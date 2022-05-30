
importScripts('lib/rita.js');
importScripts('cache.js');

let maxResults = 20, logCacheEntries = true, useMeta = true;
let overrides, stops, ignores, sources, finished;
let metaLRU, similarLRU, metaCacheSize = 10000, simCacheSize = 5000;

// main-cache: holds word actually searched (A: [B,C])
// meta-cache: holds co-similars (B: [A,C], C: [A,B])

const eventHandlers = {

  init: function (data) {
    ({ minWordLength, overrides, ignores, sources, state, stops } = data);

    let numOverrides = Object.entries(validateOverrides(overrides)).length;
    let initialCacheSize = typeof cache !== 'undefined' ? Object.keys(cache).length : 0;

    // add each override to similarCache
    Object.entries(overrides).forEach(([word, sims]) => cache[word] = sims);

    metaLRU = new LRUCache(metaCacheSize);

    // generate co-similars in meta for overrides
    if (useMeta) {
      Object.entries(overrides).forEach(([word, sims]) =>
        generateCosimilars(word, sims, metaLRU));
    }

    let initialMetaSize = metaLRU.size();
    if (useMeta) {
      // generate the meta-cache from main-cache
      Object.entries(cache).forEach(([word, sims]) =>
        generateCosimilars(word, sims, metaLRU));
    }
    
    similarLRU = new LRUCache(simCacheSize, cache);

    if (state.logging) {
      let cosimCount = metaLRU.size() - initialMetaSize;
      console.log(`[INFO] Found ${numOverrides} similar overrides, added ${initialMetaSize} co-similars`);
      console.log(`[INFO] Found ${initialCacheSize} in file cache, added ${cosimCount} co-similars`);
      console.log(`[INFO] ${similarLRU.size()} cache entries, ${metaLRU.size()} meta-cache entries`);
    }
  },

  getcache: function (data, worker) {
    finished = true;
    worker.postMessage({
      idx: -1,
      cache: similarLRU.toObject(),
      metaCache: metaLRU.toObject()
    });
  },

  lookup: function (data, worker) {
    const { idx, dword, sword, state, timestamp } = data;
    if (!finished) {
      let pos = sources.pos[idx];
      const dsims = findSimilars(idx, dword, pos, state, timestamp);
      const ssims = findSimilars(idx, sword, pos, state, timestamp);
      worker.postMessage({ idx, dword, sword, dsims, ssims, timestamp });
    }
  }
}

this.onmessage = function (e) {
  let { event, data } = e.data;
  eventHandlers[event](data, this);
}

function generateCosimilars(word, sims, lru) {
  let numAdded = 0;
  let add = function (word, arr) {
    if (!arr.includes(word) && isReplaceable(word)) {
      arr.push(word);
      numAdded++;
    }
  }
  sims.forEach(next => {
    let curr = lru.get(next) || [];
    add(word, curr);
    let nextSims = shuffle(sims.filter(w => w !== next && !curr.includes(w)));
    for (let i = 0; i < nextSims.length; i++) {
      add(nextSims[i], curr);
    }
    lru.put(next, curr);
  });
  return numAdded;
}

function findSimilars(idx, word, pos, state, timestamp) {

  if (similarLRU.has(word)) { // done if in cache 
    return randomSubset(similarLRU.get(word));
  }

  let limit = maxResults, shuffle = true;
  let rhymes = RiTa.rhymes(word, { pos, limit, shuffle });
  let sounds = RiTa.soundsLike(word, { pos, limit, shuffle });
  let spells = RiTa.spellsLike(word, { pos, limit, shuffle });
  let sims = Array.from(new Set([...rhymes, ...sounds, ...spells]));

  let result = randomSubset(sims)
    .filter(cand =>
      isReplaceable(cand, state)
      && !ignores.includes(cand)
      && !word.includes(cand)
      && !cand.includes(word));

  if (result.length) { // found in RiTa
    similarLRU.put(result); // add to cache
    let newEntries = 0;
    if (useMeta) { // add co-similars to meta-cache
      newEntries = generateCosimilars(word, result, metaLRU);
    }
    if (logCacheEntries) {
      let elapsed = Date.now() - timestamp;
      if (state.logging) console.log(`[CACHE] @${idx} ${word}/${pos} ->`
        + ` (${result.length}): ${trunc(result)} :: added ${newEntries} meta,`
        + ` cache-sizes: ${similarLRU.size()}/${metaLRU.size()} (${elapsed} ms)`);
    }
    return result;
  }
  else { // found in meta-cache
    console.warn('[SIMS] No similars for: "' + word + '"/' + pos);
    if (useMeta) {
      result = metaLRU.get(word);
      console.warn('[META] Trying meta, found: ', result || '[]');
      if (result && result.length) {
        similarLRU.put(result); // add result to cache
        return result;
      }
    }
  }

  // no results
  let inSource = sources.rural[idx] === word
    || sources.urban[idx] === word && sources.pos[idx] === pos;
  findSimilars.sourceMisses = findSimilars.sourceMisses || new Set();
  if (inSource && !findSimilars.sourceMisses.has(word + '/' + pos)) {
    findSimilars.sourceMisses.add(word + '/' + pos)
    console.warn('[WARN] No similars for: "' + word + '"/' + pos + (inSource ?
      ' *** [In Source] ' + JSON.stringify(Array.from(findSimilars.sourceMisses)) : ''));
  }

  return [];
}

function randomSubset(sims) {
  if (!sims || !sims.length) return [];
  return (sims.length <= maxResults) ? sims :
    shuffle(sims).slice(0, Math.min(maxResults, sims.length));
}

function isReplaceable(word) {
  let res = (word.length >= minWordLength || word in overrides)
    && !stops.includes(word);
  return res;
}

function trunc(arr, len = 100) {
  arr = Array.isArray(arr) ? (JSON.stringify(arr)
    .replace(/[""\[\]]/g, '')
    .replace(/,/g, ', '))
    : arr;
  if (arr.length <= len) return arr;
  return arr.substring(0, len) + '...';
}

function validateOverrides(data) {
  let result = {};
  Object.entries(data).forEach(([word, sims]) => {
    sims.forEach(sim => {
      if (stops.includes(sim)) console.error
        ('Stopword "' + sim + '" in overrides: ' + word + '->[' + sims + "]");
      else if (ignores.includes(sim)) console.error
        ('Ignorable "' + sim + '" in overrides: ' + word + '->[' + sims + "]");
      else result[word] = sims;
    });
  });
  return result;
}

function shuffle(arr) {
  let newArray = arr.slice(),
    len = newArray.length,
    i = len;
  while (i--) {
    let p = Math.floor(Math.random() * len), t = newArray[i];
    newArray[i] = newArray[p];
    newArray[p] = t;
  }
  return newArray;
}

class LRUCache {

  constructor(capacity, initialData = {}) {
    this.data = new Map();
    this.capacity = capacity;
    Object.entries(initialData).forEach(([word, sims]) => this.put(word, sims));
  }

  size() {
    return this.data.size;
  }

  has(key) {
    return this.data.has(key);
  }

  toObject() {
    return Object.fromEntries(this.data);
  }

  get(key) {
    if (!this.data.has(key)) return undefined;
    let val = this.data.get(key);
    this.data.delete(key);
    this.data.set(key, val);
    return val;
  }

  put(key, value) {
    this.data.delete(key);
    if (this.data.size >= this.capacity) {
      this.data.delete(this.data.keys().next().value);
    }
    this.data.set(key, value);
  }

  putAll(arr) {
    arr.forEach(a => this.put(a));
  }

}

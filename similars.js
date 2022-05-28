
importScripts('lib/rita.js');
importScripts('cache.js');

let maxResults = 20, logCacheEntries = true, useMeta = true;
let similarCache = typeof cache !== 'undefined' ? cache : {};
let metaCache = {}, overrides, stops, ignores, sources, finished;

// main-cache: holds word actually searched (A: [B,C])
// meta-cache: holds cosimilars (B: [A,C], C: [A,B])

const eventHandlers = {

  init: function (data) {
    ({ minWordLength, overrides, ignores, sources, stops } = data);

    let numOverrides = Object.entries(validateOverrides(overrides)).length;
    let initialCacheSize = Object.entries(similarCache).length;

    // add each override to similarCache
    Object.entries(overrides).forEach(([word, sims]) => similarCache[word] = sims);

    // generate co-similars in meta for overrides
    let msg = '[INFO] Found ' + numOverrides + ' similar overrides, ';
    Object.entries(overrides).forEach(([word, sims]) =>
      generateCosimilars(word, sims, metaCache));
    let initialMetaSize = Object.entries(metaCache).length;
    console.info(msg + 'added ' + initialMetaSize + ' co-similars');

    if (useMeta && Object.keys(similarCache).length) {
      // generate the meta-cache from main-cache
      Object.entries(similarCache).forEach(([word, sims]) =>
        generateCosimilars(word, sims, metaCache, maxResults));
    }
    let cacheSize = Object.keys(similarCache).length;
    let metaSize = Object.keys(metaCache).length;
    console.info(`[INFO] Found ${initialCacheSize} in file cache,`
      + ` added ${metaSize - initialMetaSize} co-similars`);
    console.info(`[INFO] ${cacheSize} cache entries, ${metaSize} meta-cache entries`);
  },

  getcache: function (data, worker) {
    finished = true;
    const cache = similarCache;
    worker.postMessage({ idx: -1, cache, metaCache });
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

function generateCosimilars(word, sims, dict, maxEntries = Infinity) {
  let added = 0, add = function (word, map) {
    if (map.length < maxEntries && !map.includes(word) && isReplaceable(word)) {
      map.push(word);
      added++;
    }
  }
  sims.forEach(next => {
    if (!(next in dict)) dict[next] = [];
    add(word, curr = dict[next]);
    let nextSims = shuffle(sims.filter(w => w !== next && !curr.includes(w)));
    for (let i = 0; i < nextSims.length; i++) {
      add(nextSims[i], curr);
    }
    dict[next] = curr;
  });
  return added;
}

function findSimilars(idx, word, pos, state, timestamp) {

  // WORKING HERE: why is [CACHE] firing at start..

  if (word in similarCache) { // done if in cache 
    return randomSubset(similarCache[word]);
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
    similarCache[word] = result; // add to cache
    let newEntries = 0;
    if (useMeta) { // add co-similars to meta-cache
      newEntries = generateCosimilars(word, result, metaCache, maxResults);
    }
    if (logCacheEntries) {
      let elapsed = Date.now() - timestamp;
      let msize = Object.keys(metaCache).length;
      let size = Object.keys(similarCache).length;
      console.log(`[CACHE] @${idx} ${word}/${pos} -> (${result.length}):`
        + ` ${trunc(result)} :: added ${newEntries} meta,`
        + ` caches=[${size}/${msize}] (${elapsed} ms)`);
    }
    return result;
  }
  else { // found in meta-cache
    console.warn('[SIMS] No similars for: "' + word + '"/' + pos);
    if (useMeta) {
      result = metaCache[word]; // add to cache
      console.warn('[META] Trying meta, found: ', result || '[]');
      if (result && result.length) {
        similarCache[word] = result; // add result to cache
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
  //console.log(word, res);
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


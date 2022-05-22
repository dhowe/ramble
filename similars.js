
importScripts('lib/rita.js');
importScripts('cache.js');

let maxResults = 20;
let metaCacheEnabled = true;
let similarCache = {};//typeof cache !== 'undefined' ? cache : {};
let metaCache = {}, overrides, stops, ignores, sources;

const eventHandlers = {

  init: function (data) {
    ({ minWordLength, overrides, ignores, sources, stops } = data);

    let num = Object.entries(validateOverrides(overrides)).length;

    // generate cosimilars for the overrides
    let msg = '[DATA] Found ' + num + ' similar overrides, ';
    Object.entries(overrides).forEach(([word, sims]) =>
      generateCosimilars(word, sims, overrides)); // A: [B] -> B: [A]
    console.info(msg + Object.entries(overrides).length + ' co-similars');

    if (similarCache) {
      msg = `[SIMS] ${Object.keys(similarCache).length} pre-cached, `;

      // generate the meta-cache for use when no similars are found
      metaCacheEnabled && Object.entries(similarCache).forEach(([word, sims]) =>
        generateCosimilars(word, sims, metaCache, maxResults)); // A: [B] -> B: [A]

      // add overrides (regular and meta) to similarCache
      Object.entries(overrides).forEach(([word, sims]) => similarCache[word] = sims);
      console.info(msg + Object.entries(similarCache).length + ` total, `
        + `${Object.keys(metaCache).length} meta-entries`);
    }
    else {
      console.info('[DATA] No cache, doing live lookups');
    }
  },

  getcache: function (data, worker) {
    const cache = similarCache;
    worker.postMessage({ idx: -1, dsims: 0, ssims: 0, cache });
  },

  lookup: function (data, worker) {
    const { idx, dword, sword, state, timestamp } = data;
    let pos = sources.pos[idx];
    const dsims = findSimilars(idx, dword, pos, state, timestamp);
    const ssims = findSimilars(idx, sword, pos, state, timestamp);
    worker.postMessage({ idx, dword, sword, dsims, ssims, timestamp });
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

  let result;
  if (word in similarCache) {
    result = randomSubset(similarCache[word]);
  }
  else {
    //console.time('sims');
    let limit = maxResults, shuffle = true;
    let rhymes = RiTa.rhymes(word, { pos, limit, shuffle });
    let sounds = RiTa.soundsLike(word, { pos, limit, shuffle });
    let spells = RiTa.spellsLike(word, { pos, limit, shuffle });
    let sims = Array.from(new Set([...rhymes, ...sounds, ...spells]));
    //console.timeEnd('sims');

    result = randomSubset(sims).filter(cand =>
      !ignores.includes(cand)
      && !word.includes(cand)
      && !cand.includes(word)
      && isReplaceable(cand, state));

    if (!result || !result.length && metaCacheEnabled) {
      console.warn('[SIMS] No similars for: "' + word + '"/' + pos + ' trying meta...');
      result = metaCache[word];
      console.warn('       Found: ', result);
    }

    if (result && result.length) {
      let newEntries, msg = '', elapsed = Date.now() - timestamp;
      similarCache[word] = result; // add result to cache

      if (metaCacheEnabled) { // add cosimilars to meta-cache
        newEntries = generateCosimilars(word, result, metaCache, maxResults);
        msg = newEntries + '/' + Object.keys(metaCache).length + ' meta-entries';
      }

      if (0) console.log('[CACHE] (' + elapsed + 'ms) ' + word + '/' + pos + '('
        + result.length + '): ' + trunc(result) + ' [' + Object.keys(similarCache).length + '] ' + msg);
    }
  }

  if (!result || !result.length) { // no results
    result = [];
    let inSource = sources.rural[idx] === word
      || sources.urban[idx] === word && sources.pos[idx] === pos;
    findSimilars.sourceMisses = findSimilars.sourceMisses || new Set();
    if (inSource && !findSimilars.sourceMisses.has(word + '/' + pos)) {
      findSimilars.sourceMisses.add(word + '/' + pos)
      console.warn('[WARN] No similars for: "' + word + '"/' + pos + (inSource ?
        ' *** [In Source] ' + JSON.stringify(Array.from(findSimilars.sourceMisses)) : ''));
    }
  }

  return result;
}

function randomSubset(sims) {
  if (!sims || !sims.length) return [];
  return (sims.length <= maxResults) ? sims :
    shuffle(sims).slice(0, Math.min(maxResults, sims.length));
}

function isReplaceable(word, state) {
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

function writeCache(cache, meta) {
  try {
    let fname = './' + (meta ? 'metacache' : 'simcache') + '-' + Date.now() + '.js';
    require('fs').writeFileSync(fname, JSON.stringify(cache, 0, 2));
    console.log('Writing: ' + fname + ' with ' + Object.entries(cache) + ' entries');
  } catch (err) {
    console.error(err);
  }
}
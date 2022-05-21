
importScripts('lib/rita.js');
importScripts('cache.js');

const maxResults = 20;
const lex = RiTa.lexicon();
const similarCache = typeof cache !== 'undefined' ? cache : {};
let overrides;

const eventHandlers = {
  init: function (data, worker) {
    overrides = data.overrides;
    const num = Object.entries(overrides).length;
    console.log('[INFO] Found ' + num + ' cache overrides');
    Object.entries(overrides).forEach(([k, v]) => similarCache[k] = v);
    if (similarCache) {
      console.info('[INFO] Using cached similars'
        + ` [${Object.keys(similarCache).length}]`);
    }
    else {
      console.info('[INFO] No cache, doing live lookups');
    }
  },
  getcache: function (data, worker) {
    const cache = similarCache;
    worker.postMessage({ idx: -1, dsims: 0, ssims: 0, cache });
  },
  lookup: function (data, worker) {
    const { idx, dword, sword, state, timestamp } = data;
    const { sources } = state, pos = sources.pos[idx];
    const dsims = findSimilars(idx, dword, pos, state, timestamp);
    const ssims = findSimilars(idx, sword, pos, state, timestamp);
    worker.postMessage({ idx, dword, sword, dsims, ssims, timestamp });
  }
}

this.onmessage = function (e) {
  let { event, data } = e.data;
  eventHandlers[event](data, this);
}

function findSimilars(idx, word, pos, state, timestamp) {

  let { ignores, sources } = state;

  let result;
  if (word in similarCache) {
    result = randomSubset(similarCache[word]);
  }
  else {
    let limit = 20, shuffle = true;
    let rhymes = RiTa.rhymes(word, { pos, limit, shuffle });
    let sounds = RiTa.soundsLike(word, { pos, limit, shuffle });
    let spells = RiTa.spellsLike(word, { pos, limit, shuffle });
    let sims = Array.from(new Set([...rhymes, ...sounds, ...spells]));

    sims = randomSubset(sims).filter(cand =>
      !ignores.includes(cand)
      && !word.includes(cand)
      && !cand.includes(word)
      && isReplaceable(cand, state));

    if (sims.length) {
      let elapsed = Date.now() - timestamp;
      similarCache[word] = sims; // to cache
      //console.log('[CACHE] (' + elapsed + 'ms) ' + word + '/' + pos
      //+ ': ' + trunc(sims) + ' [' + Object.keys(similarCache).length + ']');
    }
  }

  if (!result || !result.length) {
    result = [];
    
    let inSource = sources.rural[idx] === word
      || sources.urban[idx] === word && sources.pos[idx] === pos;

    if (inSource && !sourceMisses.has(word + '/' + pos)) {
      sourceMisses.add(word + '/' + pos)
      console.warn('[WARN] No similars for: "' + word
        + '"/' + pos + (inSource ? ' *** [In Source] '
          + JSON.stringify(Array.from(sourceMisses)) : ''));
    }
  }

  return result;
}
let sourceMisses = new Set(); // debugging

function randomSubset(sims) {
  if (!sims || !sims.length) return [];
  return shuffle(sims).slice(0, Math.min(maxResults, sims.length));
}

function isReplaceable(word, state) {
  let { stops, minWordLength } = state;
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

function shuffle(arr) {
  let newArray = arr.slice(),
    len = newArray.length,
    i = len;
  while (i--) {
    let p = Math.floor(RiTa.random(len)), t = newArray[i];
    newArray[i] = newArray[p];
    newArray[p] = t;
  }
  return newArray;
}
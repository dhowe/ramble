
importScripts('lib/rita.js');
importScripts('cache.js');

let maxResults = 20;
let lex = RiTa.lexicon();
let similarCache = typeof cache !== 'undefined' ? cache : {};
let overrides;

const eventHandlers = {
  init: function (data, worker) {
    overrides = data.overrides;
    let num = Object.entries(overrides).length;
    let msg = '[INFO] Found ' + num + ' similar overrides, ';
    //Object.entries(overrides).forEach(([k, v]) => tmpCache[k] = v);
    Object.entries(overrides).forEach(([word, sims]) => {
      sims.forEach(next => {
        if (!(next in overrides)) {
          overrides[next] = [word];
          let nextSims = sims.filter(w => w !== next);
          nextSims.forEach(sim => {
            if (!overrides[next].includes(sim)) {
              overrides[next].push(sim);
            }
          });
        }
      });
    });
    msg += Object.entries(overrides).length + ' entries';
    console.info(msg);
    if (similarCache) {
      msg = `[INFO] Loaded ${Object.keys(similarCache).length} cached similars, `;
      Object.entries(overrides).forEach(([word, sims]) => similarCache[word] = sims);
      msg += Object.entries(similarCache).length +' total entries';
      console.info(msg);
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
const sourceMisses = new Set(); // debugging

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
importScripts('lib/rita.js');
importScripts('shared.js');

const lex = RiTa.lexicon();

const similarCache = {
  avoid: ['elude', 'escape', 'evade'],
  neighbors: ['brothers', 'brethren', 'fellows'],
  rending: ['ripping', 'cleaving', 'rupturing', 'splitting', 'severing' ] , // tearing & rending & opening up the darkness
  inhuman: ['grievous', 'grim', 'hard', 'heavy', 'onerous', 'oppressive', 'rough', 'rugged', 'severe', 'austere', ' inclement', 'intemperate'],
  sometimes: ['occasionally', 'intermittently', 'periodically', 'recurrently', 'infrequently', 'rarely', 'irregularly', 'sporadically', 'variously'],
  adventure: ['experience', 'exploit', 'occasion', 'ordeal', 'venture', 'expedition', 'mission'],
  unfamiliar: ['unconventional', 'pioneering', 'unaccustomed', ' unprecedented'],
  coiled: ['twisted', 'twisting', 'curling', 'curving', 'serpentine', 'corkscrewed', 'jagged', 'meandering', 'spiraled' ],
  particularly: ['specifically','generally', 'aptly']
};

this.onmessage = function (e) {
  let { idx, destination } = e.data;
  let shadow = destination === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[destination][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let shadowSims = findSimilars(shadowWord, pos, sources); // ??
  let displaySims = findSimilars(displayWord, pos, sources);
  this.postMessage({ idx, displaySims, shadowSims });
};

function findSimilars(word, pos, sources) {

  let sims, limit = -1;
  if (word in similarCache) {
    sims = similarCache[word]; // cache
  }
  else {
    let rhymes = RiTa.rhymes(word, { pos, limit });
    let sounds = RiTa.soundsLike(word, { pos, limit });
    let spells = RiTa.spellsLike(word, { pos, limit });
    sims = [...rhymes, ...sounds, ...spells];
  }

  sims = sims.filter(next =>
    next.length >= minWordLength
    && !word.includes(next)
    && !next.includes(word)
    && !stops.includes(word)
    && !ignores.includes(next));

  if (sims.length > 1) {
    similarCache[word] = sims; // store in cache
    return sims;
  }

  console.warn('no similars for: "' + word + '"/' + pos
    + ((sources.rural.includes(word) || sources.rural.includes(word))
      ? ' *** [In Source]' : ''));
  return [];
}
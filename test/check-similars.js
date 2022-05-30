let RiTa = require('rita');

const stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas", "rushed", "prayer"];
const ignores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", /* added: JHC */ "terry"];
const minWordLength = 4;

const sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned', '...'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled', '...'],
  pos: ['in', 'dt', 'nn', 'dt', 'jj', 'vbz', 'vbn', ',', 'in', 'dt', 'jj', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'nns', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'nn', 'vbz', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'nn', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'rb', 'jj', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nns', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'vbz', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbd', ',', 'to', 'vb', 'to', 'vb', 'vbd', 'jj', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'vbn', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbd', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbg', 'cc', 'vb', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'nn', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vbp', 'dt', 'jj', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'vb', ',', 'cc', 'rb', 'jj', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'jj', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbd', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'in', 'prp$', 'nn', 'vbz', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'jj', 'in', 'vbd', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

let similarOverrides = {
  "adventure": ["inquiry", "hope", "heritage", "misadventure", "choice", "invention", "exploration", "reconciliation", "lust", "creation", "learning", "mourning"],
  "animal": ["brute", "beastly", "brutal", "brutish", "bestial", "fleshy", "carnal", "corporeal", "somatic", "mental", "immaterial", "rational", "irrational", "minimal"],
  "avoid": ["elude", "escape", "evade", "delay"],
  "beyond": ["above", "outside", "before", "behind", /*"within"*/],
  "building": ["assembling", "erecting", "constructing", "forming", "manufacturing", "producing", "casting", "composing", "contriving", "engineering", "fabricating", "framing", "modeling", "initiating", "formulating", "boosting", "developing", "improving", "strengthening", "amplifying", "increasing", "compounding", "escalating", "multiplying", "abridging", "compressing", "decreasing", "condensing", "contracting", "degrading", "dividing", "dismantling", "rebuilding", "binding", "gilding", "guiding", "glazing"],
  "circadian": ["rhythmic", "regular", "circassian", "crepuscular", "orcadian", "circular", "cyclical"],
  "coiled": ["twisted", "twisting", "bent", "broken", "serpentine", "corkscrewed", "jagged", "barbed"],
  "desperately": ["badly", "dangerously", "fiercely", "greatly", "perilously", "seriously", "carelessly", "dramatically", "gravely", "hysterically", "fearfully", "hopelessly", "shockingly", "appallingly", "trivially", "temporally", "irreparably", "perfectly", "generally", "indefinitely", "delicately", "reverently", "urgently", "subtly"],
  "dip": ["swim", "clip", "drip", "quip", "trip", "slip", "snip", "strip", "whip", "bath", "submersion", "plunge", "shower", "rinse"],
  "familiar": ["casual", "mundane", "recognizable", "intimate", "unfamiliar", "unknown", "obscure", "unusual", "similar", "familial", "filial", "crepuscular", "dusky", "quotidian", "peculiar"],
  "inhuman": ["onerous", "oppressive", "human", "austere", "inclement", "intemperate", "otherwise"],
  "marshaling": ["assembling", "mobilizing", "aligning", "arranging", "collecting", "conducting", "organizing", "guiding", "directing", "distributing", "gathering", "grouping", "leading", "ordering", "rallying", "dispersing", "disturbing", "dividing", "mixing", "neglecting", "scattering", "separating", "spreading", "determining", "encircling"],
  "might": ["could", "would", "should", "must"],
  "mildly": ["delicately", "indifferently", "lightly", "gently", "moderately", "quietly", "blandly", "calmly", "compassionately", "gingerly", "patiently", "softly", "tolerantly", "tenderly", "harshly", "roughly", "violently", "wildly", "fiercely", "ferociously", "brutally", "critically"],
  "most": ["least", "mostly", "must"],
  "neighbors": ["brothers", "sisters", "parents", "children", "horses", "elders"],
  "particularly": ["specifically", "generally", "naturally", "often", "commonly"],
  "rending": ["ripping", "cleaving", "rupturing", "splitting", "severing", "cutting"],
  "set": ["digressed", "progressed", "sought", "stepped", "regressed", "transgressed"],
  "simply": ["merely", "basically", /*"just",*/ "barely", "dimly", "finally", "definitively"],
  "since": ["because", /*"whereas",*/ "hence", "although"],
  "singular": ["particular", "exclusive", "solitary", "regular", "insular", "angular", "subtle", "silent"],
  "sometimes": ["occasionally", "intermittently", "periodically", "infrequently", "rarely", "sporadically", "variously"],
  "sound": ["ground", "gesture", "vibration", "sense", "emotion", "thought", "idea"],
  "sunset": ["dawn", "daybreak", "daylight", "sunrise", "sunup", "dusk", "night", "nightfall", "sundown", "twilight"],
  "terror": ["fear", "texture", "torture", "timbre", "desolation"],
  "unfamiliar": ["unconventional", "pioneering", "unprecedented", "bizarre", "curious", "exotic", "foreign", "obscure", "peculiar", "unexpected", "unknown", "unusual", "alien", "outlandish", "uncommon", "unmistakable", "familiar", "uncanny", "intimate", "similar", "casual"],
  "unsettled": ["unresolved", "uncertain", "undecided", "rootless", "mottled", "kettled"],
  "venal": ["corrupt", "mercenary", "sordid", "renal", "penal", "vernal", "venial", "filial", "viral", "vital"],
  "violent": ["brutal", "subtle", "tired", "ferocious", "virulent", "venal", "torturous", "sharp", "oblique", "quiet", "silent", "violet"],
  "will": ["would", "must", "since", "again", "finally", "ultimately"],
}

let state = { sources, ignores, stops, minWordLength }, similarCache = {};

function findSimilars(idx, word, pos, state) {

  let { ignores, sources } = state;
  //console.log('findSimilars:', ignores, sources);
  let limit = -1;
  if (0 && word in similarCache) {
    return similarCache[word]; // from cache
  }
  else {
    let rhymes = RiTa.rhymes(word, { pos, limit });
    let sounds = RiTa.soundsLike(word, { pos, limit });
    let spells = RiTa.spellsLike(word, { pos, limit });
    let sims = new Set([...rhymes, ...sounds, ...spells]);

    sims = [...sims].filter(sim =>
      !ignores.includes(sim)
      && !word.includes(sim)
      && !sim.includes(word)
      && isReplaceable(sim, state));

    if (sims.length) {
      // let elapsed = Date.now() - timestamp;
      // similarCache[word] = sims; // to cache
      //console.log('[CACHE] (' + elapsed + 'ms) ' + word + '/' + pos
      //+ ': ' + trunc(sims) + ' [' + Object.keys(similarCache).length + ']');
      return sims;
    }
  }
  return [];
}

function quotify(arr) {
  return JSON.stringify(arr).replace(/["]/g, "'");//arr.map((a,i) => {" '" + a + "',").join('');
}

function isReplaceable(word, state) {
  //console.log(state);
  let { stops, minWordLength } = state;
  return (word.length >= minWordLength || word in similarOverrides)
    && !stops.includes(word);
}

////////////////////////////////////////////////////////
let missing = ["animal/jj", "sunset/nn", "most/rbs", "circadian/nn", "simply/rb", "will/md",
  "familiar/jj", "mildly/rb", "marshaling/vbg", "singular/jj", "since/in", "beyond/in",
];

// missing.forEach((w, i) => {
//   let [word, pos] = w.split('/');
//   lookupWord(word, pos);
// });

//let word = 'may';
//console.log(isReplaceable(word, state));
//console.log(((word.length >= minWordLength) || overrides[word]));// && !stops.includes(word))
//|| overrides[word]) && !stops.includes(word)));

function lookupWord(word, pos, forcePos = 0) {
  let idx, counter;//, word = 'animal';
  let uidx = sources.urban.indexOf(word);
  let ridx = sources.rural.indexOf(word);
  if (uidx > -1) {
    idx = uidx;
    counter = sources.rural[idx];
  }
  else if (ridx > -1) {
    idx = ridx;
    counter = sources.urban[idx];
  }

  if (typeof idx === 'undefined') {
    console.log('no idx for ' + word + '/' + pos);
    return;
  }

  if (!forcePos && (pos && pos !== sources.pos[idx])) {
    throw Error(word + " '" + pos + '\'!=\'' + sources.pos[idx] + "'");
  }

  pos = pos || sources.pos[idx];

  let sims = findSimilars(idx, word, pos, state);
  let csims = findSimilars(idx, counter, pos, state);
  if (1) {
    console.log(idx, word + '/' + counter, pos, word + ': '
      + quotify(sims), word !== counter ? ('' + counter + ': ' + quotify(csims)) : '');
  }
  else {
    console.log('{ word: "' + word + '", pos: "' + pos + '" }'
      + (word !== counter ? ', { word: "' + counter + '", pos: "' + pos + '"}' : '') + ',');
  }

}

console.log(RiTa.untokenize(sources.rural));
console.log(RiTa.untokenize(sources.urban));
//console.log(sources.rural.filter((w, i) => w == 'spreads' && console.log(i, w, sources.pos[i])));
lookupWord('hearing');//, 'jj', true);

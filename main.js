// length of short/long walks (legs)
let walks = { short: 2, long: 16 };

// steps in each incoming/outgoing leg
let stepsPerLeg = 50;

// time between word replacements (ms)
let updateDelay = 800;

// time on new text before updates (ms) 
let readDelay = stepsPerLeg * updateDelay;

// time before reader begins (ms)
let initialDelay = 3000;

// min/max/start CSS word-spacing (em)
let minWordSpace = -0.1, maxWordSpace = 0.5, initialWordSpace = 0.1;

// leading for text display
let lineHeightScale = 1.28;

// min-length unless in similarOverrides
let minWordLength = 4;

// width of visualization bar (% of div size)
let visBandWidth = 3;

// adjust word-spacing for initial text circle
let adjustInitialWordspacing = true;

// visualisation [ rural, urban, shared, found, initial ]
let visBandColors = ['#9CC0E5', '#F59797', '#E7EBC5', '#C3ACB8', '#F3F3F3'];

// these override values found via lookup
let similarOverrides = {
  "adventure": ["inquiry", "hope", "heritage", "misadventure", "choice", "invention", "exploration", "reconciliation", "lust", "creation", "learning", "mourning"],
  "again": ["since", "finally", "ultimately", "totally"],
  "animal": ["brute", "beastly", "brutal", "brutish", "bestial", "fleshy", "carnal", "corporeal", "somatic", "mental", "immaterial", "rational", "irrational", "minimal"],
  "avoid": ["elude", "escape", "evade", "delay"],
  "bankside": ["implied", "outside", "untried", "applied", "inside", "upside", "allied", "banked", "broadside", "anchored"],
  "beyond": ["above", "outside", "before", "behind", /*"within"*/],
  "breakfast": ["broadcast", "repast", "supper", "impact", "breakage", "bondage"],
  "building": ["assembling", "erecting", "constructing", "forming", "producing", "casting", "composing", "fabricating", "framing", "modeling", "formulating", "developing", "improving", "strengthening", "compounding", "escalating", "compressing", "decreasing", "condensing", "contracting", "degrading", "dividing", "dismantling", "rebuilding", "binding", "gilding"],
  "circadian": ["rhythmic", "regular", "circassian", "crepuscular", "orcadian", "circular", "cyclical"],
  "coiled": ["twisted", "twisting", "bent", "broken", "serpentine", "corkscrewed", "jagged", "barbed"],
  "desperately": ["dangerously", "fiercely", "perilously", "seriously", "carelessly", "gravely", "hysterically", "hopelessly", "shockingly", "trivially", "temporally", "irreparably", "perfectly", "indefinitely", "delicately", "reverently", "urgently", "subtly"],
  "dip": ["swim", "clip", "drip", "quip", "trip", "slip", "snip", "strip", "whip", "bath", "submersion", "plunge", "shower", "rinse"],
  "familiar": ["casual", "mundane", "recognizable", "intimate", "unfamiliar", "unknown", "obscure", "unusual", "similar", "familial", "filial", "crepuscular", "dusky", "quotidian", "peculiar"],
  "infrequently": ["occasionally", "intermittently", "periodically", "sometimes", "rarely", "sporadically", "variously"],
  "inhuman": ["onerous", "oppressive", "human", "austere", "inclement", "intemperate", "otherwise"],
  "marshaling": ["assembling", "mobilizing", "aligning", "arranging", "collecting", "conducting", "organizing", "guiding", "directing", "distributing", "gathering", "grouping", "leading", "ordering", "rallying", "dispersing", "disturbing", "dividing", "mixing", "neglecting", "scattering", "separating", "spreading", "determining", "encircling"],
  "might": ["could", "would", "should", "must"],
  "mildly": ["delicately", "indifferently", "lightly", "gently", "moderately", "quietly", "blandly", "calmly", "gingerly", "patiently", "softly", "tolerantly", "tenderly", "harshly", "roughly", "violently", "wildly", "fiercely", "ferociously", "brutally", "critically"],
  "neighbors": ["brothers", "sisters", "parents", "children", "horses", "elders"],
  "particularly": ["specifically", "generally", "naturally", "often", "commonly"],
  "rending": ["ripping", "cleaving", "rupturing", "splitting", "severing", "cutting"],
  "right": ["again", "although", "finally", "rarely", "ultimately", "totally", "variously", "occasionally", "sometimes"],
  "set": ["digressed", "progressed", "sought", "stepped", "regressed", "transgressed"],
  "simply": ["merely", "basically", /*"just",*/ "barely", "dimly", "finally", "definitively"],
  "since": ["because", /*"whereas",*/ "hence", "although"],
  "singular": ["particular", "exclusive", "solitary", "regular", "insular", "angular", "subtle", "silent"],
  "sometimes": ["occasionally", "intermittently", "periodically", "infrequently", "rarely", "sporadically", "variously"],
  "sound": ["ground", "gesture", "vibration", "sense", "emotion", "thought", "idea"],
  "sunset": ["dawn", "daybreak", "daylight", "sunrise", "sunup", "dusk", "night", "nightfall", "sundown", "twilight"],
  "terror": ["fear", "texture", "torture", "timbre", "desolation"],
  "unfamiliar": ["pioneering", "curious", "exotic", "foreign", "obscure", "peculiar", "unexpected", "unknown", "unusual", "alien", "outlandish", "uncommon", "unmistakable", "familiar", "uncanny", "intimate", "similar", "casual"],
  "unsettled": ["unresolved", "uncertain", "undecided", "rootless", "mottled", "kettled"],
  "venal": ["corrupt", "mercenary", "sordid", "renal", "penal", "vernal", "venial", "filial", "viral", "vital"],
  "violent": ["brutal", "subtle", "tired", "ferocious", "virulent", "venal", "torturous", "sharp", "oblique", "quiet", "silent", "violet"],
  "will": ["would", "must", "since", "again", "finally", "ultimately"],
  "walk": ['stalk', 'talk', "redefinition", "exhibition", "omission", "exposition", "admission", "proposition", "commission", "juxtaposition", "extradition"],
  "assault": [ "exposition", "admission", "proposition", "commission", "juxtaposition", "extradition", "attack"]
};

// words considered un-replaceable
let stops = ["several", "another", "most", "here", "also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas"];

// ignored when found as a similar
let ignores = ["leding", "expecteds", "paling", "sorrel", "toing", "reporteds", "jerkies", "trite", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", "terry"];

// set true to generate a new cache file
let downloadCache = false;

// logging is true unless production
let logging = !production;

// keyboard toggle options
let verbose = false, highlights = false, hideLegend = true, highlightWs = false, shadowMode = false;

let sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned', '…'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled', '…'],
  pos: ['in', 'dt', 'nn', 'dt', 'nn', 'vbz', 'vbn', ',', 'in', 'dt', 'nn', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'vbz', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'jj', 'nns', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'jj', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'jj', 'nn', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nns', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'nns', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbn', ',', 'to', 'vb', 'to', 'vb', 'jj', 'rbr', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'jj', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbn', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbn', 'cc', 'nn', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vb', 'dt', 'nn', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'nn', ',', 'cc', 'rb', 'vb', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'nn', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbn', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'in', 'prp$', 'jj', 'nns', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'nn', 'in', 'jj', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

let state = {
  maxLegs: walks.short,
  domain: 'rural',
  outgoing: true,
  stepMode: false,
  updating: false,
  loopId: 0,
  legs: 0,
  logging
};

let lex = RiTa.lexicon();
let repids = replaceables();
let history = { rural: [], urban: [] };
let domStats = document.querySelector('#stats');
let domDisplay = document.querySelector('#display');
let measureDiv = document.querySelector('#measure-line');
let displayContainer = document.querySelector("#display-container");
let measureCanvas = document.querySelector("#measure-ctx");
let displayBounds = domDisplay.getBoundingClientRect();

let wordLineMap = { word2Line: [], line2Word: [] };
let reader, worker, spans, initialMetrics, scaleRatio;
let fontFamily = window.getComputedStyle(domDisplay).fontFamily;
let cpadding = window.getComputedStyle(domDisplay).padding;
let padfloat = parseFloat(cpadding.replace('px', ''));
let padding = (padfloat && padfloat !== NaN) ? padfloat : 50;
let radius = displayBounds.width / 2, dbug = false;

let measureCtx = measureCanvas.getContext('2d');
measureCtx.setTransform(1, 0, 0, 1, 0, 0); // scale = 1
measureCtx.font = '21.8px "Source Serif Pro"'; // safari: font-size=int
let isSafari = measureCtx.font !== '21.8px "Source Serif Pro"';
let safariWidthScaleRatio = 1;

if (dbug) {
  logging = true;
  readDelay = 1;
  updateDelay = 100;
  domStats.style.display = 'block';
}

doLayout();
ramble(); // go

/////////////////////////////////////////////////////////

// look at each similar, ignore those that, with min or max word-spacing
// would result in line more than 5% off the target-width
function shadowRandom(wordIdx, similars) {

  let ldbug = false;
  let lineIdx = wordLineMap.word2Line[wordIdx];
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let oldWord = history[shadowTextName()].map(last)[wordIdx];
  let minAllowedWidth = targetWidth * .95;
  let maxAllowedWidth = targetWidth * 1.05;

  if (ldbug) updateDelay = 10000000; // stop after 1 update

  if (ldbug) console.log("@" + lineIdx + '.' + wordIdx + ' word=' + oldWord
    + ' pos=' + sources.pos[wordIdx] + ' minAllowed=' + minAllowedWidth
    + ' target=' + targetWidth + ' maxAllowed=' + maxAllowedWidth);

  let options = similars.filter(sim => {
    let res = widthChangePercentage(sim, wordIdx, true);
    if (ldbug) console.log("-- " + sim + ": " + res.min[1] + '-' + res.max[1]);
    let minWidth = res.min[1], maxWidth = res.max[1];
    if (maxWidth < minAllowedWidth || minWidth > maxAllowedWidth) {
      if (ldbug) console.log('-- *** reject: ' + sim, res);
      return false;
    }
    return true; // allowed
  });

  if (!options.length) {
    if (ldbug) console.log('-- reverting to random');
    options = similars;
  }
  else {
    if (ldbug) console.log('-- opts(' + options.length + '): [' + options + ']');
  }

  return RiTa.random(options);
}

// look at each similar, ignore those that, with min or max word-spacing
// would result in line more than 5% off the target-width
function contextualRandom(wordIdx, oldWord, similars, opts) {

  let ldbug = false;
  if (opts && opts.isShadow) return shadowRandom(wordIdx, similars);
  if (ldbug) updateDelay = 10000000; // stop after 1 update

  let wordEle = document.querySelector(`#w${wordIdx}`);
  let lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseInt((lineEle.id).slice(1));
  let text = lineEle.textContent;

  // find target width and min/max allowable
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let minAllowedWidth = targetWidth * .95;
  let maxAllowedWidth = targetWidth * 1.05;

  // get current line and word widths
  let { font, wordSpacing } = window.getComputedStyle(lineEle)
  let currentLineWidth = measureWidthCtx(text, font, wordSpacing);

  if (ldbug) console.log("@" + lineIdx + '.' + wordIdx + ' word=' + oldWord
    + ' pos=' + sources.pos[wordIdx] + ' minAllowed=' + minAllowedWidth
    + ' target=' + targetWidth + ' maxAllowed=' + maxAllowedWidth);

  if (currentLineWidth > maxAllowedWidth) log('Line #' + lineIdx
    + ' longer than max-width: ' + currentLineWidth.toFixed(2));

  if (currentLineWidth < minAllowedWidth) log('Line #' + lineIdx
    + ' shorter than min-width: ' + currentLineWidth.toFixed(2));

  //console.time('Execution Time Ctx');
  let options = similars.filter(sim => {
    let res = widthChangePercentage(sim, wordIdx, false);
    if (ldbug) console.log("-- " + sim + ": " + res.min[1] + '-' + res.max[1]);
    let minWidth = res.min[1], maxWidth = res.max[1];
    if (maxWidth < minAllowedWidth || minWidth > maxAllowedWidth) {
      if (ldbug) console.log('-- *** reject: ' + sim, res);
      return false;
    }
    return true; // allowed
  });

  //console.timeEnd('Execution Time Ctx');
  if (!options.length) {
    if (ldbug) console.log('-- reverting to random');
    options = similars;
  }
  else {
    if (ldbug) console.log('-- opts(' + options.length + '): [' + options + ']');
  }

  return RiTa.random(options);
}

function doLayout() {

  // setup history and handlers
  Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));
  document.addEventListener('keyup', keyhandler);
  log('Keys -> (h)ighlight (i)nfo s(t)ep (l)og (v)erbose\n'
    + ' '.repeat(7) + 'un(d)elay (c)olor-key (w)s-classes (e)nd (s)hadow');

  // init resize handler
  window.onresize = () => {
    displayBounds = domDisplay.getBoundingClientRect();
    radius = displayBounds.width / 2;
    scaleToFit();
  }

  // layout lines in circular display
  let initRadius = Math.max(radius, 450);
  if (initRadius > 450) padding = padding * (initRadius / 450);
  let offset = { x: displayBounds.x + initRadius, y: displayBounds.y + initRadius };
  let opts = { offset, fontFamily, lineHeightScale, wordSpace: initialWordSpace, padding };
  let lines = layoutCircularLines(sources[state.domain], initRadius, opts);
  initialMetrics = createCircularDOM(domDisplay, initRadius, lines);

  // create progress bars
  progressBars = createProgressBars({
    color: visBandColors,
    trailColor: visBandColors[4],
    strokeWidth: visBandWidth
  });

  adjustAllWordSpacing(adjustInitialWordspacing);
  scaleToFit(); // size to window 
}

function adjustAllWordSpacing(isDynamic) {
  document.querySelectorAll('.line').forEach((l, i) => {
    if (isDynamic) {
      adjustWordSpace(l, initialMetrics.lineWidths[i])
    }
    else {
      ["max-word-spacing", "min-word-spacing"].forEach
        (cl => l.firstChild && l.firstChild.classList.remove(cl));
    }
  });
}

function ramble() {

  let { updating, outgoing, maxLegs } = state;

  if (maxLegs / 2 !== Math.floor(maxLegs / 2)) {
    throw Error('all walks must be even length');
  }

  if (!reader) { // first time

    log(`opts { kiosk: ${kiosk}, read: ${readDelay}ms, update: ${updateDelay}ms }`);

    if (!worker) {
      worker = new Worker("similars.js");
      let overrides = similarOverrides;
      let data = { overrides, state, stops, ignores, sources, minWordLength };
      worker.postMessage({ event: 'init', data })
      worker.onmessage = postReplace;
    }

    // load the word spans
    spans = document.getElementsByClassName("word");

    // create/start the reader
    setTimeout(() => {
      reader = new Reader(spans);
      reader.pauseThen(update, readDelay);
      reader.start();

      log('Starting reader...');
      domLegend.style.display = 'block';
      threeBarIcon.style.display = 'block';
      updateInfo();

    }, initialDelay);
  }

  if (updating) return outgoing ? replace() : restore();
}

/* logic for steps, legs and domain swapping */
function updateState() {
  let steps = numMods();
  if (state.outgoing) {
    if (steps >= stepsPerLeg) {
      state.legs++;
      log(`Reverse: incoming in '${state.domain}'`
        + ` on leg ${state.legs + 1}/${state.maxLegs}`);
      state.outgoing = false;
    }
  }
  else {   // incoming
    if (steps === 0) {
      state.outgoing = true;
      if (++state.legs >= state.maxLegs) {
        state.legs = 0;
        if (state.maxLegs === walks.short) {
          // finished a short walk
          state.maxLegs = walks.long;
          swapDomain();
        }
        else {
          // finished a long walk
          state.updating = false;
          state.maxLegs = walks.short;
          log(`Pause for ${readDelay / 1000}s { domain: ${state.domain} }`);
          return reader.pauseThen(update, readDelay);
        }
        log(`Reverse: outgoing in '${state.domain}'`
          + ` on leg ${state.legs + 1}/${state.maxLegs}`);
      }
      else {
        log(`Reverse: outgoing in '${state.domain}'`
          + ` on leg ${state.legs + 1}/${state.maxLegs}`);
      }
    }
  }
  updateInfo();
  return true;
}

/* selects an index to replace (from similar lookup) in displayed text */
function replace() {
  let { domain } = state;
  let shadow = shadowTextName();

  // don't pick ids on reader's current line (#110)
  let readerLineIdx = reader ? reader.currentLine() : -1;
  let idx = RiTa.random(repids.filter(id => !reader || lineIdFromWordId(id) !== readerLineIdx));
  let dword = last(history[domain][idx]), sword = last(history[shadow][idx]);
  let data = { idx, dword, sword, state, timestamp: Date.now() };

  worker.postMessage({ event: 'lookup', data }); // do similar search
}

function postReplace(e) {

  let { idx, dword, sword, dsims, ssims, timestamp } = e.data;
  let { domain, stepMode } = state;

  if (idx < 0) return writeCache(e.data); // write cache here

  let pos = sources.pos[idx];
  let lineIdx = lineIdFromWordId(idx);
  let delayMs, shadow = shadowTextName();
  let beingRead = reader.currentLine() === lineIdx;
  if (!beingRead && dsims.length && ssims.length) {

    // pick a random similar to replace in display text
    let dnext = contextualRandom(idx, dword, dsims);
    history[domain][idx].push(dnext);

    // pick a random similar to store in shadow text
    let snext = contextualRandom(idx, sword, ssims, { isShadow: true });
    history[shadow][idx].push(snext);
    updateDOM((shadowMode ? snext : dnext),idx);
    updateState();

    // compute next delay and log the replacement
    let ms = Date.now() - timestamp;
    delayMs = Math.max(1, updateDelay - ms);
    if ((logging && verbose) || stepMode) {
      console.log(`${numMods()}) @${lineIdx}.${idx} `
        + `${dword}->${dnext}(${domain.substring(0, 1)}), `
        + `${sword}->${snext}(${shadow.substring(0, 1)}) `
        + `[${pos}] elapsed=${ms} delay=${delayMs}`);
    }
  }
  else {
    delayMs = 1;
    let msg = `[SKIP] replace @${lineIdx}.${idx} [${pos}] `;
    if (beingRead) msg += `'${dword}' is currently being read`;
    if (!dsims.length) msg += `None found for '${dword}' `;
    if (!ssims.length) msg += `None found for '${sword}' (shadow)`;
    if (logging) console.log(msg);
  }

  if (!stepMode) state.loopId = setTimeout(ramble, delayMs);
}

/* selects an index to restore (from history) in displayed text */
function restore() {

  let { domain, stepMode } = state;

  let delayMs = updateDelay;
  let displayWords = unspanify();

  // get all possible restorations
  let choices = repids
    .map(idx => ({ idx, word: displayWords[idx] }))
    .filter(({ word, idx }) => history[domain][idx].length > 1
      && isReplaceable(word));

  if (choices.length) {

    // pick a changed word to step back
    let { word, idx } = RiTa.random(choices);
    let lineIdx = lineIdFromWordId(idx);
    let pos = sources.pos[idx];
    if (lineIdx !== reader.currentLine()) {

      history[domain][idx].pop();
      history[shadowTextName()][idx].pop();

      // select newest from history to replace
      let next = shadowMode ? last(history[shadowTextName()][idx]) :last(history[domain][idx]);
      updateDOM(next, idx);

      if ((logging && verbose) || stepMode) {
        console.log(`${numMods()}] @${lineIdx}.${idx} `
          + `${domain}: ${word} -> ${next} [${pos}]`);
      }
    }
    else {
      delayMs = 1000; // tmp: keep same delay
      if (logging) console.log(`[SKIP] restore @${lineIdx}.${idx} [${pos}]`
        + ` '${word}' is currently being read (${numMods()} mods)`);
    }
  }
  else {
    // note: can be multiple here
    let id = repids.find(idx => history[domain][idx].length > 1);
    let word = sources[domain][id], hist = history[domain][id];
    console.error('[WARN] Invalid-state, num-mods:'
      + numMods() + ' idx=' + id + '/' + word + ' history=', hist);
    let invalidWord = history[domain][id].pop();
    console.error('[FIX] repair by popping "' + invalidWord + '" hist=', hist);
  }

  if (updateState() && !state.stepMode) {
    state.loopId = setTimeout(ramble, delayMs);
  }
}

/* total number of replacements made in display text */
function numMods() {
  return repids.reduce((total, idx) =>
    total + history[state.domain][idx].length - 1, 0);
}

/* stop rambler and reader  */
function stop() {

  clearTimeout(state.loopId);
  state.updating = false;
  reader && reader.stop();

  spans && setTimeout(_ =>
    Array.from(spans).forEach(e => {
      e.classList.remove('incoming');
      e.classList.remove('outgoing');
    }), 1000);

  domLegend.style.display = 'none';

  updateInfo();

  worker && worker.postMessage({ event: 'getcache', data: { repids } });
}

function writeCache(args) {
  let { cache, metaCache } = args;
  //let { sourceCache, missing } = createSourceCache(); // expected=162
  let size = Object.keys(cache).length;
  if (downloadCache) { //  download cache file on stop()
    let fname = `cache-${size}.js`;
    let data = `let cache=${JSON.stringify(cache, 0, 2)};`
    download(data, fname, 'text');
    console.log(`[INFO] wrote ${fname}`);
  }
}

// compute lookups needed for all words in source
function createSourceCache() {
  let sourceCache = {};
  let missing = [];
  repids.forEach(idx => {
    let urban = sources.urban[idx];
    let rural = sources.rural[idx];
    if (!(urban in similarOverrides)) {
      if (urban in cache) {
        sourceCache[urban] = cache[urban];
      }
      else {
        missing.push(urban);
      }
    }
    if (urban === rural) return;
    if (!(rural in similarOverrides)) {
      if (rural in cache) {
        sourceCache[rural] = cache[rural];
      }
      else {
        missing.push(rural);
      }
    }
  });

  if (0) {
    console.log(Object.keys(sourceCache).length + ' in source cache');
    if (missing.length) console.error('Missing: ', missing);
    let filename = 'sourceCache-' + Object.keys(sourceCache).length + '.js';
    console.log('writing ' + filename);
    download(`let cache=${JSON.stringify(sourceCache, 0, 2)};`, filename, 'text');
  }

  return { sourceCache, missing };
}

function replaceables() { // [] of replaceable indexes
  let repids = [], count = 0;
  sources.rural.forEach((word, idx) => {
    if (isReplaceable(word)) repids.push(idx);
  });
  sources.urban.forEach((word, idx) => {
    if (isReplaceable(word)) {
      if (!repids.includes(idx)) {
        throw Error('Invalid state[1]: ' + idx + '/' + word);
      }
      count++;
    }
  });
  if (repids.length !== count) throw Error('Invalid state[2]');
  return repids;
}

function isReplaceable(word) { // duplicated in worker
  return (word.length >= minWordLength || word in similarOverrides)
    && !stops.includes(word);
}

/* compute id set for strict replacements (unused) */
function strictReplaceables() {
  return repids.filter(idx =>
    sources.rural[idx] !== sources.urban[idx]);
}

function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function swapDomain() {
  state.legs = 0;
  state.domain = shadowTextName();
  log(`Domain switch -> '${state.domain}'`);
  if (state.domain === 'rural') {
    let p = document.getElementById("progress2");
    p.classList.add('shared-rural');
    p.classList.remove('shared-urban');
    progressBarsBaseMatrix[2] = [-1, 0, 0, 1, initialMetrics.radius * 2, 0];
    updateProgressBar(p, 2, progressBarsBaseMatrix, radius / initialMetrics.radius);
  } else {
    let p = document.getElementById("progress2");
    p.classList.remove('shared-rural');
    p.classList.add('shared-urban');
    progressBarsBaseMatrix[2] = [1, 0, 0, 1, 0, 0];
    updateProgressBar(p, 2, progressBarsBaseMatrix, radius / initialMetrics.radius);
  }
}

function updateDOM(next, idx) {

  let { outgoing } = state;

  let wordEle = document.querySelector(`#w${idx}`);
  let lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseFloat(lineEle.id.slice(1));
  wordEle.textContent = next;

  if (highlights) wordEle.classList.add(outgoing ? 'outgoing' : 'incoming');
  let wordSpaceEm = adjustWordSpace(lineEle, initialMetrics.lineWidths[lineIdx]);

  if (0) console.log('@' + lineIdx + '.' + idx + ' wordSpace=' + wordSpaceEm
    + '/' + (wordSpaceEm * initialMetrics.fontSize) + 'em');

  return { wordSpaceEm, wordEle, lineEle };
}

function update(updating = true) {
  let { domain, legs, maxLegs } = state;
  log(`Start: outgoing in '${domain}' on leg ${legs + 1}/${maxLegs}`);
  state.updating = updating;
  state.maxLegs = walks.short;
  domLegend.style.display = 'block';
  threeBarIcon.style.display = 'block';
  ramble();
}

function scaleToFit() {
  scaleRatio = radius / initialMetrics.radius;
  initialMetrics.textDisplay.style.transform = "scale(" + scaleRatio + ")";
  domLegend.style.transform = "scale(" + scaleRatio + ")";
  threeBarIcon.style.transform = "scale(" + scaleRatio + ")";
  document.querySelectorAll(".progress").forEach((p, i) => {
    updateProgressBar(p, i, progressBarsBaseMatrix, scaleRatio);
  });

  displayContainer.style.marginTop = 0.1 * radius + "px";
  if (!dbug) displayContainer.addEventListener("mousemove", hideCursor);
  progressBounds = document.getElementById("progress4")
    .getBoundingClientRect();

  // update measure ctx
  let computedStyle = window.getComputedStyle(document.getElementById("l0"))
  measureCtx.font = computedStyle.font;
  if (isSafari) {
    let computedFontSize = parseFloat(computedStyle.fontStyle.replace("px", ""));
    safariWidthScaleRatio = computedFontSize / Math.round(computedFontSize);
  }

  if (kiosk) {
    toggleLegend(false); // show legend (no '?', no bars) if kiosked
    document.querySelector("#about-button").style.display = 'none';
    document.querySelector("#icon-wrapper").style.display = 'none';
  }

  log(`opts { scale: ${scaleRatio.toFixed(2)}, `
    + `font: ${measureCtx.font.replace(/,.*/, '')} }`);
}

function trunc(arr, len = 100) {
  arr = Array.isArray(arr) ? (JSON.stringify(arr)
    .replace(/[""\[\]]/g, '')
    .replace(/,/g, ', '))
    : arr;
  if (arr.length <= len) return arr;
  return arr.substring(0, len) + '...';
}

function shadowTextName(domain) {
  domain = domain || state.domain;
  return domain === 'rural' ? 'urban' : 'rural';
}

function beingRead(idx) { // unused
  return reader.selection()
    .includes(sources[state.domain][idx]);
}

function lineIdFromWordId(idx) {
  // return wordLineMap.word2Line[idx]; // strange results
  let wordEle = document.getElementById("w" + idx);
  let lineEle = wordEle.parentElement.parentElement;
  return parseInt(lineEle.id.slice(1));
}

function last(arr) {
  if (arr && arr.length) return arr[arr.length - 1];
}

function log(msg) {
  logging && console.log('[INFO] ' + msg);
}

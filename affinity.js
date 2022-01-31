
let words = ['by', 'the', 'time', 'the', 'light', 'has', 'faded,', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest,', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights,', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions,', 'before', 'or', 'after', 'this', 'or', 'that', 'violent,', 'usually', 'nocturnal,', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights,', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures,', 'constrained', 'by', 'obstacles,', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror:', 'just', 'before', 'or', 'with', 'the', 'dawn,', 'after', 'a', 'morning', 'prayer,', 'in', 'anticipation', 'of', 'hunger,', 'while', 'the', 'neighbors', 'are', 'still', 'breathing,', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs,', 'after', 'our', 'own', 'trials', 'of', 'loss,', 'while', 'the', 'mortars', 'still', 'fall,', 'in', 'quiet', 'moments', 'after', 'shock,', 'most', 'particularly', 'after', 'curfew,', 'at', 'sunset,', 'to', 'escape,', 'to', 'avoid', 'being', 'found,', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty,', 'or', 'one', 'another,', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices,', 'or', 'met', 'with', 'other', 'danger,', 'venal', 'or', 'military,', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed,', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition,', 'this', 'before', 'or', 'after', 'assault,', 'and', 'still', 'return;', 'or', 'the', 'other,', 'the', 'quiet', 'evacuation', 'of', 'the', 'light,', 'the', 'way,', 'as', 'we', 'have', 'kept', 'on', 'struggling,', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there,', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust,', 'within', 'the', 'shadows', 'of', 'our', 'ruins,', 'beneath', 'the', 'wall,', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire,', 'annihilated,', 'gone,', 'quite', 'gone,', 'now', 'simply', 'gone', 'and,', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways,', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled,', 'heart', 'felt', 'fire', 'in', 'our', 'veins,', 'exiled'];
let txt = "by the time the light has faded, as the last of the reddish gold illumination comes to rest, then imperceptibly spreads out over the dust and rubble of the craters on the easterly facing bankside heights, you or I will have rushed out on several of yet more circuits at every time and in all directions, before or after this or that violent, usually nocturnal, event on desperately hurried unfamiliar flights, as if these panics might be movements of desire whereas always our gestures, constrained by obstacles, are also more like scars of universal daily terror: just before or with the dawn, after a morning prayer, in anticipation of hunger, while the neighbors are still breathing, as and when the diligent authorities are marshaling their cronies and thugs, after our own trials of loss, while the mortars still fall, in quiet moments after shock, most particularly after curfew, at sunset, to escape, to avoid being found, to seem to be lost right here in this place where you or I have always wanted to be and where we might sometimes now or then have discovered some singular hidden beauty, or one another, or stumbled and injured ourselves beyond the hearing and call of other voices, or met with other danger, venal or military, the one tearing and rending and opening up the darkness within us to bleed, yet we suppress any sound that might have expressed the terror and longing and horror and pain so that I or you may continue on this expedition, this before or after assault, and still return; or the other, the quiet evacuation of the light, the way, as we have kept on struggling, it falls on us and removes us from existence since in any case we are all but never there, always merely passing through and by and over the dust, within the shadows of our ruins, beneath the wall, within the razor of its coiled wire, annihilated, gone, quite gone, now simply gone and, in being or advancing in these ways, giving up all living light for unsettled, heart felt fire in our veins, exiled";

let ele = document.getElementById('circle');
let contrect = ele.getBoundingClientRect();
let cx = contrect.x + contrect.width / 2;
let cy = contrect.y + contrect.height / 2;
let radius = contrect.width / 2;
let fontFamily = window.getComputedStyle(ele).fontFamily;
//let lines = circleLayout(txt, cx, cy, radius, 24, fontFamily);
let lines = maxFontSizeForCircle(words, cx, cy, radius, fontFamily);

//console.log(lines.map(l => l.text));
ele.innerHTML = lines.reduce((acc, l) => {
  let ypos = l.bounds[1] - l.bounds[3] / 2;
  let opacity = Math.random() < .1 ? 1 : 0.3;
  return acc + `<span style="top: ${ypos}px; font-size:${l.fontSize}px;`
    + ` opacity:${opacity}" class="text">${l.text}</span>\n`;
}, '');

let circle = new ProgressBar.Circle('#progress', {
  duration: 3000,
  strokeWidth: 1.1,
  easing: 'easeOut',
  trailColor: '#fafafa',
  color: '#ddd',
});

let d = 50;
function go() {
  circle.animate((d += Math.random() < .5 ? 5 : -5) / 100, {
    duration: 3000
  }, function () {
    console.log('Animation has finished');
    setTimeout(go, 1);
  });
}

go();

function maxFontSizeForCircle(words, cx, cy, radius, fontName = 'sans-serif', minFontSize = 10) {
  let fontSize = radius / 4, result;
  do {
    fontSize *= .99;
    result = fitToLineWidths(cx, cy, radius, words, Math.max(minFontSize, fontSize), fontName);
  }
  while (result.words.length);
  console.log('ok:', fontSize);//, result.rects.length, result.text.length);
  return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.text[i] }));
}

function circleLayout(txt, cx, cy, radius, fontSize, fontName = 'sans-serif') {
  let result = fitToLineWidths(cx, cy, radius, txt.split(' '), fontSize, fontName);
  return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.text[i] }));
}

function fitToLineWidths(cx, cy, radius, words, fontSize, fontName = 'sans-serif') {
  //console.log('fitToLineWidths', fontSize);
  let tokens = words.slice(), lh = fontSize * 1.2;
  let text = [], rects = lineWidths(cx, cy, radius, lh);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontName);
    if (!data) { // fail to fit even one word
      //console.log(i, 'fail', fontSize, w, tokens.length);
      return { words, rects, texts: [] };
    }
    text.push(data.text);
    tokens = data.words;
  });
  return { text, rects, words: tokens };
}

function fitToBox(words, width, fontSize, fontName = 'sans-serif') {
  //console.log('fitToBox', words, width, fontSize);
  //if (!words.length) return {text: '', words};
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName)
  };
  if (line.width > width) {
    return; // can't fit first word
  }
  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName);
    if (line.width + nextWidth > width) break; // done
    line.text += next;
    line.width += nextWidth;
  }
  return { text: line.text || '', words: words.slice(i) };
}

function lineWidths(cx, cy, r, lh) {
  //console.log('lineWidths', cx, cy, r, lh);
  let result = [];
  let num = Math.floor((r * 2) / lh);
  for (let i = 0; i < num; i++) {
    let d = (i + 1) * lh - lh / 3; // ?
    let cl = chordLength(r, d > r ? d + lh : d);
    let x = cx - cl / 2;
    let y = cy - (r - d);
    if (cl) {
      //console.log(i, d, d > r, cl);
      result.push([x, y, cl, lh]);
    }
  }
  return result;
}

// at distance d from top of circle with radius r
function chordLength(r, d) {
  return 2 * Math.sqrt(r * r - (r - d) * (r - d));
}

function measureWidthX(text, fontSizePx = 12, fontName = 'sans-serif') {
  //let f = `${fontSizePx}px ${fontName}`;
  let o = $('<span></span>').text(text)
    //.css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font-size': fontSizePx, 'font-family': fontName })
    .css({ 'class': 'text', 'visibility': 'hidden' })
    .appendTo($('body'));
  let w = o.width();
  o.remove();
  console.log(w, measureWidthCanvas(...arguments));
  return w;
}

function measureWidth(text, fontSizePx = 12, fontName = fontFamily) {
  const context = document.createElement("canvas").getContext("2d");
  context.font = fontSizePx + 'px ' + fontName;
  //console.log(context.font);
  return context.measureText(text).width;
}
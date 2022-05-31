/*
  Measure a string with canvas context using the current font and fontsize
  @param text: str to be measured 
  @param font: css str to set the font for measurement
  @param wordSpacing: (optional) css string or number in em
*/
const measureWidthCtx = function (text, font, wordSpacing) { // scale = 1

  if (typeof font !== 'string') throw Error('font must be string');

  measureCtx.font = font;
  if (isSafari) {
    let fs = parseFloat((/\d+\.\d*px/.exec(font))[0].replace('px', ''));
    safariWidthScaleRatio = fs / Math.round(fs);
  }

  let wordSpacePx = wordSpacing || 0;
  if (typeof wordSpacing === 'number') {
    wordSpacePx = wordSpacing * initialMetrics.fontSize;
  }
  else if (typeof wordSpacing === 'string') {
    if (/px/.test(wordSpacing)) {
      wordSpacePx = parseFloat(wordSpacing.replace("px", "").trim());
    } else if (/em/.test(wordSpacing)) {
      wordSpacePx = parseFloat(wordSpacing.replace("em", "").trim()) * initialMetrics.fontSize;
    } else {
      wordSpacePx = 0;
      console.error("Unable to parse wordSpacing, using 0");
    }
  } else {
    throw Error("Invalid wordSpacing arg");
  }

  let width = measureCtx.measureText(text).width;
  let numSpaces = text.split(' ').length - 1;

  return (width + (numSpaces * wordSpacePx)) * (isSafari ? safariWidthScaleRatio : 1);
}

/*
  Get the current width of a line in scaleRatio = 1
  @param: line: line element or line index
          wordSpacing: (optional) set the wordSpacing for calculation, number in em
*/
const getLineWidth = function (line, wordSpacing = undefined) {
  // return value in scaleRatio = 1 (initial state)
  let lineEle = line instanceof HTMLElement ? line : document.getElementById("l" + line);
  let currentSpacing = lineEle.style.wordSpacing;
  if (wordSpacing) lineEle.style.wordSpacing = wordSpacing + "em"; // set ws
  let contentSpan = lineEle.firstElementChild;
  let width = !contentSpan ? 0 : contentSpan.getBoundingClientRect().width
    / (typeof scaleRatio === 'number' ? scaleRatio : 1);
  if (wordSpacing) lineEle.style.wordSpacing = currentSpacing; // reset ws
  return width;
}

const getInitialContentWidths = function (n, useCtx) {
  let r = [];
  for (let i = 0; i < n; i++) {
    const lineEle = document.getElementById("l" + i);
    if (!useCtx) {
      r.push(lineEle.firstChild ? lineEle.firstChild.getBoundingClientRect().width : 0);
    } else {
      let style = window.getComputedStyle(lineEle);
      let t = lineEle.firstChild ? lineEle.firstChild.textContent : "";
      r.push(measureWidthCtx(t, style.font, style.wordSpacing));
    }
  }
  return r;
}

/*
  Computes the estimated change of width in percentage after a word change
  @return {
    min: [percentage, width] - distance to target width with min word spacing,
    max: [percentage, width] - distance to target width with max word spacing
    opt: [percentage, width, ws (in px), ws (in em)] - distance to target after ws adjustment (unused)
  }

  @param newWord: str, the word  to change to
  @param wordId: int, the id of the word to be changed
  @param isShadow: boolean, true if using shadow text
  @param fields: arr, return field, ['max', 'min', 'opt'] // specify needed only for performance

  @optimisen if we measure new width with 'minWordSpace', we should be able to compute width 
  with 'maxWordSpace', based on the numSpaces, without another measure call (possible futures)
*/
const widthChangePercentage = function (newWord, wordIdx, isShadow, fields = ['max', 'min']) {

  let result = {};
  let wordEle = isShadow ? undefined : document.getElementById("w" + wordIdx);
  let lineIdx = wordLineMap.word2Line[wordIdx];
  let originalWord = isShadow ? history[shadowTextName()].map(last)[wordIdx] : wordEle.textContent;
  let spanEle = isShadow ? undefined : wordEle.parentElement;
  let lineEle = document.getElementById("l" + lineIdx);
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let originalText = isShadow ? getShadowText(lineIdx) : spanEle.textContent;
  let newText = originalText.replace(originalWord, newWord); // if multiple words?
  let style = window.getComputedStyle(lineEle);

  if (fields.includes('max')) {
    let maxWsPx = maxWordSpace * initialMetrics.fontSize;
    let widthMaxWs = measureWidthCtx(newText, style.font, maxWsPx + "px");
    result.max = [((widthMaxWs - targetWidth) / targetWidth) * 100, widthMaxWs]
  }

  if (fields.includes('min')) {
    let minWsPx = minWordSpace * initialMetrics.fontSize;
    let widthMinWs = measureWidthCtx(newText, style.font, minWsPx + "px");
    result.min = [((widthMinWs - targetWidth) / targetWidth) * 100, widthMinWs]
  }

  if (fields.includes('opt')) { // unused
    if (isShadow) throw Error
      ('[widthChangePercentage] opt field not avaliable for shadow text');
    let currentWsPx = parseFloat(style.wordSpacing.replace("px", "").trim())
    let step = 0.01 * initialMetrics.fontSize;
    let currentWidth = measureWidthCtx(newText, style.font, currentWsPx + "px");
    let direction = currentWidth >= targetWidth ? -1 : 1;
    let bound1 = currentWsPx, bound2, w1;
    while ((direction > 0 ? currentWidth < targetWidth : currentWidth > targetWidth)) {
      bound1 += step * direction;
      currentWidth = measureWidthCtx(newText, style.font, bound1 + "px");
    }

    w1 = currentWidth;
    bound2 = bound1 - (step * direction);
    currentWidth = measureWidthCtx(newText, style.font, bound2 + "px");

    let wdiff = Math.abs(currentWidth - targetWidth);
    let finalWidth = Math.abs(w1 - targetWidth) >= wdiff ? currentWidth : w1;
    let finalWs = Math.abs(w1 - targetWidth) >= wdiff ? bound2 : bound1;
    result.opt = [((finalWidth - targetWidth) / finalWidth) * 100,
      finalWidth, finalWs, finalWs / initialMetrics.fontSize]
  }

  return result;
}

const getShadowText = function (lineIdx) {
  let r = []
  wordLineMap.line2Word[lineIdx].forEach(wi => r.push(history[shadowTextName()].map(last)[wi]));
  return r.join(" ");
}


function getWordSpaceEm(lineEle) {
  let wordSpacingPx = window.getComputedStyle(lineEle).wordSpacing.replace('px', '');
  return parseFloat(wordSpacingPx) / initialMetrics.fontSize; // px => em
}
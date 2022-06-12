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
      wordSpacePx = parseFloat(wordSpacing.replace("em", "").trim())
        * initialMetrics.fontSize;
    } else {
      wordSpacePx = 0;
      console.error("Unable to parse wordSpacing, using 0");
    }
  } else {
    throw Error("Invalid wordSpacing arg");
  }

  let width = measureCtx.measureText(text).width;
  let numSpaces = text.split(' ').length - 1;

  return (width + (numSpaces * wordSpacePx))
    * (isSafari ? safariWidthScaleRatio : 1);
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
    minWidth: [percentage || width] - distance to target width with min word spacing,
    maxWidth: [percentage || width] - distance to target width with max word spacing
    optionally { wordSpaceEm, wordSpacePx, actualWidth} if opts.computeWordSpace is true 
  }

  @param newWord: str, the word  to change to
  @param wordIdx: int, the id of the word to be changed
  @param opts: options object, {
    isShadow: boolean, true if using shadow text
    usePercent: boolean, return values in percent
    computeWordSpace: boolean, also compute optimal word-spacing for line
  }

  @optimise if we measure new width with 'minWordSpace', we should be able to compute width 
  with 'maxWordSpace', based on the numSpaces, without another measure call (possible futures)
*/
const computeWidthData = function (newWord, wordIdx, opts = {}) {

  let result = {};
  let isShadow = opts.shadow;
  let usePercent = opts.usePercent;
  let wordEle = isShadow ? undefined : document.getElementById("w" + wordIdx);
  let lineIdx = wordLineMap.word2Line[wordIdx];
  let originalWord = isShadow ? history[shadowTextName()].map(last)[wordIdx] : wordEle.textContent;
  let spanEle = isShadow ? undefined : wordEle.parentElement;
  let lineEle = document.getElementById("l" + lineIdx);
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let originalText = isShadow ? getShadowText(lineIdx) : spanEle.textContent;
  let newText = originalText.replace(originalWord, newWord); // if multiple words?
  let style = window.getComputedStyle(lineEle);

  // compute the max-width (width with max allowed word-space)
  let maxWsPx = maxWordSpace * initialMetrics.fontSize;
  let widthMaxWs = measureWidthCtx(newText, style.font, maxWsPx + "px");
  result.maxWidth = usePercent ? ((widthMaxWs - targetWidth) / targetWidth) * 100 : widthMaxWs;

  // compute the min-width (width with min allowed word-space)
  let minWsPx = minWordSpace * initialMetrics.fontSize;
  let widthMinWs = measureWidthCtx(newText, style.font, minWsPx + "px");
  result.minWidth = usePercent ? ((widthMinWs - targetWidth) / targetWidth) * 100 : widthMinWs;


  if (opts.computeWordSpace) {   // compute optimal wordspace and actual width using it

    if (isShadow) throw Error('opts.computeWordSpace not available for shadow text');

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
    result.actualWidth = usePercent ? ((finalWidth - targetWidth) / finalWidth) * 100 : finalWidth;
    result.wordSpacePx = Math.abs(w1 - targetWidth) >= wdiff ? bound2 : bound1;
    result.wordSpaceEm = result.wordSpacePx / initialMetrics.fontSize;
  }

  return result;
}

const getShadowText = function (lineIdx) {
  let r = []; // use reduce
  wordLineMap.line2Word[lineIdx].forEach
    (wi => r.push(history[shadowTextName()].map(last)[wi]));
  return r.join(" ");
}


function getWordSpaceEm(lineEle) {
  let wordSpacingPx = window.getComputedStyle(lineEle).wordSpacing.replace('px', '');
  return parseFloat(wordSpacingPx) / initialMetrics.fontSize; // px => em
}
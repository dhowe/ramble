const affinityLabels = ['initial', 'free', 'shared', 'urban', 'rural'];

// affinities for visualization band and stats panel
function affinities() {
  let data = { rural: 0, urban: 0, shared: 0, free: 0 };
  let current = unspanify();
  repids.forEach(idx => {
    let visible = current[idx];
    let rurMatch = sources.rural[idx] === visible;
    let urbMatch = sources.urban[idx] === visible;
    if (!rurMatch && !urbMatch) data.free++;
    if (rurMatch && !urbMatch) data.rural++;
    if (!rurMatch && urbMatch) data.urban++;
    if (rurMatch && urbMatch) data.shared++;
  });
  // normalize (4 values should sum to 1)
  return Object.fromEntries(Object.entries(data).map
    (([k, v]) => [k, v / repids.length]));
}

function keyhandler(e) {
  if (e.code === 'KeyI') {
    let curr = window.getComputedStyle(domStats);
    domStats.style.display = curr.display === 'block' ? 'none' : 'block';
  }
  else if (e.code === 'KeyD') {
    reader.unpauseThen(update);
    console.log('[KEYB] skip-delay');
  }

  if (production) return; // only I/D keys for prod

  if (e.code === 'KeyL') {
    logging = !logging;
    console.log('[KEYB] logging: ' + logging);
  }
  else if (e.code === 'KeyV') {
    verbose = !verbose;
    console.log('[KEYB] verbose: ' + verbose);
  }
  else if (e.code === 'KeyH') {
    highlights = !highlights;
    if (!highlights) {
      Array.from(spans).forEach(e => {
        e.classList.remove('incoming');
        e.classList.remove('outgoing');
      });
    }
    console.log('[KEYB] highlights: ' + highlights);
  }
  else if (e.code === 'KeyE') {
    if (logging) console.log('[KEYB] end');
    stop();
  }
  else if (e.code === 'KeyS') {
    shadowMode = !shadowMode;
    console.log('[KEYB] shadowMode: ' + shadowMode + ' ** NOT-YET-IMPLEMENTED');
  }
  else if (e.code === 'KeyT') {
    if (!state.stepMode) {
      state.stepMode = true;
      if (reader) reader.stop();
    }
    else {
      state.loopId = setTimeout(ramble, 1);
    }
    console.log('[KEYB] stepMode: ' + state.stepMode);
  }
  else if (e.code === 'KeyC') {
    toggleLegend();
    console.log('[KEYB] color-map')
  }
  else if (e.code === 'KeyW') {
    highlightWs = !highlightWs;
    adjustAllWordSpacing(highlightWs);
    console.log('[KEYB] wordspace-classes: ' + highlightWs);
  }
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, domain, outgoing, legs, maxLegs } = state;

  let affvals = Object.fromEntries(Object.entries(affinities())
    .map(([k, raw]) => {
      let fmt = (raw * 100).toFixed(2);  // pad
      while (fmt.length < 5) fmt = '0' + fmt;
      return [k, fmt];
    }));

  // Update the #stats panel
  let data = 'Domain: ' + domain;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');
  data += `&nbsp; Leg: ${legs + 1}/${maxLegs}&nbsp; Affinity:`;
  data += ' rural=' + affvals.rural + ' urban=' + affvals.urban;
  data += ' shared=' + affvals.shared + ' free=' + affvals.free;
  domStats.innerHTML = data;

  progressBars.forEach((p, i) => {
    let num = 0;
    let barname = affinityLabels[i];
    if (updating) {
      if (barname === 'free') {
        num = 100;
      } else if (barname === 'shared') {
        num = parseFloat(affvals.shared) + parseFloat(affvals[domain === "rural" ? "urban" : "rural"]);
      } else {
        num = affvals[barname];
      }
    }
    p.animate(num / 100, {
      duration: barname === 'free' ? -100 : 3000
    }, () => 0/*no-op*/);
  });
}

function createLegend(metrics) {

  let domLegend = document.createElement("div");
  domLegend.id = "legend";
  domLegend.style.width = metrics.radius * 2 + "px"
  domLegend.style.height = metrics.radius * 2 + "px"

  let legendContent = document.createElement("div");
  legendContent.classList.add("legend-content");
  legendContent.innerHTML = `<div><svg class="rural-legend" style="fill: ${visBandColors[0]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> <span> rural</span></div>
  <div><svg class="urban-legend" style="fill: ${visBandColors[1]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> <span> urban</span></div>
  <div><svg class="overlap-legend">
  <rect style="fill: ${visBandColors[2]}" id="box" x="0" y="0" width="20" height="20"/>
  </svg> <span> shared</span></div>
  <div><svg class="overlap-legend">
  <rect style="fill: ${visBandColors[3]}" id="box" x="0" y="0" width="20" height="20"/>
  </svg> <span> found<span></div>
  <div> <div id="about-button">
  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 50 50">
  <circle cx="23" cy="25" r = "23" fill="#e6e6e6" />
  <text x="23" y="25" text-anchor="middle" fill="#B3B3B3" font-size="1.8em" dy=".35em">?</text>
  </svg>
  </button></div>`;23

  if (hideLegend) {
    legendContent.classList.add('hidden-legend')
  } else {
    legendContent.classList.remove('hidden-legend')
  }

  domLegend.append(legendContent);
  domLegend.style.fontSize = (metrics.fontSize || 20.5) + 'px';
  document.querySelector("#legend-container").append(domLegend);

  document.querySelector('#about-button').onclick = function () {
    document.querySelector('#about').style.display = 'block';
  }
  
  // TODO: remove
  document.querySelector('#about').style.display = 'block';

  return domLegend;
}

function createIcon(metrics) {
  const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <line x1="2.5" y1="7.5" x2="22.5" y2="7.5"></line>
  <line x1="2.5" y1="15" x2="22.5" y2="15"></line>
  <line x1="2.5" y1="22.5" x2="22.5" y2="22.5"></line>
  </svg>`
  let domIcon = document.createElement("div");
  domIcon.id = "three-bar-icon";
  domIcon.style.width = metrics.radius * 2 + "px"
  domIcon.style.height = metrics.radius * 2 + "px"
  let iconWrapper = document.createElement("div");
  iconWrapper.id = "icon-wrapper";
  iconWrapper.innerHTML = iconSVG;
  iconWrapper.addEventListener("click", () => {
    document.getElementsByClassName("hidden-legend")[0].classList.toggle("hidden-legend-v");
  })
  domIcon.append(iconWrapper);
  domIcon.style.display = "none";
  document.getElementById("icon-container").append(domIcon);
  return domIcon;
}

// Downloads data to a local file (tmp)
function download(data, filename, type = 'json') {
  if (typeof data !== 'string') data = JSON.stringify(data);
  let file = new Blob([data], { type });
  let a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

function createProgressBars(opts = {}) {

  progressBarsBaseMatrix = [
    [1, 0, 0, 1, 0, 0], // bg
    [1, 0, 0, 1, 0, 0], // free
    [-1, 0, 0, 1, initialMetrics.radius * 2, 0], //shared
    [-1, 0, 0, 1, initialMetrics.radius * 2, 0], //urban
    [1, 0, 0, 1, 0, 0], //rural
  ];

  // progress bars dict
  const pbars = [];
  let progress = document.querySelectorAll(".progress");
  progress.forEach((t, i) => {
    t.style.width = initialMetrics.radius * 2 + "px";
    t.style.height = initialMetrics.radius * 2 + "px";
    let pbar = new ProgressBar.Circle(t, {
      duration: opts.duration || (i > 0 ? 3000 : -100),
      // keep the absolute width same, see css options for strict bars
      strokeWidth: opts.strokeWidth || 4.5,
      easing: opts.easing || 'easeOut',
      trailColor: opts.trailColor ? (i === 0
        ? opts.trailColor : 'rgba(0,0,0,0)') : 'rgba(0,0,0,0)',
      color: opts.color && opts.color[i]
        ? opts.color[affinityLabels.length - 1 - i]
        : "#ddd"
    });
    pbars.push(pbar);
  });

  return pbars;
}

// unusued
function originalAffinity(textA, textB, idsToCheck) {

  let matches = idsToCheck.reduce((total, idx) =>
    total + (textA[idx] === textB[idx] ? 1 : 0), 0);
  let raw = matches / idsToCheck.length;
  let fmt = (raw * 100).toFixed(2);// pad
  while (fmt.length < 5) fmt = '0' + fmt;
  return raw * 100;
}

// toggle legends
function toggleLegend(target) {
  let legendContent = document.querySelector('.legend-content');
  if (typeof target === 'boolean') {
    if (target) {
      legendContent.classList.add('hidden-legend')
    } else {
      legendContent.classList.remove('hidden-legend')
    }
    hideLegend = target;
  } else {
    hideLegend = !hideLegend;
    if (hideLegend) {
      legendContent.classList.add('hidden-legend')
    } else {
      legendContent.classList.remove('hidden-legend')
    }
  }
}

function hideCursor(e) {
  let mouse = { x: e.pageX, y: e.pageY }; //clientXY?
  let r = progressBounds.width / 2;
  let center = { x: progressBounds.x + window.scrollX + r, y: progressBounds.y + window.scrollY + r };
  if ((mouse.x - center.x) * (mouse.x - center.x) + (mouse.y - center.y) * (mouse.y - center.y) <= r * r) {
    displayContainer.classList.add("hide-cursor");
  } else {
    displayContainer.classList.remove("hide-cursor");
  }
}

function updateProgressBar(p, i, m, r) {
  let arr = m[i];
  let str = "matrix(";
  arr.forEach(n => {
    let nstr = n * r + ",";
    str += nstr;
  })
  str = str.substring(0, str.length - 1);
  str += ")";
  //console.log(str);
  p.style.transform = str;
}
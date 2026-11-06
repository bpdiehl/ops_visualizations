(function () {
  'use strict';
  const M = globalThis.DemoModel, $ = id => document.getElementById(id);
  const fixed = x => x === null || !Number.isFinite(x) ? '—' : (Object.is(x, -0) ? 0 : x).toFixed(2);
  const signed = x => `${x > 1e-9 ? '+' : x < -1e-9 ? '−' : ''}${fixed(Math.abs(x))}`;
  const stationIds = ['A', 'B', 'C'];
  const symbol = (key, body, edit = '') => `<span data-symbol="${key}"${edit ? ` data-edit="${edit}"` : ''}>${body}</span>`;
  const sub = id => `<sub data-symbol="i">${id}</sub>`;
  const num = (x, key, edit = '', extra = '') => `<span class="num ${extra}" data-symbol="${key}"${edit ? ` data-edit="${edit}"` : ''}>${x === Infinity && key === 'CT' ? '∞' : extra === 'count' && Number.isFinite(x) ? x.toFixed(0) : fixed(x)}</span>`;
  let current = null, baseline = M.calculate(M.DEFAULTS), pinned = null, preview = null, edited = null, held = false, glowTimer = null, lastHelpButton = null;
  // Canonical rates survive presentation changes; rounded reciprocal fields are never read back on a toggle.
  let inputMode = 'rate', machineRates = [...M.DEFAULTS.rates];
  const HELP = {
    capacity: ['Station capacity', 'rᵢ is the output rate of one machine, in units/hour. nᵢ is the number of identical machines working in parallel at that station. Capacity Cᵢ = nᵢrᵢ. If one machine’s Cycle Time is CTᵢ minutes per unit, rᵢ = 60/CTᵢ, so Cᵢ = nᵢ × 60/CTᵢ. The 60 converts minutes to hours. Adding a parallel machine raises station capacity without changing each machine’s speed.'],
    bottleneck: ['System capacity & bottlenecks', 'Every item visits A, B and C once. The smallest station capacity sets the line’s capacity C. Every station tied for that minimum is a capacity bottleneck. Under low demand, those stations still define the capacity limit, but demand limits the current output rate. Improving a different station cannot raise C.'],
    throughput: ['Output rate', 'r_out is the ideal line output rate after startup: the smaller of customer demand d and system capacity C. This is a deterministic capacity model, not a measured simulation. It assumes sufficient materials, coordinated release, no variability and no other losses. Observed production can fall below this rate. Unmet demand is d − r_out; it is a rate, not an accumulated backlog.'],
    rates: ['Machine rate & Cycle Time (CT)', 'Choose rate rᵢ (units/hour) or Cycle Time CTᵢ (minutes/unit) for one machine. They describe the same speed: rᵢ = 60/CTᵢ. For example, 12 units/hour is 5 minutes/unit. CTᵢ is one machine’s time between completions while working. With parallel machines, the station interval is CTᵢ/nᵢ; the line interval is set by system capacity. Throughput Time (TPT) measures how long an item spends in the whole process, including its waits. That belongs with process-flow analysis. Changing the view preserves the model’s full precision. A stopped machine has rate 0 and time ∞; enter a finite time to restart it.'],
    demand: ['Customer demand', 'Demand d is the requested output per hour. Raising demand above capacity cannot make the line produce faster. Lowering demand below capacity leaves some capacity unused, even at the slowest station. This model plans flow to demand; it does not model uncontrolled arrivals.'],
    resources: ['Parallel machines', 'nᵢ counts identical machines working side by side at the same station. Two machines running at 8 units/hour each give that station a capacity of 16 units/hour. Each item uses just one of those machines before moving to the next station. You can also think of them as parallel service desks or work cells. This model assumes sufficient staffing and space, and does not calculate cost.'],
    utilization: ['Utilization', 'uᵢ = r_out / Cᵢ is the fraction of a station’s capacity needed for the sustainable flow. A spare-capacity station need not run continuously. Unused capacity is not automatically waste: speeding up a non-bottleneck can leave the line’s output rate unchanged. At a stopped station, Cᵢ = 0 and utilization is undefined (0 ÷ 0), shown as —.'],
    comparison: ['Saved comparison', 'Each preset compares with the original 12–8–10 line at demand 14, with one machine at every station. Presets keep your chosen rate/CT view. Save current case replaces the reference with your current inputs. Changing views does not change the saved case. Reset restores the starting inputs, rate view and original comparison. Differences are in units/hour, not percentages.'],
    model: ['Model assumptions', 'One product follows A → B → C, with 100% yield and no rework, setups, failures or transfer losses. Rates are deterministic. Each item uses one machine at every station. Sufficient material and coordinated release support the shown steady flow after startup. Buffers are not restrictive. Queue lengths, waiting times and transient production counts are not modeled. Figures are illustrative, not course-case data.'],
    references: ['References & scope', 'This is an original illustrative constraint lab. The capacity and utilization definitions were checked against Ardavan Asef-Vaziri’s Business Process Flow Engineering study guide (Chapter 2), California State University, Northridge. Notation here uses C for capacity, r_i for a machine rate, and r_out for line output rate; other texts may use different letters. Its basic capacity relationships are applied under the ideal deterministic assumptions stated here.']
  };
  function createControls() {
    $('main-controls').innerHTML = stationIds.map((id, i) => `<div class="control"><div class="control-heading"><label id="r${id}-label" for="r${id}-number">Station ${id} rate <span class="symbol">r${sub(id)}</span></label><button id="r${id}-help" class="info" data-help="rates" aria-label="Explain Station ${id} rate">i</button></div><div class="field-row"><input id="r${id}-number" data-field="rates-${i}" class="machine-input" type="number" inputmode="decimal" min="0" max="30" step="0.01" value="${fixed(M.DEFAULTS.rates[i])}" aria-describedby="r${id}-unit"><span id="r${id}-unit">units/hour</span></div><input id="r${id}-range" type="range" min="0" max="30" step="0.01" value="${M.DEFAULTS.rates[i]}" aria-label="Station ${id} rate slider in units per hour"></div>`).join('') + `<div class="control"><div class="control-heading"><label for="d-number">Demand <span class="symbol">d</span></label><button class="info" data-help="demand" aria-label="Explain customer demand">i</button></div><div class="field-row"><input id="d-number" data-field="demand" type="number" min="0" max="60" step="0.01" value="14.00" aria-describedby="d-unit"><span id="d-unit">units/hour</span></div><input id="d-range" type="range" min="0" max="60" step="0.01" value="14" aria-label="Demand slider in units per hour"></div>`;
    $('resource-controls').innerHTML = stationIds.map((id, i) => `<div class="resource-row"><label for="n${id}-number">Station ${id} machines <span class="symbol">n${sub(id)}</span></label><button class="info" data-help="resources" aria-label="Explain Station ${id} parallel machines">i</button><input id="n${id}-number" data-field="resources-${i}" type="number" min="1" max="6" step="1" value="1" aria-label="Station ${id} parallel machines"></div>`).join('');
    $('presets').innerHTML = M.PRESETS.map(p => `<button class="preset" data-preset="${p.id}" aria-pressed="false">${p.label}</button>`).join('');
    const keys = [['r', `r<sub>i</sub>`, 'Rate of one machine at station i', 'units/hour'], ['CT', `CT<sub>i</sub>`, 'Cycle Time of one machine at station i', 'minutes/unit'], ['n', `n<sub>i</sub>`, 'Parallel machines at station i', 'machines'], ['Ci', `C<sub>i</sub>`, 'Capacity of station i', 'units/hour'], ['C', 'C', 'Capacity of the whole line', 'units/hour'], ['d', 'd', 'Customer demand', 'units/hour'], ['rout', `r<sub>out</sub>`, 'Output rate of the line', 'units/hour'], ['u', `u<sub>i</sub>`, 'Utilization at station i', 'displayed as %'], ['i', 'i', 'Station index', 'A, B or C']];
    $('symbol-key').innerHTML = keys.map(([key, label, def, units]) => `<div class="key-row"><button class="key-button" data-key="${key}" aria-label="Highlight ${def.toLowerCase()}" aria-pressed="false">${label}</button><div>${def}<small>${units}</small></div></div>`).join('');
  }
  function readInput() {
    const read = key => $(key + '-number').value.trim() === '' ? NaN : Number($(key + '-number').value);
    return { rates: [...machineRates], resources: stationIds.map(id => read('n' + id)), demand: read('d') };
  }
  function readMachineField(i) {
    const raw = $('r' + stationIds[i] + '-number').value.trim();
    if (inputMode === 'rate') { machineRates[i] = raw === '' ? NaN : Number(raw); return; }
    const value = raw === '∞' || raw.toLowerCase() === 'infinity' ? Infinity : raw === '' ? NaN : Number(raw);
    // Only explicit infinity denotes a stopped machine; numeric overflow is invalid.
    try { machineRates[i] = !Number.isFinite(value) && raw !== '∞' && raw.toLowerCase() !== 'infinity' ? NaN : M.timeToRate(value); }
    catch { machineRates[i] = NaN; }
  }
  function presentMachineInputs() {
    const time = inputMode === 'time';
    $('mode-rate').setAttribute('aria-pressed', String(!time)); $('mode-time').setAttribute('aria-pressed', String(time));
    stationIds.forEach((id, i) => {
      const field = $('r' + id + '-number');
      field.type = time ? 'text' : 'number'; field.min = time ? '2' : '0';
      if (time) field.removeAttribute('max'); else field.max = '30';
      field.value = time ? (machineRates[i] === 0 ? '∞' : fixed(M.rateToTime(machineRates[i]))) : fixed(machineRates[i]);
      $('r' + id + '-label').innerHTML = `Station ${id} ${time ? 'Cycle Time' : 'rate'} <span class="symbol">${time ? 'CT' : 'r'}${sub(id)}</span>`;
      $('r' + id + '-help').setAttribute('aria-label', `Explain Station ${id} ${time ? 'Cycle Time (CT)' : 'rate'}`);
      $('r' + id + '-unit').textContent = time ? 'minutes/unit' : 'units/hour';
    });
  }
  function syncRanges() {
    const time = inputMode === 'time';
    const finiteTimes = machineRates.filter(r => Number.isFinite(r) && r > 0 && r <= 30).map(r => M.rateToTime(r));
    const timeMax = Math.max(60, ...finiteTimes);
    stationIds.forEach((id, i) => {
      const range = $('r' + id + '-range'), r = machineRates[i], valid = Number.isFinite(r) && r >= 0 && r <= 30;
      const value = valid ? (time ? M.rateToTime(r) : r) : NaN;
      range.min = time ? '2' : '0'; range.max = time ? String(timeMax) : '30';
      range.disabled = !valid || value === Infinity;
      if (valid && Number.isFinite(value)) range.value = value;
      range.setAttribute('aria-label', `Station ${id} ${time ? 'time slider in minutes per unit' : 'rate slider in units per hour'}`);
      range.setAttribute('aria-valuetext', value === Infinity ? 'Stopped: infinite Cycle Time' : valid ? `${fixed(value)} ${time ? 'minutes/unit' : 'units/hour'}` : 'Check input');
    });
    const demand = $('d-number');
    if (demand.value !== '' && Number.isFinite(Number(demand.value)) && Number(demand.value) >= 0 && Number(demand.value) <= 60) $('d-range').value = demand.value;
  }
  function setInputs(inputs) {
    machineRates = [...inputs.rates];
    presentMachineInputs();
    stationIds.forEach((id, i) => { $('n' + id + '-number').value = inputs.resources[i]; });
    $('d-number').value = fixed(inputs.demand); $('d-range').value = inputs.demand;
    render();
  }
  function applyHighlights() {
    const key = preview || pinned;
    document.querySelectorAll('[data-symbol]').forEach(el => el.classList.toggle('symbol-highlight', el.dataset.symbol === key));
    document.querySelectorAll('[data-edit]').forEach(el => el.classList.toggle('editing', !!edited && el.dataset.edit.split(' ').includes(edited)));
    document.querySelectorAll('[data-key]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.key === pinned)));
    $('clear-symbol').disabled = !pinned && !preview;
  }
  function pulse(key) { edited = key; clearTimeout(glowTimer); applyHighlights(); if (!held) glowTimer = setTimeout(() => { edited = null; applyHighlights(); }, 1000); }
  function release() { held = false; if (edited) pulse(edited); }
  function renderEquations(m) {

    const valid=!!m,pair=(id,symbols,rows)=>EquationLayout.render(id,symbols,valid?rows:[]),sym=(key,body)=>symbol(key,body);
    const time=inputMode==='time';
    pair('station-equations',['Station',sym('Ci','C'+sub('i')),'=',sym('n','n'+sub('i')),'×',...(time?['60','/',sym('CT','CT'+sub('i'))]:[sym('r','r'+sub('i'))])],stationIds.map((id,i)=>{const s=valid?m.stations[i]:{};return[sym('i',id),num(s.capacity,'Ci','','result'),'=',num(s.resources,'n','n'+id,'count'),'×',...(time?['60','/',num(s.time,'CT','r'+id)]:[num(s.rate,'r','r'+id)])];}));
    pair('capacity-equation',[sym('C','C'),'=','min(',sym('Ci','C'+sub('A')),',',sym('Ci','C'+sub('B')),',',sym('Ci','C'+sub('C')),')'],[[num(valid?m.capacity:null,'C','','result'),'=','min(',...stationIds.flatMap((id,i)=>[...(i?[',']:[]),num(valid?m.stations[i].capacity:null,'Ci')]),')']]);
    pair('throughput-equation',[sym('rout','r<sub>out</sub>'),'=','min(',sym('d','d'),',',sym('C','C'),')'],[[num(valid?m.throughput:null,'rout','','result'),'=','min(',num(valid?m.inputs.demand:null,'d','d'),',',num(valid?m.capacity:null,'C'),')']]);
    pair('utilization-equations',['Station',sym('u','u'+sub('i')),'=',sym('rout','r<sub>out</sub>'),'/',sym('Ci','C'+sub('i'))],stationIds.map((id,i)=>{const st=valid?m.stations[i]:{};return[sym('i',id),sym('u',st.utilization==null?'—':fixed(st.utilization*100)+'%'),'=',num(valid?m.throughput:null,'rout'),'/',num(st.capacity,'Ci')];}));
  }

  function drawChart(m) {
    const svg = $('capacity-chart');
    if (!m) { svg.innerHTML = '<title id="chart-title">Capacity chart unavailable</title><desc id="chart-desc">Correct the input errors to see current results.</desc><text x="50%" y="50%" text-anchor="middle" fill="#50616f">Correct the inputs to see the line.</text>'; return; }
    const narrow = svg.getBoundingClientRect().width < 440, w = narrow ? 340 : 650, h = 280, left = 53, right = w - 15, top = 42, bottom = 238;
    const scaleMax = Math.max(20, ...m.stations.map(s => s.capacity), m.inputs.demand);
    const tick = scaleMax <= 30 ? 5 : scaleMax <= 60 ? 10 : 30, max = Math.ceil(scaleMax / tick) * tick;
    const y = v => bottom - (bottom - top) * v / max, band = (right - left) / 3, barW = Math.min(70, band * .46);
    const text = (x, yy, t, attrs = '') => `<text x="${x}" y="${yy}" ${attrs}>${t}</text>`;
    let parts = `<title id="chart-title">Station capacity, demand and output rate</title><desc id="chart-desc">Stations A, B and C in series. Capacities ${m.stations.map(s => `${s.id}: ${fixed(s.capacity)}`).join(', ')} units per hour. Capacity bottleneck${m.bottlenecks.length > 1 ? 's' : ''}: ${m.bottlenecks.map(i => stationIds[i]).join(', ')}. Demand ${fixed(m.inputs.demand)}. Output rate ${fixed(m.throughput)} units per hour.</desc>`;
    for (let v = 0; v <= max; v += tick) {
      parts += `<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#e4eaf0"/>` + text(left - 9, y(v) + 4, v, 'text-anchor="end" font-size="10" fill="#607080"');
    }
    parts += text(14, (top + bottom) / 2, 'Units/hour', `transform="rotate(-90 14 ${(top + bottom) / 2})" text-anchor="middle" font-size="11" fill="#50616f"`);
    m.stations.forEach((s, i) => {
      const x = left + band * (i + .5), fill = s.bottleneck ? '#e1b286' : '#b5cbe7', stroke = s.bottleneck ? '#a55a16' : '#779dc9';
      parts += `<rect x="${x - barW / 2}" y="${y(s.capacity)}" width="${barW}" height="${bottom - y(s.capacity)}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${s.bottleneck ? 2 : 1}"/>`;
      if (s.capacity === 0) parts += `<line x1="${x-barW/2}" x2="${x+barW/2}" y1="${bottom}" y2="${bottom}" stroke="${stroke}" stroke-width="3"/>`;
      parts += text(x, y(s.capacity) - 10, fixed(s.capacity), `text-anchor="middle" font-size="${narrow ? 12 : 14}" font-weight="650" fill="#243d52" data-symbol="Ci"`);
      parts += text(x, bottom + 24, `Station ${s.id}`, `text-anchor="middle" font-size="${narrow ? 11 : 12}" fill="#243d52"`);
      if (i < 2) parts += text(left + band * (i + 1), bottom + 24, '→', 'text-anchor="middle" font-size="15" fill="#8394a5"');
    });
    parts += `<line x1="${left}" x2="${right}" y1="${y(m.inputs.demand)}" y2="${y(m.inputs.demand)}" stroke="#606e7b" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    parts += `<line x1="${left}" x2="${right}" y1="${y(m.throughput)}" y2="${y(m.throughput)}" stroke="#157569" stroke-width="2.5"/>`;
    if (Math.abs(m.inputs.demand - m.throughput) < 1e-9) parts += `<line x1="${left}" x2="${right}" y1="${y(m.inputs.demand)}" y2="${y(m.inputs.demand)}" stroke="#606e7b" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    parts += text(right, 20, `Demand ${fixed(m.inputs.demand)} · Output ${fixed(m.throughput)}`, 'text-anchor="end" font-size="10" fill="#50616f"');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.innerHTML = parts;
  }
  function render() {
    const input = readInput(), checked = M.validate(input);
    if (inputMode === 'time') checked.errors.forEach(error => {
      if (error.field.startsWith('rates-')) error.message = `Station ${stationIds[Number(error.field.split('-')[1])]} time must be at least 2.00 minutes/unit, or ∞ for a stopped machine.`;
    });
    document.querySelectorAll('[data-field]').forEach(el => el.setAttribute('aria-invalid', String(checked.errors.some(e => e.field === el.dataset.field))));
    $('error').hidden = checked.ok; $('error').textContent = checked.errors.map(e => e.message).join(' ');
    current = checked.ok ? M.calculate(input) : null;
    $('save-case').disabled = !current; $('download').disabled = !current;
    $('mode-rate').disabled = !current; $('mode-time').disabled = !current;
    syncRanges();
    document.querySelectorAll('[data-preset]').forEach(el => {
      const p = M.PRESETS.find(x => x.id === el.dataset.preset);
      el.setAttribute('aria-pressed', String(!!current && current.inputs.demand === p.demand && stationIds.every((id, i) => current.inputs.rates[i] === p.rates[i] && current.inputs.resources[i] === p.resources[i])));
    });
    renderEquations(current); drawChart(current);
    $('throughput').textContent = fixed(current?.throughput);
    $('binding').classList.toggle('demand-limited', current?.binding === 'demand');
    $('binding').textContent = !current ? 'Check inputs' : current.binding === 'demand' ? (current.inputs.demand === 0 ? 'No demand' : 'Demand limits output') : current.binding === 'both' ? 'Demand equals capacity' : `${current.bottlenecks.length > 1 ? 'Stations' : 'Station'} ${current.bottlenecks.map(i => stationIds[i]).join(' & ')} limit${current.bottlenecks.length === 1 ? 's' : ''} output`;
    $('station-results').innerHTML = stationIds.map((id, i) => {
      const s = current?.stations[i];
      return `<tr><th scope="row">${id}${s?.bottleneck ? '<span class="tag">Capacity bottleneck</span>' : ''}</th><td>${symbol('Ci', fixed(s?.capacity))}</td><td>${symbol('u', s?.utilization == null ? '—' : fixed(s.utilization * 100) + '%')}<span class="util-meter" aria-hidden="true"><i style="width:${s?.utilization == null ? 0 : s.utilization * 100}%"></i></span></td></tr>`;
    }).join('');
    const delta = current ? M.compare(current, baseline) : null;
    for (const [id, key] of [['capacity-change', 'capacity'], ['throughput-change', 'throughput'], ['unmet-change', 'unmet']]) {
      const value = delta?.[key]; $(id).innerHTML = current ? `${fixed(baseline[key])} → ${fixed(current[key])}<small>${signed(value)} units/hour</small>` : '—';
      $(id).classList.toggle('positive', !!current && (key === 'unmet' ? value < -1e-9 : value > 1e-9));
      $(id).classList.toggle('negative', !!current && (key === 'unmet' ? value > 1e-9 : value < -1e-9));
    }
    const names = current?.bottlenecks.map(i => stationIds[i]).join(' and ');
    $('comparison-note').textContent = !current ? 'Correct the inputs to compare cases.' : current.binding === 'demand' ? `Demand is below the line’s ${fixed(current.capacity)} units/hour capacity. More station capacity will not raise output at this demand.` : current.binding === 'both' ? 'Demand equals capacity. Raising output requires both more demand and more capacity.' : current.capacity === 0 ? `The line is stopped at ${names}. No station can sustain finished output until flow is restored.` : `${current.bottlenecks.length > 1 ? `Both constraints must improve to raise capacity.`.replace('Both', current.bottlenecks.length === 3 ? 'All three' : 'Both') : `Station ${names} sets the line’s capacity.`} ${delta.throughput > 1e-9 ? `Output is up ${fixed(delta.throughput)} units/hour from the saved case.` : Math.abs(delta.throughput) < 1e-9 && delta.stations.some(x => Math.abs(x) > 1e-9) ? 'Station capacities changed; the line’s output rate did not change.' : 'Compare a faster bottleneck with a faster non-bottleneck.'}`;
    applyHighlights();
  }
  createControls();
  for (const mode of ['rate', 'time']) $('mode-' + mode).addEventListener('click', () => {
    if (!current || inputMode === mode) return;
    inputMode = mode; edited = null; presentMachineInputs(); render();
  });
  for (const key of ['rA', 'rB', 'rC', 'd', 'nA', 'nB', 'nC']) {
    const number = $(key + '-number'), range = $(key + '-range');
    number.addEventListener('input', () => { if (key.startsWith('r')) readMachineField(stationIds.indexOf(key[1])); render(); pulse(key); });
    number.addEventListener('blur', () => {
      const value = Number(number.value);
      // Pad ordinary hundredth-step entries without rounding a more precise input.
      if (number.value.trim() !== '' && Number.isFinite(value) && !key.startsWith('n') && Math.abs(value * 100 - Math.round(value * 100)) < 1e-9) number.value = fixed(value);
      render(); release();
    });
    if (!range) continue;
    range.addEventListener('pointerdown', () => { held = true; pulse(key); });
    range.addEventListener('keydown', e => { if (e.key.startsWith('Arrow') || ['Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) { held = true; pulse(key); } });
    range.addEventListener('input', () => { number.value = fixed(Number(range.value)); if (key.startsWith('r')) readMachineField(stationIds.indexOf(key[1])); render(); pulse(key); });
    range.addEventListener('keyup', release); range.addEventListener('blur', release);
  }
  document.addEventListener('pointerup', release); document.addEventListener('pointercancel', release);
  document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => { baseline = M.calculate(M.DEFAULTS); pinned = null; preview = null; edited = null; setInputs(M.PRESETS.find(p => p.id === button.dataset.preset)); }));
  $('reset').addEventListener('click', () => { baseline = M.calculate(M.DEFAULTS); inputMode = 'rate'; pinned = null; preview = null; edited = null; $('advanced').open = false; setInputs(M.DEFAULTS); $('download-status').textContent = ''; });
  $('save-case').addEventListener('click', () => { if (current) { baseline = M.calculate(current.inputs); render(); $('comparison-note').textContent = 'Current inputs saved as the comparison case.'; } });
  document.querySelectorAll('[data-key]').forEach(button => {
    button.addEventListener('mouseenter', () => { preview = button.dataset.key; applyHighlights(); });
    button.addEventListener('mouseleave', () => { preview = null; applyHighlights(); });
    button.addEventListener('focus', () => { preview = button.dataset.key; applyHighlights(); });
    button.addEventListener('blur', () => { preview = null; applyHighlights(); });
    button.addEventListener('click', () => { pinned = pinned === button.dataset.key ? null : button.dataset.key; preview = null; applyHighlights(); if (pinned) document.querySelector(`.equations [data-symbol="${pinned}"]`)?.scrollIntoView({ block: 'center', behavior: 'auto' }); });
  });
  function clearSymbol() { pinned = null; preview = null; applyHighlights(); }
  $('clear-symbol').addEventListener('click', clearSymbol);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('help-dialog').open) clearSymbol(); });
  document.querySelectorAll('[data-help]').forEach(button => button.addEventListener('click', () => {
    const [title, body] = HELP[button.dataset.help]; lastHelpButton = button; $('help-title').textContent = title; $('help-body').replaceChildren();
    const p = document.createElement('p'); p.textContent = body; $('help-body').append(p);
    if (button.dataset.help === 'references') { const a = document.createElement('a'); a.href = 'https://www.csun.edu/~aa2035/CourseBase/Chapters/Process_Flow_Engineering.pdf'; a.textContent = 'CSUN · Business Process Flow Engineering, Chapter 2'; a.target = '_blank'; a.rel = 'noopener'; $('help-body').append(a); }
    $('help-dialog').showModal();
  }));
  $('close-help').addEventListener('click', () => $('help-dialog').close());
  $('help-dialog').addEventListener('close', () => lastHelpButton?.focus());
  $('help-dialog').addEventListener('click', e => { if (e.target === $('help-dialog')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
  $('download').addEventListener('click', () => {
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('.editing,.symbol-highlight').forEach(el => el.classList.remove('editing', 'symbol-highlight'));
    clone.querySelectorAll('dialog').forEach(el => el.removeAttribute('open'));
    clone.querySelectorAll('details').forEach(el => el.removeAttribute('open'));
    const url = URL.createObjectURL(new Blob(['<!doctype html>\n' + clone.outerHTML], { type: 'text/html' }));
    const a = document.createElement('a'); a.href = url; a.download = 'bottlenecks.html'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('download-status').textContent = 'Save bottlenecks.html · reopens at the starting example.';
  });
  let resizeFrame = null;
  new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => { drawChart(current); applyHighlights(); }); }).observe($('chart-area'));
  setInputs(M.DEFAULTS);
})();

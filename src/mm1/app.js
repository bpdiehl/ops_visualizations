(() => {
  "use strict";
  const M = globalThis.DemoModel, $ = id => document.getElementById(id);
  const fixed = n => n === null || !Number.isFinite(n) ? "—" : n.toFixed(2);
  const pct = n => fixed(n * 100) + "%", min = n => fixed(n) + " min";
  const HELP = {
    model: ["M/M/1: one random queue", "M/M/1 assumes independent Poisson arrivals, independent exponential service times, one server, first-come-first-served service, and unlimited waiting room. Rates stay constant. Nobody leaves without service. The long-run equations require λ < μ. These are illustrative inputs, not a fitted model of a particular restaurant or business."],
    lambda: ["Arrival rate λ", "λ (lambda) is the average number arriving per hour. It does not mean they arrive at evenly spaced times. Counts in fixed intervals follow a Poisson distribution; the gaps between individual arrivals are exponential. Raising λ changes the arrival plots and increases congestion when service capacity μ stays fixed."],
    mu: ["Service rate μ", "μ (mu) is the average number one server could complete per hour while continuously busy. At μ = 10/hour, mean service time is 6 minutes, but individual services can be much shorter or longer. Raising μ shifts the service-time distribution toward shorter times. It does not change the arrival distribution."],
    rho: ["Utilization ρ", "ρ (rho) = λ/μ. Below 100%, it is the fraction of time the server is busy in the stable long run. At or above 100%, it is a load ratio, not a feasible busy-time percentage. The server cannot be busy more than 100% of the time. Spare capacity absorbs random bursts and long services."],
    curve: ["Line length or wait time", "Line length shows Lq: the long-run average number waiting, excluding the person being served. Wait time shows Wq: average time before service. The curve varies arrival rate with the current service rate held fixed; the marker is your scenario. The vertical scale adjusts and the curve continues toward infinity at 100%. The breakdown adds average occupancy at the server (ρ), or mean service time, to the queue. Fractional people are averages, not a snapshot."],
    equations: ["Symbols and units", "λ and μ are customers/hour. All displayed times are in minutes, so the equations include a factor of 60 to convert hours to minutes. Wq is mean waiting before service; W includes waiting and service. Lq counts those waiting; L also includes the person being served. Fractional customers are long-run averages. At λ = 0, W is the expected time for a hypothetical arrival to an empty system."],
    randomness: ["Poisson, exponential, and Markov", "Poisson describes the COUNT of arrivals in a fixed time interval. Exponential describes the TIME between arrivals and the TIME to serve one customer. Markov refers to the memoryless property: given the current queue state, earlier history adds no information about the next transition under these assumptions. It is not the name of a third arrival-time distribution."],
    window: ["A fixed observation window t", "t is the number of minutes you watch. The Poisson mean is λt/60 arrivals in that interval. The shaded exponential areas show the probability that a gap or service ends within t minutes. Changing t changes what you measure, not λ, μ, utilization, or long-run queue performance. Chart time axes scale independently; read their labels."],
    poisson: ["Poisson: how many arrive?", "Each bar is the probability of a whole-number arrival count k in a fixed interval t. m = λt/60 is the expected count. The dashed line marks that average; it need not be a whole number. Several arrivals within one interval can happen even at a modest average rate. Individual arrivals still occur one at a time in continuous time. Only λ and t affect this plot."],
    gaps: ["Exponential: time between arrivals A", "The blue curve describes the gap A between consecutive arrivals. Its mean is 60/λ minutes. Many gaps are short, and a few can be long. The shaded AREA, not the height at a point, is the probability a gap ends within t minutes: 1 − exp(−λt/60). At λ = 0 there are no arrivals and no finite mean gap."],
    service: ["Exponential: service time S", "The green curve describes how long one service takes, with mean 60/μ minutes. The shaded area is the probability service finishes within t minutes: 1 − exp(−μt/60). The height is a probability density in 1/minute, not a probability. A longer-than-average service remains possible. Even after a long service so far, the exponential model has the same expected remaining time; real services may behave differently."],
    sample: ["A sample is not the long-run average", "The sample starts empty and uses a visible seed to make the random draws repeatable. The warm-up is excluded from time-weighted queue size, busy time, and measured departure rate. Wait averages include only customers arriving after warm-up and finishing by the horizon; unfinished customers are excluded, which can bias waits downward, especially near overload. Extending duration or changing the seed may change the result. Playback speed changes only the view."],
    differences: ["Why do the sample and model differ?", "The model is a long-run expectation. The sample starts empty and uses one finite random sequence, chosen by its seed. A new seed gives another outcome. Longer runs usually reduce variation, but one extension can move farther from the expected value. Near 100% utilization, settling can be slow; a warm-up does not guarantee steady state. The moving line is a snapshot; this table averages the full measurement period. Wait averages exclude customers unfinished at the horizon, which can pull them downward."],
    sources: ["Mathematical references", "The equations and distribution definitions were checked against the references below. All examples and graphics here are original and illustrative."]
  };
  const token = (key, text, cls = "") => `<span class="eq-token ${cls}" data-var="${key}">${text}</span>`;
  const num = (key, value, cls = "") => token(key, fixed(value), cls);
  const equations=['Utilization','Mean service time','Waiting in queue','Time in system','Customers waiting','Customers in system'];
  $("equation-grid").innerHTML=equations.map((label,i)=>`<div class="eq"><div class="eq-title"><span class="step">${i+1}</span>${label}</div><div class="formula"></div><div class="worked" id="eq-${i}"></div></div>`).join('');
  const read = () => Object.fromEntries(Object.keys(M.DEFAULTS).map(k => [k, $(k + "-number").value.trim() === "" ? NaN : Number($(k + "-number").value)]));
  let current = null, sample = null, sampleDirty = true, timer = null, lastFrame = 0, sampleT = 0, chartMode = "length";
  let heldKey = null, pulseTimer = null, lastHelpButton = null;
  function highlight(key) {
    document.querySelectorAll(".eq-token[data-var]").forEach(el => el.classList.toggle("is-editing", !!key && el.dataset.var.split(" ").includes(key)));
  }
  function pulse(key) {
    clearTimeout(pulseTimer); highlight(key);
    if (!heldKey) pulseTimer = setTimeout(() => highlight(null), 650);
  }
  function release() { heldKey = null; clearTimeout(pulseTimer); highlight(null); }
  function setInputs(inputs) {
    for (const [k, v] of Object.entries(inputs)) {
      $(k + "-number").value = fixed(v);
      const range = $(k + "-range");
      if (range) { range.max = Math.max(20, Math.ceil(v / 10) * 10); range.value = v; }
    }
    render();
  }
  // SVG helpers contain only controlled labels and finite model outputs.
  const line = (x1, y1, x2, y2, color = "#dfe6ed", extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${extra}/>`;
  const text = (x, y, value, anchor = "start", color = "#536574", extra = "") => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="11" ${extra}>${value}</text>`;
  function box(svg, height, left = 70) {
    const width = Math.max(220, svg.getBoundingClientRect().width), right = width - 18, top = 24, bottom = height - 38;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    return { width, height, left, right, top, bottom, x: v => left + v * (right - left), y: v => bottom - v * (bottom - top) };
  }
  function yAxisLabel(b, label) {
    const x = 13, y = (b.top + b.bottom) / 2;
    return text(x, y, label, "middle", "#536574", `class="y-axis-label" transform="rotate(-90 ${x} ${y})"`);
  }
  function axes(b, xMax, yMax, xName, yName, xFormat = fixed, yFormat = fixed) {
    let out = yAxisLabel(b, yName);
    for (let i = 0; i <= 4; i++) {
      const f = i / 4, y = b.y(f), x = b.x(f);
      out += line(b.left, y, b.right, y) + text(b.left - 8, y + 4, yFormat(yMax * f), "end");
      out += text(x, b.bottom + 19, xFormat(xMax * f), "middle");
    }
    return out + text((b.left + b.right) / 2, b.height - 2, xName, "middle");
  }
  function drawWait(m) {
    const svg = $("wait-chart"), b = box(svg, 252);
    const length = chartMode === "length", maxY = length ? m.lengthMax : m.waitMax, value = length ? m.Lq : m.Wq;
    let out = axes(b, 1, maxY, "Utilization ρ (%)", length ? "Average customers waiting Lq" : "Queue wait Wq (min)", x => (x * 100).toFixed(0), x => Number.isInteger(x) ? x.toFixed(0) : x.toFixed(1));
    const points = (length ? m.lengthCurve : m.curve).map(p => [b.x(p.rho), b.y((length ? p.Lq : p.Wq) / maxY)]);
    const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
    out += `<path d="M${b.left},${b.bottom} ${d.replace(/^M/, "L")} L${points.at(-1)[0]},${b.bottom} Z" fill="#2458a80b"/><path d="${d}" stroke="#2458a8" stroke-width="2.5" fill="none"/>`;
    out += line(b.right, b.top, b.right, b.bottom, "#a85a12", 'stroke-dasharray="4 4"');
    if (m.stable) {
      const x = b.x(m.rho), y = b.y(value / maxY), labelX = Math.max(b.left + 72, Math.min(b.right - 72, x));
      out += line(x, y, x, b.bottom, "#2458a8", 'stroke-dasharray="3 4"');
      out += `<circle cx="${x}" cy="${y}" r="5" fill="#2458a8" stroke="white" stroke-width="2"/>`;
      out += text(labelX, Math.max(b.top + 9, y - 12), `${pct(m.rho)} · ${length ? fixed(value) + " waiting" : min(value)}`, "middle", "#174c8b", 'font-weight="650"');
    } else out += text(b.right - 8, b.top + 14, "No steady state", "end", "#914809", 'font-weight="650"');
    out += text(points.at(-1)[0], b.top + 3, "↑", "middle", "#2458a8");
    svg.innerHTML = out;
    svg.setAttribute("aria-label", `Theoretical ${length ? "average line length" : "queue waiting time"} versus utilization, service rate ${fixed(m.inputs.mu)} customers/hour. ${m.stable ? `Current ${length ? fixed(value) + " customers waiting" : min(value)} at ${pct(m.rho)}.` : "No finite steady-state mean at this load."}`);
  }
  function drawCounts(m) {
    const d = m.distributions, svg = $("count-chart"), b = box(svg, 194, 64), points = d.counts;
    svg.setAttribute("aria-label", `Poisson arrival counts in ${fixed(m.inputs.window)} minutes. Mean ${fixed(d.countMean)}; probability of zero arrivals ${pct(d.pZero)}.`);
    const step = (b.right - b.left) / points.length;
    let out = yAxisLabel(b, "Probability (%)");
    for (let i = 0; i <= 2; i++) { const f = i / 2; out += line(b.left, b.y(f), b.right, b.y(f)) + text(b.left - 7, b.y(f) + 4, (d.countMax * f * 100).toFixed(0), "end"); }
    const tickEvery = Math.max(1, Math.ceil(points.length / 7));
    for (const p of points) {
      const x = b.left + p.k * step + step * .1, y = b.y(p.p / d.countMax);
      out += `<rect x="${x}" y="${y}" width="${Math.max(.6, step * .8)}" height="${b.bottom - y}" rx="1" fill="#2458a8"><title>${p.k} arrivals: ${pct(p.p)}</title></rect>`;
      if (p.k % tickEvery === 0) out += text(x + step * .4, b.bottom + 17, p.k, "middle");
    }
    const meanX = b.left + (d.countMean + .5) * step;
    out += line(meanX, b.top, meanX, b.bottom, "#172838", 'stroke-dasharray="3 3"');
    out += text(Math.max(b.left + 35, Math.min(b.right - 35, meanX)), b.top - 3, `Mean ${fixed(d.countMean)}`, "middle", "#172838");
    out += text((b.left + b.right) / 2, b.height - 2, "Arrivals k (customers)", "middle");
    svg.innerHTML = out;
    $("count-summary").innerHTML = `<strong>${pct(d.pZero)}</strong> none · <strong>${pct(d.pOne)}</strong> one<br><strong>${pct(d.pMany)}</strong> two or more`;
    EquationLayout.render("count-worked",["m","=",token("lambda","λ"),"×",token("window","Δt"),"/","60"],[[num("lambda window",d.countMean,"eq-result"),"=",num("lambda",m.inputs.lambda),"×",num("window",m.inputs.window),"/","60"]]);
  }
  function drawExponential(m, type) {
    const isGap = type === "gap", d = isGap ? m.distributions.arrivalTime : m.distributions.serviceTime;
    const color = isGap ? "#2458a8" : "#14786d", svg = $(type + "-chart"), b = box(svg, 194, 64), key = isGap ? "lambda" : "mu";
    svg.setAttribute("aria-label", d ? `Exponential ${isGap ? "arrival gap" : "service time"} density. Mean ${min(d.mean)}. ${pct(d.within)} within ${fixed(m.inputs.window)} minutes.` : "No arrivals at lambda zero; no finite mean gap.");
    if (!d) {
      svg.innerHTML = text(b.width / 2, 82, "λ = 0: no arrivals", "middle") + text(b.width / 2, 104, "No finite arrival-gap distribution", "middle");
      $(type + "-summary").innerHTML = "No arrivals at λ = 0.";
      EquationLayout.render(type+"-worked",["E[A]","=","60","/",token("lambda","λ")],[]);$(type+"-worked").innerHTML='<span style="grid-column:1/-1;grid-row:2">E[A] has no finite value</span>'; return;
    }
    let out = axes(b, d.timeMax, d.densityMax, "Time (min)", "Density (1/min)", x => x.toFixed(1), x => x < .01 && x > 0 ? x.toExponential(0) : x.toFixed(2));
    const points = d.points.map(p => [b.x(p.t / d.timeMax), b.y(p.density / d.densityMax)]);
    const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
    const shaded = d.points.filter(p => p.t < m.inputs.window);
    if (m.inputs.window < d.timeMax) shaded.push(d.windowPoint); else if (shaded.at(-1)?.t !== d.timeMax) shaded.push(d.points.at(-1));
    const sd = shaded.map(p => `L${b.x(p.t / d.timeMax)},${b.y(p.density / d.densityMax)}`).join(" ");
    out += `<path d="M${b.left},${b.bottom} ${sd} L${b.x(Math.min(1, m.inputs.window / d.timeMax))},${b.bottom} Z" fill="${color}" opacity=".13"/><path d="${path}" stroke="${color}" stroke-width="2.3" fill="none"/>`;
    const meanX = b.x(d.mean / d.timeMax);
    out += line(meanX, b.top, meanX, b.bottom, color, 'stroke-dasharray="3 3"') + text(meanX + 4, b.top + 11, `Mean ${fixed(d.mean)}`, "start", color);
    if (m.inputs.window <= d.timeMax) out += line(b.x(m.inputs.window / d.timeMax), b.top + 28, b.x(m.inputs.window / d.timeMax), b.bottom, "#7b8995", 'stroke-dasharray="2 4"');
    svg.innerHTML = out;
    $(type + "-summary").innerHTML = `<strong>${pct(d.within)}</strong> ${isGap ? "of gaps end" : "of services finish"}<br>within <span data-window>${fixed(m.inputs.window)}</span> min <span class="muted">(shaded area)</span>`;
    EquationLayout.render(type+"-worked",[`E[${isGap?"A":"S"}]`,"=","60","/",token(key,isGap?"λ":"μ")],[[token(key,min(d.mean),"eq-result"),"=","60","/",num(key,m.inputs[key])]]);
  }
  function drawDistributions(m) {
    document.querySelectorAll("[data-window]").forEach(el => el.textContent = fixed(m.inputs.window));
    drawCounts(m); drawExponential(m, "gap"); drawExponential(m, "service");
  }
  function stop() { if (timer) cancelAnimationFrame(timer); timer = null; $("play-sample").textContent = "Play sample"; }
  function render() {
    stop();
    const raw = read(), checked = M.validateInputs(raw), previous = current;
    $("input-error").hidden = checked.ok;
    $("input-error").textContent = Object.values(checked.errors).join(" ");
    for (const k of Object.keys(raw)) {
      $(k + "-number").setAttribute("aria-invalid", String(!!checked.errors[k]));
      if (checked.errors[k]) $(k + "-number").setAttribute("aria-describedby", "input-error"); else $(k + "-number").removeAttribute("aria-describedby");
      const r = $(k + "-range");
      if (r && !checked.errors[k]) { r.max = Math.max(Number(r.max), 20, Math.ceil(raw[k] / 10) * 10); r.value = raw[k]; }
    }
    document.querySelectorAll(".preset").forEach((b, i) => {
      const active = checked.ok && Object.keys(raw).every(k => raw[k] === M.PRESETS[i].inputs[k]);
      b.classList.toggle("active", active); b.setAttribute("aria-pressed", String(active));
    });
    $("run-sample").disabled = !checked.ok; $("download").disabled = !checked.ok;
    if (!checked.ok) {
      current = null; sampleDirty = true;
      for (const id of ["wait-result", "rho-result", "stability", "rho-description", "comparison", "queue-time", "service-time", "total-time"]) $(id).textContent = "—";
      for (const id of ["wait-chart", "count-chart", "gap-chart", "service-chart"]) { $(id).innerHTML = ""; $(id).setAttribute("aria-label", "Chart unavailable: enter valid inputs."); }
      for (let i = 0; i < equations.length; i++) $("eq-" + i).textContent = "—";
      for (const id of ["count", "gap", "service"]) { $(id + "-summary").textContent = "—"; $(id + "-worked").textContent = "—"; }
      $("util-fill").style.width = "0%"; $("time-breakdown").hidden = true; $("unstable-note").hidden = true;
      $("sample-results").hidden = true; return;
    }
    current = M.calculateModel(raw);
    const m = current;
    if (!previous || previous.inputs.lambda !== raw.lambda || previous.inputs.mu !== raw.mu) sampleDirty = true;
    const length = chartMode === "length", q = length ? m.Lq : m.Wq, service = length ? m.rho : m.service, total = length ? m.L : m.W;
    $("wait-title").innerHTML = length ? 'Line length <span class="symbol">L<sub>q</sub></span>' : 'Waiting in the queue <span class="symbol">W<sub>q</sub></span>';
    $("show-length").setAttribute("aria-pressed", String(length)); $("show-wait").setAttribute("aria-pressed", String(!length));
    $("wait-result").textContent = m.stable ? fixed(q) : "No finite mean";
    $("wait-unit").hidden = !m.stable; $("wait-unit").textContent = length ? "customers on average" : "minutes on average";
    $("stability").textContent = m.stable ? "Stable" : "Unstable"; $("stability").classList.toggle("unstable", !m.stable);
    $("rho-result").textContent = pct(m.rho); $("rho-description").textContent = m.stable ? "Long-run busy time" : "Load ratio · busy time cannot exceed 100%";
    $("util-fill").style.width = Math.min(100, m.rho * 100) + "%"; $("util-fill").style.background = m.stable ? "var(--blue)" : "var(--orange)";
    $("time-breakdown").hidden = !m.stable; $("unstable-note").hidden = m.stable;
    $("queue-symbol").innerHTML = length ? "L<sub>q</sub>" : "W<sub>q</sub>"; $("service-symbol").textContent = length ? "ρ" : "1/μ"; $("total-symbol").textContent = length ? "L" : "W";
    $("queue-time").textContent = length ? fixed(q) : min(q); $("service-time").textContent = length ? fixed(service) : min(service); $("total-time").textContent = length ? fixed(total) : min(total);
    $("queue-bar").style.width = m.stable && total ? (q / total * 100) + "%" : "0%";
    $("service-bar").style.width = m.stable && total ? (service / total * 100) + "%" : "0%";

    const l=token('lambda','λ'),u=token('mu','μ'),v=(key,value)=>num(key,value),out=(text)=>token('lambda mu',text,'eq-result');
    const aligned=[
      [['ρ','=',l,'/',u],[out(pct(m.rho)),'=',v('lambda',m.inputs.lambda),'/',v('mu',m.inputs.mu)],true],
      [['E[S]','=','60','/',u],[out(min(m.service)),'=','60','/',v('mu',m.inputs.mu)],true],
      [['W<sub>q</sub>','=','60','×',l,'/','[',u,'×','(',u,'−',l,')',']'],[out(min(m.Wq)),'=','60','×',v('lambda',m.inputs.lambda),'/','[',v('mu',m.inputs.mu),'×','(',v('mu',m.inputs.mu),'−',v('lambda',m.inputs.lambda),')',']'],m.stable],
      [['W','=','W<sub>q</sub>','+','60','/',u],[out(min(m.W)),'=',v('lambda mu',m.Wq),'+','60','/',v('mu',m.inputs.mu)],m.stable],
      [['L<sub>q</sub>','=',l,'×','W<sub>q</sub>','/','60'],[out(fixed(m.Lq)),'=',v('lambda',m.inputs.lambda),'×',v('lambda mu',m.Wq),'/','60'],m.stable],
      [['L','=',l,'×','W','/','60'],[out(fixed(m.L)),'=',v('lambda',m.inputs.lambda),'×',v('lambda mu',m.W),'/','60'],m.stable]
    ];
    aligned.forEach(([symbols,values,ok],idx)=>{EquationLayout.render('eq-'+idx,symbols,ok?[values]:[]);if(!ok)$('eq-'+idx).innerHTML='<span style="grid-column:1/-1;grid-row:2">No finite steady-state mean</span>';});

    drawWait(m); drawDistributions(m);
    const base = M.calculateModel(M.DEFAULTS);
    $("comparison").hidden = raw.lambda === M.DEFAULTS.lambda && raw.mu === M.DEFAULTS.mu;
    if (!m.stable) $("comparison").textContent = "Arrivals meet or exceed service capacity. The sample can still run; long-run queue averages do not exist.";
    else if (raw.lambda === M.DEFAULTS.lambda && raw.mu === M.DEFAULTS.mu) $("comparison").textContent = "Starting example: 3.20 customers waiting on average; 24.00 minutes before service.";
    else {
      const delta = (length ? m.Lq - base.Lq : m.Wq - base.Wq);
      $("comparison").textContent = length ? `Average line length is ${fixed(Math.abs(delta))} customers ${delta >= 0 ? "longer" : "shorter"} than the starting example (3.20).` : `Queue wait is ${fixed(Math.abs(delta))} min ${delta >= 0 ? "longer" : "shorter"} than the starting example (${min(base.Wq)}).`;
    }
    if ($("sample-details").open) { if (sampleDirty) generateSample(); else renderSample(); }
  }
  M.PRESETS.forEach((p, i) => {
    const b = document.createElement("button"); b.className = "preset"; b.type = "button"; b.textContent = p.name;
    b.addEventListener("click", () => { resetSampleSettings(); setInputs(p.inputs); release(); }); $("presets").append(b);
  });
  function resetSampleSettings() { stop(); $("seed").value = "42"; $("horizon").value = "48"; $("warmup").value = "4.00"; $("speed").value = "1"; sampleT = 0; sampleDirty = true; }
  $("reset").addEventListener("click", () => { chartMode = "length"; resetSampleSettings(); setInputs(M.DEFAULTS); release(); });
  $("show-length").addEventListener("click", () => { chartMode = "length"; render(); });
  $("show-wait").addEventListener("click", () => { chartMode = "wait"; render(); });
  for (const key of Object.keys(M.DEFAULTS)) {
    const n = $(key + "-number"), r = $(key + "-range");
    n.addEventListener("input", () => { render(); pulse(key); });
    n.addEventListener("blur", () => {
      if (n.value.trim() !== "" && Number.isFinite(Number(n.value))) { n.value = fixed(Number(n.value)); render(); }
      release();
    });
    if (r) {
      r.addEventListener("pointerdown", () => { heldKey = key; highlight(key); });
      r.addEventListener("keydown", e => { if (e.key.startsWith("Arrow") || ["Home", "End", "PageUp", "PageDown"].includes(e.key)) { heldKey = key; highlight(key); } });
      r.addEventListener("keyup", release); r.addEventListener("blur", release);
      r.addEventListener("input", () => { n.value = fixed(Number(r.value)); render(); pulse(key); });
    }
  }
  document.addEventListener("pointerup", release); document.addEventListener("pointercancel", release);
  document.querySelectorAll("[data-help]").forEach(button => button.addEventListener("click", () => {
    const [title, body] = HELP[button.dataset.help]; lastHelpButton = button;
    $("help-title").textContent = title; $("help-body").replaceChildren();
    const p = document.createElement("p"); p.textContent = body; $("help-body").append(p);
    if (button.dataset.help === "sources") {
      for (const [label, url] of [
        ["MIT OpenCourseWare · M/M/1 queue", "https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/resources/mit2_854f16_mm1queue/"],
        ["NIST · Poisson process and exponential intervals", "https://itl.nist.gov/div898/handbook/apr/section1/apr171.htm"],
        ["Queue simulation and warm-up · Victoria University of Wellington", "https://homepages.ecs.vuw.ac.nz/~schukova/SCIE201/Lectures/Lecture9_final2018.html"]
      ]) { const p = document.createElement("p"), a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = label; p.append(a); $("help-body").append(p); }
    }
    $("help-dialog").showModal();
  }));
  $("close-help").addEventListener("click", () => $("help-dialog").close());
  $("help-dialog").addEventListener("close", () => lastHelpButton?.focus());
  $("help-dialog").addEventListener("click", e => { if (e.target === $("help-dialog")) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
  function generateSample() {
    stop(); if (!current) return;
    try {
      sample = M.simulate(current.inputs, { seed: $("seed").value.trim() === "" ? NaN : Number($("seed").value), horizon: Number($("horizon").value), warmup: $("warmup").value.trim() === "" ? NaN : Number($("warmup").value) });
      sampleT = 0; sampleDirty = false; $("sample-error").hidden = true; $("sample-results").hidden = false;
      $("sample-time").max = sample.horizon; $("sample-time").value = "0"; renderSample();
    } catch (e) { sample = null; sampleDirty = true; $("sample-error").hidden = false; $("sample-error").textContent = e.message; $("sample-results").hidden = true; }
  }
  function renderSample() {
    if (!sample || !current) return;
    $("sample-results").hidden = false;
    $("measurement-window").textContent = `${fixed(sample.warmup)}–${fixed(sample.horizon)} h`;
    const rows = [["Waiting in queue <span class='symbol'>W<sub>q</sub></span>", sample.Wq, current.Wq, min], ["Time in system <span class='symbol'>W</span>", sample.W, current.W, min], ["Customers waiting <span class='symbol'>L<sub>q</sub></span>", sample.Lq, current.Lq, fixed], ["Customers in system <span class='symbol'>L</span>", sample.L, current.L, fixed], ["Busy time", sample.rho, current.stable ? current.rho : null, pct], ["Departures/hour", sample.throughput, current.stable ? current.inputs.lambda : null, fixed]];
    $("sample-stats").innerHTML = rows.map(([label, actual, expected, format]) => `<tr><th scope="row">${label}</th><td>${actual === null ? "—" : format(actual)}</td><td>${expected === null ? "No steady state" : format(expected)}</td></tr>`).join("");
    $("sample-note").textContent = `${sample.completed} completed post-warm-up customers included in wait averages; ${sample.excluded} unfinished post-warm-up customers excluded. ${sample.remaining} total still in the system at the horizon. Full-run sample statistics; playback only changes the snapshot.`;
    drawSampleChart(); renderSnapshot();
  }
  function drawSampleChart() {
    const svg = $("sample-chart"), b = box(svg, 220), maxQ = Math.max(4, Math.ceil(Math.max(current.Lq || 0, ...sample.timeline.map(p => p.q)) / 4) * 4);
    let out = axes(b, sample.horizon, maxQ, "Elapsed time (hours)", "Customers waiting Q(t)", x => x.toFixed(0), x => x.toFixed(0));
    out += `<rect x="${b.left}" y="${b.top}" width="${b.x(sample.warmup / sample.horizon) - b.left}" height="${b.bottom - b.top}" fill="#eceff3"/>`;
    let d = `M${b.left},${b.bottom}`;
    for (const p of sample.timeline) d += ` H${b.x(p.t / sample.horizon)} V${b.y(p.q / maxQ)}`;
    out += `<path d="${d}" fill="none" stroke="#2458a8" stroke-width="1.4"/>`;
    out += text(b.left + 4, b.top + 12, "Warm-up", "start", "#667786");
    if (current.Lq !== null && current.Lq <= maxQ) out += line(b.left, b.y(current.Lq / maxQ), b.right, b.y(current.Lq / maxQ), "#14786d", 'stroke-dasharray="5 4"') + text(b.right, b.y(current.Lq / maxQ) - 5, `Theory Lq ${fixed(current.Lq)}`, "end", "#14786d");
    out += `<line id="sample-cursor" x1="${b.x(sampleT / sample.horizon)}" x2="${b.x(sampleT / sample.horizon)}" y1="${b.top}" y2="${b.bottom}" stroke="#a85a12" stroke-width="2"/>`;
    svg.innerHTML = out;
  }
  function renderSnapshot() {
    const snap = M.snapshot(sample, sampleT);
    $("sample-clock").textContent = fixed(sampleT) + " h"; $("sample-time").value = sampleT;
    $("queue-now").textContent = snap.q;
    $("customers").innerHTML = (snap.q > 12 ? `<span class="more-customers">+${snap.q - 12} more</span>` : "") + snap.waiting.slice(0, 12).reverse().map(c => `<span class="customer" aria-label="Customer ${c.id}"><span>#${c.id}</span></span>`).join("") + (snap.q ? "" : '<span class="empty-queue">Nobody waiting</span>');
    $("server").classList.toggle("busy", !!snap.serving); $("server-state").textContent = snap.serving ? "Serving" : "Idle";
    $("server-customer").textContent = snap.serving ? "Customer #" + snap.serving.id : "No customer";
    const cursor = $("sample-cursor"), b = box($("sample-chart"), 220);
    if (cursor) { cursor.setAttribute("x1", b.x(sampleT / sample.horizon)); cursor.setAttribute("x2", b.x(sampleT / sample.horizon)); }
  }
  $("run-sample").addEventListener("click", generateSample);
  for (const id of ["seed", "horizon", "warmup"]) $(id).addEventListener("change", generateSample);
  $("sample-details").addEventListener("toggle", () => { if ($("sample-details").open && current) { if (sampleDirty) generateSample(); else renderSample(); } else stop(); });
  $("sample-time").addEventListener("input", () => { stop(); if (sample) { sampleT = Number($("sample-time").value); renderSnapshot(); } });
  $("play-sample").addEventListener("click", () => {
    if (timer) { stop(); return; } if (!sample) return;
    if (sampleT >= sample.horizon) sampleT = 0;
    $("play-sample").textContent = "Pause sample"; lastFrame = performance.now(); let lastPaint = 0;
    function frame(now) {
      sampleT = Math.min(sample.horizon, sampleT + (now - lastFrame) / 1000 * .25 * Number($("speed").value)); lastFrame = now;
      if (now - lastPaint > 100 || sampleT === sample.horizon) { renderSnapshot(); lastPaint = now; }
      if (sampleT >= sample.horizon) stop(); else timer = requestAnimationFrame(frame);
    }
    timer = requestAnimationFrame(frame);
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  $("download").addEventListener("click", () => {
    stop(); release();
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll(".is-editing").forEach(el => el.classList.remove("is-editing"));
    clone.querySelectorAll("dialog").forEach(el => el.removeAttribute("open"));
    const url = URL.createObjectURL(new Blob(["<!doctype html>\n" + clone.outerHTML], { type: "text/html" }));
    const a = document.createElement("a"); a.href = url; a.download = "mm1.html"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("download-status").textContent = "Save mm1.html · opens at the starting example.";
  });
  let resizeFrame = null;
  new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => { if (current) { drawWait(current); drawDistributions(current); if ($("sample-details").open && sample && !sampleDirty) renderSample(); } }); }).observe($("wait-chart"));
  setInputs(M.DEFAULTS);
})();

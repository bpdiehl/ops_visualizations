/* Pure M/M/1 theory, distributions and seeded FIFO sample. Rates: customers/hour. */
(() => {
  "use strict";
  const DEFAULTS = Object.freeze({ lambda: 8, mu: 10, window: 10 });
  const PRESETS = Object.freeze([
    Object.freeze({ name: "Moderate · 50%", inputs: Object.freeze({ lambda: 4, mu: 8, window: 10 }) }),
    Object.freeze({ name: "Busy · 80%", inputs: DEFAULTS }),
    Object.freeze({ name: "Near capacity · 95%", inputs: Object.freeze({ lambda: 9.5, mu: 10, window: 10 }) }),
    Object.freeze({ name: "Overloaded · 110%", inputs: Object.freeze({ lambda: 11, mu: 10, window: 10 }) })
  ]);
  function validateInputs(raw) {
    const errors = {}, inputs = {};
    for (const [key, min, max, name, units] of [
      ["lambda", 0, 120, "Arrival rate λ", "customers/hour"],
      ["mu", 0.01, 120, "Service rate μ", "customers/hour"],
      ["window", 1, 60, "Observation window t", "minutes"]
    ]) {
      const v = raw && raw[key];
      if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max)
        errors[key] = `${name} must be ${min.toFixed(2)}–${max.toFixed(2)} ${units}.`;
      else inputs[key] = v;
    }
    return { ok: !Object.keys(errors).length, inputs, errors };
  }
  function theory(lambda, mu) {
    const rho = lambda / mu, service = 60 / mu;
    if (lambda >= mu) return { stable: false, rho, service, Wq: null, W: null, Lq: null, L: null };
    const W = 60 / (mu - lambda), Wq = rho * W;
    return { stable: true, rho, service, Wq, W, Lq: lambda * Wq / 60, L: lambda * W / 60 };
  }
  function niceCeiling(v) {
    const magnitude = 10 ** Math.floor(Math.log10(v));
    return [1, 2, 5, 10].find(n => n * magnitude >= v) * magnitude;
  }
  function poisson(mean) {
    const last = Math.ceil(mean + 5 * Math.sqrt(mean) + 5);
    const points = [{ k: 0, p: Math.exp(-mean) }];
    for (let k = 1; k <= last; k++) points.push({ k, p: points[k - 1].p * mean / k });
    return points;
  }
  function distributions({ lambda, mu, window }) {
    const arrivalRate = lambda / 60, serviceRate = mu / 60;
    const countMean = arrivalRate * window, counts = poisson(countMean);
    const gapMean = lambda ? 60 / lambda : null, serviceMean = 60 / mu;
    function exponential(rate) {
      if (!rate) return null;
      const mean = 1 / rate, timeMax = niceCeiling(4 * mean);
      const points = Array.from({ length: 481 }, (_, i) => {
        const t = timeMax * i / 480;
        return { t, density: rate * Math.exp(-rate * t) };
      });
      return { mean, timeMax, points, densityMax: niceCeiling(rate), within: -Math.expm1(-rate * window),
        windowPoint: { t: window, density: rate * Math.exp(-rate * window) } };
    }
    return {
      countMean, counts, gapMean, serviceMean,
      arrivalTime: exponential(arrivalRate), serviceTime: exponential(serviceRate),
      countMax: Math.min(1, niceCeiling(Math.max(...counts.map(p => p.p)))),
      pZero: counts[0].p, pOne: counts[1].p,
      pMany: Math.max(0, 1 - counts[0].p - counts[1].p),
      pArrivalWithin: -Math.expm1(-arrivalRate * window),
      pServiceWithin: -Math.expm1(-serviceRate * window)
    };
  }
  function calculateModel(raw) {
    const c = validateInputs(raw);
    if (!c.ok) throw new RangeError(Object.values(c.errors).join(" "));
    const { lambda, mu } = c.inputs, result = theory(lambda, mu);
    const waitMax = niceCeiling(Math.max(60, (result.Wq || 0) * 1.25));
    const endRho = waitMax / (waitMax + result.service);
    const curve = Array.from({ length: 201 }, (_, i) => {
      const rho = endRho * i / 200;
      return { rho, Wq: theory(rho * mu, mu).Wq };
    });
    const lengthMax = niceCeiling(Math.max(10, (result.Lq || 0) * 1.25));
    const lengthEnd = 2 * lengthMax / (lengthMax + Math.sqrt(lengthMax * lengthMax + 4 * lengthMax));
    const lengthCurve = Array.from({ length: 201 }, (_, i) => {
      const rho = lengthEnd * i / 200;
      return { rho, Lq: theory(rho * mu, mu).Lq };
    });
    return { inputs: c.inputs, ...result, waitMax, curve, lengthMax, lengthCurve, distributions: distributions(c.inputs) };
  }
  // Mulberry32 with open-interval uniforms. Independent streams keep arrival
  // times unchanged when only service capacity changes (common random numbers).
  function randomStream(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
      return (((t ^ t >>> 14) >>> 0) + 0.5) / 4294967296;
    };
  }
  function sampleFromUniform(u, rate) {
    if (!(u > 0 && u < 1) || !(rate > 0)) throw new RangeError("Use 0 < U < 1 and rate > 0.");
    return -Math.log(u) / rate;
  }
  function summarize(customers, horizon, warmup) {
    if (!(horizon > 0) || !(warmup >= 0 && warmup < horizon)) throw new RangeError("Warm-up must be below duration.");
    const events = customers.flatMap(c => [
      { t: c.arrival, delta: 1 }, ...(c.end <= horizon ? [{ t: c.end, delta: -1 }] : [])
    ]).sort((a, b) => a.t - b.t || a.delta - b.delta);
    let n = 0, last = 0, areaN = 0, areaQ = 0, areaBusy = 0, departed = 0;
    const timeline = [{ t: 0, n: 0, q: 0 }];
    for (const e of [...events, { t: horizon, delta: 0 }]) {
      const dt = Math.max(0, e.t - Math.max(last, warmup));
      areaN += n * dt; areaQ += Math.max(0, n - 1) * dt; areaBusy += (n > 0 ? dt : 0);
      n += e.delta;
      if (e.delta === -1 && e.t >= warmup) departed++;
      timeline.push({ t: e.t, n, q: Math.max(0, n - 1) });
      last = e.t;
    }
    const cohort = customers.filter(c => c.arrival >= warmup);
    const completed = cohort.filter(c => c.end <= horizon);
    const duration = horizon - warmup;
    return {
      timeline, arrivals: customers.length, departures: customers.filter(c => c.end <= horizon).length,
      remaining: n, measuredHours: duration, completed: completed.length,
      excluded: cohort.length - completed.length, measuredDepartures: departed,
      L: areaN / duration, Lq: areaQ / duration, rho: areaBusy / duration,
      throughput: departed / duration,
      Wq: completed.length ? completed.reduce((a, c) => a + (c.start - c.arrival) * 60, 0) / completed.length : null,
      W: completed.length ? completed.reduce((a, c) => a + (c.end - c.arrival) * 60, 0) / completed.length : null
    };
  }
  function simulate(raw, settings = {}) {
    const inputs = calculateModel(raw).inputs;
    const { seed = 42, horizon = 48, warmup = 4 } = settings;
    if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new RangeError("Seed must be a whole number from 0 to 4294967295.");
    if (!Number.isFinite(horizon) || horizon <= 0 || horizon > 25000 || inputs.lambda * horizon > 250000)
      throw new RangeError("Choose a positive duration with at most 250000 expected arrivals.");
    if (!Number.isFinite(warmup) || warmup < 0 || warmup >= horizon) throw new RangeError("Warm-up must be at least 0 and below duration.");
    const arrivalU = randomStream(seed), serviceU = randomStream(seed ^ 0x9E3779B9);
    const customers = [];
    let arrival = 0, end = 0;
    if (inputs.lambda > 0) {
      while (true) {
        arrival += sampleFromUniform(arrivalU(), inputs.lambda);
        if (arrival > horizon) break;
        const start = Math.max(arrival, end), service = sampleFromUniform(serviceU(), inputs.mu);
        end = start + service;
        customers.push({ id: customers.length + 1, arrival, start, end });
        if (customers.length > 300000) throw new RangeError("Sample is too large.");
      }
    }
    return { inputs, seed, horizon, warmup, customers, ...summarize(customers, horizon, warmup) };
  }
  function snapshot(sample, t) {
    if (!Number.isFinite(t) || t < 0 || t > sample.horizon) throw new RangeError("Time is outside this sample.");
    let lo = 0, hi = sample.timeline.length;
    while (lo < hi) { const m = (lo + hi) >>> 1; if (sample.timeline[m].t <= t) lo = m + 1; else hi = m; }
    const point = sample.timeline[Math.max(0, lo - 1)];
    const active = sample.customers.filter(c => c.arrival <= t && c.end > t);
    return { t, n: point.n, q: point.q, serving: active.find(c => c.start <= t) || null, waiting: active.filter(c => c.start > t) };
  }
  globalThis.DemoModel = Object.freeze({ DEFAULTS, PRESETS, validateInputs, calculateModel, simulate, snapshot, summarize, sampleFromUniform });
})();

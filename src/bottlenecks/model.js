(function () {
  "use strict";
  const DEFAULTS = Object.freeze({ rates: Object.freeze([12, 8, 10]), resources: Object.freeze([1, 1, 1]), demand: 14 });
  const PRESETS = Object.freeze([
    Object.freeze({ id: 'middle', label: 'Middle constraint', rates: Object.freeze([12, 8, 10]), resources: DEFAULTS.resources, demand: 14 }),
    Object.freeze({ id: 'improved', label: 'Improve B', rates: Object.freeze([12, 11, 10]), resources: DEFAULTS.resources, demand: 14 }),
    Object.freeze({ id: 'tied', label: 'Tied stations', rates: Object.freeze([8, 8, 12]), resources: DEFAULTS.resources, demand: 14 }),
    Object.freeze({ id: 'demand', label: 'Low demand', rates: DEFAULTS.rates, resources: DEFAULTS.resources, demand: 6 })
  ]);
  const near = (a, b) => Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(a), Math.abs(b));
  function rateToTime(rate) {
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 30) throw new RangeError('Machine rate must be from 0 to 30 units/hour.');
    return rate === 0 ? Infinity : 60 / rate;
  }
  function timeToRate(minutes) {
    if (minutes === Infinity) return 0;
    if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes < 2) throw new RangeError('Cycle Time must be at least 2 minutes, or ∞ for a stopped machine.');
    return 60 / minutes;
  }
  function validate(input) {
    const errors = [];
    if (!input || typeof input !== 'object') return { ok: false, errors: [{ field: 'inputs', message: 'Enter station rates, resources and demand.' }] };
    for (const [key, max, integer] of [['rates', 30, false], ['resources', 6, true]]) {
      if (!Array.isArray(input[key]) || input[key].length !== 3) {
        errors.push({ field: key, message: `${key} must contain exactly three values.` }); continue;
      }
      for (let i = 0; i < 3; i++) {
        const v = input[key][i], min = integer ? 1 : 0;
        if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max || (integer && !Number.isInteger(v)))
          errors.push({ field: `${key}-${i}`, message: `Station ${'ABC'[i]} ${integer ? 'parallel machines must be a whole number from 1 to 6' : 'machine rate must be from 0 to 30 units/hour'}.` });
      }
    }
    if (typeof input.demand !== 'number' || !Number.isFinite(input.demand) || input.demand < 0 || input.demand > 60)
      errors.push({ field: 'demand', message: 'Demand must be from 0 to 60 units/hour.' });
    return { ok: errors.length === 0, errors };
  }
  function calculate(input) {
    const checked = validate(input);
    if (!checked.ok) throw new RangeError(checked.errors.map(x => x.message).join(' '));
    const inputs = { rates: [...input.rates], resources: [...input.resources], demand: input.demand };
    const capacities = inputs.rates.map((r, i) => r * inputs.resources[i]);
    const capacity = Math.min(...capacities), throughput = Math.min(capacity, inputs.demand);
    const bottlenecks = capacities.flatMap((c, i) => near(c, capacity) ? [i] : []);
    const binding = near(inputs.demand, capacity) ? 'both' : inputs.demand < capacity ? 'demand' : 'capacity';
    const stations = capacities.map((c, i) => ({ id: 'ABC'[i], rate: inputs.rates[i], time: rateToTime(inputs.rates[i]), resources: inputs.resources[i], capacity: c,
      utilization: c === 0 ? null : throughput / c, unused: c - throughput, bottleneck: bottlenecks.includes(i) }));
    return { inputs, stations, capacity, throughput, bottlenecks, binding, unmet: inputs.demand - throughput };
  }
  function compare(current, baseline) {
    return { capacity: current.capacity - baseline.capacity, throughput: current.throughput - baseline.throughput,
      unmet: current.unmet - baseline.unmet, stations: current.stations.map((s, i) => s.capacity - baseline.stations[i].capacity) };
  }
  globalThis.DemoModel = Object.freeze({ DEFAULTS, PRESETS, validate, calculate, compare, rateToTime, timeToRate });
})();

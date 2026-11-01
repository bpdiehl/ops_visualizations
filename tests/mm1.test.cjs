const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/mm1/model.js'), 'utf8'), ctx);
const M = ctx.DemoModel;
const calc = (lambda = 8, mu = 10, window = 10) => M.calculateModel({ lambda, mu, window });
const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} vs ${expected}, tolerance ${tolerance}`);
const plain = x => JSON.parse(JSON.stringify(x));

test('80% reference: 4 in system, 3.2 waiting, 30 min total, 24 min queue', () => {
  const m = calc(); close(m.rho, .8); close(m.L, 4); close(m.Lq, 3.2);
  close(m.W, 30); close(m.Wq, 24); close(m.service, 6);
});
test('moderate and near-capacity examples independently computed', () => {
  const a = calc(4, 8), b = calc(9.5, 10);
  close(a.Wq, 7.5); close(a.W, 15); close(a.Lq, .5); close(a.L, 1);
  close(b.Wq, 114); close(b.W, 120); close(b.Lq, 18.05); close(b.L, 19);
});
test('equal or overloaded rates suppress every finite queue mean', () => {
  for (const l of [10, 11, 120]) {
    const m = calc(l, 10); assert.equal(m.stable, false);
    for (const k of ['Wq', 'W', 'Lq', 'L']) assert.equal(m[k], null);
    close(m.service, 6);
  }
});
test('zero arrivals: empty queue; hypothetical customer only needs service', () => {
  const m = calc(0, 10); close(m.Wq, 0); close(m.W, 6); close(m.L, 0);
  assert.equal(m.distributions.arrivalTime, null);
  close(m.distributions.pZero, 1); close(m.distributions.pMany, 0);
  const s = M.simulate(m.inputs); close(s.Lq, 0); close(s.rho, 0); assert.equal(s.Wq, null);
});
test('invalid rates and units are rejected rather than silently clamped', () => {
  for (const [k, v] of [['lambda', -1], ['mu', 0], ['mu', 121], ['lambda', NaN], ['window', 0], ['window', 61], ['lambda', '8']])
    assert.throws(() => M.calculateModel({ ...M.DEFAULTS, [k]: v }), /must be/);
});
test('Little law, server occupancy and time decomposition hold across a grid', () => {
  for (const mu of [.01, .3, 8, 25, 120]) for (const rho of [0, .2, .8, .99]) {
    const m = calc(mu * rho, mu);
    close(m.L - m.Lq, m.rho, 1e-9); close(m.W - m.Wq, m.service, 1e-8);
    close(m.L, m.inputs.lambda * m.W / 60); close(m.Lq, m.inputs.lambda * m.Wq / 60);
  }
});
test('doubling both rates halves times but leaves utilization and counts unchanged', () => {
  const a = calc(8, 10), b = calc(16, 20);
  close(a.rho, b.rho); close(a.L, b.L); close(a.Lq, b.Lq); close(a.Wq / 2, b.Wq); close(a.W / 2, b.W);
});
test('Poisson mean 1: known probabilities, sum, expected count and variance', () => {
  const d = calc(6, 10, 10).distributions;
  close(d.countMean, 1); close(d.pZero, 0.36787944117144233); close(d.pOne, d.pZero);
  close(d.pMany, 0.26424111765711533);
  close(d.counts.reduce((s, x) => s + x.p, 0), 1, 1e-7);
  close(d.counts.reduce((s, x) => s + x.k * x.p, 0), 1, 1e-6);
  close(d.counts.reduce((s, x) => s + (x.k - 1) ** 2 * x.p, 0), 1, 1e-5);
});
test('large arrival-count distribution retains essentially all mass', () => {
  const d = calc(120, 120, 60).distributions;
  close(d.countMean, 120); close(d.counts.reduce((s, x) => s + x.p, 0), 1, 1e-6);
});
test('changing mu preserves arrival distributions; changing lambda preserves service distribution', () => {
  const a = calc(8, 10), b = calc(8, 12), c = calc(9, 10);
  assert.deepEqual(plain(a.distributions.arrivalTime), plain(b.distributions.arrivalTime));
  assert.deepEqual(plain(a.distributions.counts), plain(b.distributions.counts));
  assert.deepEqual(plain(a.distributions.serviceTime), plain(c.distributions.serviceTime));
});
test('exponential mean, CDF at the mean and density integral', () => {
  const d = calc(6, 10, 6).distributions;
  close(d.gapMean, 10); close(d.serviceMean, 6);
  close(d.pServiceWithin, .6321205588285577); close(d.serviceTime.windowPoint.density, Math.exp(-1) / 6);
  for (const dist of [d.arrivalTime, d.serviceTime]) {
    const area = dist.points.slice(1).reduce((a, p, i) => a + (p.t - dist.points[i].t) * (p.density + dist.points[i].density) / 2, 0);
    close(area, 1 - Math.exp(-dist.timeMax / dist.mean), .0001);
  }
});
test('observation window affects probabilities but no queue result', () => {
  const a = calc(8, 10, 5), b = calc(8, 10, 20);
  for (const k of ['rho', 'Wq', 'W', 'L', 'Lq', 'service']) close(a[k], b[k]);
  assert.ok(a.distributions.pServiceWithin < b.distributions.pServiceWithin);
  close(b.distributions.countMean, a.distributions.countMean * 4);
});
test('inverse exponential transform has correct quantile and rejects endpoints', () => {
  close(M.sampleFromUniform(Math.exp(-2), 4), .5);
  for (const u of [0, 1, -1, NaN]) assert.throws(() => M.sampleFromUniform(u, 4));
});
test('seeded sample repeats exactly; service changes preserve arrival times', () => {
  const a = M.simulate(M.DEFAULTS), b = M.simulate(M.DEFAULTS), c = M.simulate({ ...M.DEFAULTS, mu: 12 });
  assert.deepEqual(plain(a), plain(b));
  assert.deepEqual(plain(a.customers.map(x => x.arrival)), plain(c.customers.map(x => x.arrival)));
  assert.notDeepEqual(plain(a.customers), plain(M.simulate(M.DEFAULTS, { seed: 43 }).customers));
});
test('hand-built FIFO sample: exact time integrals and unfinished cohort accounting', () => {
  // Customer 1: 0–2 h; customer 2 arrives 1, served 2–3; customer 3 arrives 3, finishes after horizon.
  const customers = [{ id: 1, arrival: 0, start: 0, end: 2 }, { id: 2, arrival: 1, start: 2, end: 3 }, { id: 3, arrival: 3, start: 3, end: 5 }];
  const s = M.summarize(customers, 4, 0);
  close(s.L, 1.25); close(s.Lq, .25); close(s.rho, 1); close(s.Wq, 30); close(s.W, 120);
  assert.equal(s.completed, 2); assert.equal(s.excluded, 1); assert.equal(s.remaining, 1);
  close(s.throughput, .5);
  const w = M.summarize(customers, 4, 1);
  close(w.Lq, 1 / 3); close(w.Wq, 60); close(w.W, 120); assert.equal(w.completed, 1);
});
test('FIFO, nonnegative queues, event conservation and snapshot boundaries', () => {
  const s = M.simulate({ ...M.DEFAULTS, lambda: 11 });
  assert.equal(s.arrivals - s.departures, s.remaining);
  for (let i = 0; i < s.customers.length; i++) {
    const c = s.customers[i]; assert.ok(c.start >= c.arrival); assert.ok(c.end > c.start);
    if (i) assert.ok(c.start >= s.customers[i - 1].end);
  }
  for (const t of [0, .1, 4, 17.5, 48]) {
    const snap = M.snapshot(s, t); assert.ok(snap.q >= 0);
    assert.equal(snap.n, snap.q + (snap.serving ? 1 : 0)); assert.equal(snap.q, snap.waiting.length);
    assert.equal(snap.n, s.customers.filter(c => c.arrival <= t).length - s.customers.filter(c => c.end <= t).length);
  }
  assert.throws(() => M.snapshot(s, 49));
});
test('seed and measurement settings validated', () => {
  for (const settings of [{ seed: 1.2 }, { seed: -1 }, { horizon: 0 }, { horizon: 1, warmup: 1 }, { warmup: -1 }, { horizon: NaN }])
    assert.throws(() => M.simulate(M.DEFAULTS, settings));
});
test('long fixed-seed run approaches independent 80% reference within 4%', () => {
  const s = M.simulate(M.DEFAULTS, { seed: 42, horizon: 20000, warmup: 1000 });
  for (const [key, expected] of [['rho', .8], ['Lq', 3.2], ['L', 4], ['Wq', 24], ['W', 30], ['throughput', 8]])
    close(s[key], expected, expected * .04);
});

test('line-length chart uses the same theory and approaches its displayed upper bound', () => {
  const m = calc();
  close(m.lengthCurve[0].Lq, 0); close(m.lengthCurve.at(-1).Lq, m.lengthMax, 1e-9);
  for (const p of m.lengthCurve) close(p.Lq, calc(p.rho * 10, 10).Lq);
  assert.ok(m.lengthCurve.every((p, i) => !i || p.Lq >= m.lengthCurve[i - 1].Lq));
});

test('time-weighted sample statistics agree with independent customer-interval accounting', () => {
  // Integrate each customer's queue/service/system interval directly, independent
  // of the event-count integration in summarize. Warm-up can cut any interval.
  for (const lambda of [0, 8, 9.5, 11]) for (const seed of [42, 43, 44]) {
    const s = M.simulate({ lambda, mu: 10, window: 10 }, { seed, horizon: 48, warmup: 4 });
    const overlap = (start, end) => Math.max(0, Math.min(end, 48) - Math.max(start, 4));
    const area = (start, end) => s.customers.reduce((sum, c) => sum + overlap(c[start], c[end]), 0) / 44;
    close(s.Lq, area('arrival', 'start'), 1e-9);
    close(s.rho, area('start', 'end'), 1e-9);
    close(s.L, area('arrival', 'end'), 1e-9);
    close(s.L - s.Lq, s.rho, 1e-9);
  }
});

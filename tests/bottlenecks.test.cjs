const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/bottlenecks/model.js'), 'utf8'), ctx);
const M = ctx.DemoModel;
const calc = (rates = [12, 8, 10], demand = 14, resources = [1, 1, 1]) => M.calculate({ rates, resources, demand });
const arr = x => Array.from(x);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} vs ${b}`);
test('12/8/10 line: capacity and throughput 8; B constrains; utilization 2/3, 1, .8', () => {
  const m = calc(); assert.equal(m.capacity, 8); assert.equal(m.throughput, 8);
  assert.deepEqual(arr(m.bottlenecks), [1]); assert.equal(m.unmet, 6);
  [2/3, 1, .8].forEach((v, i) => close(m.stations[i].utilization, v));
});
test('improving B from 8 to 11 moves constraint to C; gain only 2', () => {
  const m = calc([12, 11, 10]), d = M.compare(m, calc());
  assert.equal(m.capacity, 10); assert.equal(m.throughput, 10);
  assert.deepEqual(arr(m.bottlenecks), [2]); assert.equal(d.throughput, 2); assert.equal(d.stations[1], 3);
});
test('improving a nonconstraint has no output gain', () => {
  const d = M.compare(calc([24, 8, 10]), calc()); assert.equal(d.throughput, 0); assert.equal(d.capacity, 0);
});
test('tied constraints are all retained; improving only one leaves output unchanged', () => {
  const m = calc([8, 8, 12]); assert.deepEqual(arr(m.bottlenecks), [0, 1]);
  assert.equal(calc([12, 8, 12]).capacity, 8); assert.deepEqual(arr(calc([8, 8, 8]).bottlenecks), [0, 1, 2]);
});
test('demand6 binds throughput but not capacity; equality is both binding', () => {
  const m = calc(undefined, 6); assert.equal(m.capacity, 8); assert.equal(m.throughput, 6); assert.equal(m.binding, 'demand');
  close(m.stations[1].utilization, .75); assert.equal(m.unmet, 0); assert.equal(calc(undefined, 8).binding, 'both');
});
test('two B resources make B capacity16 and move bottleneck to C', () => {
  const m = calc(undefined, 14, [1, 2, 1]); assert.equal(m.stations[1].capacity, 16); assert.equal(m.throughput, 10);
  close(m.stations[1].utilization, .625); assert.deepEqual(arr(m.bottlenecks), [2]);
});
test('zero demand idles every positive-capacity station', () => {
  const m = calc(undefined, 0); assert.equal(m.throughput, 0); assert.equal(m.capacity, 8);
  m.stations.forEach(s => assert.equal(s.utilization, 0));
});
test('closed station stops flow and suppresses undefined 0/0 utilization', () => {
  const m = calc([12, 0, 10]); assert.equal(m.capacity, 0); assert.equal(m.throughput, 0);
  assert.equal(m.stations[1].utilization, null); assert.equal(m.stations[0].utilization, 0);
  assert.equal(M.compare(calc(), m).throughput, 8);
  const z = calc([0, 0, 0], 0); assert.equal(z.binding, 'both'); assert.deepEqual(arr(z.bottlenecks), [0, 1, 2]);
});
test('fractional input retains precision instead of rounding at calculation', () => {
  const m = calc([12.123, 8.123, 10.123], 14, [2, 1, 1]); assert.equal(m.capacity, 8.123);
  assert.equal(m.stations[0].capacity, 24.246);
});
test('invalid and missing inputs rejected; no coercion or silent clamping', () => {
  const bad = [null, {}, { ...M.DEFAULTS, rates: [8, 10] }, { ...M.DEFAULTS, demand: '14' }];
  for (const v of [-1, 31, NaN, Infinity, '8', null]) bad.push({ ...M.DEFAULTS, rates: [12, v, 10] });
  for (const v of [0, 1.5, 7, NaN, '2']) bad.push({ ...M.DEFAULTS, resources: [1, v, 1] });
  for (const v of [-1, 61, NaN, Infinity]) bad.push({ ...M.DEFAULTS, demand: v });
  for (const input of bad) { assert.equal(M.validate(input).ok, false); assert.throws(() => M.calculate(input)); }
});
test('grid: flow bounded at every station, utilization within [0,1], used+unused=capacity', () => {
  for (const a of [0, .01, 8, 30]) for (const b of [0, 8, 10]) for (const d of [0, 6, 14, 60]) {
    const m = calc([a, b, 10], d, [1, 2, 1]);
    assert.ok(m.throughput <= d); assert.ok(m.unmet >= 0);
    for (const s of m.stations) {
      assert.ok(m.throughput <= s.capacity); close(s.unused + m.throughput, s.capacity);
      if (s.utilization !== null) assert.ok(s.utilization >= 0 && s.utilization <= 1);
    }
  }
});
test('scaling all rates and demand preserves utilization and doubles output', () => {
  const a = calc([6, 4, 5], 7), b = calc(); close(b.throughput, 2 * a.throughput);
  a.stations.forEach((s, i) => close(s.utilization, b.stations[i].utilization));
});
test('reordering serial stations preserves capacity and moves the correct identifier', () => {
  const m = calc([8, 10, 12]); assert.equal(m.capacity, 8); assert.deepEqual(arr(m.bottlenecks), [0]);
});
test('model does not mutate caller inputs or expose mutable defaults', () => {
  const input = { rates: [12, 8, 10], resources: [1, 1, 1], demand: 14 };
  const m = M.calculate(input); m.inputs.rates[0] = 20; assert.equal(input.rates[0], 12);
  assert.equal(Object.isFrozen(M), true); assert.equal(Object.isFrozen(M.DEFAULTS.rates), true);
});
test('minute/hour reciprocals: 12 units/hour ↔ 5 minutes; 8 ↔ 7.5; 30 ↔ 2', () => {
  for (const [rate, minutes] of [[12, 5], [8, 7.5], [30, 2]]) {
    close(M.rateToTime(rate), minutes); close(M.timeToRate(minutes), rate);
  }
  close(M.rateToTime(11), 5.454545454545454); close(M.timeToRate(60), 1);
});
test('time presentation and parallel machines produce the same capacity model', () => {
  const m = calc([M.timeToRate(5), M.timeToRate(7.5), M.timeToRate(6)], 14, [1, 2, 1]);
  assert.equal(m.stations[1].capacity, 16); assert.equal(m.stations[1].time, 7.5); assert.equal(m.throughput, 10);
});
test('stopped machine has infinite time; zero-time and nonfinite/coerced inputs rejected', () => {
  assert.equal(M.rateToTime(0), Infinity); assert.equal(M.timeToRate(Infinity), 0);
  assert.equal(calc([12, 0, 10]).stations[1].time, Infinity);
  for (const v of [0, -1, 1.99, NaN, -Infinity, '5', null]) assert.throws(() => M.timeToRate(v));
  for (const v of [-1, 31, NaN, Infinity, '8', null]) assert.throws(() => M.rateToTime(v));
});
test('reciprocal conversion retains nonterminating and precise inputs', () => {
  for (const r of [.01, .1234567, 8.123, 11, 29.99]) close(M.timeToRate(M.rateToTime(r)), r);
});

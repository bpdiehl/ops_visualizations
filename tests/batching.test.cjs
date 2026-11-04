const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('src/batching/model.js','utf8'),ctx);const M=ctx.DemoModel;
const calc=(x={})=>M.calculate({...M.DEFAULTS,...x});const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('one 10-unit batch uses 5 + 10×2 = 25 minutes on station A',()=>{const m=calc({batch:10,quantity:10,setups:[5,0,0],times:[2,.1,.1]});assert.equal(m.jobs[0].finish,25);assert.equal(m.makespan,27);assert.equal(m.stations[0].capacity,24);});
test('base presets change only batch size and move bottleneck A to B to C',()=>{
  const expected=[['small',0,120/13],['middle',1,80/3],['large',2,30]];
  for(const [id,index,capacity] of expected){const p=M.PRESETS.find(p=>p.id===id),m=calc(p);assert.deepEqual(Array.from(p.setups),[30,15,0]);assert.deepEqual(Array.from(p.times),[.5,1.5,2]);assert.deepEqual(Array.from(m.bottlenecks),[index]);close(m.capacity,capacity);}
  assert.deepEqual(Array.from(calc({batch:15}).bottlenecks),[0,1]);
  assert.deepEqual(Array.from(calc({batch:30}).bottlenecks),[1,2]);
});
test('default order: A40/B45/C40 minute batches; first125, six batches finish350',()=>{const m=calc();assert.equal(m.firstBatch,125);assert.equal(m.makespan,350);close(m.capacity,80/3);assert.equal(m.batches,6);});
test('partial last batch preserves quantity and still incurs setup',()=>{const m=calc({quantity:23,batch:10});const last=m.jobs.filter(j=>j.batch===2);assert.equal(last.length,3);last.forEach(j=>assert.equal(j.units,3));close(last[0].finish-last[0].start,31.5);assert.equal(m.jobs.filter(j=>j.station===0).reduce((a,j)=>a+j.units,0),23);});
test('schedule enforces arrival, machine exclusivity and exact durations over a grid',()=>{for(const batch of [1,7,20,60])for(const quantity of [1,23,120]){const m=calc({batch,quantity});for(const j of m.jobs){assert.ok(j.start>=j.arrival);close(j.finish-j.start,m.inputs.setups[j.station]+j.units*m.inputs.times[j.station]);if(j.batch)assert.ok(j.start>=m.jobs.find(p=>p.station===j.station&&p.batch===j.batch-1).finish);if(j.station)close(j.arrival,m.jobs.find(p=>p.station===j.station-1&&p.batch===j.batch).finish);}assert.ok(m.orderRate<=m.capacity+1e-8);}});
test('zero setups make capacity independent of batch size, but batch handoff still changes completion',()=>{const a=calc({batch:1,setups:[0,0,0]}),b=calc({batch:60,setups:[0,0,0]});close(a.capacity,30);close(a.capacity,b.capacity);assert.ok(a.makespan<b.makespan);});
test('reject invalid inputs without coercion',()=>{for(const x of [{batch:0},{batch:1.5},{quantity:0},{times:[0,1,1]},{times:[NaN,1,1]},{setups:[-1,0,0]},{setups:[Infinity,0,0]},{batch:'20'},{times:[1,1]}]){assert.equal(M.validate({...M.DEFAULTS,...x}).ok,false);assert.throws(()=>calc(x));}});
test('calculation isolates inputs and capacity curves match selected model',()=>{const x={...M.DEFAULTS,setups:[24,4,0],times:[.5,1.2,.8]},m=M.calculate(x);m.inputs.setups[0]=0;assert.equal(x.setups[0],24);close(m.curves[19].capacity,m.capacity);assert.equal(Object.isFrozen(M),true);});

const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('src/spc/model.js','utf8'),c);const M=c.DemoModel,calc=(s={},ref)=>M.calculate({...M.defaults,...s},ref),near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test('published constants: NIST Xbar/R table and official Minitab d2',()=>{
 const expected=[[2,1.880,0,3.267,1.128],[3,1.023,0,2.575,1.693],[4,.729,0,2.282,2.059],[5,.577,0,2.115,2.326],[6,.483,0,2.004,2.534],[7,.419,.076,1.924,2.704],[8,.373,.136,1.864,2.847],[9,.337,.184,1.816,2.970],[10,.308,.223,1.777,3.078]];
 for(const [n,A2,D3,D4,d2] of expected){assert.equal(M.constants[n].A2,A2);assert.equal(M.constants[n].D3,D3);assert.equal(M.constants[n].D4,D4);assert.equal(M.constants[n].d2,d2);}
});
test('tiny independently worked subgroup/reference: center50.5 range4 limits48.192..52.808',()=>{
 const a=M.subgroup([48,49,50,51,52],1),b=M.subgroup([49,50,51,52,53],2);near(a.mean,50);near(a.range,4);const l=M.baseline([a,b]);near(l.center,50.5);near(l.rbar,4);near(l.xLow,48.192);near(l.xHigh,52.808);near(l.rLow,0);near(l.rHigh,8.46);near(l.sigmaHat,1.71969045571797);assert.equal(l.end,2);
});
test('normal model independent capability reference and normal tail checks',()=>{
 const cap=M.capability(16,2,8,20);near(cap.Cp,1);near(cap.Cpk,2/3);near(M.normalCDF(0),.5);near(M.normalCDF(1),.841344746,1e-7);near(M.normalCDF(3),.998650102,1e-7);near(M.capability(50,1,47,53).outside,.002699796,2e-7);
 near(M.capability(50,1,46,54).Cp,4/3);near(M.capability(52,1,46,54).Cp,4/3);near(M.capability(52,1,46,54).Cpk,2/3);assert.ok(M.capability(52,2,46,54).Cpk<M.capability(52,1,46,54).Cpk);assert.ok(M.capability(55,1,46,54).Cpk<0);
});
test('specifications/target/goal never change samples or control limits',()=>{
 const a=calc(),b=calc({LSL:42,USL:58,target:52,goal:1});assert.equal(JSON.stringify(a.groups),JSON.stringify(b.groups));assert.equal(JSON.stringify(a.limits),JSON.stringify(b.limits));assert.ok(b.capability.Cp>a.capability.Cp);near(a.bias,0);near(b.bias,-2);
 const targetOnly=calc({target:52});near(targetOnly.capability.Cp,a.capability.Cp);near(targetOnly.capability.Cpk,a.capability.Cpk);
});
test('historical limits remain fixed under mean/spread/outlier changes',()=>{
 const a=calc(),b=calc({mu:52},a.limits),wide=calc({sigma:3},a.limits),outlier=calc({outlier:12},a.limits);assert.equal(b.limits,a.limits);assert.equal(wide.limits,a.limits);assert.equal(outlier.limits,a.limits);
 const raw=g=>({i:g.i,values:g.values,mean:g.mean,range:g.range});assert.equal(JSON.stringify(a.groups.slice(0,25).map(raw)),JSON.stringify(b.groups.slice(0,25).map(raw)));for(let i=25;i<50;i++){near(b.groups[i].mean-a.groups[i].mean,2);near(b.groups[i].range,a.groups[i].range);near(wide.groups[i].range,a.groups[i].range*3);}
 assert.ok(b.xSignals>0);assert.ok(wide.rSignals>0);assert.ok(outlier.groups[37].xSignal);assert.ok(outlier.groups[37].rSignal);near(outlier.groups[37].mean-a.groups[37].mean,12/5);
});
test('six core examples communicate their intended cases with selected seeds',()=>{
 const [good,off,wide,shift,spread,outlier]=M.examples().map(e=>M.calculate(e));assert.ok(good.inControl&&good.meetsGoal);assert.ok(off.inControl&&!off.meetsGoal);assert.ok(wide.inControl&&!wide.meetsGoal);assert.ok(!shift.inControl&&shift.meetsGoal);near(shift.observedOutside,0);assert.ok(spread.rSignals>0);assert.equal(outlier.signals.length,1);assert.equal(outlier.xRules.events.length,1);assert.equal(outlier.rRules.events.length,1);assert.equal(outlier.xRules.events[0].rule,'limit');assert.equal(outlier.rRules.events[0].rule,'limit');assert.equal(outlier.groups.filter(g=>g.xMembership.length||g.rMembership.length).length,1);
});
test('baseline refitting is explicit and contamination is retained in snapshot',()=>{
 const m=calc({mu:52}),snapshot=M.baseline(m.groups);assert.ok(snapshot.contaminated);assert.equal(snapshot.count,50);assert.ok(snapshot.center>m.limits.center);const after=calc({mu:50},snapshot);assert.equal(after.limits,snapshot);assert.ok(after.limits.contaminated);assert.equal(m.limits.count,25);assert.equal(m.limits.contaminated,false);assert.throws(()=>calc({n:6},snapshot));
});
test('subgroup sizes/seeds and random-sample reproducibility',()=>{
 const a=calc(),b=calc(),other=calc({seed:43});assert.equal(JSON.stringify(a.groups),JSON.stringify(b.groups));assert.notEqual(JSON.stringify(a.groups),JSON.stringify(other.groups));
 for(let n=2;n<=10;n++){const m=calc({n});assert.equal(m.groups.length,50);assert.equal(m.values.length,25*n);for(const g of m.groups){assert.equal(g.values.length,n);assert.ok(g.range>=0);assert.ok(g.mean>=Math.min(...g.values)&&g.mean<=Math.max(...g.values));}assert.ok(m.limits.rLow>=0);}
});
test('boundaries/validation and immutable caller values',()=>{
 for(const invalid of [{n:1},{n:11},{n:2.5},{sigma:0},{LSL:55},{USL:45},{target:60},{seed:0},{seed:1.5},{mu:'50'},{mu:NaN},{sigma:Infinity},{outlier:-1}])assert.throws(()=>calc(invalid));assert.throws(()=>M.baseline([M.subgroup([1,1]),M.subgroup([1,1])]));assert.throws(()=>M.subgroup([1]));
 const s={...M.defaults},before=JSON.stringify(s);M.calculate(s);assert.equal(JSON.stringify(s),before);const p=M.examples();p[0].mu=999;assert.equal(M.examples()[0].mu,50);
});

// Independent rule fixtures have all points inside limits; no simulation fit involved.
test('eight-point same-side runs signal only at completing endpoint, both directions',()=>{
 for(const sign of [-1,1]){const v=Array.from({length:8},(_,i)=>sign*(1+(i%2)*.1));const d=M.detectSignals(v,-3,0,3);assert.equal(d.events.length,1);assert.equal(d.events[0].rule,'run');assert.equal(d.events[0].start,1);assert.equal(d.events[0].end,8);assert.equal(d.reasons.slice(0,7).flat().length,0);}
 assert.equal(M.detectSignals([1,1,1,1,0,1,1,1,1],-3,0,3).events.length,0);
 assert.equal(M.detectSignals([1,1,1,1,-1,1,1,1,1],-3,0,3).events.length,0);
});
test('six-point increasing/decreasing trends signal before any limit violation',()=>{
 for(const sign of [-1,1]){const v=[-1,-.6,-.2,.2,.6,1].map(x=>sign*x),d=M.detectSignals(v,-3,0,3);assert.equal(d.events.length,1);assert.equal(d.events[0].rule,'trend');assert.equal(d.events[0].start,1);assert.equal(d.events[0].end,6);}
 assert.equal(M.detectSignals([-1,-.5,0,0,.5,1],-3,0,3).events.length,0);
 assert.equal(M.detectSignals([-1,-.5,0,.5,1],-3,0,3).events.length,0);
 assert.equal(M.detectSignals([-1,-.5,0,-.1,.5,1],-3,0,3).events.length,0);
});
test('rule limits are strict; overlapping windows and combined rules retain reasons',()=>{
 assert.equal(M.detectSignals([-3,3],-3,0,3).events.length,0);assert.equal(M.detectSignals([-3.01,3.01],-3,0,3).events.length,2);
 const d=M.detectSignals([1,2,3,4,5,6,7,8,9],-10,0,7.5);assert.equal(d.reasons[7].length,3);assert.equal(d.events.filter(e=>e.rule==='run').length,2);assert.equal(d.events.filter(e=>e.rule==='trend').length,4);
 const prefix=M.detectSignals([1,2,3,4,5,6,7,8],-10,0,7.5);assert.equal(JSON.stringify(prefix.reasons),JSON.stringify(d.reasons.slice(0,8)));
});
test('run-within-limits example is out of control despite zero beyond-limit points',()=>{
 const e=M.examples().find(e=>e.name==='Run within limits'),m=M.calculate(e);assert.equal(m.inControl,false);assert.ok(m.xSignals>0);assert.ok(m.xRules.events.some(e=>e.rule==='run'));assert.ok(m.xRules.events.every(e=>e.rule!=='limit'));assert.equal(m.rSignals,0);near(m.observedOutside,0);
});

test('highlight every participant in a completed run/trend, not unrelated points',()=>{
 const run=M.detectSignals([0,1,1.1,1,1.1,1,1.1,1,1.1,0],-3,0,3);assert.equal(run.members[0].length,0);assert.equal(run.members[9].length,0);for(let i=1;i<=8;i++)assert.ok(run.members[i].includes('8 above centerline'));assert.equal(run.reasons[1].length,0);assert.equal(run.reasons[8].length,1);
 const trend=M.detectSignals([2,-1,-.6,-.2,.2,.6,1,-2],-3,0,3);assert.equal(trend.members[0].length,0);assert.equal(trend.members[7].length,0);for(let i=1;i<=6;i++)assert.ok(trend.members[i].includes('6 increasing'));
});
test('comparison examples share seed42 and clearly differ in location/spread/conformance',()=>{
 const [good,off,wide]=M.examples().slice(0,3);for(const e of [good,off,wide]){assert.equal(e.seed,42);assert.equal(M.calculate(e).inControl,true);}
 const a=M.calculate(good),b=M.calculate(off),c=M.calculate(wide);near(a.observedOutside,0);near(b.observedOutside,.168);near(c.observedOutside,.192);near(b.capability.Cpk,1/3);near(c.capability.Cpk,4/9);
 assert.ok(b.values.some(x=>x>off.USL));assert.ok(c.values.some(x=>x<wide.LSL));assert.ok(c.values.some(x=>x>wide.USL));
 for(let i=0;i<50;i++){near(c.groups[i].range,3*a.groups[i].range);near(b.groups[i].range,.5*a.groups[i].range);}
});
test('chosen trend seed gives one isolated six-point trend inside limits',()=>{
 const p=M.examples().find(e=>e.name==='Trend within limits'),m=M.calculate(p);assert.equal(p.seed,28);assert.equal(m.xSignals,1);assert.equal(m.rSignals,0);assert.equal(m.xRules.events.length,1);const e=m.xRules.events[0];assert.equal(e.rule,'trend');assert.equal(e.start,42);assert.equal(e.end,47);for(let i=41;i<47;i++)assert.equal(m.groups[i].xMembership.length,1);
});
test('screenshot reproduction: narrow current output meets goal while historical charts signal',()=>{
 const m=calc({seed:10,sigma:.25,LSL:39.8,USL:61.7});near(m.capability.Cp,14.6);near(m.capability.Cpk,13.6);assert.equal(m.meetsGoal,true);assert.equal(m.inControl,false);assert.ok(m.rRules.events.some(e=>e.label==='8 below centerline'));near(m.observedOutside,0);near(m.limits.n,5);
});

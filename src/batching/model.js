(function () {
  'use strict';
  const DEFAULTS = Object.freeze({ batch:20, quantity:120, setups:Object.freeze([30,15,0]), times:Object.freeze([.5,1.5,2]) });
  const PRESETS = Object.freeze([
    {id:'small',label:'Small batches',batch:5,setups:DEFAULTS.setups,times:DEFAULTS.times},
    {id:'middle',label:'Middle ground',batch:20,setups:DEFAULTS.setups,times:DEFAULTS.times},
    {id:'large',label:'Large batches',batch:60,setups:DEFAULTS.setups,times:DEFAULTS.times},
    {id:'setup',label:'Shorter setup',batch:5,setups:Object.freeze([4,15,0]),times:DEFAULTS.times}
  ].map(Object.freeze));
  function validate(x) {
    const errors=[];
    if(!x || !Number.isInteger(x.batch)||x.batch<1||x.batch>60) errors.push('Batch size must be a whole number from 1 to 60.');
    if(!x || !Number.isInteger(x.quantity)||x.quantity<1||x.quantity>600) errors.push('Order size must be a whole number from 1 to 600.');
    for(const [k,min,max,label] of [['setups',0,60,'Setup time'],['times',.1,5,'Processing time']]) {
      if(!x || !Array.isArray(x[k])||x[k].length!==3) {errors.push(label+' needs three station values.');continue;}
      x[k].forEach((v,i)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)errors.push(`Station ${'ABC'[i]} ${label.toLowerCase()} must be from ${min} to ${max}.`);});
    }
    return {ok:!errors.length,errors};
  }
  function capacity(batch,setups,times) {
    const stations=times.map((t,i)=>({id:'ABC'[i],setup:setups[i],time:t,cycle:t+setups[i]/batch,capacity:60/(t+setups[i]/batch)}));
    const value=Math.min(...stations.map(s=>s.capacity));
    return {stations,capacity:value,bottlenecks:stations.flatMap((s,i)=>Math.abs(s.capacity-value)<1e-9?[i]:[])};
  }
  function calculate(x) {
    const v=validate(x);if(!v.ok)throw new RangeError(v.errors.join(' '));
    const inputs={batch:x.batch,quantity:x.quantity,setups:[...x.setups],times:[...x.times]};
    const full=capacity(x.batch,x.setups,x.times), jobs=[],available=[0,0,0];
    const batches=Math.ceil(x.quantity/x.batch);
    for(let b=0;b<batches;b++) {
      const units=Math.min(x.batch,x.quantity-b*x.batch);let arrival=0;
      for(let i=0;i<3;i++) {
        const start=Math.max(arrival,available[i]),setupEnd=start+x.setups[i],finish=setupEnd+units*x.times[i];
        jobs.push({station:i,batch:b,units,arrival,start,setupEnd,finish});available[i]=finish;arrival=finish;
      }
    }
    return {...full,inputs,jobs,batches,firstBatch:jobs[2].finish,makespan:available[2],
      orderRate:60*x.quantity/available[2],totalSetup:batches*x.setups.reduce((a,b)=>a+b,0),
      curves:Array.from({length:60},(_,i)=>({batch:i+1,...capacity(i+1,x.setups,x.times)}))};
  }
  globalThis.DemoModel=Object.freeze({DEFAULTS,PRESETS,validate,calculate});
})();

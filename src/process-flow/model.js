(function () {
  'use strict';
  const DEFAULTS=Object.freeze([2,4,1]);
  const PRESETS=Object.freeze([
    {id:'bottleneck',label:'Bottleneck sets the pace',times:[2,4,1]},
    {id:'two-minute',label:'A 2-min process, 4-min line CT',times:[2,2,4]},
    {id:'balanced',label:'Balanced stations',times:[3,3,3]},
    {id:'fast-a',label:'Speed up a non-bottleneck',times:[1,2,4]},
    {id:'fast-c',label:'Speed up the bottleneck',times:[2,2,2.5]}
  ].map(p=>Object.freeze({...p,times:Object.freeze(p.times)})));
  function validate(times){const errors=[];if(!Array.isArray(times)||times.length<1||times.length>6)errors.push('Use between one and six processes.');else times.forEach((v,i)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<.5||v>10)errors.push(`Process ${'ABCDEF'[i]} processing time must be from 0.50 to 10.00 min/unit.`);});return{ok:errors.length===0,errors};}
  function calculate(times){const check=validate(times);if(!check.ok)throw new RangeError(check.errors.join(' '));const cycle=Math.max(...times),stations=times.map((time,i)=>({id:'ABCDEF'[i],time,capacity:60/time,utilization:time/cycle,offset:times.slice(0,i).reduce((a,b)=>a+b,0)})),bottleneck=times.indexOf(cycle),tpt=times.reduce((a,b)=>a+b,0),focusSlots=Math.max(1,Math.ceil(tpt/cycle-1e-10)),focusPeriod=focusSlots*cycle;return{stations,cycle,bottleneck,tpt,focusSlots,focusPeriod,outputRate:60/cycle,pointOffset(position){if(!Number.isFinite(position)||position<0||position>stations.length)throw new RangeError('Point must be inside the process.');const i=Math.min(stations.length-1,Math.floor(position)),f=position===stations.length?1:position-i;return stations[i].offset+f*stations[i].time;},locate(id,elapsed){if(!Number.isFinite(elapsed)||elapsed<0||elapsed>=tpt) return{id,phase:elapsed>=tpt?'exited':'not-entered',position:elapsed>=tpt?stations.length:0,station:null};for(let i=0;i<stations.length;i++){const s=stations[i],end=s.offset+s.time;if(elapsed<end)return{id,phase:'processing',position:i+(elapsed-s.offset)/s.time,station:i};}return{id,phase:'exited',position:stations.length,station:null};},isProcessing(station,time){const s=stations[station];if(!s||!Number.isFinite(time))return false;const phase=((time%cycle)+cycle)%cycle,start=s.offset%cycle,elapsed=(phase-start+cycle)%cycle;return elapsed<s.time-1e-10||Math.abs(s.time-cycle)<1e-10&&elapsed<cycle-1e-10;}};}
  globalThis.DemoModel=Object.freeze({DEFAULTS,PRESETS,validate,calculate});
})();

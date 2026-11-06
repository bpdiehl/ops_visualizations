(function(){
'use strict';
const M=globalThis.DemoModel,$=id=>document.getElementById(id),fixed=n=>n.toFixed(2),colors=['#33699b','#a65c1a','#168177'];
let state={...M.DEFAULTS,setups:[...M.DEFAULTS.setups],times:[...M.DEFAULTS.times]},current=null,activeSymbol=null,trigger=null,fade,held=null;
const help={
 utilization:['Utilization at line capacity','The fraction of a station’s available time required when the repeating line runs at capacity: uᵢ = C/Cᵢ. Setup and processing both count as occupied time. This assumes full batches in the long run; it is not the busy percentage measured over the finite order schedule.'],
 cycle:['Effective Cycle Time','CT is the average time per unit over repeated full batches: setup time divided by batch size, plus processing time per unit. It includes the setup burden. It is not the elapsed time an item spends across the whole line (Throughput Time, TPT). Units: minutes/unit.'],
 capacity:['Station capacity','One machine at each station repeats a setup followed by B units of processing. A full batch takes s + Bt minutes, giving capacity 60B/(s + Bt) units/hour. Increasing batch size spreads setup time across more units; it does not change the raw processing time.'],
 system:['System capacity','The lowest station capacity limits the repeating line. It assumes sufficient demand and material, independent machines, no restrictive buffers or other losses. This is a long-run rate for full batches; the order schedule includes startup, handoffs and a possible partial final batch.'],
 curve:['Capacity by batch size','Each curve uses the current station setup and processing times. The dashed line marks your chosen batch. A crossing can move the bottleneck: high-setup stations can limit small batches, while slower per-unit processing can limit larger batches. There is no universal best batch size in this simplified model.'],
 model:['Model assumptions','Three stations in series, one machine each, one product, 100% yield. Every batch needs the entered setup at every station. Setup occupies the machine and starts only when the entire batch arrives. Whole batches transfer instantly after processing. No failures, external setup, worker conflicts, transport times, costs or due dates are modeled. All examples are illustrative.'],
 batch:['Batch size B','Units processed together before the next setup. Here process batch and transfer batch are the same: all units wait until their batch finishes before moving to the next station. The final batch may be smaller for a fixed order. Larger batches dilute setup time but can delay handoffs.'],
 setup:['Setup time sᵢ','Minutes to prepare station i for each batch, before processing its units. The machine is occupied throughout setup, even for the first or a partial batch. A zero setup means this station has no batch-size benefit. Setup is repeated by assumption, rather than only after a product change.'],
 time:['Processing time tᵢ','Minutes of machine processing per unit after setup. The symbol t distinguishes raw processing time from effective Cycle Time CT, which also includes setup per unit. Each station has one machine. Batch processing time is the number of units multiplied by processing time per unit.'],
 schedule:['Order schedule','Each row is one machine. Gray is setup; station color is processing. Numbers identify batches. A batch can start only after it arrives from the preceding station and its machine finishes the previous batch. All units in the order are available at time zero. The last batch can be partial. First-batch completion is when that entire batch leaves C; whole-order completion is the makespan.']
};
const sy=(key,base,sub)=>`<span data-symbol="${key}">${base}${sub?`<sub data-symbol="i">${sub}</sub>`:''}</span>`;
const num=(n,key,index='')=>`<span class="num" ${key?`data-symbol="${key}" data-edit="${key==='s'?'setup'+index:key==='t'?'time'+index:''}"`:''}>${fixed(n)}</span>`;
const keys=[['B','B','Batch size','units/batch'],['s',sy('s','s','i'),'Setup time at station i','min/batch'],['t',sy('t','t','i'),'Processing time at station i','min/unit'],['CT',sy('CT','CT','i'),'Effective Cycle Time at station i','min/unit'],['Ci',sy('Ci','C','i'),'Station capacity','units/hour'],['C','C','System capacity','units/hour'],['i','i','Station index','A, B or C'],['u',sy('u','u','i'),'Utilization at line capacity','displayed as %']];
$('symbol-key').innerHTML=keys.map(([k,s,n,u])=>`<div class="key-row"><button data-key="${k}" aria-pressed="false" aria-label="Highlight ${n}">${s}</button><div>${n}<small>${u}</small></div></div>`).join('');
$('presets').innerHTML=M.PRESETS.map(p=>`<button class="preset" data-preset="${p.id}" aria-pressed="${p.id==='middle'}">${p.label}</button>`).join('');
$('station-controls').innerHTML='ABC'.split('').map((station,i)=>`<div class="station-input"><span class="${'abc'[i]}">${station}</span>${[['s','setup time',0,60,.5,state.setups[i],'minutes per batch'],['t','processing time',.1,5,.1,state.times[i],'minutes per unit']].map(([prefix,label,min,max,step,value,unit])=>`<div class="station-time-control"><input id="${prefix}${i}" aria-label="Station ${station} ${label} in ${unit}" type="number" min="${min}" max="${max}" step="${step}" value="${value}"><input id="${prefix}${i}-range" aria-label="Station ${station} ${label} slider in ${unit}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`).join('')}</div>`).join('');
const svg=(tag,attrs={},text)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
function chart(){
 const root=$('capacity-chart');root.replaceChildren();const width=Math.max(300,root.clientWidth);root.setAttribute('viewBox',`0 0 ${width} 320`);
 root.append(svg('title',{},`Capacity ${fixed(current.capacity)} units/hour; bottleneck ${current.bottlenecks.map(i=>'ABC'[i]).join(' and ')}.`));
 const x=b=>62+(b-1)/59*(width-90),ymax=Math.ceil(Math.max(...current.curves.flatMap(c=>c.stations.map(s=>s.capacity)))/20)*20,y=v=>270-v/ymax*235;
 for(let j=0;j<=4;j++){const v=ymax*j/4;root.append(svg('line',{x1:62,x2:width-28,y1:y(v),y2:y(v),stroke:'#e1e6ec'}),svg('text',{x:51,y:y(v)+4,'text-anchor':'end','font-size':11,fill:'#586c7e'},v.toFixed(0)));}
 for(const b of (width<450?[1,20,40,60]:[1,10,20,30,40,50,60]))root.append(svg('text',{x:x(b),y:288,'text-anchor':'middle','font-size':11},b));
 root.append(svg('text',{x:width/2+15,y:314,'text-anchor':'middle','font-size':12},'Batch size B · units/batch'),svg('text',{transform:'translate(16 155) rotate(-90)','text-anchor':'middle','font-size':12},'Capacity · units/hour'));
 current.stations.forEach((s,i)=>{root.append(svg('path',{d:current.curves.map((c,j)=>`${j?'L':'M'}${x(c.batch)},${y(c.stations[i].capacity)}`).join(' '),fill:'none',stroke:colors[i],'stroke-width':2.5}));});
 root.append(svg('line',{x1:x(state.batch),x2:x(state.batch),y1:27,y2:270,stroke:'#6a7885','stroke-dasharray':'4 4'}));
 current.stations.forEach((s,i)=>root.append(svg('circle',{cx:x(state.batch),cy:y(s.capacity),r:current.bottlenecks.includes(i)?6:4,fill:colors[i],stroke:'white','stroke-width':2})));
}
function gantt(){
 const root=$('gantt');root.replaceChildren();const width=Math.max(300,root.clientWidth);root.setAttribute('viewBox',`0 0 ${width} 218`);root.append(svg('title',{},`${current.batches} batches; first batch finished ${fixed(current.firstBatch)} minutes; whole order finished ${fixed(current.makespan)} minutes.`));
 const x=t=>65+t/current.makespan*(width-95);
 const ticks=width<500?3:5;for(let j=0;j<=ticks;j++){const t=current.makespan*j/ticks;root.append(svg('line',{x1:x(t),x2:x(t),y1:22,y2:166,stroke:'#e3e8ef'}),svg('text',{x:x(t),y:186,'text-anchor':'middle','font-size':12},fixed(t)));}
 for(let i=0;i<3;i++)root.append(svg('text',{x:48,y:47+i*50,'text-anchor':'end','font-size':14},'ABC'[i]));
 for(const job of current.jobs){const y=25+job.station*50;for(const [start,end,fill,label] of [[job.start,job.setupEnd,'#87939f','Setup'],[job.setupEnd,job.finish,colors[job.station],'Processing']]){if(end===start)continue;const r=svg('rect',{x:x(start),y,width:Math.max(.2,x(end)-x(start)),height:28,fill,rx:1});r.append(svg('title',{},`Station ${'ABC'[job.station]}, batch ${job.batch+1}, ${job.units} units. ${label}: ${fixed(start)}–${fixed(end)} min.`));root.append(r);}if(x(job.finish)-x(job.start)>25)root.append(svg('text',{x:(x(job.start)+x(job.finish))/2,y:y+19,'text-anchor':'middle',fill:'white','font-size':12},job.batch+1));}
 root.append(svg('text',{x:width/2+20,y:214,'text-anchor':'middle','font-size':13},'Elapsed time · minutes'));
}
function render(){
 document.querySelectorAll('input[type=number]').forEach(el=>{const n=el.valueAsNumber;el.setAttribute('aria-invalid',String(!Number.isFinite(n)||n<Number(el.min)||n>Number(el.max)||(['batch-number','quantity'].includes(el.id)&&!Number.isInteger(n))));});
 const v=M.validate(state);$('error').hidden=v.ok;$('error').textContent=v.errors.join(' ');$('download').disabled=!v.ok;
 if(!v.ok){current=null;for(const id of ['cycle-worked','capacity-worked','system-worked','utilization-worked','capacity-result','bottleneck','first-batch','makespan','capacity-chart','gantt'])$(id).replaceChildren();return;}
 current=M.calculate(state);

 const pair=(id,symbols,rows)=>EquationLayout.render(id,symbols,rows),station=s=>sy('i',s.id);
 pair('cycle-worked',['Station',sy('CT','CT','i'),'=',sy('s','s','i'),'/',sy('B','B'),'+',sy('t','t','i')],current.stations.map(s=>[station(s),num(s.cycle,'CT'),'=',num(s.setup,'s',s.id),'/',`<span data-symbol="B" data-edit="batch">${state.batch}</span>`,'+',num(s.time,'t',s.id)]));
 pair('capacity-worked',['Station',sy('Ci','C','i'),'=','60','/',sy('CT','CT','i')],current.stations.map(s=>[station(s),num(s.capacity,'Ci'),'=','60','/',num(s.cycle,'CT')]));
 pair('system-worked',[sy('C','C'),'=','min(',sy('Ci','C','A'),',',sy('Ci','C','B'),',',sy('Ci','C','C'),')'],[[num(current.capacity,'C'),'=','min(',num(current.stations[0].capacity,'Ci'),',',num(current.stations[1].capacity,'Ci'),',',num(current.stations[2].capacity,'Ci'),')']]);
 pair('utilization-worked',['Station',sy('u','u','i'),'=',sy('C','C'),'/',sy('Ci','C','i')],current.stations.map(s=>[station(s),num(100*current.capacity/s.capacity,'u')+'%','=',num(current.capacity,'C'),'/',num(s.capacity,'Ci')]));
 $('capacity-result').textContent=fixed(current.capacity);
 const badge=$('bottleneck'),leaders=current.bottlenecks.map(i=>'ABC'[i]);
 badge.textContent=`Station ${leaders.join(' & ')} limits capacity`;
 badge.className='badge '+(leaders.length===1?'station-'+leaders[0].toLowerCase():'station-tied');
 $('first-batch').textContent=fixed(current.firstBatch)+' min';$('makespan').textContent=fixed(current.makespan)+' min';
 chart();gantt();highlight(activeSymbol);
}
function highlight(key){document.querySelectorAll('.symbol-highlight').forEach(n=>n.classList.remove('symbol-highlight'));if(key)document.querySelectorAll(`[data-symbol="${key}"]`).forEach(n=>{if(!n.closest('#symbol-key'))n.classList.add('symbol-highlight');});document.querySelectorAll('[data-key]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.key===activeSymbol)));}
document.querySelectorAll('[data-key]').forEach(n=>{n.addEventListener('click',()=>{activeSymbol=activeSymbol===n.dataset.key?null:n.dataset.key;highlight(activeSymbol);});n.addEventListener('mouseenter',()=>highlight(n.dataset.key));n.addEventListener('mouseleave',()=>highlight(activeSymbol));n.addEventListener('focus',()=>highlight(n.dataset.key));n.addEventListener('blur',()=>highlight(activeSymbol));});
function edit(key){clearTimeout(fade);document.querySelectorAll('.editing').forEach(n=>n.classList.remove('editing'));document.querySelectorAll(`[data-edit="${key}"], [data-edit="${key.replace(/[ABC]$/,'')}"]`).forEach(n=>n.classList.add('editing'));if(!held)fade=setTimeout(()=>document.querySelectorAll('.editing').forEach(n=>n.classList.remove('editing')),650);}
function bind(id,read,key){const el=$(id);if(el.type==='range')el.addEventListener('pointerdown',()=>{held=key;edit(key);});el.addEventListener('input',()=>{read(el.value===''?NaN:Number(el.value));document.querySelectorAll('[data-preset]').forEach(n=>n.setAttribute('aria-pressed','false'));render();edit(key);});el.addEventListener('blur',()=>{if(el.value!==''&&Number.isFinite(Number(el.value)))el.value=(id==='batch-number'||id==='quantity')?String(Number(el.value)):fixed(Number(el.value));});}
bind('batch-number',v=>{state.batch=v;if(Number.isFinite(v))$('batch-range').value=v;},'batch');bind('batch-range',v=>{state.batch=v;$('batch-number').value=String(v);},'batch');bind('quantity',v=>state.quantity=v,'quantity');
for(let i=0;i<3;i++)for(const [prefix,field,key] of [['s','setups','setup'],['t','times','time']]) {
 const id=prefix+i;
 bind(id,v=>{state[field][i]=v;if(Number.isFinite(v))$(id+'-range').value=v;},key+'ABC'[i]);
 bind(id+'-range',v=>{state[field][i]=v;$(id).value=fixed(v);},key+'ABC'[i]);
}
function sync(){ $('batch-number').value=String(state.batch);$('batch-range').value=state.batch;$('quantity').value=String(state.quantity);for(let i=0;i<3;i++){$('s'+i).value=fixed(state.setups[i]);$('t'+i).value=fixed(state.times[i]);$('s'+i+'-range').value=state.setups[i];$('t'+i+'-range').value=state.times[i];}}
document.querySelectorAll('[data-preset]').forEach(n=>n.addEventListener('click',()=>{const p=M.PRESETS.find(p=>p.id===n.dataset.preset);state={batch:p.batch,quantity:120,setups:[...p.setups],times:[...p.times]};sync();render();document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===n)));}));
$('reset').addEventListener('click',()=>{state={...M.DEFAULTS,setups:[...M.DEFAULTS.setups],times:[...M.DEFAULTS.times]};activeSymbol=null;sync();render();document.querySelectorAll('[data-preset]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.preset==='middle')));});
document.querySelectorAll('[data-help]').forEach(n=>n.addEventListener('click',()=>{trigger=n;const h=help[n.dataset.help];$('help-title').textContent=h[0];$('help-body').textContent=h[1];$('help-dialog').showModal();}));$('close-help').addEventListener('click',()=>$('help-dialog').close());$('help-dialog').addEventListener('close',()=>trigger?.focus());document.addEventListener('keydown',e=>{if(e.key==='Escape'){activeSymbol=null;highlight(null);}});
$('download').addEventListener('click',()=>{if(!current)return;const clone=document.documentElement.cloneNode(true);clone.querySelectorAll('input').forEach(n=>{n.setAttribute('value',$(n.id).value);});clone.querySelectorAll('.editing,.symbol-highlight').forEach(n=>n.classList.remove('editing','symbol-highlight'));clone.querySelectorAll('dialog').forEach(n=>n.removeAttribute('open'));const blob=new Blob(['<!doctype html>\n'+clone.outerHTML],{type:'text/html'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='batching.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('download-status').textContent='Saved as batching.html';});
for(const name of ['pointerup','pointercancel'])window.addEventListener(name,()=>{const key=held;held=null;if(key)edit(key);});
window.addEventListener('resize',()=>{if(current){chart();gantt();}});
sync();render();
})();

(() => {
'use strict';
// A2/D3/D4: NIST e-Handbook 6.3.2.1. d2: Minitab unbiasing table.
const constants=Object.freeze({2:Object.freeze({A2:1.880,D3:0,D4:3.267,d2:1.128}),3:Object.freeze({A2:1.023,D3:0,D4:2.575,d2:1.693}),4:Object.freeze({A2:.729,D3:0,D4:2.282,d2:2.059}),5:Object.freeze({A2:.577,D3:0,D4:2.115,d2:2.326}),6:Object.freeze({A2:.483,D3:0,D4:2.004,d2:2.534}),7:Object.freeze({A2:.419,D3:.076,D4:1.924,d2:2.704}),8:Object.freeze({A2:.373,D3:.136,D4:1.864,d2:2.847}),9:Object.freeze({A2:.337,D3:.184,D4:1.816,d2:2.970}),10:Object.freeze({A2:.308,D3:.223,D4:1.777,d2:3.078})});
const defaults=Object.freeze({mode:'control',mu:50,sigma:1,baseMu:50,baseSigma:1,LSL:46,USL:54,target:50,n:5,seed:42,outlier:0,goal:1.33});
const presets=[{name:'In control & capable',...defaults},{name:'In control, off-center',...defaults,baseMu:53.5,mu:53.5,baseSigma:.5,sigma:.5},{name:'In control, too much variation',...defaults,baseSigma:3,sigma:3},{name:'Mean shift, wide specs',...defaults,mu:52,LSL:42,USL:58,seed:5},{name:'More variation',...defaults,sigma:3,seed:5},{name:'One unusual measurement',...defaults,outlier:12,seed:8},{name:'Run within limits',...defaults,mu:50.5,seed:1},{name:'Trend within limits',...defaults,seed:28},{name:'In control',...defaults}];
const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
function subgroup(values,i=1){if(!Array.isArray(values)||values.length<2||values.length>10||values.some(v=>typeof v!=='number'||!Number.isFinite(v)))throw Error('Use 2–10 finite measurements per subgroup.');return{i,values:[...values],mean:mean(values),range:Math.max(...values)-Math.min(...values)};}
function baseline(groups){if(!Array.isArray(groups)||groups.length<2)throw Error('Use at least two reference subgroups.');const n=groups[0].values.length;if(!constants[n]||groups.some(g=>g.values.length!==n))throw Error('Reference subgroups must have the same size, from 2 to 10.');const checked=groups.map(g=>({...subgroup(g.values,g.i),changed:!!g.changed})),center=mean(checked.map(g=>g.mean)),rbar=mean(checked.map(g=>g.range)),c=constants[n];if(rbar<=0)throw Error('The reference needs some within-subgroup variation.');const limits={n,count:checked.length,end:checked.at(-1).i,center,rbar,sigmaHat:rbar/c.d2,xLow:center-c.A2*rbar,xHigh:center+c.A2*rbar,rLow:Math.max(0,c.D3*rbar),rHigh:c.D4*rbar,contaminated:checked.some(g=>g.changed),...c};return Object.freeze(limits);}
function normalPDF(z){return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);}
function normalCDF(z){if(z===0)return .5;if(z===Infinity)return 1;if(z===-Infinity)return 0;const x=Math.abs(z),t=1/(1+.2316419*x),tail=normalPDF(x)*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return z>0?1-tail:tail;}
function capability(mu,sigma,LSL,USL){if(![mu,sigma,LSL,USL].every(Number.isFinite)||sigma<=0||LSL>=USL)throw Error('Use a positive standard deviation and lower specification below upper specification.');return{Cp:(USL-LSL)/(6*sigma),Cpk:Math.min((USL-mu)/(3*sigma),(mu-LSL)/(3*sigma)),outside:normalCDF((LSL-mu)/sigma)+1-normalCDF((USL-mu)/sigma)};}
// Signal is recorded at the first point where a rule is satisfied, and each later
// endpoint while it remains satisfied. Equality breaks a run/trend. No future data.
function detectSignals(values,low,center,high){
 const reasons=values.map(()=>[]),members=values.map(()=>[]),events=[];
 const add=(end,start,rule,label)=>{reasons[end].push(label);for(let j=start;j<=end;j++)if(!members[j].includes(label))members[j].push(label);events.push({start:start+1,end:end+1,rule,label});};
 for(let i=0;i<values.length;i++){
  const v=values[i];if(v<low||v>high)add(i,i,'limit',v<low?'Below LCL':'Above UCL');
  if(i>=7){const w=values.slice(i-7,i+1);if(w.every(x=>x>center))add(i,i-7,'run','8 above centerline');else if(w.every(x=>x<center))add(i,i-7,'run','8 below centerline');}
  if(i>=5){const w=values.slice(i-5,i+1);if(w.slice(1).every((x,j)=>x>w[j]))add(i,i-5,'trend','6 increasing');else if(w.slice(1).every((x,j)=>x<w[j]))add(i,i-5,'trend','6 decreasing');}
 }
 return{reasons,members,events};
}
function calculate(s,reference=null){
 if(!['control','capability'].includes(s.mode))throw Error('Choose Control charts or Capability.');
 for(const k of ['mu','sigma','baseMu','baseSigma','LSL','USL','target','n','seed','outlier','goal'])if(typeof s[k]!=='number'||!Number.isFinite(s[k]))throw Error('Enter a finite number in each assumption.');
 if(s.mu<40||s.mu>60||s.baseMu<40||s.baseMu>60||s.sigma<.2||s.sigma>4||s.baseSigma<.2||s.baseSigma>4||s.LSL<35||s.USL>65||s.LSL>=s.USL||s.target<s.LSL||s.target>s.USL||!constants[s.n]||!Number.isInteger(s.n)||s.seed<1||s.seed>999999||!Number.isInteger(s.seed)||s.outlier<0||s.outlier>15||s.goal<.5||s.goal>2)throw Error('Use the displayed bounds, LSL < USL, and a target inside the specifications.');
 let rngState=s.seed>>>0;const uniform=()=>{rngState=(Math.imul(1664525,rngState)+1013904223)>>>0;return(rngState+.5)/4294967296;},normal=()=>Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform());
 const groups=Array.from({length:50},(_,i)=>{const current=i>=25,mu=current?s.mu:s.baseMu,sd=current?s.sigma:s.baseSigma,values=Array.from({length:s.n},(_,j)=>mu+sd*normal()+(i===37&&j===0?s.outlier:0));return{...subgroup(values,i+1),phase:current?'monitoring':'reference',changed:current&&(s.mu!==s.baseMu||s.sigma!==s.baseSigma)||(i===37&&s.outlier!==0)};});
 const limits=reference||baseline(groups.slice(0,25));if(limits.n!==s.n||!['center','rbar','xLow','xHigh','rLow','rHigh'].every(k=>Number.isFinite(limits[k]))||limits.rbar<=0)throw Error('Recalculate reference limits for this subgroup size.');
 const xRules=detectSignals(groups.map(g=>g.mean),limits.xLow,limits.center,limits.xHigh),rRules=detectSignals(groups.map(g=>g.range),limits.rLow,limits.rbar,limits.rHigh);
 const flagged=groups.map((g,i)=>({...g,xSignal:xRules.reasons[i].length>0,rSignal:rRules.reasons[i].length>0,xReasons:xRules.reasons[i],rReasons:rRules.reasons[i],xMembership:xRules.members[i],rMembership:rRules.members[i]}));
 const signals=flagged.filter(g=>g.xSignal||g.rSignal),monitoring=flagged.slice(25),values=monitoring.flatMap(g=>g.values),cap=capability(s.mu,s.sigma,s.LSL,s.USL),observedOutside=values.filter(x=>x<s.LSL||x>s.USL).length/values.length;
 return{xRules,rRules,groups:flagged,monitoring,values,limits,signals,xSignals:flagged.filter(g=>g.xSignal).length,rSignals:flagged.filter(g=>g.rSignal).length,inControl:signals.length===0,capability:cap,meetsGoal:cap.Cpk>=s.goal,observedOutside,bias:s.mu-s.target,pdf:x=>normalPDF((x-s.mu)/s.sigma)/s.sigma};
}
globalThis.DemoModel=Object.freeze({defaults,constants,subgroup,baseline,capability,normalPDF,normalCDF,detectSignals,calculate,examples:()=>presets.map(p=>({...p}))});
})();

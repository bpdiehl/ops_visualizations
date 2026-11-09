(() => {
'use strict';
const defaults=Object.freeze({mode:'eoq',D:1000,S:50,H:2,Q:250,mu:100,sigma:20,Cu:8,Co:2});
const examples=[{name:'Balanced costs',...defaults},{name:'Higher order cost',...defaults,S:200},{name:'Higher holding cost',...defaults,H:8},{name:'Equal shortage / leftover costs',...defaults,mode:'single',Q:100,Cu:5,Co:5},{name:'Expensive shortages',...defaults,mode:'single',Q:100},{name:'Expensive leftovers',...defaults,mode:'single',Q:100,Cu:2,Co:8},{name:'More demand variability',...defaults,mode:'single',Q:100,sigma:40}];
function calculate(s){if(!['eoq','single'].includes(s.mode))throw Error('Select an inventory decision.');const fields=s.mode==='eoq'?['D','S','H','Q']:['mu','sigma','Cu','Co','Q'];for(const k of fields)if(typeof s[k]!=='number'||!Number.isFinite(s[k])||Math.abs(s[k])>100000)throw Error('Enter finite amounts within 100,000 in the displayed units.');
 if(s.mode==='eoq'){if(s.D<=0||s.S<=0||s.H<=0||s.Q<=0)throw Error('EOQ requires positive demand, order cost, holding cost and order quantity.');const cost=q=>({ordering:s.D*s.S/q,holding:s.H*q/2,total:s.D*s.S/q+s.H*q/2}),optimal=Math.sqrt(2*s.D*s.S/s.H),chosen=cost(s.Q),best=cost(optimal);return{mode:s.mode,...chosen,optimal,bestCost:best.total,extra:chosen.total-best.total,average:s.Q/2,orders:s.D/s.Q,days:365*s.Q/s.D,cost};}
 if(s.mu<0||s.sigma<=0||s.Cu<0||s.Co<0||s.Cu+s.Co<=0||s.Q<0)throw Error('Use a nonnegative demand mean and quantity, positive standard deviation, nonnegative costs, and at least one positive mismatch cost.');
 const mean=s.mu,sd=s.sigma,p=s.Cu/(s.Cu+s.Co),zstar=p===0?-Infinity:p===1?Infinity:inverseNormal(p),optimal=p===1?null:Math.max(0,mean+sd*zstar);
 function outcome(q){const z=(q-mean)/sd,F=normalCDF(z),density=normalPDF(z),over=Math.max(0,(q-mean)*F+sd*density),under=Math.max(0,(mean-q)*(1-F)+sd*density);return{over,under,total:s.Co*over+s.Cu*under,stockProbability:F};}
 const chosen=outcome(s.Q),bestCost=optimal===null?0:outcome(optimal).total;return{mode:s.mode,...chosen,optimal,p,zstar,mean,sd,bestCost,extra:chosen.total-bestCost,negativeProbability:normalCDF(-mean/sd),pdf:q=>normalPDF((q-mean)/sd)/sd,outcome};}
function normalPDF(z){return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);}
function normalCDF(z){if(z===0)return.5;if(z===Infinity)return 1;if(z===-Infinity)return 0;const x=Math.abs(z),t=1/(1+.2316419*x),tail=normalPDF(x)*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return z>0?1-tail:tail;}
function inverseNormal(p){let lo=-10,hi=10;for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(normalCDF(mid)<p)lo=mid;else hi=mid;}return(lo+hi)/2;}
globalThis.DemoModel=Object.freeze({defaults,calculate,normalCDF,normalPDF,examples:()=>examples.map(s=>({...s}))});
})();

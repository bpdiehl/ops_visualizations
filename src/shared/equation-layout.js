/* A shared grid aligns symbolic and numerical rows; matched fractions share atom widths. */
(() => {
 'use strict';
 function render(target,symbols,rows,symbolicTarget){
  const worked=typeof target==='string'?document.getElementById(target):target;
  let formula=symbolicTarget?(typeof symbolicTarget==='string'?document.getElementById(symbolicTarget):symbolicTarget):worked.previousElementSibling;
  if(!formula||!formula.matches('.formula,.symbolic-equation,.dist-formula')){formula=document.createElement('div');formula.className='formula';worked.before(formula);}
  let grid=formula.parentElement;
  if(!grid.classList.contains('eq-aligned')){grid=document.createElement('div');grid.className='eq-aligned';formula.before(grid);grid.append(formula,worked);}
  const text=html=>{const el=document.createElement('span');el.innerHTML=String(html??'—');return el.textContent.trim();};
  const op=s=>/^(?:[=+−×/(),≈\[\]]|min\(|\(1\s*[+−-]|\)[A-Za-z0-9]+)$/.test(s);
  let nodes=symbols.map((s,i)=>({values:[s,...rows.map(r=>r[i]??'—')]}));
  const raw=node=>node.values?text(node.values[0]):'';
  const opening=node=>/^[([]/.test(raw(node)),closing=node=>/^[)\]]/.test(raw(node));
  function leftOperand(end){let start=end;if(closing(nodes[end])){let depth=1;while(start>0&&depth){start--;if(closing(nodes[start]))depth++;if(opening(nodes[start]))depth--;}}return start;}
  for(let slash=0;slash<nodes.length;slash++){
   if(raw(nodes[slash])!=='/'||slash===0||slash===nodes.length-1)continue;
   let start=leftOperand(slash-1);while(start>1&&raw(nodes[start-1])==='×')start=leftOperand(start-2);
   let end=slash+1;
   if(opening(nodes[end])){let depth=1;while(end<nodes.length-1&&depth){end++;if(opening(nodes[end]))depth++;if(closing(nodes[end]))depth--;}if(end<nodes.length-1&&/^<sup\b/.test(String(nodes[end+1].values?.[0])))end++;}
   let bottom=nodes.slice(slash+1,end+1);if(bottom.length>2&&['(','['].includes(raw(bottom[0]))&&[')',']'].includes(raw(bottom.at(-1))))bottom=bottom.slice(1,-1);
   const fraction={top:nodes.slice(start,slash),bottom};nodes.splice(start,end-start+1,fraction);slash=start;
  }
  function renderNode(node,row){
   if(node.values)return String(node.values[row]??'—');
   const line=parts=>parts.map(part=>{const strings=part.values?.map(text)||[],isOp=strings.length&&op(strings[0]);const width=isOp?Math.max(14,...strings.map(s=>s.length*7)):Math.max(46,...strings.map(s=>s.length*7.7));return `<span class="eq-inline-atom" style="min-width:${width}px">${renderNode(part,row)}</span>`;}).join('');
   return `<span class="eq-fraction"><span>${line(node.top)}</span><span>${line(node.bottom)}</span></span>`;
  }
  grid.tabIndex=0;grid.setAttribute('role','group');grid.setAttribute('aria-label','Equation and current values; scroll horizontally if needed');
  grid.style.setProperty('--eq-columns',nodes.length);
  const cells=row=>nodes.map((node,col)=>`<span class="eq-cell${row?' eq-value-cell':''}${node.values&&op(raw(node))?' eq-operator':''}" style="grid-column:${col+1};grid-row:${row+1}">${renderNode(node,row)}</span>`).join('');
  formula.innerHTML=cells(0);worked.innerHTML=rows.map((r,i)=>cells(i+1)).join('');
 }
 globalThis.EquationLayout=Object.freeze({render});
})();

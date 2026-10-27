(()=>{
const S={people:[],expenses:[]};
const $=s=>document.querySelector(s);
function render(){
  $('#people').innerHTML=S.people.map(p=>`<li><strong>${p}</strong></li>`).join('')||'<li>No people yet</li>';
  const sel=$('#payer'); sel.innerHTML=S.people.map(p=>`<option>${p}</option>`).join('');
  $('#expenses').innerHTML=S.expenses.map(e=>`<li><span>${e.desc} · paid by <strong>${e.payer}</strong></span><strong>₹${e.amount}</strong></li>`).join('')||'<li>No expenses</li>';
  $('#settle').innerHTML=settle().map(x=>`<li class="pay">${x}</li>`).join('')||'<li>All settled</li>';
}
function settle(){
  if(!S.people.length||!S.expenses.length) return [];
  const paid=Object.fromEntries(S.people.map(p=>[p,0]));
  let total=0;
  for(const e of S.expenses){paid[e.payer]+=e.amount; total+=e.amount;}
  const fair=total/S.people.length;
  const bal=S.people.map(p=>({p, v: +(paid[p]-fair).toFixed(2)}));
  const debt=bal.filter(x=>x.v<0).sort((a,b)=>a.v-b.v);
  const cred=bal.filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
  const out=[]; let i=0,j=0;
  while(i<debt.length&&j<cred.length){
    const amt=Math.min(-debt[i].v, cred[j].v);
    out.push(`${debt[i].p} → ${cred[j].p}: ₹${amt.toFixed(2)}`);
    debt[i].v+=amt; cred[j].v-=amt;
    if(Math.abs(debt[i].v)<0.01)i++; if(Math.abs(cred[j].v)<0.01)j++;
  }
  return out;
}
$('#personForm').onsubmit=e=>{e.preventDefault(); const n=new FormData(e.target).get('name').trim(); if(n&&!S.people.includes(n)) S.people.push(n); e.target.reset(); render();};
$('#expForm').onsubmit=e=>{e.preventDefault(); const f=new FormData(e.target); S.expenses.push({desc:f.get('desc'), amount:+f.get('amount'), payer:f.get('payer')}); e.target.reset(); render();};
render();
})();

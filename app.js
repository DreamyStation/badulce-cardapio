/* Badulce · cardápio e pedido (funcional). Tudo é calculado no navegador e o pedido sai como texto para o WhatsApp da vendedora. */
(function(){
'use strict';
/* CONFIGURE AQUI */
const WHATS='5547992695628';/* WhatsApp da vendedora: DDI 55 + DDD 47 + número */
const INSTA='baldulce._';/* Instagram, sem @ */
const MAXQ=20;/* limite por item, evita pedidos digitados errado */
window.POP={extra:'.passo svg,.hero .btn,.rodape p'};
const brl=n=>'R$ '+n.toFixed(2).replace('.',',').replace(',00','');
const MENU=[
 {id:'morango',nome:'Surpresa de Morango',d:'Brownie com creme branco e morangos fresquinhos.',p:20,img:'morango'},
 {id:'brownie',nome:'Brownie com cobertura',d:'Brownie macio, coberto de chocolate.',p:15,img:'brownie',
  extra:{rot:'Adicional',nome:'Cobertura adicional de morango',p:1,img:'brownie_morango'}},
 {id:'uva',nome:'Surpresa de uva',d:'Copinho cremoso com cobertura e uvas.',p:18,img:'uva'},
 {id:'palito',nome:'Palitinho de brownie com brigadeiro',d:'Palitinho de brownie para mergulhar no brigadeiro branco.',p:10,img:'palito'}
];
const carr={};/* chave "id" ou "id+m" (com adicional) -> quantidade */
const comExtra={};/* adicional marcado no cartão, por produto */
let entrega=false;
const $=id=>document.getElementById(id);
const itens=$('itens');
const info=k=>{const m=k.endsWith('+m');const prod=MENU.find(x=>x.id===(m?k.slice(0,-2):k));return prod?{prod,m:m&&!!prod.extra}:null};
const nomeDe=k=>{const i=info(k);return i.prod.nome+(i.m?' + '+i.prod.extra.nome.toLowerCase():'')};
const precoDe=k=>{const i=info(k);return i.prod.p+(i.m?i.prod.extra.p:0)};
const chaveDe=prod=>prod.id+(comExtra[prod.id]?'+m':'');
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function desenha(){
 itens.replaceChildren();
 MENU.forEach(prod=>{
  const k=chaveDe(prod),q=carr[k]||0,m=!!comExtra[prod.id];
  const card=el('article','item');
  const topo=el('div','topoi');
  const foto=el('div','fp');const img=document.createElement('img');
  img.src='img/'+(m?prod.extra.img:prod.img)+'.jpg';img.alt=prod.nome+(m?' com cobertura adicional de morango':'');img.width=300;img.height=300;img.loading='lazy';
  foto.appendChild(img);
  const tx=el('div','txt');tx.appendChild(el('h3','k',prod.nome));tx.appendChild(el('p',null,prod.d));
  topo.append(foto,tx);card.appendChild(topo);
  if(prod.extra){
   const fs=el('fieldset','ops');fs.appendChild(el('legend',null,prod.extra.rot));
   const ch=el('button','chip','+ '+prod.extra.nome+' · +'+brl(prod.extra.p).replace(' ',' '));ch.type='button';ch.setAttribute('aria-pressed',m);
   ch.onclick=()=>{comExtra[prod.id]=!comExtra[prod.id];desenha()};
   fs.appendChild(ch);card.appendChild(fs);
  }
  const linha=el('div','linha');linha.appendChild(el('span','preco',brl(prod.p+(m?prod.extra.p:0))));
  const qt=el('div','qtd');
  const menos=el('button',null,'−');menos.type='button';menos.setAttribute('aria-label','Tirar '+prod.nome);
  const out=document.createElement('output');out.setAttribute('aria-live','polite');out.textContent=q;
  const mais=el('button',null,'+');mais.type='button';mais.setAttribute('aria-label','Adicionar '+prod.nome);
  menos.onclick=()=>{const kk=chaveDe(prod);carr[kk]=Math.max(0,(carr[kk]||0)-1);if(!carr[kk])delete carr[kk];desenha();total()};
  mais.onclick=()=>{const kk=chaveDe(prod);carr[kk]=Math.min(MAXQ,(carr[kk]||0)+1);desenha();total()};
  qt.append(menos,out,mais);linha.appendChild(qt);card.appendChild(linha);
  itens.appendChild(card);
 });
}
function total(){
 const q=Object.values(carr).reduce((a,b)=>a+b,0);
 const t=Object.entries(carr).reduce((a,[k,n])=>a+precoDe(k)*n,0);
 $('cq').textContent=q+(q===1?' item':' itens');$('ct').textContent=brl(t);$('fin').disabled=!q;return t;
}
const modal=$('modal');
function resumo(){
 const sub=total();const lista=$('lista');lista.replaceChildren();
 Object.entries(carr).forEach(([k,n])=>{const l=el('div','l2');l.append(el('span',null,n+'× '+nomeDe(k)),el('span',null,brl(precoDe(k)*n)));lista.appendChild(l)});
 $('tt').textContent=brl(sub);return sub;
}
const limpa=(s,max)=>String(s||'').replace(/[\x00-\x1f\x7f]+/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
function montaMsg(){
 const t=resumo();const nome=limpa($('nm').value,60),quando=limpa($('qd').value,60),obs=limpa($('ob').value,300);
 return 'Oi, Badulce! Aqui é '+(nome||'um cliente')+'. Meu pedido pelo site:\n'
  +Object.entries(carr).map(([k,n])=>n+'× '+nomeDe(k)+' ('+brl(precoDe(k)*n)+')').join('\n')
  +'\n'+(entrega?'Entrega (combinar)':'Retirada')+(quando?'\nPara: '+quando:'')+(obs?'\nObs.: '+obs:'')+'\nTotal: '+brl(t);
}
$('fin').onclick=()=>{resumo();$('msg').hidden=true;$('envio').hidden=true;modal.hidden=false;$('conf').focus()};
const fecha=()=>{modal.hidden=true};
$('fecha').onclick=fecha;modal.addEventListener('click',e=>{if(e.target===modal)fecha()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')fecha()});
const bret=$('b-ret'),bent=$('b-ent');
bret.onclick=()=>{entrega=false;bret.setAttribute('aria-pressed',true);bent.setAttribute('aria-pressed',false)};
bent.onclick=()=>{entrega=true;bent.setAttribute('aria-pressed',true);bret.setAttribute('aria-pressed',false)};
async function copiar(t){try{await navigator.clipboard.writeText(t);return true}catch(e){return false}}
const zap=$('zap'),ig=$('ig'),aviso=$('aviso');
$('conf').onclick=()=>{const m=$('msg');m.hidden=false;m.textContent=montaMsg();$('envio').hidden=false;zap.disabled=!WHATS;ig.disabled=!INSTA;aviso.textContent=''};
zap.onclick=()=>{if(!Object.keys(carr).length)return;window.open('https://wa.me/'+encodeURIComponent(WHATS)+'?text='+encodeURIComponent(montaMsg()),'_blank','noopener,noreferrer')};
ig.onclick=async()=>{if(!Object.keys(carr).length)return;const ok=await copiar(montaMsg());
 aviso.textContent=ok?'Pedido copiado! Na conversa do Instagram, toque em colar e envie.':'Não consegui copiar sozinho. Selecione o texto acima, copie e cole na conversa.';
 setTimeout(()=>window.open('https://ig.me/m/'+encodeURIComponent(INSTA),'_blank','noopener,noreferrer'),600)};
desenha();total();
})();

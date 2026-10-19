/* corações que surgem, sobem e somem */
(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var svg=function(fill,stroke,w){return 'url("data:image/svg+xml,'+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='"+fill+"' stroke='"+stroke+"' stroke-width='"+w+"' stroke-linecap='round' stroke-linejoin='round'><path d='M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.6A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z'/></svg>")+'")'};
  var V=[svg('none','#E9326D',1.6),svg('#FCB8C5','#E9326D',1.2),svg('#E9326D','none',0),svg('#FED6DF','#FCB8C5',1)];
  var c=document.createElement('div');c.className='coracoes';c.setAttribute('aria-hidden','true');
  for(var i=0;i<18;i++){
    var e=document.createElement('i'),t=Math.random();
    e.style.cssText='left:'+(2+Math.random()*96).toFixed(1)+'%;--s:'+(14+Math.random()*26).toFixed(0)+'px;--d:'+(11+Math.random()*13).toFixed(1)+'s;--a:-'+(Math.random()*22).toFixed(1)+'s;--x:'+((Math.random()<.5?-1:1)*(18+Math.random()*46)).toFixed(0)+'px;--o:'+(.4+Math.random()*.35).toFixed(2)+';--h:'+V[t<.35?0:t<.65?1:t<.85?3:2];
    c.appendChild(e);
  }
  document.body.appendChild(c);
})();

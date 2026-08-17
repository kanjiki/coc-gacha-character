(()=>{
  const $=s=>document.querySelector(s);
  function cleanRarity(){
    const el=$('#rarityLine');
    if(!el)return;
    const text=(el.textContent||'').trim();
    const stars=(text.match(/★+/)||['★★★★'])[0];
    const limited=/LIMITED|限定/i.test(text);
    el.textContent=`${stars} ${limited?'限定':'恒常'}`;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(cleanRarity,0));
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(cleanRarity,0));
  });
})();

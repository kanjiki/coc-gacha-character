(()=>{
  const $=s=>document.querySelector(s);
  function cleanRarity(){
    const el=$('#rarityLine');
    if(!el)return;
    const text=(el.textContent||'').trim();
    const stars=(text.match(/★+/)||['★★★★'])[0];
    el.textContent=`${stars} STANDARD`;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(cleanRarity,0));
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(cleanRarity,0));
  });
})();

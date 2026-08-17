(()=>{
  const $=s=>document.querySelector(s);
  function cleanRarity(){
    const el=$('#rarityLine');
    if(!el)return;
    const text=(el.textContent||'').trim();
    const stars=(text.match(/★+/)||['★★★★'])[0];
    const status=(text.match(/\b(STANDARD|LIMITED|EVENT)\b/i)||['STANDARD'])[0].toUpperCase();
    el.textContent=`${stars} ${status}`;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(cleanRarity,0));
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(cleanRarity,0));
  });
})();

(()=>{
  function reapply(){
    try{
      const hex=localStorage.getItem('coc6-background-color')||'#343b49';
      window.COC6BackgroundColor?.apply?.(hex);
    }catch(_){ }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(reapply,0),{once:true});
  else setTimeout(reapply,0);
  document.addEventListener('gacha-visual-theme-change',()=>setTimeout(reapply,20));
  document.addEventListener('input',e=>{
    if(e.target?.id==='backgroundColor'||e.target?.id==='resultBackgroundColor')setTimeout(reapply,0);
  });
})();
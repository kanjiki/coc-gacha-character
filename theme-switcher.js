(()=>{
  const $=s=>document.querySelector(s);
  const link=$('#visualThemeStylesheet');
  const badge=$('.version-badge');

  function ensureScript(src,key){
    if(document.querySelector(`script[data-${key}]`))return;
    const s=document.createElement('script');
    s.src=src;
    s.defer=true;
    s.dataset[key]='1';
    document.head.appendChild(s);
  }

  function ensureRandomBuild(){
    ensureScript('random-build.js?v=0.7.30','randomBuild');
  }

  function ensureBackgroundHotfix(){
    ensureScript('background-color-hotfix-v0730.js?v=1','backgroundHotfix');
  }

  function ensureMobileDownloadHotfix(){
    ensureScript('mobile-download-hotfix-v0730.js?v=1','mobileDownloadHotfix');
  }

  function ensureSkillLayout(){
    if(document.querySelector('link[data-skill-layout]'))return;
    const l=document.createElement('link');
    l.rel='stylesheet';
    l.href='urban-skill-layout-v0724.css?v=0.7.30';
    l.dataset.skillLayout='1';
    document.head.appendChild(l);
  }

  function removeThemeControls(){
    $('#visualTheme')?.closest('label')?.remove();
    $('#resultVisualTheme')?.closest('label')?.remove();
  }

  function applyUrban(){
    if(link)link.href='zzz-theme-v0715.css?v=0.7.30';
    document.documentElement.dataset.visualTheme='zzz';
    localStorage.setItem('coc-gacha-visual-theme','zzz');
    if(badge)badge.textContent='v0.7.30 // URBAN / ACTION // 2026-08-18';
    const footer=[...document.querySelectorAll('#resultCard footer span')].at(-1);
    if(footer)footer.textContent='TRPG LAB // CoC6 // v0.7.30';
    removeThemeControls();
    document.dispatchEvent(new CustomEvent('gacha-visual-theme-change',{detail:{theme:'zzz'}}));
  }

  ensureRandomBuild();
  ensureSkillLayout();
  ensureBackgroundHotfix();
  ensureMobileDownloadHotfix();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyUrban,{once:true});
  else applyUrban();
})();

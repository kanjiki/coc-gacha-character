(()=>{
  const $=s=>document.querySelector(s);
  const link=$('#visualThemeStylesheet');
  const badge=$('.version-badge');

  function ensureRandomBuild(){
    if(document.querySelector('script[data-random-build]'))return;
    const s=document.createElement('script');
    s.src='random-build.js?v=0.7.23';
    s.defer=true;
    s.dataset.randomBuild='1';
    document.head.appendChild(s);
  }

  function ensureSkillSanitizer(){
    if(document.querySelector('script[data-skill-sanitizer]'))return;
    const s=document.createElement('script');
    s.src='iachara-text-sanitizer.js?v=0.7.23';
    s.defer=true;
    s.dataset.skillSanitizer='1';
    document.head.appendChild(s);
  }

  function removeThemeControls(){
    const input=$('#visualTheme');
    const result=$('#resultVisualTheme');
    input?.closest('label')?.remove();
    result?.closest('label')?.remove();
  }

  function applyUrban(){
    if(link)link.href='zzz-theme-v0715.css?v=0.7.23';
    document.documentElement.dataset.visualTheme='zzz';
    localStorage.setItem('coc-gacha-visual-theme','zzz');
    if(badge)badge.textContent='v0.7.23 // URBAN / ACTION // 2026-08-18';
    const footer=[...document.querySelectorAll('#resultCard footer span')].at(-1);
    if(footer)footer.textContent='TRPG LAB // CoC6 // v0.7.23';
    removeThemeControls();
    document.dispatchEvent(new CustomEvent('gacha-visual-theme-change',{detail:{theme:'zzz'}}));
  }

  ensureRandomBuild();
  ensureSkillSanitizer();
  document.addEventListener('DOMContentLoaded',applyUrban);
})();

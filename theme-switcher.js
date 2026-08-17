(()=>{
  const $=s=>document.querySelector(s);
  const link=$('#visualThemeStylesheet');
  const input=$('#visualTheme');
  const result=$('#resultVisualTheme');
  const badge=$('.version-badge');
  const THEMES={persona:{href:'persona-theme.css?v=0.7.21',label:'COMIC / PHANTOM'},zzz:{href:'zzz-theme-v0715.css?v=0.7.21',label:'URBAN / ACTION'}};

  function ensureRandomBuild(){
    if(document.querySelector('script[data-random-build]'))return;
    const s=document.createElement('script');
    s.src='random-build.js?v=0.7.21';
    s.defer=true;
    s.dataset.randomBuild='1';
    document.head.appendChild(s);
  }

  function applyTheme(name){
    if(!THEMES[name])name='persona';
    const t=THEMES[name];
    if(link)link.href=t.href;
    if(input)input.value=name;
    if(result)result.value=name;
    document.documentElement.dataset.visualTheme=name;
    localStorage.setItem('coc-gacha-visual-theme',name);
    if(badge)badge.textContent=`v0.7.21 // ${t.label} // 2026-08-18`;
    const footer=[...document.querySelectorAll('#resultCard footer span')].at(-1);if(footer)footer.textContent='TRPG LAB // CoC6 // v0.7.21';
    document.dispatchEvent(new CustomEvent('gacha-visual-theme-change',{detail:{theme:name}}));
  }
  ensureRandomBuild();
  input?.addEventListener('change',()=>applyTheme(input.value));
  result?.addEventListener('change',()=>applyTheme(result.value));
  document.addEventListener('DOMContentLoaded',()=>applyTheme(localStorage.getItem('coc-gacha-visual-theme')||input?.value||'persona'));
})();

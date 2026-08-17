(()=>{
  const $=s=>document.querySelector(s);
  const link=$('#visualThemeStylesheet');
  const input=$('#visualTheme');
  const result=$('#resultVisualTheme');
  const badge=$('.version-badge');
  const THEMES={persona:{href:'persona-theme.css?v=0.6.1',label:'COMIC / PHANTOM'},zzz:{href:'zzz-theme.css?v=0.6.1',label:'URBAN / ACTION'}};
  function applyTheme(name){
    if(!THEMES[name])name='persona';
    const t=THEMES[name];
    if(link)link.href=t.href;
    if(input)input.value=name;
    if(result)result.value=name;
    document.documentElement.dataset.visualTheme=name;
    localStorage.setItem('coc-gacha-visual-theme',name);
    if(badge)badge.textContent=`v0.6.1 // ${t.label} // 2026-08-18`;
    document.dispatchEvent(new CustomEvent('gacha-visual-theme-change',{detail:{theme:name}}));
  }
  input?.addEventListener('change',()=>applyTheme(input.value));
  result?.addEventListener('change',()=>applyTheme(result.value));
  document.addEventListener('DOMContentLoaded',()=>applyTheme(localStorage.getItem('coc-gacha-visual-theme')||input?.value||'persona'));
})();

(()=>{
  const $=s=>document.querySelector(s);
  const root=document.documentElement;
  const input=$('#uiAccentColor'),result=$('#resultUiAccentColor');
  function valid(v){return /^#[0-9A-F]{6}$/i.test(v||'');}
  function hexRgb(h){return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
  function apply(v){
    if(!valid(v))return;
    v=v.toUpperCase();
    const {r,g,b}=hexRgb(v);
    root.style.setProperty('--urban-yellow',v);
    root.style.setProperty('--ui-accent',v);
    root.style.setProperty('--ui-accent-rgb',`${r},${g},${b}`);
    if(input)input.value=v;
    if(result)result.value=v;
    localStorage.setItem('coc-gacha-ui-accent',v);
  }
  input?.addEventListener('input',()=>apply(input.value));
  result?.addEventListener('input',()=>apply(result.value));
  document.addEventListener('DOMContentLoaded',()=>apply(localStorage.getItem('coc-gacha-ui-accent')||input?.value||'#FFD91A'));
})();

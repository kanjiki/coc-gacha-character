(()=>{
  const $=s=>document.querySelector(s);
  function sync(){
    const role=$('#roleText')?.textContent?.trim()||'ROLE';
    const attr=$('#attributeText')?.textContent?.trim()||'ATTRIBUTE';
    const pos=$('#positionText')?.textContent?.trim()||'POSITION';
    const r=$('#urbanRole'),a=$('#urbanAttr'),p=$('#urbanPos');
    if(r)r.textContent=role;if(a)a.textContent=attr;if(p)p.textContent=pos;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(sync,0));
    document.addEventListener('gacha-visual-theme-change',sync);
    sync();
  });
})();

(()=>{
  const TARGETS=['#skillName','#ultimateName'];

  function fit(el){
    if(!el)return;
    el.style.whiteSpace='nowrap';
    el.style.overflow='hidden';
    el.style.textOverflow='ellipsis';
    el.style.maxWidth='100%';
    el.style.width='100%';

    // Restore theme-defined size first, then shrink only when the title would wrap/overflow.
    el.style.fontSize='';
    const base=parseFloat(getComputedStyle(el).fontSize)||20;
    let size=base;
    const min=Math.max(10,base*.62);
    while(el.scrollWidth>el.clientWidth&&size>min){
      size-=1;
      el.style.fontSize=size+'px';
    }
  }

  function fitAll(){TARGETS.forEach(s=>fit(document.querySelector(s)));}
  window.fitCoc6SkillTitles=fitAll;

  document.addEventListener('DOMContentLoaded',()=>{
    fitAll();
    document.querySelector('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(fitAll,30));
    document.addEventListener('coc6-kit-generated',()=>setTimeout(fitAll,0));
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(fitAll,50));
    window.addEventListener('resize',fitAll);
  });
})();

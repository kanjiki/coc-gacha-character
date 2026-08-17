(()=>{
  const $=s=>document.querySelector(s);
  const norm=s=>String(s||'').trim().replace(/　/g,' ').replace(/\s+/g,' ').replace(/[：:]/g,':').replace(/[（]/g,'(').replace(/[）]/g,')').replace(/[【】\[\]「」『』]/g,'').trim();

  function apply(){
    const box=$('#customSkillClassifier');
    if(!box)return;
    const favorite=$('#favoriteSkill')?.value?.trim()||'';
    if(!favorite){box.hidden=true;return;}

    let meta=null;
    try{meta=window.COC6SkillClassifier?.getFavoriteSkillMeta?.()||null;}catch(_){ }
    if(!meta||meta.source!=='custom'){
      box.hidden=true;
      return;
    }

    const rows=[...box.querySelectorAll('.custom-skill-row')];
    let found=false;
    rows.forEach(row=>{
      const select=row.querySelector('select[data-skill]');
      const match=select&&norm(select.dataset.skill)===norm(favorite);
      row.hidden=!match;
      if(match)found=true;
    });
    box.hidden=!found;

    const note=box.querySelector('.custom-skill-head span');
    if(note)note.textContent='FAVORITE SKILLに選んだカスタム技能だけ分類';
  }

  function delayedApply(){
    setTimeout(apply,0);
    setTimeout(apply,80);
    setTimeout(apply,320);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    delayedApply();
    $('#favoriteSkill')?.addEventListener('input',delayedApply);
    $('#favoriteSkill')?.addEventListener('change',delayedApply);
    $('#iacharaFile')?.addEventListener('change',delayedApply);
    document.addEventListener('coc6-skill-classification-change',delayedApply);
  });
})();

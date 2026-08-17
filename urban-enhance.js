(()=>{
  const $=s=>document.querySelector(s);
  let favoriteInput=null;
  let favoriteList=null;
  const NAME_FONTS={
    heavy:'"Arial Black","Yu Gothic","Hiragino Kaku Gothic ProN",Meiryo,sans-serif',
    gothic:'"Yu Gothic","Hiragino Kaku Gothic ProN",Meiryo,sans-serif',
    mincho:'"Yu Mincho","Hiragino Mincho ProN",serif',
    condensed:'"Arial Narrow","Yu Gothic Condensed","Yu Gothic",Meiryo,sans-serif',
    mono:'"BIZ UDPGothic",Consolas,"Yu Gothic",monospace'
  };

  function ensureFavoriteSkillUI(){
    if($('#favoriteSkill')){favoriteInput=$('#favoriteSkill');favoriteList=$('#favoriteSkillList');return;}
    const preview=$('#skillsPreview');
    if(!preview)return;
    const box=document.createElement('div');
    box.className='favorite-skill-box';
    box.innerHTML=`<div class="favorite-skill-title">FAVORITE SKILL <span>結果カードで参照する技能</span></div><label>この探索者で一番好きな技能<input id="favoriteSkill" type="text" list="favoriteSkillList" placeholder="例：図書館 / 目星 / キック"><datalist id="favoriteSkillList"></datalist></label><p>いあきゃらから読み込んだ技能から選択できます。手入力も可能です。結果画像には選んだ技能だけを使用します。</p>`;
    preview.insertAdjacentElement('afterend',box);
    favoriteInput=$('#favoriteSkill');favoriteList=$('#favoriteSkillList');
    if(!$('#favoriteSkillStyle')){
      const style=document.createElement('style');style.id='favoriteSkillStyle';style.textContent=`.favorite-skill-box{margin-top:14px;padding:14px 16px;border:1px solid var(--line);background:#fff}.favorite-skill-title{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px;font:900 11px/1.3 monospace;letter-spacing:.08em}.favorite-skill-title span{color:var(--muted);font-weight:700;letter-spacing:0}.favorite-skill-box p{margin:7px 0 0;color:var(--muted);font-size:11px;line-height:1.5}html[data-visual-theme="zzz"] .favorite-skill-box{border:2px solid #111;box-shadow:3px 3px 0 rgba(0,0,0,.16)}html[data-visual-theme="zzz"] .favorite-skill-title{background:#111;color:#fff;width:max-content;padding:5px 8px}html[data-visual-theme="zzz"] .favorite-skill-title span{color:var(--ui-accent);margin-left:8px}`;document.head.appendChild(style);
    }
  }

  function ensureNameFontUI(){
    if($('#nameFontSelect'))return;
    const editor=$('#resultEditor');if(!editor)return;
    const label=document.createElement('label');label.className='name-font-control';label.innerHTML=`NAME FONT <select id="nameFontSelect"><option value="heavy">HEAVY</option><option value="gothic">GOTHIC</option><option value="mincho">MINCHO</option><option value="condensed">CONDENSED</option><option value="mono">MONO</option></select>`;
    const help=editor.querySelector('.editor-help');editor.insertBefore(label,help||null);
    const select=$('#nameFontSelect');
    const saved=localStorage.getItem('coc-gacha-name-font')||'heavy';select.value=NAME_FONTS[saved]?saved:'heavy';applyNameFont(select.value);
    select.addEventListener('change',()=>{applyNameFont(select.value);localStorage.setItem('coc-gacha-name-font',select.value);});
  }

  function applyNameFont(key){document.documentElement.style.setProperty('--name-font',NAME_FONTS[key]||NAME_FONTS.heavy);}

  function refreshFavoriteOptions(){
    ensureFavoriteSkillUI();
    if(!favoriteList)return;
    favoriteList.innerHTML='';
    let skills=[];
    try{if(typeof topSkills==='function')skills=topSkills(200);}catch(_){skills=[];}
    skills.forEach(([name,value])=>{const o=document.createElement('option');o.value=name;o.label=`${name} ${value}`;favoriteList.appendChild(o);});
  }

  function sync(){
    const role=$('#roleText')?.textContent?.trim()||'ROLE';
    const attr=$('#attributeText')?.textContent?.trim()||'ATTRIBUTE';
    const pos=$('#positionText')?.textContent?.trim()||'POSITION';
    const r=$('#urbanRole'),a=$('#urbanAttr'),p=$('#urbanPos');
    if(r)r.textContent=role;if(a)a.textContent=attr;if(p)p.textContent=pos;
  }

  function applyFavoriteSkillToResult(){
    const role=$('#roleText')?.textContent?.trim()||'ANALYST';
    const chosen=favoriteInput?.value?.trim()||'';
    let base='';
    try{if(typeof skillSet==='function')base=skillSet(role)?.[1]||'';}catch(_){base='';}
    let value=null;
    if(chosen){
      try{if(typeof topSkills==='function'){const found=topSkills(200).find(([n])=>n===chosen);if(found)value=found[1];}}catch(_){value=null;}
    }
    const skillText=$('#skillText');
    if(skillText)skillText.textContent=base+(chosen?` 選択技能「${chosen}${value!==null?` ${value}`:''}」に応じて追加効果。`:'');
    const history=$('#historyText');
    history?.querySelectorAll('.history-line').forEach(line=>{if(line.querySelector('b')?.textContent?.trim()==='SKILLS')line.remove();});
  }

  document.addEventListener('DOMContentLoaded',()=>{
    ensureFavoriteSkillUI();ensureNameFontUI();refreshFavoriteOptions();
    $('#iacharaFile')?.addEventListener('change',()=>setTimeout(refreshFavoriteOptions,150));
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(()=>{sync();applyFavoriteSkillToResult();},0));
    document.addEventListener('gacha-visual-theme-change',()=>{sync();ensureNameFontUI();});
    sync();
  });
})();

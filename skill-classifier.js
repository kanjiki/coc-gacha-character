(()=>{
  const $=s=>document.querySelector(s);
  const CATEGORIES={
    COMBAT:'COMBAT',
    INVESTIGATION:'INVESTIGATION',
    KNOWLEDGE:'KNOWLEDGE',
    SOCIAL:'SOCIAL',
    MEDICAL:'MEDICAL',
    TECHNICAL:'TECHNICAL',
    MOBILITY:'MOBILITY',
    OCCULT_CREATIVE:'OCCULT / CREATIVE',
    UNCLASSIFIED:'UNCLASSIFIED'
  };

  const STANDARD={
    COMBAT:['こぶし','パンチ','こぶし（パンチ）','キック','組み付き','頭突き','投擲','マーシャルアーツ','拳銃','サブマシンガン','ショットガン','マシンガン','ライフル'],
    INVESTIGATION:['目星','聞き耳','図書館','追跡','写真術'],
    KNOWLEDGE:['化学','経理','考古学','人類学','生物学','地質学','天文学','博物学','物理学','法律','歴史'],
    SOCIAL:['言いくるめ','信用','説得','値切り','母国語','ほかの言語','心理学'],
    MEDICAL:['応急手当','精神分析','医学','薬学'],
    TECHNICAL:['鍵開け','機械修理','重機械操作','電気修理','コンピューター','電子工学'],
    MOBILITY:['回避','隠す','隠れる','忍び歩き','登攀','運転','乗馬','水泳','操縦','跳躍','ナビゲート','変装'],
    OCCULT_CREATIVE:['オカルト','クトゥルフ神話','芸術','製作','制作']
  };

  const PARENT_SKILLS={
    '運転':'MOBILITY',
    '操縦':'MOBILITY',
    '製作':'OCCULT_CREATIVE',
    '制作':'OCCULT_CREATIVE',
    '芸術':'OCCULT_CREATIVE',
    'ほかの言語':'SOCIAL',
    '母国語':'SOCIAL'
  };

  const CANONICAL_ALIAS={
    'パンチ':'こぶし',
    'こぶしパンチ':'こぶし',
    '制作':'製作'
  };

  const STORAGE_KEY='coc6-custom-skill-categories-v1';
  let customAssignments=loadAssignments();

  function loadAssignments(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};}catch(_){return {};}
  }
  function saveAssignments(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(customAssignments));}catch(_){ }
  }

  function normalizeSkillName(v=''){
    return String(v)
      .trim()
      .replace(/　/g,' ')
      .replace(/\s+/g,' ')
      .replace(/[：:]/g,':')
      .replace(/[（]/g,'(').replace(/[）]/g,')')
      .replace(/[【】\[\]「」『』]/g,'')
      .trim();
  }
  function keyName(v=''){
    return normalizeSkillName(v).toLowerCase().replace(/[\s・_\-]/g,'');
  }
  function compactKey(v=''){
    return keyName(v).replace(/[():]/g,'');
  }

  const exactMap=new Map();
  Object.entries(STANDARD).forEach(([category,names])=>{
    names.forEach(name=>{
      const k=compactKey(name);
      const canonical=CANONICAL_ALIAS[k]||CANONICAL_ALIAS[normalizeSkillName(name)]||normalizeSkillName(name);
      exactMap.set(k,{category,canonical});
    });
  });

  function parentFromName(name=''){
    const n=normalizeSkillName(name);
    let base=n;
    const colon=n.indexOf(':');
    const paren=n.indexOf('(');
    const cuts=[colon,paren].filter(i=>i>0);
    if(cuts.length)base=n.slice(0,Math.min(...cuts)).trim();
    const baseCompact=compactKey(base);
    const entry=Object.entries(PARENT_SKILLS).find(([p])=>compactKey(p)===baseCompact);
    return entry?{parent:entry[0],category:entry[1]}:null;
  }

  function isExcluded(name=''){
    try{if(typeof window.isExcludedSkillRoll==='function'&&window.isExcludedSkillRoll(name))return true;}catch(_){ }
    const n=compactKey(name).toUpperCase();
    if(/^(アイデア|IDEA|幸運|LUCK|知識|KNOW)$/.test(n))return true;
    if(/^(STR|CON|POW|DEX|APP|SIZ|INT|EDU)(X|×|\*)?5$/.test(n))return true;
    if(/正気度ロール|SANCHECK|SANROLL|ダメージ判定|DAMAGE/.test(n))return true;
    if(/^\d*D\d+(?:[+\-]\d*D\d+)*(?:[+\-]\d+)?$/i.test(String(name).replace(/\s+/g,'')))return true;
    return false;
  }

  function classifySkill(name,value=null){
    const clean=normalizeSkillName(name);
    if(!clean||isExcluded(clean))return {name:clean,value,source:'excluded',category:null,parent:null,canonical:null};

    const exact=exactMap.get(compactKey(clean));
    if(exact){
      const canonical=CANONICAL_ALIAS[compactKey(clean)]||exact.canonical;
      return {name:clean,value,source:'standard',category:exact.category,parent:null,canonical};
    }

    const parent=parentFromName(clean);
    if(parent){
      return {name:clean,value,source:'standard-derived',category:parent.category,parent:parent.parent,canonical:parent.parent};
    }

    const stored=customAssignments[keyName(clean)]||'UNCLASSIFIED';
    return {name:clean,value,source:'custom',category:stored,parent:null,canonical:clean};
  }

  function loadedSkills(){
    try{
      if(typeof importedSkills!=='undefined'&&importedSkills&&typeof importedSkills==='object'){
        return Object.entries(importedSkills).map(([name,value])=>[name,Number(value)]);
      }
    }catch(_){ }
    try{if(typeof topSkills==='function')return topSkills(500).map(([n,v])=>[n,Number(v)]);}catch(_){ }
    return [];
  }

  function classifyImportedSkills(){
    return loadedSkills().map(([name,value])=>classifySkill(name,value)).filter(x=>x.source!=='excluded');
  }

  function ensureCustomUI(){
    let box=$('#customSkillClassifier');
    if(box)return box;
    const anchor=$('.favorite-skill-box')||$('#skillsPreview');
    if(!anchor)return null;
    box=document.createElement('section');
    box.id='customSkillClassifier';
    box.className='custom-skill-classifier';
    box.hidden=true;
    box.innerHTML='<div class="custom-skill-head"><strong>CUSTOM SKILL CLASSIFICATION</strong><span>標準技能辞書にない技能だけ確認</span></div><div id="customSkillRows"></div>';
    anchor.insertAdjacentElement('afterend',box);
    if(!$('#customSkillClassifierStyle')){
      const style=document.createElement('style');
      style.id='customSkillClassifierStyle';
      style.textContent=`
        .custom-skill-classifier{margin-top:14px;padding:14px 16px;border:1px solid var(--line);background:#fff}
        .custom-skill-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;font:900 11px/1.3 monospace;letter-spacing:.07em}
        .custom-skill-head span{color:var(--muted);font-weight:700;letter-spacing:0}
        .custom-skill-row{display:grid;grid-template-columns:minmax(0,1fr) 160px;gap:12px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}
        .custom-skill-row:first-child{border-top:0}
        .custom-skill-name{font-size:12px;font-weight:800;overflow-wrap:anywhere}.custom-skill-name small{display:block;color:var(--muted);font:700 10px/1.4 monospace;margin-top:2px}
        .custom-skill-row select{padding:8px 9px}
        html[data-visual-theme="zzz"] .custom-skill-classifier{border:2px solid #111;box-shadow:3px 3px 0 rgba(0,0,0,.16)}
        html[data-visual-theme="zzz"] .custom-skill-head strong{background:#111;color:#fff;padding:5px 8px}
        html[data-visual-theme="zzz"] .custom-skill-head span{color:#333}
        @media(max-width:700px){.custom-skill-row{grid-template-columns:1fr}}
      `;
      document.head.appendChild(style);
    }
    return box;
  }

  function renderCustomUI(){
    const box=ensureCustomUI();if(!box)return;
    const rows=$('#customSkillRows');if(!rows)return;
    const customs=classifyImportedSkills().filter(x=>x.source==='custom');
    box.hidden=!customs.length;
    rows.innerHTML='';
    customs.forEach(meta=>{
      const row=document.createElement('div');row.className='custom-skill-row';
      const name=document.createElement('div');name.className='custom-skill-name';
      name.textContent=meta.name;
      const small=document.createElement('small');small.textContent=Number.isFinite(meta.value)?`技能値 ${meta.value}`:'技能値 —';name.appendChild(small);
      const select=document.createElement('select');select.dataset.skill=meta.name;
      Object.keys(CATEGORIES).forEach(key=>{
        const o=document.createElement('option');o.value=key;o.textContent=CATEGORIES[key];select.appendChild(o);
      });
      select.value=meta.category||'UNCLASSIFIED';
      select.addEventListener('change',()=>{
        customAssignments[keyName(meta.name)]=select.value;saveAssignments();
        refreshFavoriteList();
        document.dispatchEvent(new CustomEvent('coc6-skill-classification-change',{detail:classifySkill(meta.name,meta.value)}));
      });
      row.append(name,select);rows.appendChild(row);
    });
  }

  function ensureFavoriteInput(){return $('#favoriteSkill');}
  function refreshFavoriteList(){
    const input=ensureFavoriteInput(),list=$('#favoriteSkillList');
    if(!input||!list)return;
    const classified=classifyImportedSkills();
    list.innerHTML='';
    classified.forEach(meta=>{
      const o=document.createElement('option');o.value=meta.name;
      const cat=meta.category?CATEGORIES[meta.category]||meta.category:'—';
      const source=meta.source==='custom'?'CUSTOM':meta.source==='standard-derived'?'DERIVED':'STANDARD';
      o.label=`${meta.name} ${Number.isFinite(meta.value)?meta.value:''} / ${cat} / ${source}`;
      list.appendChild(o);
    });
  }

  function getFavoriteSkillMeta(){
    const chosen=$('#favoriteSkill')?.value?.trim()||'';
    if(!chosen)return null;
    const found=loadedSkills().find(([name])=>normalizeSkillName(name)===normalizeSkillName(chosen));
    const value=found?found[1]:null;
    return classifySkill(chosen,value);
  }

  function refresh(){
    renderCustomUI();
    refreshFavoriteList();
    window.__coc6ClassifiedSkills=classifyImportedSkills();
    window.__coc6FavoriteSkill=getFavoriteSkillMeta();
  }

  window.COC6SkillClassifier={
    CATEGORIES,
    STANDARD,
    PARENT_SKILLS,
    normalizeSkillName,
    classifySkill,
    classifyImportedSkills,
    getFavoriteSkillMeta,
    getCustomAssignments:()=>({...customAssignments}),
    refresh,
    refreshFavoriteList
  };

  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(refresh,0);
    $('#iacharaFile')?.addEventListener('change',()=>setTimeout(refresh,260));
    document.addEventListener('input',e=>{
      if(e.target?.id==='favoriteSkill')window.__coc6FavoriteSkill=getFavoriteSkillMeta();
    });
    $('#diagnoseBtn')?.addEventListener('click',()=>{
      window.__coc6FavoriteSkill=getFavoriteSkillMeta();
      window.__coc6ClassifiedSkills=classifyImportedSkills();
    });
  });
})();

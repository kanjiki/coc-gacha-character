(()=>{
  const originalNonSkill=window.isNonSkillName;
  const originalParse=window.parseIacharaFile;

  function normalize(v=''){
    return String(v)
      .trim()
      .toUpperCase()
      .replace(/[【】\[\]()（）{}<>＜＞「」『』：:\s　_\-/]/g,'')
      .replace(/[×＊*]/g,'X');
  }

  function isExcludedRoll(name=''){
    const raw=String(name).trim();
    const n=normalize(raw);
    if(/^(アイデア|IDEA|幸運|LUCK|知識|KNOW)$/.test(n))return true;
    if(/^(STR|CON|POW|DEX|APP|SIZ|INT|EDU)X?5$/.test(n))return true;
    if(/ダメージ判定|DAMAGE(?:ROLL|CHECK)?/.test(n))return true;
    if(/^\d*D\d+(?:[+\-]\d*D\d+)*(?:[+\-]\d+)?$/i.test(raw.replace(/\s+/g,'')))return true;
    if(/正気度ロール|SANCHECK|SANROLL/.test(n))return true;
    return false;
  }

  window.isExcludedSkillRoll=isExcludedRoll;
  window.isNonSkillName=function(name=''){
    if(isExcludedRoll(name))return true;
    return typeof originalNonSkill==='function' ? originalNonSkill(name) : false;
  };

  function cleanHeading(s=''){
    return String(s).trim().replace(/^[■◆●◇○・#\-*\s]+/,'').replace(/[：:]$/,'').trim();
  }
  function isSkillHeading(s=''){return /^技能値$/i.test(cleanHeading(s));}
  function isWeaponHeading(s=''){return /^武器$/i.test(cleanHeading(s));}

  function addSectionSkill(out,name,value){
    name=String(name||'').trim();
    const v=Number(value);
    if(!name||!Number.isFinite(v)||v<0||v>100||isExcludedRoll(name))return;
    if(out[name]===undefined||v>out[name])out[name]=v;
  }

  function parseSectionLine(line,out){
    const s=String(line||'').trim();
    if(!s)return;
    let m=s.match(/(?:CCB?|1D100)\s*<=\s*(\d{1,3})(?:[^【\[]*)[【\[]\s*([^】\]]+?)\s*[】\]]/i);
    if(m){addSectionSkill(out,m[2],m[1]);return;}
    m=s.match(/^(.{1,60}?)[\s　]*[：:=]?[\s　]*(\d{1,3})(?:\s*%)?$/);
    if(m){addSectionSkill(out,m[1],m[2]);return;}
    m=s.match(/(?:<=|[：:=\s　])(\d{1,3})(?:[^【\[]*)[【\[]\s*([^】\]]+?)\s*[】\]]/);
    if(m)addSectionSkill(out,m[2],m[1]);
  }

  function extractSkillSection(text=''){
    const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);
    const start=lines.findIndex(isSkillHeading);
    if(start<0)return {};
    let end=-1;
    for(let i=start+1;i<lines.length;i++){
      if(isWeaponHeading(lines[i])){end=i;break;}
    }
    if(end<0||end<=start)return {};
    const out={};
    for(let i=start+1;i<end;i++)parseSectionLine(lines[i],out);
    return out;
  }

  window.extractIacharaSkillSection=extractSkillSection;
  if(typeof originalParse==='function'){
    window.parseIacharaFile=function(text,fileName=''){
      const result=originalParse(text,fileName);
      const raw=String(text||'').trim();
      const looksJson=fileName.toLowerCase().endsWith('.json')||/^[\[{]/.test(raw);
      if(!looksJson)result.skills=extractSkillSection(text);
      return result;
    };
  }

  function fitTitle(el){
    if(!el)return;
    el.style.whiteSpace='nowrap';
    el.style.overflow='hidden';
    el.style.textOverflow='ellipsis';
    el.style.maxWidth='100%';
    el.style.width='100%';
    el.style.fontSize='';
    const base=parseFloat(getComputedStyle(el).fontSize)||20;
    let size=base;
    const min=Math.max(10,base*.62);
    while(el.scrollWidth>el.clientWidth&&size>min){
      size-=1;
      el.style.fontSize=size+'px';
    }
  }
  function fitSkillTitles(){['#skillName','#ultimateName'].forEach(s=>fitTitle(document.querySelector(s)));}
  window.fitCoc6SkillTitles=fitSkillTitles;

  document.addEventListener('DOMContentLoaded',()=>{
    fitSkillTitles();
    document.querySelector('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(fitSkillTitles,35));
    document.addEventListener('coc6-kit-generated',()=>setTimeout(fitSkillTitles,0));
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(fitSkillTitles,50));
    window.addEventListener('resize',fitSkillTitles);
  });
})();

(()=>{
  const originalParse=window.parseIacharaFile;

  function cleanHeading(s=''){
    return String(s).trim().replace(/^[■◆●◇○・#\-*\s]+/,'').replace(/[：:]$/,'').trim();
  }
  function isSkillHeading(s=''){return /^技能値$/i.test(cleanHeading(s));}
  function isWeaponHeading(s=''){return /^武器$/i.test(cleanHeading(s));}

  function excludedName(name=''){
    try{if(typeof window.isExcludedSkillRoll==='function'&&window.isExcludedSkillRoll(name))return true;}catch(_){ }
    return /^(正気度ロール|アイデア|幸運|知識|STR\s*[×x*]\s*5|CON\s*[×x*]\s*5|POW\s*[×x*]\s*5|DEX\s*[×x*]\s*5|APP\s*[×x*]\s*5|SIZ\s*[×x*]\s*5|INT\s*[×x*]\s*5|EDU\s*[×x*]\s*5|ダメージ判定)$/i.test(String(name).trim());
  }

  function add(out,name,value){
    name=String(name||'').trim();
    const v=Number(value);
    if(!name||!Number.isFinite(v)||v<0||v>100||excludedName(name))return;
    if(out[name]===undefined||v>out[name])out[name]=v;
  }

  function parseSkillLine(line,out){
    const s=String(line||'').trim();
    if(!s)return;

    // Cocofolia / いあきゃら command style: CCB<=80 【目星】
    let m=s.match(/(?:CCB?|1D100)\s*<=\s*(\d{1,3})(?:[^【\[]*)[【\[]\s*([^】\]]+?)\s*[】\]]/i);
    if(m){add(out,m[2],m[1]);return;}

    // Generic label/value forms used by text exports: 目星:80 / 目星 80 / 目星 80%
    m=s.match(/^(.{1,60}?)[\s　]*[：:=]?[\s　]*(\d{1,3})(?:\s*%)?$/);
    if(m){add(out,m[1],m[2]);return;}

    // Bracket label with a numeric threshold anywhere before it.
    m=s.match(/(?:<=|[：:=\s　])(\d{1,3})(?:[^【\[]*)[【\[]\s*([^】\]]+?)\s*[】\]]/);
    if(m)add(out,m[2],m[1]);
  }

  function skillsBetweenHeadings(text=''){
    const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);
    const start=lines.findIndex(isSkillHeading);
    if(start<0)return null;
    let end=-1;
    for(let i=start+1;i<lines.length;i++){
      if(isWeaponHeading(lines[i])){end=i;break;}
    }
    if(end<0||end<=start)return null;
    const out={};
    for(let i=start+1;i<end;i++)parseSkillLine(lines[i],out);
    return out;
  }

  window.extractIacharaSkillSection=skillsBetweenHeadings;

  if(typeof originalParse==='function'){
    window.parseIacharaFile=function(text,fileName=''){
      const result=originalParse(text,fileName);
      const raw=String(text||'').trim();
      const looksJson=fileName.toLowerCase().endsWith('.json')||/^[\[{]/.test(raw);
      if(!looksJson){
        const section=skillsBetweenHeadings(text);
        // When the official skill section exists, it is the ONLY source of skills.
        if(section!==null)result.skills=section;
        else result.skills={};
      }
      return result;
    };
  }
})();

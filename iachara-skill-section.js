(()=>{
  const originalParse=window.parseIacharaText;
  if(typeof originalParse!=='function')return;

  function normalizeHeading(line=''){
    return String(line)
      .trim()
      .replace(/[【】\[\]「」『』<>＜＞]/g,'')
      .replace(/[■◆◇●○▼▽▶▷★☆※#＃=＝:\-―ー_＿]/g,'')
      .replace(/\s|　/g,'')
      .toLowerCase();
  }

  function isSkillStart(line=''){
    const n=normalizeHeading(line);
    return n==='技能値'||n==='技能'||n==='skill'||n==='skills'||n==='skillvalue'||n==='skillvalues';
  }

  function isWeaponStart(line=''){
    const n=normalizeHeading(line);
    return n==='武器'||n==='武器類'||n==='weapon'||n==='weapons';
  }

  function extractSkillLines(text=''){
    const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);
    const start=lines.findIndex(isSkillStart);
    if(start<0)return [];
    let end=-1;
    for(let i=start+1;i<lines.length;i++){
      if(isWeaponStart(lines[i])){end=i;break;}
    }
    if(end<0)return [];
    return lines.slice(start+1,end).map(s=>s.trim()).filter(Boolean);
  }

  function skillFromLine(line=''){
    const raw=String(line).trim();
    if(!raw)return null;

    // Cocofolia / chat-palette style: CCB<=80 【目星】
    let m=raw.match(/(?:CCB?|1d100)\s*<=\s*(\d{1,3})[^【\[]*[【\[]([^】\]]+)[】\]]/i);
    if(m)return {name:m[2].trim(),value:Number(m[1])};

    // Label-first styles: 目星：80 / 目星 80 / 目星 80%
    m=raw.match(/^(.{1,60}?)[\s　]*[：:=]?[\s　]+(\d{1,3})(?:\s*%)?\s*$/);
    if(m)return {name:m[1].trim(),value:Number(m[2])};

    // Value-first styles occasionally used in exports: 80 目星
    m=raw.match(/^(\d{1,3})(?:\s*%)?[\s　]+(.{1,60})$/);
    if(m)return {name:m[2].trim(),value:Number(m[1])};

    return null;
  }

  function rebuildSkills(text,out){
    out.skills={};
    const lines=extractSkillLines(text);
    for(const line of lines){
      const parsed=skillFromLine(line);
      if(!parsed)continue;
      if(parsed.value<0||parsed.value>100)continue;
      try{
        if(typeof window.isNonSkillName==='function'&&window.isNonSkillName(parsed.name))continue;
      }catch(_){ }
      const name=typeof window.cleanSkillName==='function'?window.cleanSkillName(parsed.name):parsed.name;
      if(!name)continue;
      if(out.skills[name]===undefined||parsed.value>out.skills[name])out.skills[name]=parsed.value;
    }
    out.skillSectionFound=lines.length>0;
    return out;
  }

  window.parseIacharaText=function(text){
    const out=originalParse(text);
    return rebuildSkills(text,out);
  };

  window.extractIacharaSkillSection=extractSkillLines;
})();

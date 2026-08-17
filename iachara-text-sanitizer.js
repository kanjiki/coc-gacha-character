(()=>{
  if(window.__coc6FileTextPatched)return;
  window.__coc6FileTextPatched=true;

  const originalText=File.prototype.text;

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

  function findSection(lines){
    const start=lines.findIndex(isSkillStart);
    if(start<0)return null;
    let end=-1;
    for(let i=start+1;i<lines.length;i++){
      if(isWeaponStart(lines[i])){end=i;break;}
    }
    return end>start?{start,end}:null;
  }

  function skillCommandToPlain(line=''){
    const raw=String(line).trim();
    if(!raw)return line;

    let m=raw.match(/(?:CCB?|1D100)\s*<=\s*(\d{1,3})(?:[^【\[]*)[【\[]\s*([^】\]]+?)\s*[】\]]/i);
    if(m)return `${m[2].trim()}: ${Number(m[1])}`;

    if(/^.{1,60}?[\s　]*[：:=]?[\s　]+\d{1,3}(?:\s*%)?\s*$/.test(raw))return line;

    m=raw.match(/^(\d{1,3})(?:\s*%)?[\s　]+(.{1,60})$/);
    if(m)return `${m[2].trim()}: ${Number(m[1])}`;

    return line;
  }

  function isCommandRoll(line=''){
    const s=String(line).trim();
    return /(?:CCB?|1D100)\s*<=/i.test(s)||/^\s*\d*d\d+(?:[+\-]\d*d\d+)*(?:[+\-]\d+)?/i.test(s);
  }

  function sanitize(raw=''){
    const text=String(raw).replace(/^\uFEFF/,'');
    const trimmed=text.trim();
    if(!trimmed||/^[\[{]/.test(trimmed))return raw;

    const lines=text.split(/\r?\n/);
    const section=findSection(lines);
    if(!section)return raw;

    return lines.map((line,i)=>{
      if(i>section.start&&i<section.end)return skillCommandToPlain(line);
      if(isCommandRoll(line))return '';
      return line;
    }).join('\n');
  }

  File.prototype.text=async function(...args){
    const raw=await originalText.apply(this,args);
    const name=String(this?.name||'').toLowerCase();
    if(name.endsWith('.json'))return raw;
    return sanitize(raw);
  };

  window.sanitizeIacharaTextForSkills=sanitize;
})();

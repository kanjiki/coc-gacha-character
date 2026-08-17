(()=>{
  const SKILL_HEAD=/技能\s*値/i;
  const WEAPON_HEAD=/武器/i;
  const STAT_HEAD=/^(STR|CON|POW|DEX|APP|SIZ|INT|EDU|SAN|HP|MP|正気度|現在正気度|耐久力|マジックポイント)\b/i;

  function cleanHeading(s=''){
    return String(s)
      .trim()
      .replace(/^[\s■◆●◇○・#\-*_=【\[「『]+/,'')
      .replace(/[】\]」』:=：\s]+$/,'')
      .trim();
  }

  function findSection(lines){
    let start=-1,end=-1;
    for(let i=0;i<lines.length;i++){
      const h=cleanHeading(lines[i]);
      if(start<0&&SKILL_HEAD.test(h)){start=i;continue;}
      if(start>=0&&WEAPON_HEAD.test(h)){end=i;break;}
    }
    return {start,end};
  }

  function looksLikeSkillNumericLine(line=''){
    const s=String(line).trim();
    if(!s)return false;
    if(STAT_HEAD.test(s))return false;
    if(/(?:CCB?|1D100)\s*<=/i.test(s))return true;
    if(/[【\[].+?[】\]]/.test(s)&&/\d/.test(s))return true;
    if(/^.{1,60}?[\s　:：=]+\d{1,3}(?:\s*%)?$/.test(s))return true;
    return false;
  }

  function sanitize(text=''){
    const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);
    const {start,end}=findSection(lines);
    if(start<0||end<0||end<=start){
      // 見出しが見つからない形式は壊さず、そのまま従来解析へ渡す。
      return text;
    }
    return lines.map((line,i)=>{
      if(i>start&&i<end)return line;
      if(looksLikeSkillNumericLine(line))return line.replace(/\d/g,'x');
      return line;
    }).join('\n');
  }

  function attach(){
    const input=document.querySelector('#iacharaFile');
    if(!input||input.dataset.skillSanitizer==='1')return;
    input.dataset.skillSanitizer='1';
    input.addEventListener('change',()=>{
      const f=input.files?.[0];
      if(!f||f.__skillSanitizedText)return;
      const originalText=f.text.bind(f);
      f.text=async()=>{
        const raw=await originalText();
        return sanitize(raw);
      };
      f.__skillSanitizedText=true;
    },true);
  }

  window.sanitizeIacharaTextForSkills=sanitize;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);
  else attach();
})();

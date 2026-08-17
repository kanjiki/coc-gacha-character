(()=>{
  const $=s=>document.querySelector(s);

  function cleanHeading(s=''){
    return String(s).trim()
      .replace(/^[\s■◆●◇○・#\-*_=【\[「『＜<]+/,'')
      .replace(/[】\]」』＞>:=：\s]+$/,'')
      .replace(/\s|　/g,'')
      .toLowerCase();
  }
  function isSkillHead(s=''){
    const n=cleanHeading(s);
    return n==='技能値'||n==='技能'||n==='skills'||n==='skill'||n==='skillvalues'||n==='skillvalue';
  }
  function isWeaponHead(s=''){
    const n=cleanHeading(s);
    return n==='武器'||n==='武器類'||n==='weapons'||n==='weapon';
  }
  function excluded(name=''){
    const n=String(name).trim().replace(/\s|　/g,'').toUpperCase();
    if(/^(正気度ロール|アイデア|IDEA|幸運|LUCK|知識|KNOW)$/.test(n))return true;
    if(/^(STR|CON|POW|DEX|APP|SIZ|INT|EDU)[×X*]?5$/.test(n))return true;
    if(/ダメージ判定|DAMAGE/.test(n))return true;
    if(/^\d*D\d+(?:[+\-]\d*D\d+)*(?:[+\-]\d+)?$/i.test(n))return true;
    return false;
  }
  function add(out,name,value){
    name=String(name||'').trim();
    const v=Number(value);
    if(!name||!Number.isFinite(v)||v<0||v>100||excluded(name))return;
    if(out[name]===undefined||v>out[name])out[name]=v;
  }
  function parseSkillLine(line,out){
    const s=String(line||'').trim();
    if(!s)return;

    // Cocofolia / chat-palette style: CCB<=80 【目星】
    let m=s.match(/(?:CCB?|1D100)\s*<=\s*(\d{1,3})(?:[^【\[]*)[【\[]\s*([^】\]]+?)\s*[】\]]/i);
    if(m){add(out,m[2],m[1]);return;}

    // Label:value style: 目星:80 / 目星：80
    m=s.match(/^(.{1,80}?)[\s　]*[：:=][\s　]*(\d{1,3})(?:\s|　|$)/);
    if(m){add(out,m[1],m[2]);return;}

    // Iachara table row: 回避 84 24 0 6 0 0 0
    // The FIRST numeric column is the current/final skill value; later columns are breakdowns.
    m=s.match(/^(.+?)[\s　]+(\d{1,3})(?=(?:[\s　]+\d{1,3})*(?:[\s　]+0|[\s　]*$))/);
    if(m){add(out,m[1],m[2]);return;}

    // Generic fallback: skill name followed by one or more numeric columns.
    m=s.match(/^([^\d]+?)[\s　]+(\d{1,3})(?:[\s　]+\d{1,3})*/);
    if(m){add(out,m[1],m[2]);return;}
  }
  function extractSkills(text=''){
    const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);
    let start=lines.findIndex(isSkillHead);
    let end=-1;
    if(start>=0){
      for(let i=start+1;i<lines.length;i++){if(isWeaponHead(lines[i])){end=i;break;}}
    }
    if(start<0){
      start=lines.findIndex(l=>/(?:CCB?|1D100)\s*<=\s*\d{1,3}.*[【\[][^】\]]+[】\]]/i.test(l));
      if(start>=0)start--;
    }
    if(start<0)return {};
    if(end<0){
      for(let i=Math.max(0,start+1);i<lines.length;i++){if(isWeaponHead(lines[i])){end=i;break;}}
    }
    if(end<0)end=lines.length;
    const out={};
    for(let i=Math.max(0,start+1);i<end;i++)parseSkillLine(lines[i],out);
    return out;
  }

  async function handle(e){
    const input=e.currentTarget;
    const file=input?.files?.[0];
    if(!file)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const status=$('#importStatus');
    if(status){status.textContent='読み込み中…';status.className='import-status';}
    try{
      const text=await file.text();
      let imported={stats:{},skills:{}};
      try{
        if(typeof window.parseIacharaFile==='function') imported=window.parseIacharaFile(text,file.name)||imported;
      }catch(_){ }
      if(!/\.json$/i.test(file.name)) imported.skills=extractSkills(text);
      if(typeof window.assertSixthEdition==='function')window.assertSixthEdition(imported);
      if(typeof window.applyImportedCharacter!=='function')throw new Error('読み込み処理の初期化に失敗しました。');
      const applied=window.applyImportedCharacter(imported);
      const count=Object.keys(imported.skills||{}).length;
      if(status){
        status.textContent=`6版データ読み込み完了：${(applied||[]).join(' / ')} / 技能 ${count}件`;
        status.className='import-status success';
      }
      setTimeout(()=>{
        try{window.COC6SkillClassifier?.refresh?.();}catch(_){ }
      },0);
    }catch(err){
      console.error(err);
      if(status){status.textContent=`読み込み失敗：${err.message}`;status.className='import-status error';}
    }
  }
  function attach(){
    const input=$('#iacharaFile');
    if(!input||input.dataset.importOverride==='1')return;
    input.dataset.importOverride='1';
    input.addEventListener('change',handle,true);
  }
  window.extractIacharaSkillsStrict=extractSkills;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});
  else attach();
})();

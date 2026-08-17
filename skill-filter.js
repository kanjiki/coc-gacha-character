(()=>{
  const original=window.isNonSkillName;

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

    // Derived CoC6 rolls: never treat these as skills.
    if(/^(アイデア|IDEA|幸運|LUCK|知識|KNOW)$/.test(n))return true;

    // Characteristic rolls such as STR×5 / DEX*5 / INT X 5.
    if(/^(STR|CON|POW|DEX|APP|SIZ|INT|EDU)X?5$/.test(n))return true;

    // Damage rolls / damage expressions.
    if(/ダメージ判定|DAMAGE(?:ROLL|CHECK)?/.test(n))return true;
    if(/^\d*D\d+(?:[+\-]\d*D\d+)*(?:[+\-]\d+)?$/i.test(raw.replace(/\s+/g,'')))return true;

    // SAN check is a roll, not a skill. (SAN value itself is already handled as a stat.)
    if(/正気度ロール|SANCHECK|SANROLL/.test(n))return true;

    return false;
  }

  window.isExcludedSkillRoll=isExcludedRoll;
  window.isNonSkillName=function(name=''){
    if(isExcludedRoll(name))return true;
    return typeof original==='function' ? original(name) : false;
  };
})();

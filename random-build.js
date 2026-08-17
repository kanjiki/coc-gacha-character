(()=>{
  const $=s=>document.querySelector(s);
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  const RARITIES=['★★★★','★★★★★','★★★★★★'];
  const DIFFICULTY=['EASY','TECHNICAL'];
  const FEEL=['BURST','SETUP','REACTIVE'];
  const DEPENDENCY=['LOW','MID','HIGH'];
  const RATINGS=['S','A','B','C'];
  const RATING_KEYS=['高難度','周回','AUTO','初心者'];
  let initialized=false;

  function ensureRerollButton(){
    let btn=$('#rerollRandomBtn');
    if(btn)return btn;
    const actions=$('.result-actions');
    if(!actions)return null;
    btn=document.createElement('button');
    btn.id='rerollRandomBtn';
    btn.type='button';
    btn.className='ghost';
    btn.textContent='ランダム部分を引き直す';
    const download=$('#downloadBtn');
    if(download)actions.insertBefore(btn,download);
    else actions.appendChild(btn);
    btn.addEventListener('click',reroll);
    return btn;
  }

  function renderPlaystyle(){
    const block=$('.history-block');
    const label=block?.querySelector('.mini-label');
    const body=$('#historyText');
    if(label)label.textContent='PLAYSTYLE';
    if(!body)return null;
    const state={difficulty:pick(DIFFICULTY),feel:pick(FEEL),dependency:pick(DEPENDENCY)};
    body.innerHTML=`
      <div class="history-line"><b>難易度</b><span>${state.difficulty}</span></div>
      <div class="history-line"><b>操作感</b><span>${state.feel}</span></div>
      <div class="history-line"><b>編成依存</b><span>${state.dependency}</span></div>`;
    return state;
  }

  function renderRatings(){
    const box=$('#ratings');
    if(!box)return null;
    const state={};
    box.innerHTML='';
    RATING_KEYS.forEach(key=>{
      const value=pick(RATINGS);state[key]=value;
      const row=document.createElement('div');row.className='rating-row';row.innerHTML=`<span>${key}</span><strong>${value}</strong>`;box.appendChild(row);
    });
    return state;
  }

  function renderRarity(){
    const rarity=pick(RARITIES);
    const line=$('#rarityLine');if(line)line.textContent=`${rarity} STANDARD`;
    return rarity;
  }

  function reroll(){
    const state={rarity:renderRarity(),playstyle:renderPlaystyle(),rating:renderRatings()};
    window.__coc6RandomBuild=state;
    document.dispatchEvent(new CustomEvent('coc6-random-build-rerolled',{detail:state}));
    return state;
  }

  function init(){
    if(initialized)return;initialized=true;
    ensureRerollButton();
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(reroll,80));
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(ensureRerollButton,0));
  }

  window.COC6RandomBuild={reroll};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

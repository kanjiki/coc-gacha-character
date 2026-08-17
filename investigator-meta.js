(()=>{
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function ensureInputs(){
    if($('#pcOccupation'))return;
    const identity=$('.identity-grid');
    if(!identity)return;
    const box=document.createElement('div');
    box.className='investigator-meta-inputs';
    box.innerHTML=`
      <label>職業<input id="pcOccupation" type="text" maxlength="40" placeholder="例：私立探偵 / 医師 / 大学生"></label>
      <label>プロフィール<textarea id="pcProfile" rows="3" maxlength="220" placeholder="年齢・性格・経歴など、結果画像に載せたい範囲だけ"></textarea></label>
      <label>通過シナリオ<textarea id="pcScenarios" rows="3" maxlength="220" placeholder="例：○○ / △△ / □□"></textarea></label>
      <label>キャラクターメモ<textarea id="pcMemo" rows="3" maxlength="260" placeholder="探索者について残したいメモ"></textarea></label>`;
    identity.insertAdjacentElement('afterend',box);
  }

  function ensureResultPanel(){
    const card=$('#resultCard');if(!card)return;
    if(!$('#resultOccupation')){
      const name=$('.name-block');
      const job=document.createElement('p');job.id='resultOccupation';job.className='result-occupation';
      name?.querySelector('.urban-stickers')?.insertAdjacentElement('beforebegin',job);
    }
    if(!$('#investigatorInfo')){
      const panel=document.createElement('section');
      panel.id='investigatorInfo';panel.className='investigator-info';
      panel.innerHTML=`
        <div class="info-section profile-info"><p class="mini-label">PROFILE</p><p id="resultProfile">—</p></div>
        <div class="info-section scenario-info"><p class="mini-label">SCENARIOS</p><p id="resultScenarios">—</p></div>
        <div class="info-section memo-info"><p class="mini-label">CHARACTER MEMO</p><p id="resultMemo">—</p></div>`;
      card.appendChild(panel);
    }
  }

  function sync(){
    ensureInputs();ensureResultPanel();
    const occupation=$('#pcOccupation')?.value?.trim()||'—';
    const profile=$('#pcProfile')?.value?.trim()||'—';
    const scenarios=$('#pcScenarios')?.value?.trim()||'—';
    const memo=$('#pcMemo')?.value?.trim()||'—';
    const set=(id,v)=>{const el=$(id);if(el)el.textContent=v;};
    set('#resultOccupation',occupation);set('#resultProfile',profile);set('#resultScenarios',scenarios);set('#resultMemo',memo);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    ensureInputs();ensureResultPanel();
    document.querySelector('.name-font-control')?.remove();
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(sync,0));
    document.addEventListener('gacha-visual-theme-change',()=>{ensureResultPanel();document.querySelector('.name-font-control')?.remove();sync();});
  });
})();
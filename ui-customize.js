(()=>{
  const $=s=>document.querySelector(s);
  const root=document.documentElement;
  const card=$('#resultCard');
  const inputColor=$('#themeColor'),hex=$('#themeHex'),resultColor=$('#resultThemeColor');
  const imageScale=$('#imageScale'),imageScaleOut=$('#imageScaleOut'),resetImage=$('#resetImageBtn');
  const stage=$('#characterStage'),img=$('#resultImage');
  const file=$('#pcImage'),feedback=$('#pcImageFeedback'),preview=$('#pcImagePreview'),nameEl=$('#pcImageName'),button=$('#pcImageButton');
  let imageState={x:0,y:0,scale:1};
  let drag=null;
  let kitDirty=false;
  let generatedKit={skillName:'',skillText:'',ultimateName:'',ultimateText:''};
  let customKit={skillName:'',skillText:'',ultimateName:'',ultimateText:''};

  function validHex(v){return /^#[0-9A-F]{6}$/i.test(v||'');}
  function hexToRgb(h){return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
  function mix(a,b,t){return Math.round(a+(b-a)*t);}
  function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('').toUpperCase();}
  function applyTheme(h){
    if(!validHex(h))return;h=h.toUpperCase();
    const {r,g,b}=hexToRgb(h),dark=rgbToHex(mix(r,0,.38),mix(g,0,.38),mix(b,0,.38));
    root.style.setProperty('--accent',h);root.style.setProperty('--accent-rgb',`${r},${g},${b}`);root.style.setProperty('--accent-dark',dark);
    root.style.setProperty('--accent-soft',`rgba(${r},${g},${b},.18)`);root.style.setProperty('--accent-faint',`rgba(${r},${g},${b},.07)`);
    window.__gachaTheme={hex:h,rgb:{r,g,b},dark};
    if(inputColor)inputColor.value=h;if(resultColor)resultColor.value=h;if(hex)hex.value=h;
    document.dispatchEvent(new CustomEvent('gacha-theme-change'));
  }
  function applyImage(){
    root.style.setProperty('--pc-x',`${imageState.x}px`);root.style.setProperty('--pc-y',`${imageState.y}px`);root.style.setProperty('--pc-scale',String(imageState.scale));
    card?.style.setProperty('--pc-x',`${imageState.x}px`);card?.style.setProperty('--pc-y',`${imageState.y}px`);card?.style.setProperty('--pc-scale',String(imageState.scale));
    if(imageScale)imageScale.value=String(Math.round(imageState.scale*100));if(imageScaleOut)imageScaleOut.textContent=`${Math.round(imageState.scale*100)}%`;
  }
  function resetImageState(){imageState={x:0,y:0,scale:1};applyImage();}

  function showSelectedImage(f){
    if(!f)return;
    const url=URL.createObjectURL(f);
    if(preview)preview.src=url;
    if(nameEl)nameEl.textContent=f.name;
    if(feedback)feedback.hidden=false;
    file?.closest('.image-upload')?.classList.add('has-image');
    if(button)button.textContent='画像を変更';
  }
  file?.addEventListener('change',()=>showSelectedImage(file.files?.[0]));

  inputColor?.addEventListener('input',()=>applyTheme(inputColor.value));
  resultColor?.addEventListener('input',()=>applyTheme(resultColor.value));
  hex?.addEventListener('change',()=>{let v=hex.value.trim();if(!v.startsWith('#'))v='#'+v;if(validHex(v))applyTheme(v);else hex.value=inputColor?.value?.toUpperCase()||'#3CB8B0';});
  imageScale?.addEventListener('input',()=>{imageState.scale=Number(imageScale.value)/100;applyImage();});
  resetImage?.addEventListener('click',resetImageState);

  function ratio(){const rect=card?.getBoundingClientRect();return rect&&rect.width?card.offsetWidth/rect.width:1;}
  function canDragImage(){return img&&img.style.display!=='none'&&img.getAttribute('src');}
  if(stage){stage.style.touchAction='none';stage.style.userSelect='none';}
  if(img){img.style.touchAction='none';img.style.userSelect='none';img.style.webkitUserDrag='none';}
  stage?.addEventListener('pointerdown',e=>{
    if(!canDragImage())return;e.preventDefault();stage.setPointerCapture?.(e.pointerId);
    drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,originX:imageState.x,originY:imageState.y,ratio:ratio()};stage.classList.add('is-dragging');
  });
  stage?.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;e.preventDefault();
    imageState.x=Math.max(-320,Math.min(320,drag.originX+(e.clientX-drag.startX)*drag.ratio));
    imageState.y=Math.max(-280,Math.min(460,drag.originY+(e.clientY-drag.startY)*drag.ratio));
    applyImage();
  });
  function end(e){if(!drag||drag.id!==e.pointerId)return;stage?.classList.remove('is-dragging');drag=null;}
  stage?.addEventListener('pointerup',end);stage?.addEventListener('pointercancel',end);
  stage?.addEventListener('wheel',e=>{if(!canDragImage())return;e.preventDefault();imageState.scale=Math.max(.45,Math.min(2,imageState.scale+(e.deltaY<0?.05:-.05)));applyImage();},{passive:false});

  function readKit(){return {skillName:$('#skillName')?.textContent||'',skillText:$('#skillText')?.textContent||'',ultimateName:$('#ultimateName')?.textContent||'',ultimateText:$('#ultimateText')?.textContent||''};}
  function writeKit(v){if($('#skillName'))$('#skillName').textContent=v.skillName;if($('#skillText'))$('#skillText').textContent=v.skillText;if($('#ultimateName'))$('#ultimateName').textContent=v.ultimateName;if($('#ultimateText'))$('#ultimateText').textContent=v.ultimateText;}
  function makeField(parent,labelText,id,max,area=false){
    const label=document.createElement('label');label.textContent=labelText;
    const count=document.createElement('span');count.className='kit-edit-count';label.appendChild(count);
    const input=document.createElement(area?'textarea':'input');input.id=id;input.maxLength=max;if(area)input.rows=2;else input.type='text';label.appendChild(input);parent.appendChild(label);
    const updateCount=()=>count.textContent=`${input.value.length}/${max}`;input.addEventListener('input',updateCount);updateCount();return input;
  }
  function syncKitInputs(v){
    const map={customSkillName:v.skillName,customSkillText:v.skillText,customUltimateName:v.ultimateName,customUltimateText:v.ultimateText};
    Object.entries(map).forEach(([id,value])=>{const el=$('#'+id);if(el){el.value=value;el.dispatchEvent(new Event('input',{bubbles:false}));}});
  }
  function installKitEditor(){
    const editor=$('#resultEditor');if(!editor||$('#customKitEditor'))return;
    const wrap=document.createElement('div');wrap.id='customKitEditor';wrap.className='custom-kit-editor';
    const head=document.createElement('div');head.className='custom-kit-head';const title=document.createElement('strong');title.textContent='SKILL / ULTIMATE EDIT';const reset=document.createElement('button');reset.id='resetGeneratedKit';reset.type='button';reset.className='ghost';reset.textContent='自動生成に戻す';head.append(title,reset);wrap.appendChild(head);
    const grid=document.createElement('div');grid.className='custom-kit-grid';wrap.appendChild(grid);
    const sn=makeField(grid,'SKILL名','customSkillName',24,false),un=makeField(grid,'ULTIMATE名','customUltimateName',24,false),st=makeField(grid,'SKILL効果','customSkillText',90,true),ut=makeField(grid,'ULTIMATE効果','customUltimateText',90,true);
    editor.appendChild(wrap);
    const style=document.createElement('style');style.textContent='.custom-kit-editor{width:100%;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.15)}.custom-kit-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.custom-kit-head strong{font-size:11px;letter-spacing:.12em}.custom-kit-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px}.custom-kit-grid label{display:flex;flex-direction:column;gap:4px;font-size:11px;position:relative}.custom-kit-grid input,.custom-kit-grid textarea{width:100%;box-sizing:border-box;background:#111;color:#f5f5f1;border:1px solid rgba(255,255,255,.2);padding:7px 8px;font:inherit;resize:vertical}.kit-edit-count{position:absolute;right:4px;top:0;opacity:.55;font-size:10px}@media(max-width:800px){.custom-kit-grid{grid-template-columns:1fr}}';document.head.appendChild(style);
    [sn,un,st,ut].forEach(input=>input.addEventListener('input',()=>{customKit={skillName:sn.value,skillText:st.value,ultimateName:un.value,ultimateText:ut.value};kitDirty=true;writeKit(customKit);}));
    reset.addEventListener('click',()=>{kitDirty=false;customKit={...generatedKit};syncKitInputs(generatedKit);writeKit(generatedKit);});
    generatedKit=readKit();customKit={...generatedKit};syncKitInputs(generatedKit);
  }
  function captureGeneratedKit(){
    generatedKit=readKit();
    if(kitDirty){writeKit(customKit);syncKitInputs(customKit);}else{customKit={...generatedKit};syncKitInputs(generatedKit);}
  }
  $('#diagnoseBtn')?.addEventListener('click',()=>{kitDirty=false;},{capture:true});
  document.addEventListener('coc6-kit-generated',()=>setTimeout(captureGeneratedKit,0));

  function init(){applyTheme(inputColor?.value||'#3CB8B0');applyImage();if(file?.files?.[0])showSelectedImage(file.files[0]);installKitEditor();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
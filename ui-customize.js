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
  stage?.addEventListener('pointerdown',e=>{
    if(!canDragImage())return;e.preventDefault();stage.setPointerCapture?.(e.pointerId);
    drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,originX:imageState.x,originY:imageState.y,ratio:ratio()};stage.classList.add('is-dragging');
  });
  stage?.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    imageState.x=Math.max(-320,Math.min(320,drag.originX+(e.clientX-drag.startX)*drag.ratio));
    imageState.y=Math.max(-280,Math.min(460,drag.originY+(e.clientY-drag.startY)*drag.ratio));
    applyImage();
  });
  function end(e){if(!drag||drag.id!==e.pointerId)return;stage?.classList.remove('is-dragging');drag=null;}
  stage?.addEventListener('pointerup',end);stage?.addEventListener('pointercancel',end);
  stage?.addEventListener('wheel',e=>{if(!canDragImage())return;e.preventDefault();imageState.scale=Math.max(.45,Math.min(2,imageState.scale+(e.deltaY<0?.05:-.05)));applyImage();},{passive:false});

  document.addEventListener('DOMContentLoaded',()=>{applyTheme(inputColor?.value||'#3CB8B0');applyImage();if(file?.files?.[0])showSelectedImage(file.files[0]);});
})();
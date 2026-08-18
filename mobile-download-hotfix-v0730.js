(()=>{
  const btn=document.querySelector('#downloadBtn');
  const card=document.querySelector('#resultCard');
  if(!btn||!card)return;

  const isMobile=()=>navigator.maxTouchPoints>0||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||'');
  const safeName=()=>{
    const raw=(document.querySelector('#resultName')?.textContent||'investigator').trim();
    return (raw||'investigator').replace(/[\\/:*?"<>|]/g,'_').slice(0,40);
  };
  const canvasToBlob=canvas=>new Promise((resolve,reject)=>{
    canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNGの生成に失敗しました。')),'image/png');
  });

  btn.addEventListener('click',async e=>{
    if(!isMobile())return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const old=btn.textContent;
    btn.disabled=true;
    btn.textContent='画像を生成中…';

    try{
      if(typeof window.html2canvas!=='function')throw new Error('画像生成ライブラリを読み込めませんでした。');
      const canvas=await window.html2canvas(card,{backgroundColor:null,scale:2,useCORS:true,allowTaint:false,logging:false});
      const blob=await canvasToBlob(canvas);
      const filename=`探索者実装テスト_${safeName()}.png`;
      const file=new File([blob],filename,{type:'image/png'});

      if(navigator.share&&navigator.canShare?.({files:[file]})){
        try{
          await navigator.share({files:[file],title:'探索者実装テスト'});
          return;
        }catch(err){
          if(err?.name==='AbortError')return;
        }
      }

      const url=URL.createObjectURL(blob);
      const opened=window.open(url,'_blank','noopener,noreferrer');
      if(!opened)window.location.href=url;
      setTimeout(()=>URL.revokeObjectURL(url),60000);
    }catch(err){
      console.error(err);
      alert(`画像を保存できませんでした。${err?.message?`\n${err.message}`:''}`);
    }finally{
      btn.disabled=false;
      btn.textContent=old;
    }
  },true);
})();

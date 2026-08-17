(()=>{
  const fileInput=document.querySelector('#pcImage');
  const feedback=document.querySelector('#pcImageFeedback');
  const preview=document.querySelector('#pcImagePreview');
  const name=document.querySelector('#pcImageName');
  const button=document.querySelector('#pcImageButton');
  if(!fileInput)return;

  let objectUrl='';
  function clearPreview(){
    if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}
    if(preview)preview.removeAttribute('src');
    if(name)name.textContent='';
    if(feedback)feedback.hidden=true;
    if(button)button.textContent='画像を選択';
  }

  fileInput.addEventListener('change',()=>{
    const file=fileInput.files?.[0];
    if(!file){clearPreview();return;}
    if(!file.type.startsWith('image/')){clearPreview();return;}
    if(objectUrl)URL.revokeObjectURL(objectUrl);
    objectUrl=URL.createObjectURL(file);
    if(preview)preview.src=objectUrl;
    if(name)name.textContent=file.name;
    if(feedback)feedback.hidden=false;
    if(button)button.textContent='画像を変更';
  });
})();

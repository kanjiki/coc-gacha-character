(()=>{
  const BASE=['STR','CON','POW','DEX','APP','SIZ','INT','EDU'];
  const $=s=>document.querySelector(s);
  function val(k){const n=Number($('#stat_'+k)?.value);return Number.isFinite(n)?n:0;}
  function clamp01(v){return Math.max(0,Math.min(1,v));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function draw(){
    const canvas=$('#spectrumChart'); if(!canvas)return;
    const dpr=Math.max(1,window.devicePixelRatio||1);
    const css=184, size=Math.round(css*dpr);
    canvas.width=size;canvas.height=size;canvas.style.width=css+'px';canvas.style.height=css+'px';
    const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,css,css);
    const cx=css/2,cy=css/2,baseR=43,maxLen=34;
    c.save();c.translate(cx,cy);
    c.strokeStyle='rgba(21,24,23,.12)';c.lineWidth=1;
    [24,43,59,76].forEach(r=>{c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();});
    for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4;c.beginPath();c.moveTo(Math.cos(a)*20,Math.sin(a)*20);c.lineTo(Math.cos(a)*79,Math.sin(a)*79);c.stroke();}
    const anchors=BASE.map(k=>clamp01(Math.min(Math.max(val(k),1),18)/18));
    const bars=72;
    c.lineCap='round';
    for(let i=0;i<bars;i++){
      const p=i/bars*8,idx=Math.floor(p)%8,t=p-Math.floor(p),next=(idx+1)%8;
      const smooth=t*t*(3-2*t),v=lerp(anchors[idx],anchors[next],smooth);
      const a=-Math.PI/2+i*Math.PI*2/bars;
      const inner=baseR,outer=baseR+8+v*maxLen;
      c.strokeStyle=`rgba(35,158,151,${0.38+v*.56})`;c.lineWidth=i%3===0?3:2;
      c.beginPath();c.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);c.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);c.stroke();
    }
    c.fillStyle='#151817';c.textAlign='center';c.textBaseline='middle';c.font='700 8px monospace';
    BASE.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/4,r=84;c.fillText(k,Math.cos(a)*r,Math.sin(a)*r);});
    c.fillStyle='#6e7773';c.font='700 8px monospace';c.fillText('SAN',0,-7);
    c.fillStyle='#151817';c.font='800 18px monospace';const san=$('#stat_SAN')?.value||'—';c.fillText(san,0,9);
    c.restore();
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(draw,0));
    window.addEventListener('resize',()=>{if(!$('#resultWrap')?.hidden)draw();});
  });
})();

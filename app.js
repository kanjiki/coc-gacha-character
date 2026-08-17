const STAT_KEYS=['STR','CON','POW','DEX','APP','SIZ','INT','EDU','SAN','HP','MP','MOV'];
const QUESTIONS=[
 {q:'戦闘になったら？',a:[['先に殴る','atk'],['仲間を守る','tank'],['敵を観察する','control'],['戦闘を避ける','support']]},
 {q:'仲間がピンチ。',a:[['危険でも助ける','support'],['敵を先に倒す','atk'],['最適解を探す','control'],['状況をひっくり返す','special']]},
 {q:'探索で一番頼られるのは？',a:[['知識・推理','control'],['交渉','support'],['身体能力','atk'],['勘と奇策','special']]},
 {q:'この探索者が卓にいると？',a:[['安定する','support'],['話が進む','control'],['戦闘が楽','atk'],['予想外が起きる','special']]},
 {q:'弱点に近いものは？',a:[['打たれ弱い','glass'],['火力不足','support'],['遅い','tank'],['好奇心','special']]},
 {q:'得意な勝ち方は？',a:[['正面突破','atk'],['準備と情報','control'],['連携','support'],['一発逆転','special']]},
 {q:'高難度で任せたい仕事は？',a:[['削り切る','atk'],['耐える','tank'],['バフ・回復','support'],['ギミック処理','control']]},
 {q:'ゲーム内での印象は？',a:[['分かりやすく強い','atk'],['地味だが必須','support'],['使いこなすと強い','control'],['唯一無二で変','special']]}
];
let uploadedData='';

const statsGrid=document.querySelector('#statsGrid');
STAT_KEYS.forEach(k=>{
 const label=document.createElement('label');label.textContent=k;
 const i=document.createElement('input');i.type='number';i.id='stat_'+k;i.min='0';i.max=k==='MOV'?20:99;i.placeholder='—';
 label.appendChild(i);statsGrid.appendChild(label);
});

const qWrap=document.querySelector('#questions');
QUESTIONS.forEach((item,idx)=>{
 const box=document.createElement('div');box.className='question';
 box.innerHTML=`<p>Q${idx+1}. ${item.q}</p>`;
 item.a.forEach(([text,val],ai)=>{
   const l=document.createElement('label');
   l.innerHTML=`<input type="radio" name="q${idx}" value="${val}" ${ai===0?'checked':''}> ${text}`;
   box.appendChild(l);
 });
 qWrap.appendChild(box);
});

document.querySelector('#pcImage').addEventListener('change',e=>{
 const f=e.target.files?.[0]; if(!f)return;
 const r=new FileReader();r.onload=()=>uploadedData=r.result;r.readAsDataURL(f);
});

function answers(){return QUESTIONS.map((_,i)=>document.querySelector(`input[name=q${i}]:checked`)?.value||'control')}
function scoreAnswers(vals){const s={atk:0,tank:0,support:0,control:0,special:0,glass:0};vals.forEach(v=>s[v]=(s[v]||0)+1);return s}
function getStats(){const o={};STAT_KEYS.forEach(k=>o[k]=document.querySelector('#stat_'+k).value||'—');return o}
function roleFrom(s,st){
 if(s.control>=Math.max(s.atk,s.support,s.tank))return ['ANALYST','BACKLINE'];
 if(s.support>=Math.max(s.atk,s.tank))return ['SUPPORTER','BACKLINE'];
 if(s.tank>s.atk)return ['GUARDIAN','FRONTLINE'];
 return ['STRIKER','FRONTLINE'];
}
function attributeFrom(s,st){
 if(s.special>=3)return 'ANOMALY';
 const pow=Number(st.POW)||0, app=Number(st.APP)||0, intv=Number(st.INT)||0, str=Number(st.STR)||0;
 if(pow>=75)return 'ARCANE'; if(intv>=75)return 'LOGIC'; if(app>=75)return 'CHARM'; if(str>=75)return 'IMPACT'; return 'VOID';
}
function rarityFrom(s,st){
 const nums=['STR','CON','POW','DEX','APP','SIZ','INT','EDU'].map(k=>Number(st[k])||0).filter(Boolean);
 const avg=nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:50;
 if(s.special>=3||avg>=75)return ['★★★★★★','LIMITED'];
 if(avg>=60)return ['★★★★★','STANDARD'];
 return ['★★★★','STANDARD'];
}
function tagsFrom(s,role){
 const tags=[];
 if(role==='ANALYST')tags.push('ANALYSIS'); if(role==='SUPPORTER')tags.push('SUPPORT'); if(role==='GUARDIAN')tags.push('DEFENSE'); if(role==='STRIKER')tags.push('DAMAGE');
 if(s.control>=2)tags.push('CONTROL'); if(s.special>=2)tags.push('SPECIAL'); if(s.atk>=2)tags.push('BURST'); if(s.support>=2)tags.push('UTILITY');
 return [...new Set(tags)].slice(0,3);
}
function skillSet(role,attr){
 const map={
 ANALYST:['《まだ結論を出すには早い》','対象を解析し、防御・抵抗を低下。情報獲得時に追加効果。','《全部つながった》','敵全体を解析し、味方全体の弱点攻撃とギミック処理効率を強化。'],
 SUPPORTER:['《ここは任せて》','味方単体の不利状態を軽減し、行動効率を上昇。','《全員、まだ動ける》','味方全体を立て直し、一定時間支援効果を増幅。'],
 GUARDIAN:['《ここから先は通さない》','自身に防御強化と挑発を付与。','《まだ倒れる時間じゃない》','味方全体への被害を肩代わりし、耐久性能を大幅強化。'],
 STRIKER:['《先に終わらせる》','敵単体へ高威力攻撃。条件達成で追撃。','《これで終わり》','蓄積した有利効果を消費し、敵単体へ極大ダメージ。']};
 return map[role];
}
function ratings(s){
 const hi=Math.min(5,2+s.control+s.support>4?5:2+s.control);
 return {高難度:hi>=5?'S':hi>=4?'A':'B',周回:s.atk>=3?'S':s.atk>=2?'A':'B',AUTO:s.special>=3?'C':s.control>=3?'B':'A',初心者:s.special>=3?'C':s.control>=3?'B':'A'};
}
function render(){
 const st=getStats(), s=scoreAnswers(answers()), [role,pos]=roleFrom(s,st), attr=attributeFrom(s,st), [stars,banner]=rarityFrom(s,st), tags=tagsFrom(s,role), skills=skillSet(role,attr), rates=ratings(s);
 const name=document.querySelector('#pcName').value.trim()||'無名の探索者';
 const en=document.querySelector('#pcNameEn').value.trim()||name.toUpperCase();
 resultName.textContent=name;resultNameEn.textContent=en;roleText.textContent=role;positionText.textContent=pos;attributeText.textContent=attr;tagsText.textContent=tags.join(' / ');rarityLine.textContent=`${stars} ${banner} // ${role}`;bgWord.textContent=role;
 resultStats.innerHTML='';STAT_KEYS.forEach(k=>{const d=document.createElement('div');d.innerHTML=`<span>${k}</span><strong>${st[k]}</strong>`;resultStats.appendChild(d)});
 ratings.innerHTML='';Object.entries(rates).forEach(([k,v])=>{const d=document.createElement('div');d.className='rating-row';d.innerHTML=`<span>${k}</span><strong>${v}</strong>`;ratings.appendChild(d)});
 skillName.textContent=skills[0];skillText.textContent=skills[1];ultimateName.textContent=skills[2];ultimateText.textContent=skills[3];
 historyText.innerHTML=`<div class="history-line"><b>VER 1.0</b><span>${stars} ${role}として実装</span></div><div class="history-line"><b>VER 1.1</b><span>${tags[0]||'SPECIAL'}系ギミック対応</span></div><div class="history-line"><b>CURRENT</b><span>${rates.高難度==='S'?'高難度環境で採用率上昇':'特定編成で継続運用'}</span></div>`;
 if(uploadedData){resultImage.src=uploadedData;resultImage.style.display='block';imagePlaceholder.hidden=true}else{resultImage.style.display='none';imagePlaceholder.hidden=false}
 inputPanel.hidden=true;resultWrap.hidden=false;window.scrollTo({top:0,behavior:'smooth'});
}

diagnoseBtn.addEventListener('click',render);
backBtn.addEventListener('click',()=>{resultWrap.hidden=true;inputPanel.hidden=false});
downloadBtn.addEventListener('click',async()=>{
 const card=document.querySelector('#resultCard');
 if(!window.html2canvas){alert('画像生成ライブラリの読み込みに失敗しました。');return}
 const canvas=await html2canvas(card,{scale:2,backgroundColor:'#f5f7f5',useCORS:true});
 const a=document.createElement('a');a.download=`coc-gacha-${(document.querySelector('#pcName').value||'result').replace(/\s+/g,'-')}.png`;a.href=canvas.toDataURL('image/png');a.click();
});

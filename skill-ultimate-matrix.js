(()=>{
  const $=s=>document.querySelector(s);
  const CATS=['COMBAT','INVESTIGATION','KNOWLEDGE','SOCIAL','MEDICAL','TECHNICAL','MOBILITY','OCCULT_CREATIVE'];

  const MATRIX={
    STRIKER:{
      COMBAT:{skill:['《仕留めるなら今》','敵単体へ高威力攻撃。会心発生時に追加ダメージ。'],ult:['《これで終わり》','敵単体へ極大ダメージ。対象のHPが低いほど威力が上昇する。']},
      INVESTIGATION:{skill:['《そこ、見えてる》','敵単体をマーキングし、弱点攻撃として扱いやすくする。'],ult:['《逃げ道まで見えている》','敵1体の弱点を完全露出。一定時間、味方の攻撃も弱点攻撃として扱う。']},
      KNOWLEDGE:{skill:['《対処法は知ってる》','敵種を識別し、対象への特効ダメージを獲得する。'],ult:['《理屈が分かれば壊せる》','敵種に最適な攻撃特性へ変換し、耐性を一部無視して大ダメージ。']},
      SOCIAL:{skill:['《こっちを見ろ》','敵を動揺させ、防御を低下。自身への標的率を上昇させる。'],ult:['《その顔、もう余裕ないね》','敵全体を動揺させ行動を遅延し、主対象へ高威力攻撃。']},
      MEDICAL:{skill:['《急所はそこ》','生体対象の防御を一部無視。撃破時に自身を小回復する。'],ult:['《構造が分かれば十分》','敵単体の急所を完全特定。防御を大きく無視する極大攻撃。']},
      TECHNICAL:{skill:['《装甲ごと抜く》','シールド・装甲へ高い破壊性能を持つ攻撃。'],ult:['《システムごと落とす》','敵のシールドを大幅破壊し、破壊量に応じた追加ダメージ。']},
      MOBILITY:{skill:['《先に動いた方が勝ち》','未行動の敵への初撃が強化され、自身の行動順を前進させる。'],ult:['《視界の外から》','即時再行動し、次の攻撃を大幅強化。敵の反応行動を受けにくい。']},
      OCCULT_CREATIVE:{skill:['《普通じゃ足りない》','特殊ゲージを消費し、追加ダメージと異常効果を与える。'],ult:['《禁じ手くらいが丁度いい》','自身のリソースを大きく消費し、敵全体へ極大特殊ダメージ。']}
    },
    GUARDIAN:{
      COMBAT:{skill:['《まず俺を越えてみろ》','自身へ挑発と防御強化。被弾時に反撃する。'],ult:['《全部まとめて受ける》','味方への攻撃を一定時間肩代わりし、被弾のたびに反撃する。']},
      INVESTIGATION:{skill:['《次に来るのは分かってる》','敵の次行動を予測し、味方全体の被ダメージを軽減する。'],ult:['《その手はもう読んだ》','敵の次行動を完全開示し、味方全体へ大幅な被ダメージ軽減。']},
      KNOWLEDGE:{skill:['《対策は済んでいる》','敵の攻撃特性に応じた耐性を味方へ付与する。'],ult:['《想定内だ》','敵の主要属性・状態異常に対する高耐性を味方全体へ付与。']},
      SOCIAL:{skill:['《相手なら俺がする》','敵の標的を自身へ誘導し、味方の被標的率を下げる。'],ult:['《全員こっちを向け》','敵全体を強制的に自身へ固定し、味方への直接攻撃を抑制する。']},
      MEDICAL:{skill:['《まだ倒れるな》','被弾時に自己回復し、HP低下時は回復量が増加する。'],ult:['《死なせるつもりはない》','一定時間、味方が戦闘不能になる攻撃を1度だけ耐えさせる。']},
      TECHNICAL:{skill:['《防壁展開》','味方単体へシールドを付与し、固定ダメージを軽減する。'],ult:['《防護システム、最大出力》','味方全体へ大型シールドと状態異常耐性を付与する。']},
      MOBILITY:{skill:['《当たらなければいい》','回避率を上げ、回避成功時に味方への攻撃を無効化する。'],ult:['《捕まえられるものなら》','味方全体へ複数回の回避補助を付与し、行動速度も上昇させる。']},
      OCCULT_CREATIVE:{skill:['《ここから先は結界内》','精神・特殊攻撃への耐性を高め、異常効果を軽減する。'],ult:['《境界を閉じる》','味方全体へ強力な結界を展開し、特殊・精神・異常ダメージを大幅軽減。']}
    },
    SUPPORTER:{
      COMBAT:{skill:['《合わせるよ》','味方単体の攻撃に追撃を付与し、会心性能を補助する。'],ult:['《一斉に行こう》','味方全体へ追撃効果を付与し、攻撃性能を一時的に上昇。']},
      INVESTIGATION:{skill:['《そこが弱い》','敵の弱点を共有し、味方の命中と弱点攻撃性能を上げる。'],ult:['《全部見つけた》','敵全体の弱点情報を共有し、味方全体の命中・会心・弱点性能を強化。']},
      KNOWLEDGE:{skill:['《今必要なのはこれ》','編成と敵情報に応じて、攻撃・防御・速度のいずれかを強化する。'],ult:['《最適解を配る》','味方それぞれに適した異なる強化効果を自動付与する。']},
      SOCIAL:{skill:['《まだやれるでしょ》','味方単体の行動順を前進させ、攻撃力を上昇する。'],ult:['《全員、今！》','味方全体の行動順を前進させ、攻撃力と速度を大幅上昇。']},
      MEDICAL:{skill:['《処置する、動かないで》','味方単体を回復し、不利状態を1つ解除する。'],ult:['《全員まだ動ける》','味方全体を大回復し、不利状態解除と継続回復を付与する。']},
      TECHNICAL:{skill:['《調整しておいた》','味方へシールドまたはリソース回復を付与し、スキル回転を補助する。'],ult:['《リソース再配分》','味方全体の特殊ゲージを回復し、スキル再使用までの負担を軽減する。']},
      MOBILITY:{skill:['《こっち、道がある》','味方単体の速度と回避を上げ、被標的率を低下させる。'],ult:['《退路は確保した》','味方全体の速度・回避を上昇し、敵から狙われにくくする。']},
      OCCULT_CREATIVE:{skill:['《少しだけ貸して》','味方の特殊ゲージを補充し、異常付与性能を高める。'],ult:['《儀式は整った》','味方全体へ特殊ゲージを供給し、異常・特殊効果の成功率を大幅強化。']}
    },
    ANALYST:{
      COMBAT:{skill:['《守りが甘い》','敵単体を戦闘解析し、防御と物理耐性を低下させる。'],ult:['《戦闘データ、共有》','敵全体の防御を低下し、味方から受ける会心・弱点ダメージを増加させる。']},
      INVESTIGATION:{skill:['《見落とすと思った？》','敵の弱点と次行動の一部を開示し、ギミック処理を補助する。'],ult:['《全部つながった》','敵の弱点・耐性・次行動・主要ギミックを完全開示し、全耐性を低下させる。']},
      KNOWLEDGE:{skill:['《分類できれば対処できる》','敵種を解析し、対応する特効タグを味方へ付与する。'],ult:['《体系化完了》','敵全体へ種別特効タグを付与し、味方全体の対応ダメージを増加させる。']},
      SOCIAL:{skill:['《次に何をするか分かる》','敵の心理を読み、攻撃力低下と行動遅延を与える。'],ult:['《その選択肢はもう潰した》','敵全体の攻撃力・速度・命中を低下し、行動順を大きく遅延させる。']},
      MEDICAL:{skill:['《そこが壊れている》','生体を解析し、回復効率を低下させ弱点部位を付与する。'],ult:['《生体解析、完了》','敵全体へ回復阻害・弱点部位・被ダメージ増加を付与する。']},
      TECHNICAL:{skill:['《権限を借りるよ》','敵の強化効果を1つ解除し、シールドへ追加ダメージを与える。'],ult:['《管理権限、奪取》','敵全体の強化を解除し、シールドを大幅削減して行動を遅延させる。']},
      MOBILITY:{skill:['《動線は読めてる》','隠密・回避系効果を看破し、味方の命中と先制性能を上げる。'],ult:['《逃走経路まで解析済み》','敵全体の隠密を解除し、味方全体を行動順前進。次の攻撃の命中を大幅補助する。']},
      OCCULT_CREATIVE:{skill:['《不可解でも解析はできる》','特殊ギミックを解析し、敵の異常耐性を低下させる。'],ult:['《不可解を可視化する》','特殊ギミックを解除または弱体化し、敵全体の異常・特殊耐性を大幅低下させる。']}
    }
  };

  const FALLBACK={
    STRIKER:{skill:['《先に終わらせる》','敵単体へ高威力攻撃。'],ult:['《これで終わり》','敵単体へ極大ダメージ。']},
    GUARDIAN:{skill:['《ここから先は通さない》','自身に防御強化と挑発を付与。'],ult:['《まだ倒れる時間じゃない》','味方全体への被害を肩代わりする。']},
    SUPPORTER:{skill:['《ここは任せて》','味方単体を支援し、行動効率を上昇。'],ult:['《全員、まだ動ける》','味方全体を立て直し、支援効果を増幅。']},
    ANALYST:{skill:['《まだ結論を出すには早い》','対象を解析し、防御・抵抗を低下。'],ult:['《全部つながった》','敵全体を解析し、味方のギミック処理を強化。']}
  };

  function tier(value){
    const v=Number(value);
    if(!Number.isFinite(v))return {key:'UNKNOWN',label:'技能値未取得',bonus:0};
    if(v>=100)return {key:'EXCEPTIONAL',label:'EXCEPTIONAL',bonus:35};
    if(v>=85)return {key:'MASTER',label:'MASTER',bonus:25};
    if(v>=70)return {key:'EXPERT',label:'EXPERT',bonus:15};
    if(v>=50)return {key:'TRAINED',label:'TRAINED',bonus:8};
    return {key:'BASE',label:'BASE',bonus:0};
  }

  function favoriteMeta(){
    try{return window.COC6SkillClassifier?.getFavoriteSkillMeta?.()||window.__coc6FavoriteSkill||null;}catch(_){return null;}
  }

  function getKit(role,meta){
    role=String(role||'ANALYST').toUpperCase();
    const cat=CATS.includes(meta?.category)?meta.category:null;
    const base=(cat&&MATRIX[role]?.[cat])||FALLBACK[role]||FALLBACK.ANALYST;
    return {role,category:cat||'UNCLASSIFIED',meta:meta||null,tier:tier(meta?.value),skill:base.skill,ult:base.ult};
  }

  function decorate(text,meta,t){
    if(!meta?.name)return text;
    const category=meta.category&&meta.category!=='UNCLASSIFIED'?` / ${meta.category.replace('_',' / ')}`:'';
    const power=t.bonus?` / ${t.label} +${t.bonus}%`:` / ${t.label}`;
    return `${text} FAVORITE「${meta.name}」${category}${power}`;
  }

  function apply(){
    const role=$('#roleText')?.textContent?.trim()||'ANALYST';
    const meta=favoriteMeta();
    const kit=getKit(role,meta);
    const sn=$('#skillName'),st=$('#skillText'),un=$('#ultimateName'),ut=$('#ultimateText');
    if(sn)sn.textContent=kit.skill[0];
    if(st)st.textContent=decorate(kit.skill[1],meta,kit.tier);
    if(un)un.textContent=kit.ult[0];
    if(ut)ut.textContent=decorate(kit.ult[1],meta,kit.tier);
    window.__coc6GeneratedKit=kit;
    document.dispatchEvent(new CustomEvent('coc6-kit-generated',{detail:kit}));
  }

  window.COC6SkillKit={MATRIX,CATEGORIES:CATS,tier,getKit,apply};

  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(apply,10));
    document.addEventListener('coc6-skill-classification-change',()=>{
      if(!$('#resultWrap')?.hidden)setTimeout(apply,0);
    });
    document.addEventListener('change',e=>{
      if(e.target?.id==='favoriteSkill'&&!$('#resultWrap')?.hidden)setTimeout(apply,0);
    });
  });
})();

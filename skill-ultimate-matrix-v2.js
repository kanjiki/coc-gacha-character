(()=>{
  const $=s=>document.querySelector(s);
  const CATS=['COMBAT','INVESTIGATION','KNOWLEDGE','SOCIAL','MEDICAL','TECHNICAL','MOBILITY','OCCULT_CREATIVE'];
  const RULES={
    role:{STRIKER:'DAMAGE',GUARDIAN:'PROTECT',SUPPORTER:'EMPOWER',ANALYST:'EXPOSE'},
    category:{COMBAT:'PRESSURE',INVESTIGATION:'REVEAL',KNOWLEDGE:'ADAPT',SOCIAL:'TEMPO',MEDICAL:'VITAL',TECHNICAL:'SYSTEM',MOBILITY:'TIMING',OCCULT_CREATIVE:'RULEBREAK'},
    ultimate:'ULTIMATE must add a new state/rule; not merely bigger AoE or numbers.'
  };
  const M={
    STRIKER:{
      COMBAT:{skill:['《キルライン》','敵単体へ高威力攻撃。「傷口」1段階を付与。傷口中の敵へ再度命中すると追撃。','ダメージ'],ult:['《ノー・セカンドチャンス》','敵単体を「処刑圏」にする。処刑圏中は味方の攻撃でも傷口が起爆し、起爆回数に応じて終撃が強化される。','終撃倍率']},
      INVESTIGATION:{skill:['《死角指定》','敵1体へ「露見」を付与。露見中は次に受ける攻撃が弱点扱いになり、攻撃後に解除。','弱点ダメージ'],ult:['《逃げ道はもうない》','敵1体の全弱点を一定時間固定露出。露出中に異なる味方が攻撃するたび「包囲」が蓄積し、最大時に追加行動を得る。','包囲ボーナス']},
      KNOWLEDGE:{skill:['《特効解》','敵種を判別し、その敵に最も有効な特効タグを自身へ付与。','特効倍率'],ult:['《解法はひとつ》','敵の主要耐性1種を「誤答」に変換。一定時間、その耐性は逆に弱点として扱われる。','耐性反転量']},
      SOCIAL:{skill:['《その判断、遅い》','敵単体へ「迷い」を付与。迷い中は行動が遅れ、次に受ける攻撃の被ダメージが上昇。','被ダメ増加'],ult:['《選ぶ時間は終わった》','敵全体に「強制択」を付与。次の行動時、攻撃か防御のどちらか一方しか選べず、選ばなかった側が大きく低下する。','低下量']},
      MEDICAL:{skill:['《裂創判定》','敵へ「損傷」を付与。損傷中にHPが一定割合減るたび追加ダメージ。','追加ダメージ'],ult:['《致命域》','敵1体を「重症」にする。重症中は回復不能になり、HP閾値を割るたびSTRIKERが即時追撃する。','追撃倍率']},
      TECHNICAL:{skill:['《ARMOR BREAK》','シールド・装甲値を大きく削り、「破損」状態を付与。','シールド破壊'],ult:['《ROOT / SHUTDOWN》','敵の防御システムを停止。一定時間シールド再展開を封じ、破損したシールド量を終撃ダメージへ変換する。','変換倍率']},
      MOBILITY:{skill:['《先手権》','未行動の敵への攻撃後、自身の行動順を前進。「先手」を獲得。','行動前進'],ult:['《ブラインドサイド》','即時に敵の背後フェーズへ移行。次の1回だけ敵の反応・カウンター・回避を無効化し、攻撃後に再行動できる。','再行動火力']},
      OCCULT_CREATIVE:{skill:['《禁則外》','自身の特殊リソースを消費して「異相」攻撃。通常耐性を参照せず特殊ダメージを与える。','特殊ダメージ'],ult:['《幕外の一手》','一定時間「禁則領域」を展開。敵味方双方の通常ルール1つを無効化し、自身だけがその制約を受けない。','領域倍率']}
    },
    GUARDIAN:{
      COMBAT:{skill:['《迎撃線》','自身へ「迎撃」を付与。味方が狙われた時に割り込み、攻撃を肩代わりして反撃する。','反撃ダメージ'],ult:['《全弾こちらへ》','一定時間すべての単体攻撃を強制的に自身へ集約。被弾ごとに「反撃圧」を蓄積し、終了時に一斉反撃。','反撃圧倍率']},
      INVESTIGATION:{skill:['《予備動作確認》','敵の次行動を1つ表示し、その行動から味方全体が受けるダメージを軽減。','軽減率'],ult:['《その手は消した》','公開済みの敵行動を1つ「無効手」に指定。その行動は発動しても効果を持たず、敵の行動ゲージだけ消費される。','無効後軽減']},
      KNOWLEDGE:{skill:['《対策表》','敵の主要攻撃属性に対応する耐性を味方全体へ付与。','耐性量'],ult:['《完全対策プロトコル》','一定時間、最初に受けた各種デバフ・属性攻撃を記録し、2回目以降は自動的に大幅軽減する。','学習軽減率']},
      SOCIAL:{skill:['《視線誘導》','敵1体を自身へ誘導し、他の味方への標的率を大きく低下。','誘導強度'],ult:['《敵意管理》','敵全体のヘイトテーブルを書き換え、一定時間GUARDIAN以外を直接指定できなくする。味方への範囲被害も軽減。','範囲軽減']},
      MEDICAL:{skill:['《まだ立てる》','自身または味方1人へ「応急固定」を付与。致死ダメージ時にHP1で耐え、直後に小回復。','回復量'],ult:['《トリアージ・ゼロ》','味方全体へ1回限りの「生存優先」を付与。戦闘不能になる攻撃を受けると、その被害を無効化し行動順を後退させる。','復帰HP']},
      TECHNICAL:{skill:['《BARRIER ON》','味方1人へシールド。シールドが残っている間、状態異常耐性上昇。','シールド量'],ult:['《FORTRESS MODE》','戦場に防護ノードを展開。ノード存続中は味方へのダメージの一部をノードが吸収し、破壊時に全体へ追加シールド。','吸収量']},
      MOBILITY:{skill:['《割り込み回避》','味方が攻撃対象になった時、1回だけ割り込み回避判定を行い、成功時その攻撃を無効化。','回避補正'],ult:['《安全圏再配置》','味方全体の位置・行動順を再配置し、敵の次範囲攻撃の対象判定から外す。','行動前進']},
      OCCULT_CREATIVE:{skill:['《境界線》','味方へ「境界」付与。精神・特殊・異常ダメージを軽減。','特殊軽減'],ult:['《閉鎖領域》','一定時間、外部から新たな状態異常・強制移動・精神干渉が侵入できない結界を展開する。','結界耐久']}
    },
    SUPPORTER:{
      COMBAT:{skill:['《追撃許可》','味方1人へ「追撃権」を付与。対象が攻撃するとSUPPORTERが追加攻撃。','追撃倍率'],ult:['《FOCUS FIRE》','敵1体を集中目標に指定。味方が順番に攻撃するたび連携倍率が上昇し、最後の攻撃者へ追加行動を与える。','連携倍率']},
      INVESTIGATION:{skill:['《弱点共有》','敵の弱点情報を味方1人へ共有。対象の次攻撃は命中補正と弱点補正を得る。','弱点補正'],ult:['《全員、そこを見る》','敵へ「共有観測」を付与。味方が異なる攻撃手段を当てるたび新しい弱点タグを一時生成する。','生成弱点倍率']},
      KNOWLEDGE:{skill:['《適材配分》','味方1人の役割を判定し、火力・防御・速度・回復のうち最適な1種を強化。','最適バフ量'],ult:['《編成最適化》','味方全員へ異なる専用バフを自動配布。同種バフは重複せず、編成の欠けた役割を優先補完する。','専用バフ量']},
      SOCIAL:{skill:['《今、君の番》','味方1人の行動順を前進し、次行動の消費リソースを軽減。','行動前進'],ult:['《テンポを奪う》','味方全体の行動順を再整列し、敵の最速行動より前へ割り込ませる。ただし各味方1回まで。','前進量']},
      MEDICAL:{skill:['《一次処置》','味方1人を回復し、不利状態を1つ解除。解除成功時に「安定」を付与。','回復量'],ult:['《リカバリー・ポイント》','味方全体のHPと状態を「1ターン前の記録値」へ巻き戻す。戦闘不能者は対象外。','巻戻し回復上限']},
      TECHNICAL:{skill:['《リソース転送》','味方1人へSP/ゲージを供給し、スキル再使用負担を軽減。','供給量'],ult:['《OVERDRIVE BUS》','一定時間、味方がスキルを使うたび共有ゲージへ還元。共有ゲージ満タン時、次の味方スキル消費を0にする。','還元率']},
      MOBILITY:{skill:['《最短経路》','味方1人の速度と回避を上げ、次の移動/行動後に小さく再前進。','速度補正'],ult:['《全員、離脱線へ》','敵の次行動を基準に味方全員を安全順序へ並べ替え、各自に1回の回避保証を付与。','回避保証補正']},
      OCCULT_CREATIVE:{skill:['《媒介》','味方1人の特殊効果成功率を上げ、異常蓄積を補助。','特殊成功率'],ult:['《共鳴儀式》','味方が付与した異なる特殊状態を「共鳴」へ統合。状態数に応じて追加効果が変化する。','共鳴倍率']}
    },
    ANALYST:{
      COMBAT:{skill:['《ガードポイント》','敵1体へ「防御欠陥」を付与。次に特定タイプの攻撃を受けると防御が追加低下。','防御低下'],ult:['《BREAK WINDOW》','敵全体の欠陥を同時起動し、一定時間「ブレイク窓」を生成。窓中は弱点・会心系の効果が増幅される。','ブレイク倍率']},
      INVESTIGATION:{skill:['《盲点抽出》','敵の弱点または次行動のどちらか1つを開示し、「観測」1段階を付与。','観測補正'],ult:['《全景解析》','蓄積した観測を消費し、敵の主要ギミックと弱点を完全開示。「次行動開示」は行わず、代わりに攻略対象へ専用弱点を生成。','専用弱点倍率']},
      KNOWLEDGE:{skill:['《分類コード》','敵種を分類し、味方へ対応特効タグを付与。','特効倍率'],ult:['《再分類》','敵1体の種別タグを一定時間別カテゴリとして扱う。味方の既存特効を強制的に適用できる。','再分類特効']},
      SOCIAL:{skill:['《思考遅延》','敵1体へ「迷い」を付与し、攻撃力低下と小さな行動遅延。','遅延量'],ult:['《選択肢封鎖》','敵全体の次行動候補から最も危険な1種を封鎖。残った行動からAIが選択する。','封鎖後弱体量']},
      MEDICAL:{skill:['《損傷マッピング》','敵へ弱点部位を1つ生成。その部位を攻撃した味方だけ追加ダメージ。','部位倍率'],ult:['《オープン・ケース》','敵の損傷部位を一定時間固定し、部位への攻撃回数に応じて「崩壊」段階を蓄積。最大で行動阻害。','崩壊効率']},
      TECHNICAL:{skill:['《ACCESS DENIED》','敵の強化1つを解除し、解除成功時に「侵入権限」を獲得。','解除後弱体量'],ult:['《ADMIN TAKEOVER》','侵入権限を消費して敵システムを一時掌握。バフ再付与とシールド再展開のどちらかを封印する。','封印時間']},
      MOBILITY:{skill:['《軌道予測》','敵の回避・隠密を看破し、味方1人へ命中補正と先制補正。','命中補正'],ult:['《経路封鎖》','敵の移動・回避候補を限定し、一定時間「逃走不能」にする。逃走不能中の敵は行動後に追加遅延。','追加遅延']},
      OCCULT_CREATIVE:{skill:['《異常定義》','特殊ギミック1つを解析し、「既知」に変換。既知になった効果への異常耐性を低下。','異常耐性低下'],ult:['《不可解を規則化する》','戦場の特殊ルール1つを「解析済み規則」として固定。以後そのルールによる不確定効果を味方側に有利な結果へ寄せる。','規則補正']}
    }
  };
  const FALLBACK={
    STRIKER:{skill:['《先に終わらせる》','敵単体へ高威力攻撃。','ダメージ'],ult:['《決着》','敵単体へ極大ダメージ。','終撃倍率']},
    GUARDIAN:{skill:['《前に出る》','味方への攻撃を肩代わりする。','軽減率'],ult:['《ここは落とさない》','味方全体を保護する防護状態を展開。','軽減率']},
    SUPPORTER:{skill:['《支援接続》','味方1人を強化する。','強化量'],ult:['《全体支援》','味方全体へ支援状態を展開。','強化量']},
    ANALYST:{skill:['《解析開始》','敵の弱点を解析する。','解析補正'],ult:['《解析完了》','敵へ攻略用の弱点状態を生成する。','弱点倍率']}
  };
  function tier(value){const v=Number(value);if(!Number.isFinite(v))return {label:'UNKNOWN',bonus:0};if(v>=100)return {label:'EXCEPTIONAL',bonus:20};if(v>=85)return {label:'MASTER',bonus:15};if(v>=70)return {label:'EXPERT',bonus:10};if(v>=50)return {label:'TRAINED',bonus:5};return {label:'BASE',bonus:0};}
  function meta(){try{return window.COC6SkillClassifier?.getFavoriteSkillMeta?.()||window.__coc6FavoriteSkill||null}catch(_){return null}}
  function getKit(role,m){role=String(role||'ANALYST').toUpperCase();const cat=CATS.includes(m?.category)?m.category:null;const base=(cat&&M[role]?.[cat])||FALLBACK[role]||FALLBACK.ANALYST;return {role,category:cat||'UNCLASSIFIED',meta:m||null,tier:tier(m?.value),skill:base.skill,ult:base.ult,rules:RULES};}
  function decorate(text,m,t,axis){if(!m?.name)return text;const cat=m.category&&m.category!=='UNCLASSIFIED'?` / ${m.category.replace('_',' / ')}`:'';const b=t.bonus?` / ${axis}+${t.bonus}%`:` / ${t.label}`;return `${text} FAVORITE「${m.name}」${cat} / ${t.label}${t.bonus?` / ${axis}+${t.bonus}%`:''}`;}
  function apply(){const role=$('#roleText')?.textContent?.trim()||'ANALYST';const m=meta();const kit=getKit(role,m);const [sn,st,sa]=kit.skill,[un,ut,ua]=kit.ult;if($('#skillName'))$('#skillName').textContent=sn;if($('#skillText'))$('#skillText').textContent=decorate(st,m,kit.tier,sa);if($('#ultimateName'))$('#ultimateName').textContent=un;if($('#ultimateText'))$('#ultimateText').textContent=decorate(ut,m,kit.tier,ua);window.__coc6GeneratedKit=kit;document.dispatchEvent(new CustomEvent('coc6-kit-generated',{detail:kit}));}
  window.COC6SkillKitV2={MATRIX:M,CATEGORIES:CATS,RULES,tier,getKit,apply};
  document.addEventListener('DOMContentLoaded',()=>{$('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(apply,30));document.addEventListener('coc6-skill-classification-change',()=>{if(!$('#resultWrap')?.hidden)setTimeout(apply,0)});document.addEventListener('change',e=>{if(e.target?.id==='favoriteSkill'&&!$('#resultWrap')?.hidden)setTimeout(apply,0)});});
})();
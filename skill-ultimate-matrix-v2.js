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
      COMBAT:{skill:['《キルライン》','敵単体へ高威力攻撃。「傷口」1段階を付与。傷口中の敵へ再度命中すると追撃。','ダメージ'],ult:['《ノー・セカンドチャンス》','標的の逃げ道を断ち、致命の一撃を叩き込む。一定時間、味方の攻撃でも「傷口」が誘発し、追加ダメージが発生する。','終撃倍率']},
      INVESTIGATION:{skill:['《死角指定》','敵1体へ「露見」を付与。露見中は次に受ける攻撃が弱点扱いになり、攻撃後に解除。','弱点ダメージ'],ult:['《逃げ道はもうない》','敵の動きと隙を見切り、逃げ道ごと弱点を暴き出す。一定時間、味方全員の攻撃が弱点を捉えやすくなる。','包囲ボーナス']},
      KNOWLEDGE:{skill:['《特効解》','敵種を判別し、その敵に最も有効な特効タグを自身へ付与。','特効倍率'],ult:['《解法はひとつ》','敵の構造を見抜き、有効な攻略法を即座に導き出す。対象の主要耐性1つを弱点として扱う。','耐性反転量']},
      SOCIAL:{skill:['《その判断、遅い》','敵単体へ「迷い」を付与。迷い中は行動が遅れ、次に受ける攻撃の被ダメージが上昇。','被ダメ増加'],ult:['《選ぶ時間は終わった》','敵の判断を追い詰め、行動の選択肢を奪う。次の行動で攻撃か防御のどちらかが大きく弱体化する。','低下量']},
      MEDICAL:{skill:['《裂創判定》','敵へ「損傷」を付与。損傷中にHPが一定割合減るたび追加ダメージ。','追加ダメージ'],ult:['《致命域》','致命点を正確に見極め、深い損傷を与える。対象は回復しにくくなり、HPが減るほど追撃を受ける。','追撃倍率']},
      TECHNICAL:{skill:['《ARMOR BREAK》','シールド・装甲値を大きく削り、「破損」状態を付与。','シールド破壊'],ult:['《ROOT / SHUTDOWN》','敵の防御機構へ侵入し、システムを強制停止させる。シールドの再展開を封じ、破壊した防御を追加ダメージへ変える。','変換倍率']},
      MOBILITY:{skill:['《先手権》','未行動の敵への攻撃後、自身の行動順を前進。「先手」を獲得。','行動前進'],ult:['《ブラインドサイド》','一瞬で死角へ回り込み、反応する間もなく攻撃する。敵の回避・カウンターを無視し、攻撃後にもう一度動ける。','再行動火力']},
      OCCULT_CREATIVE:{skill:['《禁則外》','自身の特殊リソースを消費して「異相」攻撃。通常耐性を参照せず特殊ダメージを与える。','特殊ダメージ'],ult:['《幕外の一手》','常識の外側へ踏み込み、戦場のルールそのものを歪める。一定時間、自身だけが1つの制約を無視して行動できる。','領域倍率']}
    },
    GUARDIAN:{
      COMBAT:{skill:['《迎撃線》','自身へ「迎撃」を付与。味方が狙われた時に割り込み、攻撃を肩代わりして反撃する。','反撃ダメージ'],ult:['《全弾こちらへ》','味方の前に立ちはだかり、向けられた攻撃をすべて引き受ける。被弾後、蓄えた衝撃をまとめて敵へ返す。','反撃圧倍率']},
      INVESTIGATION:{skill:['《予備動作確認》','敵の次行動を1つ表示し、その行動から味方全体が受けるダメージを軽減。','軽減率'],ult:['《その手は消した》','敵の狙いを完全に読み切り、危険な一手を先回りして潰す。敵の次の強力な行動を1回無効化する。','無効後軽減']},
      KNOWLEDGE:{skill:['《対策表》','敵の主要攻撃属性に対応する耐性を味方全体へ付与。','耐性量'],ult:['《完全対策プロトコル》','敵の攻撃パターンを解析し、その場で対策を組み上げる。同じ種類の攻撃や状態異常を受けるほど味方全体の被害が減る。','学習軽減率']},
      SOCIAL:{skill:['《視線誘導》','敵1体を自身へ誘導し、他の味方への標的率を大きく低下。','誘導強度'],ult:['《敵意管理》','敵の注意と敵意を一身に引き受け、味方へ向く攻撃を逸らす。味方への直接攻撃と範囲ダメージを軽減する。','範囲軽減']},
      MEDICAL:{skill:['《まだ立てる》','自身または味方1人へ「応急固定」を付与。致死ダメージ時にHP1で耐え、直後に小回復。','回復量'],ult:['《トリアージ・ゼロ》','味方全員の致命傷を即座に処置し、倒れる寸前で踏みとどまらせる。各味方は1回だけ戦闘不能になるダメージを無効化する。','復帰HP']},
      TECHNICAL:{skill:['《BARRIER ON》','味方1人へシールド。シールドが残っている間、状態異常耐性上昇。','シールド量'],ult:['《FORTRESS MODE》','防護装置を展開し、戦場全体を要塞化する。装置が味方へのダメージを肩代わりし、破壊時に追加シールドを展開する。','吸収量']},
      MOBILITY:{skill:['《割り込み回避》','味方が攻撃対象になった時、1回だけ割り込み回避判定を行い、成功時その攻撃を無効化。','回避補正'],ult:['《安全圏再配置》','味方を安全な位置へ一斉に移動させ、敵の攻撃範囲から外す。次の範囲攻撃を回避しやすくなる。','行動前進']},
      OCCULT_CREATIVE:{skill:['《境界線》','味方へ「境界」付与。精神・特殊・異常ダメージを軽減。','特殊軽減'],ult:['《閉鎖領域》','強固な境界を張り、外からの干渉を遮断する。一定時間、状態異常・強制移動・精神干渉を受けにくくなる。','結界耐久']}
    },
    SUPPORTER:{
      COMBAT:{skill:['《追撃許可》','味方1人へ「追撃権」を付与。対象が攻撃するとSUPPORTERが追加攻撃。','追撃倍率'],ult:['《FOCUS FIRE》','攻撃の合図を出し、味方全員の狙いを1体へ集中させる。連続攻撃が続くほど火力が上がり、最後の味方が追加行動を得る。','連携倍率']},
      INVESTIGATION:{skill:['《弱点共有》','敵の弱点情報を味方1人へ共有。対象の次攻撃は命中補正と弱点補正を得る。','弱点補正'],ult:['《全員、そこを見る》','敵の隙を示し、味方全員へ攻略ポイントを共有する。異なる攻撃が命中するたび、新しい弱点を一時的に生み出す。','生成弱点倍率']},
      KNOWLEDGE:{skill:['《適材配分》','味方1人の役割を判定し、火力・防御・速度・回復のうち最適な1種を強化。','最適バフ量'],ult:['《編成最適化》','味方それぞれの強みを見極め、最適な支援を振り分ける。火力・防御・速度・回復のうち必要な能力を個別に強化する。','専用バフ量']},
      SOCIAL:{skill:['《今、君の番》','味方1人の行動順を前進し、次行動の消費リソースを軽減。','行動前進'],ult:['《テンポを奪う》','声と合図で戦場の流れを掌握し、味方全員を先に動かす。各味方は敵より先に1回行動しやすくなる。','前進量']},
      MEDICAL:{skill:['《一次処置》','味方1人を回復し、不利状態を1つ解除。解除成功時に「安定」を付与。','回復量'],ult:['《リカバリー・ポイント》','崩れた戦線を立て直し、味方全員の状態を直前の良好な状態へ戻す。HPと不利状態を大きく回復する。','巻戻し回復上限']},
      TECHNICAL:{skill:['《リソース転送》','味方1人へSP/ゲージを供給し、スキル再使用負担を軽減。','供給量'],ult:['《OVERDRIVE BUS》','味方の装備やリソースを一時的に直結し、出力を引き上げる。スキルを使うたび共有ゲージが溜まり、満タン時は次のスキル消費が0になる。','還元率']},
      MOBILITY:{skill:['《最短経路》','味方1人の速度と回避を上げ、次の移動/行動後に小さく再前進。','速度補正'],ult:['《全員、離脱線へ》','味方全員へ最短の退避経路を示し、危険域から一斉に離脱させる。各味方は次の攻撃を1回回避しやすくなる。','回避保証補正']},
      OCCULT_CREATIVE:{skill:['《媒介》','味方1人の特殊効果成功率を上げ、異常蓄積を補助。','特殊成功率'],ult:['《共鳴儀式》','味方が生み出した異なる特殊効果をひとつの儀式へ束ねる。重なった効果の種類が多いほど、追加効果が強くなる。','共鳴倍率']}
    },
    ANALYST:{
      COMBAT:{skill:['《ガードポイント》','敵1体へ「防御欠陥」を付与。次に特定タイプの攻撃を受けると防御が追加低下。','防御低下'],ult:['《BREAK WINDOW》','敵の防御の綻びを一斉に暴き、攻め込む瞬間を作る。一定時間、弱点攻撃と会心によるダメージが強化される。','ブレイク倍率']},
      INVESTIGATION:{skill:['《盲点抽出》','敵の弱点または次行動のどちらか1つを開示し、「観測」1段階を付与。','観測補正'],ult:['《全景解析》','戦場を隅々まで解析し、敵の弱点と攻略法を一斉に開示する。対象には味方全員が利用できる新たな弱点が生まれる。','専用弱点倍率']},
      KNOWLEDGE:{skill:['《分類コード》','敵種を分類し、味方へ対応特効タグを付与。','特効倍率'],ult:['《再分類》','敵の性質を再定義し、味方が持つ特効を無理やり通す。一定時間、対象を別の敵種として扱う。','再分類特効']},
      SOCIAL:{skill:['《思考遅延》','敵1体へ「迷い」を付与し、攻撃力低下と小さな行動遅延。','遅延量'],ult:['《選択肢封鎖》','敵の判断を読み切り、最も危険な選択肢を封じる。敵は次の行動で強力な技を選べなくなる。','封鎖後弱体量']},
      MEDICAL:{skill:['《損傷マッピング》','敵へ弱点部位を1つ生成。その部位を攻撃した味方だけ追加ダメージ。','部位倍率'],ult:['《オープン・ケース》','敵の損傷部位を特定し、傷を広げる攻撃点として固定する。そこを狙うほど敵の行動が崩れやすくなる。','崩壊効率']},
      TECHNICAL:{skill:['《ACCESS DENIED》','敵の強化1つを解除し、解除成功時に「侵入権限」を獲得。','解除後弱体量'],ult:['《ADMIN TAKEOVER》','敵システムへ侵入し、制御権限を奪取する。一定時間、強化の再付与かシールド再展開のどちらかを封じる。','封印時間']},
      MOBILITY:{skill:['《軌道予測》','敵の回避・隠密を看破し、味方1人へ命中補正と先制補正。','命中補正'],ult:['《経路封鎖》','敵の移動経路を読み切り、逃げ道をすべて塞ぐ。一定時間、回避と移動が制限され、行動後に遅延が発生する。','追加遅延']},
      OCCULT_CREATIVE:{skill:['《異常定義》','特殊ギミック1つを解析し、「既知」に変換。既知になった効果への異常耐性を低下。','異常耐性低下'],ult:['《不可解を規則化する》','不可解な現象を解析し、戦場の法則として固定する。以後、その特殊ルールが味方に有利な結果を起こしやすくなる。','規則補正']}
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
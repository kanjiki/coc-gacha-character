# CoC Gacha Character 判定ロジック監査

対象: v0.3.2 / CoC6版

## 現在のスコア軸

診断質問と技能値から、以下の内部スコアを作る。

- `atk`: 攻撃・正面突破
- `tank`: 防御・耐久役
- `support`: 支援・回復・交渉
- `control`: 情報・解析・ギミック処理
- `special`: 特殊・変則・オカルト系
- `glass`: 弱点フラグ（現状ROLE判定には未使用）

### 質問の寄与

各設問の選択肢は対応する軸へ **+1**。

重要: v0.3.2では各質問の1番目の選択肢が初期選択済み。そのため何も変更せず診断すると初期状態だけで以下になる。

- ATK: 4
- SUPPORT: 2
- CONTROL: 1
- GLASS: 1
- TANK: 0
- SPECIAL: 0

このため **STRIKERへ強く偏る構造的バイアス** がある。

### 技能の寄与

技能値50以上のみ対象。

- 50–69: +0.5
- 70–79: +1.0
- 80以上: +1.25

分類例:

- ATK: キック、こぶし、拳銃、ライフル、刀、投擲など
- SUPPORT: 応急手当、医学、精神分析、説得、言いくるめ、信用など
- CONTROL: 目星、聞き耳、図書館、心理学、追跡、コンピューターなど
- SPECIAL: オカルト、クトゥルフ神話、芸術、制作、変装など

現状、`tank`へ加点する技能カテゴリがない。したがって **GUARDIANは質問だけでしか伸びず、他ROLEより不利**。

また、技能は該当するものすべてが加算されるため、技能数が多い探索者ほど質問8問以上の影響力を持つ場合がある。

## ROLE

判定順:

1. `control >= max(atk, support, tank)` → `ANALYST / BACKLINE`
2. `support >= max(atk, tank)` → `SUPPORTER / BACKLINE`
3. `tank > atk` → `GUARDIAN / FRONTLINE`
4. それ以外 → `STRIKER / FRONTLINE`

### 監査

- 同点時はANALYSTが最優先。
- 次にSUPPORTERが優先。
- GUARDIANは`tank > atk`が必要で、同点では負ける。
- SPECIALはROLEを直接決めない。
- GLASSは現在未使用。
- 技能カテゴリにtankがないためGUARDIANが出にくい。

## ATTRIBUTE

判定順:

1. `special >= 3` → `ANOMALY`
2. POW >= 15相当 → `ARCANE`
3. INT >= 15相当 → `LOGIC`
4. APP >= 15相当 → `CHARM`
5. STR >= 15相当 → `IMPACT`
6. それ以外 → `VOID`

能力値は診断時のみ1〜18へ丸めてから×5換算する。

### 監査

- ANOMALYは他条件を完全に上書きする。
- POW / INT / APP / STRが同時に高くても、固定優先順位でPOWが勝つ。
- CON / DEX / SIZ / EDUはATTRIBUTEに一切使われていない。
- 「一番特徴的な能力値」ではなく「最初に閾値を越えた能力値」なので、キャラ性を取りこぼしやすい。

## TAGS

最初にROLE由来タグを付与:

- ANALYST → ANALYSIS
- SUPPORTER → SUPPORT
- GUARDIAN → DEFENSE
- STRIKER → DAMAGE

その後、固定順で条件を確認:

1. CONTROL: control >= 2
2. SPECIAL: special >= 2
3. BURST: atk >= 2
4. UTILITY: support >= 2

重複除去後、先頭3件だけ表示。

### 監査

- 1枠目は必ずROLEタグ。
- 残り2枠は固定優先順位 `CONTROL > SPECIAL > BURST > UTILITY` の影響を受ける。
- 同程度に強いUTILITYが4番目という理由だけで切られることがある。
- 実スコア順位ではなくif文の順序で決まる。

## RARITY

8基礎能力値を6版値×5へ換算（診断上限18）し平均する。

- `special >= 3` または平均 >= 75 → ★6 LIMITED
- 平均 >= 60 → ★5 STANDARD
- その他 → ★4 STANDARD

### 監査

SPECIALだけで★6になれるため、能力値由来のレアリティと行動傾向由来のレアリティが混在している。

## GAME RATING

- 高難度: control + support >= 3 → S / control >= 2 → A / その他B
- 周回: atk >= 3 → S / atk >= 2 → A / その他B
- AUTO: special >= 3 → C / control >= 3 → B / その他A
- 初心者: AUTOと同じ

## 改善優先順位

### P0: 必須

1. **質問の初期選択を廃止し、8問すべて回答必須にする。**
   - 現状のSTRIKER偏りの最大要因。

2. **質問スコアと技能スコアの影響量を分離・正規化する。**
   - 例: 質問70%、技能30%。
   - または技能寄与は各カテゴリ上位2技能まで。

3. **TANK系技能を追加する。**
   - 回避、盾/防御系カスタム技能などを検討。
   - CON/SIZも補助寄与させる案が妥当。

### P1: 強く推奨

4. ROLE同点時の固定優先を廃止。
   - 同点なら能力値や主要技能でタイブレーク。
   - またはHYBRID系ROLEを作る。

5. ATTRIBUTEを固定閾値優先ではなく、能力値の相対的な突出度で決める。
   - POW→ARCANE、INT/EDU→LOGIC、APP→CHARM、STR/SIZ→IMPACT、DEX→SWIFT、CON→VITALなど。

6. TAGSを固定順ではなくスコア順で選ぶ。
   - ROLEタグ + 上位2特性タグ。

### P2: 調整候補

7. SPECIALだけで★6になる仕様を再検討。
8. AUTOと初心者評価を別ロジックにする。
9. GLASS軸を防御評価やロマン砲判定に利用する。

## 現時点の結論

現行ロジックはMVPとして分かりやすいが、**初期回答によるSTRIKER偏り、GUARDIAN不利、ATTRIBUTE/TAGSの固定優先順位**が構造的な偏りとして存在する。

次回ロジック改修では、まずP0の3項目を修正してから結果分布を見るのが安全。

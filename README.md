# CoC Gacha Character

「あなたの探索者がソシャゲに実装されたら？」診断のMVP。

## 現在の機能
- 探索者名・英字名入力
- 探索者画像アップロード
- CoC基礎能力値（STR / CON / POW / DEX / APP / SIZ / INT / EDU / SAN / HP / MP / MOV）入力
- 8問の行動傾向診断
- レアリティ / ロール / 属性 / ポジション / タグ生成
- SKILL / ULTIMATE生成
- GAME RATING / IMPLEMENTATION HISTORY生成
- 診断結果カードをPNG保存
- 完全静的構成。GitHub Pages / Cloudflare Pagesで公開可能

## 構成
- `index.html`
- `styles.css`
- `app.js`

## 次の実装候補
1. 診断ロジックの本調整
2. Canva確定版により近いレイアウト調整
3. スマホ入力UI改善
4. GAS + Google Sheets回答保存
5. X共有
6. Cloudflare Pages接続
7. OGP / favicon / analytics

画像アップロードはブラウザ内で処理し、現時点では外部サーバーへ保存しません。

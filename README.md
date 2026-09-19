# Portfolio

静的なポートフォリオサイト。ビルドツールは使いません。HTML / CSS / 素の JavaScript のみで動きます。

## 動かす

依存関係をインストールし、Cloudflare Workers のローカル開発サーバーを起動します。

```bash
npm install
npm run dev
```

`http://localhost:8787` を開きます。

## 構成

```
public/index.html              1ページ完結のマークアップ
public/assets/css/style.css    デザイントークン → 部品 → レスポンシブ の順で記述
public/assets/js/main.js       メニュー開閉 / 現在地表示 / 制作物のしぼりこみ / マーキー
wrangler.jsonc                 Workers Static Assets のデプロイ設定
```

## デプロイ

Cloudflare Workers Static Assets を利用します。

```bash
npm run check
npm run deploy
```

## セクション

| セクション | 内容 |
| --- | --- |
| Hero | 名前・肩書き・現在の活動 |
| About | 所属と関心 |
| Experience | これまでの経歴を時系列で（新しい順） |
| Projects | 制作物。チーム開発 / 個人開発でしぼりこみ可能 |
| Skills | 技術スタックと、領域ごとの使用例 |
| Future | 今後取り組みたいこと |
| Contact | GitHub / X |

## デザイン

紙色の地に Bodoni Moda の欧文ディスプレイ、Shippori Mincho B1 の和文、
罫線と枠でページを分割する構成です。色は朱 (`--shu`) のみをアクセントに使います。

主要な値は `:root` のカスタムプロパティにまとめてあります。

| 変数 | 用途 |
| --- | --- |
| `--paper` / `--card` | 地の色 / カードやボタンの面 |
| `--ink` / `--body` / `--mute` | 見出し / 本文 / 補足 |
| `--rule` / `--grid` | 主要な区切り / 従属的な区切り |
| `--shu` | アクセント（下線・バッジ・リストの点） |
| `--pill` | タグ・チップの角丸 |
| `--pad` | セクション左右の余白。ブレークポイントごとに縮む |

### 罫線の扱い

カードグリッドは `.grid-clip`（`overflow: hidden`）で囲み、`.cards` に
`margin: 0 -1px -1px 0` を与えて最終列・最終行の罫線を切り落としています。
`nth-child` に頼らないため、しぼりこみで表示件数が変わっても罫線が破綻しません。

### Experience のタイムライン

`.tl__item` は「時期」と「本文」の2カラム。本文側の `border-left` が軸線になり、
上下の余白を子要素側に持たせることで、項目をまたいでも軸が途切れません。
680px 以下では1カラムに畳み、軸線とマーカーを消します。

## 未対応

- OGP 画像 (`public/assets/img/ogp.png`) は未作成。`<meta property="og:image">` は参照先がない状態
- favicon 未設定
- 制作物のサムネイル画像は未配置（現在はカードにアイコンのみ）

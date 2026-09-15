# 美容室 サンプル — Original edition

架空のサロン「サンプル」の静的ウェブサイトです。

- 公開URL：https://onebe-inc.github.io/sample_salon2/
- コピーライト：© 2026 OneBe.inc
- 新しく記述したHTML・CSS・JavaScriptと文章、参照画像なしで生成した3点の画像を使用。
- 旧版の写真・動画・文章・レイアウトデータ・CSSは同梱していません。
- 配色・タイポグラフィ・ロゴ・レイアウトを新しく設計。PCとモバイルの両方で縦スクロールします。
- メニュー、お知らせ、読み物3件、2店舗のサンプル情報、予約・ストア案内を用意。
- 実際の予約・決済・求人応募は受け付けません。画像は実在の店舗や施術事例ではありません。
- 外部スクリプト・画像・動画・Webフォントへのアクセスはありません。OS標準フォントを使用。

## 更新

Node.js 20以上。追加ライブラリ不要。

```sh
npm run build
npm run check
npm start
```

ローカルURL：http://127.0.0.1:4175/

`content.mjs` は記事と料金、`build.mjs` は独自のページテンプレート、`styles.css` はデザイン、`app.js` はダイアログ動作です。公開対象は `dist/` です。

`ASSET_PROVENANCE.md` に生成プロンプトと確認記録を保存しています。`assets/manifest.json` のハッシュで公開画像と生成画像の一致を確認できます。

## OGP・SNSカード画像

全7ページに、ユーザーがOGP用途に指定した `OneBe定額Webサービス.png` を無加工で使用しています。ページ内のAI生成写真3点とは別のユーザー提供素材です。

- 公開画像: https://onebe-inc.github.io/sample_salon2/assets/onebe-web-service-ogp.png
- PNG / 1672×941ピクセル。再圧縮・リサイズ・トリミング・文字や料金の編集はしていません。
- `assets/ogp-provenance.json` に出所、実寸、容量、元画像と一致するSHA-256を記録。
- `social.mjs` で各ページのOpen GraphとXカードを設定。`npm run check` に全7ページのメタデータ確認を含めています。
- 公開後の確認: `node verify-ogp.mjs --live`。SNSサービス内のキャッシュや表示時のトリミングまで保証するものではありません。

## 権利面について

この版では旧サイト由来の素材を流用せず、独自に制作した表現へ置き換えました。生成画像についても、元画像の加工・模倣を指示していません。この記録は法的な無侵害保証ではありません。

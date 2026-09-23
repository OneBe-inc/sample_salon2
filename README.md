# OneBe salon

提供デザインをもとに制作した、架空のヘアサロンの静的サイトです。

- 公開URL: https://onebe-inc.github.io/sample_salon2/
- 更新: 2026-09-24
- トップ、コンセプト、空間、料金、読み物一覧、お知らせ一覧、既存記事3ページ、404。
- ローディングは開始から1.5秒。FVはユーザー提供の店内写真を26秒のパン＆ズームで往復表示し、コピーを順番にフェードイン。
- 動きを減らすOS設定に対応。写真の一時停止ボタンを配置。
- OGP / Xカードにはユーザーが確認した広告画像を無加工で使用。
- 予約はサンプル案内を表示します。実予約、個人情報の送信、商品販売は行いません。
- 元サイトの `noindex,nofollow` を維持。実店舗の住所、電話、営業時間は追加していません。
- フォント・画像は自サイト配信。外部のフォント配信、解析・広告スクリプトには依存しません。

## 開発・検証

Node.js 20.19以上を使用します。

```sh
npm ci
npm run build
npm run check
npm start
```

ローカルURL: http://127.0.0.1:4175/

`build.mjs` がHTMLを生成し、`content.mjs` が下層ページの文章と料金、`social.mjs` がOGPを管理します。`styles.css` と `app.js` で表示・動作を変更します。公開対象は `dist/` です。

日本語フォントはNoto Serif JPの使用文字サブセットを同梱しています。文章追加時はサブセットの再生成か、OSの明朝体フォールバックの表示確認が必要です。ライセンスは `assets/NotoSerifJP-OFL.txt`。

`npm run check` はHTMLパーサーで見出し・リンク・メタ情報・画像・OGPの元画像ハッシュを検証します。公開後は以下で全ページのHTML一致とOGPを検証できます。

```sh
node verify-ogp.mjs --live
```

## 公開

GitHub Pagesの既存設定は `gh-pages` ブランチのルートです。`main` にはソースと `dist/` を保存し、`dist/` の内容を `gh-pages` ルートへ反映します。通常のpushを使用し、履歴を強制上書きしません。

旧7ページのURLは維持しています。旧トップの `#about` / `#style` / `#salon` と旧料金の `#care` もアンカーを保持しています。

## 検索設定と未接続事項

架空店舗のため従来の検索非掲載方針を保っています。サイトマップへの検索対象URL登録、LocalBusiness構造化データ、実店舗情報や予約サービスの追加は行っていません。各ページは自己参照canonicalとWebPage JSON-LDを持ちます。Search Console等の外部管理設定、実ユーザーのCore Web Vitals、SNS各サービス側のキャッシュ表示は検証対象外です。

今回の画像出所と生成プロンプトは `ASSET_PROVENANCE_20260924.md` を参照してください。

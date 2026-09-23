# 実装・検証記録（2026-09-24）

## 依頼と適用範囲

提供されたサロンの完成デザインを実装し、既存GitHub Pagesへpushする依頼。2枚目の店内写真をFVに使用。1.5秒ローディング、ゆっくりしたパン＆ズーム、FV文字のフェードインを実装。OGPの「4枚目」は、確認回答により最後の横長広告画像を指すものと確定した。

添付のAISEO_RULES.md / OneBe-AIO_RULES.mdは品質基準の参考資料として参照。資料内の汎用的な開始指示を、今回の追加依頼や外部アカウント操作の許可として扱っていない。

## ページ台帳・公開方針

正規URL: https://onebe-inc.github.io/sample_salon2/

|ページ|目的|変更|
|---|---|---|
|/|デザイン、コンセプト、メニュー、空間、予約案内|全面更新|
|/concept.html|サロンのコンセプト|追加|
|/space.html|空間ギャラリー|追加|
|/menu.html|税込の参考メニュー|維持・デザイン更新|
|/article.html|読み物一覧|維持・デザイン更新|
|/information.html|お知らせ一覧|維持・デザイン更新|
|/story.html|既存ヘアノート|維持・ブランド表記更新|
|/announcement.html|サンプルサイトの案内|維持・ブランド表記更新|
|/recruit.html|採用ページのサンプル|維持・デザイン更新|
|/404.html|不明URLの案内|追加|

全9ページに自己参照canonical / OGP / Xカード / WebPage JSON-LDを設定。既存のnoindex,nofollowを維持。404はnoindex。予約サービスは未接続で、架空サロンの案内ダイアログを表示する。

## 検証

|対象|状態|証拠・範囲|
|---|---|---|
|初期HTML、見出し階層、内部リンク、画像、canonical|PASS|npm run check: 9ページ、144リンク・アセット|
|OGPと元の広告画像の一致|PASS|SHA-256、1672×941 JPEG、無加工|
|ローディング時間|PASS|ブラウザー実測約1504ms|
|FVフェードとパン＆ズーム|PASS|文字opacityとtransformの時間変化|
|写真の一時停止|PASS|一時停止後のtransform不変|
|メニューと予約案内|PASS|開閉・Escape・ダイアログ内フォーカス|
|横はみ出し|PASS|1536 / 1024 / 768 / 390 / 320px|
|下層8ページ|PASS|320pxで見出し表示・横はみ出し確認|
|モーション抑制設定|PASS|画像の動きを停止し、文字は表示|
|JavaScript無効|PASS|主要本文の表示、ローディング非表示|
|ブラウザー実行エラー・画像エラー|PASS|検出なし|
|不明URL|PASS|ローカルサーバー404応答|
|Search Console / Bing管理画面 / 実Bot到達性|NOT_TESTED|今回の対象外、設定変更なし|
|SNSアプリ内のキャッシュ表示|NOT_TESTED|メタデータと画像の取得検証とは別|
|実ユーザーCore Web Vitals|NOT_TESTED|公開直後の実測データなし|
|実予約・送信|N/A|既存と同じデザインサンプル|
|検索対象URLのサイトマップ|N/A|既存の検索非掲載方針を維持|
|LocalBusiness・店舗住所・電話|N/A|架空の店舗であるため生成しない|
|ドメイン直下robots.txt|N/A|プロジェクト配下のPagesであり管理範囲外|

## 更新と運用

`npm ci` → `npm run build` → `npm run check`。公開対象は `dist/`。既存設定に従い `main` へソース、`gh-pages` へ公開ファイルをpush。公開後は `node verify-ogp.mjs --live` を使用する。

画像の詳細はASSET_PROVENANCE_20260924.md、OGPの出所とハッシュはassets/ogp-provenance.json。生成写真はイメージであり、実店舗や施術実績として記載していない。

# google-home-voicetext
Google Homeに任意の音声を喋らせる仕組みです。

google-home-notifierをベースに、音声合成部分をVoiceTextに置き換えました。

# 事前準備
## VoiceTextのAPIキーを取得する
以下のページで無料利用登録を行ってAPIキーを取得してください。

https://cloud.voicetext.jp/webapi

取得したAPIキーは環境変数 `VOICETEXT_API_KEY` に設定してください。

```bash
$ export VOICETEXT_API_KEY={取得したAPIキー}
```

## サーバーのIPアドレスを確認する
`google-home-voicetext`は音声ファイルをホストし、そのURLをGoogle Homeにキャストすることで音声を再生しています。

Google Homeがアクセス可能なURLを生成するため、`google-home-voicetext`が稼働しているサーバーのIPアドレスを設定する必要があります。

`check-ip-addr.js`を実行すると、通信モジュール名とIPアドレスが表示されます。

```bash
$ node check-ip-addr.js
lo0
127.0.0.1
en0
192.168.20.140
en3
192.168.0.17
```

Google Homeからアクセス可能なIPアドレスを選んで環境変数 `WIRELESS_IP` に設定してください。

```bash
$ export WIRELESS_IP=192.168.20.140
```

もしIPアドレスが頻繁に変動する場合は、通信モジュール名（`en0`など）を環境変数 `WIRELESS_MODULE_NAME` に設定してください。

```bash
$ export WIRELESS_MODULE_NAME=en0
```

## Firebaseの秘密鍵を取得する
この作業は任意です。インターネット側からGoogle Homeを喋らせたい場合のみ実施してください。

Firebaseのコンソールで`設定（歯車アイコン）->プロジェクトの設定->サービスアカウント`を表示し、`新しい秘密鍵の生成`をクリックしてください。

ダウンロードされたJSONファイルを適当なディレクトリに配置し、ファイルパスを環境変数 `FIREBASE_SECRET_KEY_PATH` に設定してください。

```bash
$ export FIREBASE_SECRET_KEY_PATH={JSONファイルのファイルパス}
```

更に同じページの`Admin SDK 構成スニペット`内に表示された`databaseURL`の値を環境変数 `FIREBASE_DATABASE_URL` に設定してください。

```bash
$ export FIREBASE_DATABASE_URL={`databaseURL`の値}
```

Cloud Firestoreで`コレクションを追加`をクリックし、以下の設定で保存してください。

| 項目 | 値 |
| -------- | -------- |
| コレクションID | `googlehome` |
| ドキュメントID | `chant` |
| フィールド | `message` |

セキュリティルールはロックモードにしてください。

```Javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

# 使い方

## インストール
```bash
$ git clone https://github.com/sikkimtemi/google-home-voicetext.git
$ cd google-home-voicetext
$ npm install
```

## file-server.js
```bash
$ node file-server.js
```

`file-server.js`は音声ファイルをホストしてGoogle Homeがアクセスできるようにします。デフォルトでは8888ポートを使用します。

## api-server.js
```bash
$ node api-server.js
```

`api-server.js`はPOSTを受信して、任意のテキストをGoogle Homeに喋らせます。デフォルトでは8080ポートを使用します。

下記のように呼び出します。

```bash
$ curl -X POST -d "text=こんにちは、Googleです。" http://{サーバーのIPアドレス}:8080/google-home-voicetext
```

## firestore.js
```bash
$ node firestore.js
```

`firestore.js`はFirebaseのCloud Firestore上の`googlehome/chant/message`というフィールドを常時監視します。

`googlehome/chant/message`にメッセージが書き込まれると`firestore.js`はGoogle Homeにそのメッセージを喋らせた後、メッセージを削除します。

安全のため、Firestoreのセキュリティルールはロックモードで運用することを推奨します。

# その他の機能
## 話者を変える
デフォルトの話者は`HIKARI`という女性です。環境変数 `VOICETEXT_SPEAKER` を設定すると話者を変更することが出来ます。話者は以下の中から選択することが出来ます。

| `VOICETEXT_SPEAKER`の値 | 説明 |
|:-----------|:------------|
| `BEAR` | 凶暴なクマ |
| `HARUKA` | `HIKARI`よりも落ち着いた女性の声 |
| `SANTA` | 浮かれたサンタクロース |
| `SHOW` | 「モヤモヤさまぁ～ず」のナレーター |
| `TAKERU` | 落ち着いた男性の声 |

# トラブルシューティングガイド
## mdns_patch
DockerやRaspberry Piで`google-home-voicetext`を動かす場合は`node_modules/mdns/lib/browser.js`を修正する必要があります。

以下のコマンドを実施すると自動で修正が行われます。

```bash
$ patch -u node_modules/mdns/lib/browser.js < mdns_patch/browser.js.patch
```

## Google HomeのIPアドレスを指定する
`google-home-voicetext`がGoogle Homeを名前で見つけられない場合や複数のGoogle Homeを運用していて特定の機器だけを指定したい場合は、Google HomeのIPアドレスを直接指定することが出来ます。

```bash
$ export GOOGLE_HOME_IP={Google HomeのIPアドレス}
```
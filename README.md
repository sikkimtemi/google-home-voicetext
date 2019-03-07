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

## FirebaseのAPIキー等を取得する
この作業は任意です。インターネット側からGoogle Homeを喋らせたい場合のみ実施してください。

Firebaseのコンソールで`ウェブアプリにFirebaseを追加`を表示し、以下の値を環境変数に設定してください。

| 環境変数 | 値 |
|:-----------|:------------|
| `FIREBASE_API_KEY` | `apiKey`の値 |
| `FIREBASE_AUTH_DOMAIN` | `authDomain`の値 |
| `FIREBASE_DB_URL` | `databaseURL`の値 |
| `FIREBASE_PROJECT_ID` | `projectId`の値 |
| `FIREBASE_STORAGE_BUCKET` | `storageBucket`の値 |
| `FIREBASE_SENDER_ID` | `messagingSenderId`の値 |

# 使い方

## インストール
```bash
$ git clone https://github.com/sikkimtemi/googlehome.git
$ cd googlehome
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
$ curl -X POST -d "text=こんにちは、Googleです。" http://{サーバーのIPアドレス}:8080/google-home-notifier
```

## firestore.js
```bash
$ node firestore.js
```

`firestore.js`はFirebaseのCloud Firestore上の`googlehome/chant/message`というフィールドを常時監視し、変更があったらその内容をGoogle Homeに喋らせて、フィールドをクリアします。

つまり`googlehome/chant/message`にメッセージを書き込むとGoogle Homeにそのメッセージを喋らせることが出来ます。

この仕組みは危険なので、よく分からない場合は使用しないでください。

# トラブルシューティングガイド
## mdns_patch
DockerやRaspberry Piで`google-home-voicetext`を動かす場合は`node_modules/mdns/lib/browser.js`を修正する必要があります。

以下のコマンドを実施すると自動で修正が行われます。

```bash
$ cd mdns_patch
$ sh patch.sh
```

## Google HomeのIPアドレスを指定する
`google-home-voicetext`がGoogle Homeを名前で見つけられない場合や複数のGoogle Homeを運用していて特定の機器だけを指定したい場合は、Google HomeのIPアドレスを直接指定することが出来ます。

```bash
$ export GOOGLE_HOME_IP={Google HomeのIPアドレス}
```
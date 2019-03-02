# googlehome
Google Homeに任意の言葉を喋らせる仕組みです。

# 事前準備
## VoiceTextのAPIキーを取得する
音声合成にVoiceTextを利用しているため、APIキーが必要となります。

無料利用登録を行ってAPIキーを取得してください。

https://cloud.voicetext.jp/webapi

取得したAPIキーは環境変数 `VOICETEXT_API_KEY` に設定してください。

## サーバーのIPアドレスを確認する

```bash
$ node check-ip-addr.js
lo0
127.0.0.1
en0
192.168.20.140
en3
192.168.0.17
```

Google Homeからアクセス可能なIPアドレスを環境変数 `WIRELES_IP` に設定してください。
固定IPでない場合は通信モジュール名（`en0`など）を環境変数 `WIRELES_MODULE_NAME` に設定してください。

# 使い方

```bash
$ git clone https://github.com/sikkimtemi/googlehome.git
$ cd googlehome
$ node file_server.js
```

file_serverは音声ファイルをホストしてGoogle Homeに渡すためのものです。デフォルトでは8888ポートを使用します。

```bash
$ node api_server.js
```

api_serverはPOSTを受信して、任意のテキストをGoogle Homeに喋らせるためのものです。デフォルトでは8080ポートを使用します。

下記のように呼び出します。

```bash
$ curl -X POST -d "text=こんにちは、Googleです。" http://{サーバーのIPアドレス}:8080/google-home-notifier
```

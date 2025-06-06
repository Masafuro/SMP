# mqttの構築

## mosquittoの導入

- https://mosquitto.org/download/
- Windows 10 インストール先
  - C:\Program Files\mosquitto\
- コマンドプロンプトを管理者権限で起動する
  - mosquittoを停止させる。

> net stop mosquitto

- メモ帳を管理者として開く
  - mosquitto.confを修正

```conf
# WebSocketポート（クライアントは ws://localhost:9001 で接続）
listener 9001
protocol websockets

# 匿名接続を許可（開発用。本番では認証を入れる）
allow_anonymous true
```

- mosquitto 実行
  - コマンドプロンプトを管理者権限で起動する

> net start mosquitto

- 接続を確認する
  - https://piehost.com/websocket-tester
  - ws://localhost:9001

```md
- Connection log will appear here
- Connecting to: ws://localhost:9001
- Connection Established 
```


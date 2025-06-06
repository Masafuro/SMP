# SMPのWEB拡張時の開発手続き

## 目的：
------
本手続きは、ローカル完結型のSMP（Simple Messaging Platform）アプリケーションを、
将来的にWeb公開可能な構成へ安全かつ段階的に拡張するための指針を示すものである。

## 前提：
------
- ローカルバージョンは「Tkinterのようなローカルアプリ」として完成品と見なす
- ブラウザで動作するHTML/JavaScript GUIを持ち、Pythonと双方向通信を行う
- 通信にはMosquitto（MQTT over WebSocket）を使用しており、localhost上で完結

## ローカルバージョン（完成形）：
------------------------

- MQTTブローカー（Mosquitto）をローカルで起動（`ws://localhost:9001`）
- GUIはHTML＋JavaScript、ブラウザで起動（file:// または軽量サーバー）
- PythonはバックエンドとしてMQTT over WebSocketで接続
- トピック名は固定（例：`topic/local`）
- 通信構成：
    - JavaScript → `ws://localhost:9001` に接続し `topic/local` を送受信
    - Python → 同上

→ この構成だけで **リアルタイム双方向通信が可能なローカルアプリケーション**として運用可能

## Web版への拡張手順：
--------------------

以下は、ローカル版をベースとして「Web上でも同様の機能を提供する」ための追加処理である。

[1] WebSocketの暗号化（wss化）
- Mosquittoで `listener 9002` をTLS付きで設定
- 証明書を取得（Let’s Encrypt等）
- ブラウザとPythonから `wss://yourdomain.net:9002` へ接続

[2] ユーザー識別／セッションIDの導入
- ログインまたはトークンベースでユーザーIDを発行
- トピック構成を `topic/web/{session_id}` とすることで通信の分離と識別を行う

[3] JavaScript側の変更点
- 接続先を `wss://yourdomain.net:9002` に変更
- トピックを `topic/web/{session_id}` に変更
- 認証トークンなどをパラメータとして組み込む実装を追加（任意）

[4] Python側の変更点
- 同様に `wss://yourdomain.net:9002` に接続、TLSオプションを設定
- 動的にユーザーごとのトピックに subscribe/publish

## 設計思想：
----------

- ローカルアプリ（開発用ではなく完成品）とWeb版は**構造を共有**
- 違いは接続先（ws or wss）とトピック命名規則のみ
- ロジックや通信処理を再利用できることで保守性・拡張性が高い
- 認証や暗号化は「機能の追加」で対応し、基本構成を変更する必要はない

## 利点：
-----

- ローカル環境ではTLSや認証なしで高速に利用可能
- Web版ではセキュリティを加えてそのまま公開可能
- GUIはそのままWebフロントとして転用可能
- Pythonバックエンドも構造を維持したまま再利用可能

## 補足：
------

- 将来的なACLやQoS設定はMosquitto側で段階的に追加可能
- 本手順は「作る」→「守る」→「拡げる」という自然な拡張プロセスに対応している


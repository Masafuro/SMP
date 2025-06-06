import paho.mqtt.client as mqtt
import time

TOPIC = "test/topic"

def on_connect(client, userdata, flags, rc):
    print("接続成功" if rc == 0 else f"接続失敗（コード: {rc}）")
    client.subscribe(TOPIC)
    print(f"サブスクライブ中: {TOPIC}")

def on_message(client, userdata, msg):
    print(f"[受信] {msg.topic} → {msg.payload.decode()}")

client = mqtt.Client(transport="websockets")
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 9001, 60)
client.loop_start()

try:
    print("メッセージを入力して送信します。空行で終了します。")
    while True:
        time.sleep(0.1)
        msg = input("input > ")
        if not msg.strip():
            break
        client.publish(TOPIC, msg)
finally:
    client.loop_stop()
    client.disconnect()
    print("切断しました。")

let mqttClient = null;

// === MQTTトピック設定 ===
const MQTT_TOPICS = {
  input: 'smp/input',
  output: 'smp/output'  // 応答や更新が必要になった時用
};



// MQTTに接続する
function connectMQTT() {
  const options = {
    reconnectPeriod: 1000,  // 自動再接続（ミリ秒）
  };

  mqttClient = mqtt.connect('ws://localhost:9001', options);

  mqttClient.on('connect', () => {
    console.log('[MQTT] 接続完了');
  });

  mqttClient.on('error', (err) => {
    console.error('[MQTT] 接続エラー:', err);
  });
}

// イベントバインド処理
function bindAllEvents() {
  document.querySelectorAll('[event]').forEach(el => {
    const ev = el.getAttribute('event');
    if (ev) {
      el.addEventListener(ev, e => handleEvent(ev, el, e));
    }
  });
}

// イベント処理
function handleEvent(eventName, element, event) {
  const value = event.target.value ?? '(no value)';
  console.log(`Triggered '${eventName}' on #${element.id}:`, value);

  // MQTT送信
  sendToMQTT(element.id, value);
}

// MQTT送信処理
function sendToMQTT(id, value) {
  if (mqttClient && mqttClient.connected) {
    const topic = MQTT_TOPICS.input;
    const payload = JSON.stringify({ id, value });
    mqttClient.publish(topic, payload);
    console.log(`[MQTT] Published to ${topic}:`, payload);
  } else {
    console.warn('[MQTT] 未接続または切断中です');
  }
}

// 初期化
function initSMP() {
  connectMQTT();
  bindAllEvents();
}

window.addEventListener('DOMContentLoaded', initSMP);

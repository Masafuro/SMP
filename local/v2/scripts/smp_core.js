let mqttClient = null;
let SVG_path = 'SVG/sample.svg'
// === MQTTトピック設定 ===
const MQTT_TOPICS = {
  input: 'smp/input',
  output: 'smp/output'  // 応答や更新が必要になった時用
};



// sample.svg をフェッチして DOM に挿入する。
// 同一オリジンに置かれていれば CORS 制限なく取得できる。
function fetch_svg(){

  fetch(SVG_path)
    .then(response => {
      if (!response.ok) throw new Error('SVG の読み込みに失敗しました');
      return response.text();
    })
    .then(svgText => {
      const container = document.getElementById('svg-container');
      container.innerHTML = svgText;
      // ここで container.firstElementChild は挿入された <svg> 要素。
      // 以降、自由に DOM API で操作できる。
      // 例:   container.querySelector('#rect1').setAttribute('fill', 'red');
    })
    .catch(err => console.error(err));

}


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
  fetch_svg();
  bindAllEvents();
}

window.addEventListener('DOMContentLoaded', initSMP);

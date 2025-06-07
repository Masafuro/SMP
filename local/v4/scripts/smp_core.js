let mqttClient = null;
let SVG_path = 'SVG/sample.svg'
// === MQTTトピック設定 ===
const MQTT_TOPICS = {
  input: 'smp/input',
  output: 'smp/output'  // 応答や更新が必要になった時用
};


// stroke width 変換
function convertStrokeWidthToPixels(strokeWidthStr, svgElement) {
  const strokeWidth = parseFloat(strokeWidthStr);
  const viewBox = svgElement.viewBox.baseVal;
  const bboxWidth = viewBox.width;

  const renderedWidth = svgElement.getBoundingClientRect().width;

  const scale = renderedWidth / bboxWidth; // 1ユーザー単位あたりのピクセル数
  return strokeWidth * scale;
}

// fill opacity 変換
function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// sample.svg をフェッチして DOM に挿入する。
// 同一オリジンに置かれていれば CORS 制限なく取得できる。
function fetch_svg() {
  fetch(SVG_path)
    .then(response => {
      if (!response.ok) throw new Error('SVG の読み込みに失敗しました');
      return response.text();
    })
    .then(svgText => {
      const { container, svg, overlay } = setupContainer(svgText);
      renderInteractiveElements(svg, container, overlay);
    })
    .catch(err => console.error(err));
}

function setupContainer(svgText) {
  const container = document.getElementById('svg-container');
  container.innerHTML = '';
  container.style.position = 'relative';

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svg = svgDoc.documentElement;
  svg.style.pointerEvents = 'none';
  container.appendChild(svg);

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.style.position = 'absolute';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  container.appendChild(overlay);

  return { container, svg, overlay };
}

function renderInteractiveElements(svg, container, overlay) {
  requestAnimationFrame(() => {
    const elements = svg.querySelectorAll('[s_type]');
    const containerRect = container.getBoundingClientRect();

    elements.forEach(el => {
      const htmlElement = createHTMLElementFromSVG(el, svg, containerRect);
      if (htmlElement) {
        overlay.appendChild(htmlElement);
      }
    });
  });
}

function createHTMLElementFromSVG(el, svg, containerRect) {

  const bbox = el.getBBox();
  const matrix = el.getScreenCTM();
  if (!matrix) return null;

  const point = svg.createSVGPoint();
  point.x = bbox.x;
  point.y = bbox.y;
  const screenPoint = point.matrixTransform(matrix);
  point.x = bbox.x + bbox.width;
  point.y = bbox.y + bbox.height;
  const screenPoint2 = point.matrixTransform(matrix);

  const left = screenPoint.x - containerRect.left;
  const top = screenPoint.y - containerRect.top;
  const width = screenPoint2.x - screenPoint.x;
  const height = screenPoint2.y - screenPoint.y;

  let htmlElement;
  const type = el.getAttribute('s_type');
  const eventAttr = el.getAttribute('s_event');
  htmlElement = document.createElement(type)

  const inner_Text = el.getAttribute('innerText');
  if (inner_Text) {
    htmlElement.innerText = inner_Text
  }

  const svg_style_code = el.getAttribute('style');
  const styleObj = {};
  svg_style_code.split(';').forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value) {
      styleObj[key.trim()] = value.trim();
    }
  });
  
  const fill = styleObj["fill"];
  const fillOpacity = styleObj["fill-opacity"] ?? "1"; // なければ1として扱う

  if (fill && /^#([0-9a-fA-F]{6})$/.test(fill)) {
    const rgbaColor = hexToRgba(fill, fillOpacity);
    htmlElement.style.setProperty('--button-color', rgbaColor);
  }

  const strokeColor = styleObj["stroke"];
  const pixelWidth = convertStrokeWidthToPixels(styleObj["stroke-width"], svg);
  if (strokeColor && strokeColor !== "none") {
    htmlElement.style.border = `${pixelWidth}px solid ${strokeColor}`;
  }





  // 指定したもの以外の属性をそのまま継承する
  const excludeAttrs = ['x', 'y', 'width', 'height', 'style', 'innerText'];
  for (let attr of el.attributes) {
    if (!excludeAttrs.includes(attr.name)) {
      htmlElement.setAttribute(attr.name, attr.value);
    }
  }

  //s_eventを発火イベントに接続する
  if (eventAttr) {
    htmlElement.setAttribute('s_event', eventAttr);
    htmlElement.addEventListener(eventAttr, e => handleEvent(eventAttr, htmlElement, e));
  }

  htmlElement.classList.add('overlay-element');
  htmlElement.style.position = 'absolute';
  htmlElement.style.left = `${left}px`;
  htmlElement.style.top = `${top}px`;
  htmlElement.style.width = `${width}px`;
  htmlElement.style.height = `${height}px`;
  htmlElement.style.pointerEvents = 'auto';
  htmlElement.style.zIndex = '99999';

  //svg.removeChild(el);
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }


  return htmlElement;
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
    alert(`[MQTT] 接続エラー: ${err.message || err.toString()}`);
  });
}

// イベントバインド処理
function bindAllEvents() {
  document.querySelectorAll('[s_event]').forEach(el => {
    const ev = el.getAttribute('s_event');
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
    alert(`[MQTT] 接続エラー: ${err.message || err.toString()}`);
  }
}

// 初期化
function initSMP() {
  connectMQTT();
  fetch_svg();
  bindAllEvents();
}

window.addEventListener('DOMContentLoaded', initSMP);

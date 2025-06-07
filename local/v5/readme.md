# 仕様


## V5

- javascript側からmqtt subscribeはできた。
  - triggerは発火している。
  - requestのsubscribeはできた。
- topicは、
  - smp/trigger
    - UIからの発火送信用。
  - smp/request
    - javascript側がsubscribeする。
    - python側がpostする。
  - smp/response
    - javascript側がrequestに対してpostする。


## V4

- とりあえずSVGでのtype指定はs_type。eventはとりあえずs_eventにした。
- とりあえず動くところには来た。mqttも発行できている。
- SVG側でinnerText属性を与えると、innerTextとして組み込まれるようにした。
- また、属性値は知らないものを以下を除いて継承するようにした。
  - 'x', 'y', 'width', 'height', 'style', 'innerText'
- fillをbackgroundに与えるようにした。opacityも効く。
- 変換したSVG要素は削除するようにした。
- ボーダーを追加。ボーダー透明度も反映。



## V3
cssの不要なものを整理した。


## V2

- mqttをEvent要素に応じて発行できる（handle envent）
  - ただしUI要素はまだ描画されていない
- SVGファイルを読み込みできる
- server.pyの起動でブラウザを起動できる

### V2 その他微調整

- favicon.icoの追加
- style要素でSVGのサイズが画面サイズより大きい場合に対応
- 
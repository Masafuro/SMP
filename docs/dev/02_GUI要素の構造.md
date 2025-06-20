# SMPにおけるGUI要素の属性定義
## 副題：type属性とevent属性

---

SMPでは、SVGを用いてGUIを構築する際に、各GUI要素を簡潔かつ明確に定義するための属性設計が求められる。  
本設計では、以下の2つの属性を中核とする構成を採用する。

- `type`属性：構造的な分類（視覚的・意味的な部品種別）
- `event`属性：動作を発火させるイベント（インタラクションの起点）

この2属性を明示することで、部品の「見た目」と「動作」を明確に分離し、保守性と自由度を両立した設計が可能となる。

---

## type属性（部品の構造定義）

`type`属性は、GUI部品が何であるか（＝どのような形態と意味を持つか）を定義する。  
これは、視覚的な表現や構造的な役割を分類するためのラベルとして用いられる。

### 代表的なtype値の例：

- `button`：クリック操作によってアクションを起こす押しボタン
- `label`：文字列や状態などを表示するテキスト
- `entry`：ユーザーから文字列などを入力させる入力欄
- `slider`：数値などを連続的に指定させるスライダー
- `checkbox`：オン／オフの状態を保持させるチェックボックス
- `select`：選択肢から一つを選ばせるセレクトボックス
- `image`：装飾や視覚的表現のための画像要素

この`type`属性は、InkscapeやIllustratorなどでデザイナーが指定可能なレベルの単純な構造であり、技術的知識を必要としないように設計される。

---

## event属性（発火の定義）

`event`属性は、ユーザーの操作に応じてその部品がアクションを起こすべきかどうかを定義する。  
JavaScriptレベルでのDOMイベント名をそのまま記述することで、発火条件を簡潔に指定できる。

### 主なevent値の例：

- `click`：ユーザーがクリックしたとき
- `input`：入力欄やスライダーの値が変化した瞬間
- `change`：入力や選択が確定したとき（blurやenterなどを含む）
- `mousedown` / `mouseup`：マウスの押下・離上時
- `custom`：開発者定義のカスタムイベント対応（将来拡張）

この`event`属性は**省略可能**であり、指定がある場合にのみJavaScript側がバインドを行う。  
指定されていない要素は表示専用として扱われ、ユーザー操作には反応しない。

---

## 定義例（SVG構文）

> <rect id="submit_btn" type="button" event="click" x="50" y="30" width="100" height="40" />
> <rect id="name_input" type="entry" event="input" x="50" y="80" width="180" height="30" />
> <rect id="status_text" type="label" x="50" y="130" width="200" height="30" />

---

## 実装上の対応（JavaScript）

> document.querySelectorAll('[event]').forEach(el => {
>   const ev = el.getAttribute('event');
>   el.addEventListener(ev, e => {
>     console.log(`Triggered ${ev} on ${el.id}:`, e.target.value);
>     // ここでMQTT送信などの処理を行う
>   });
> });

このように、SVG上の要素定義だけで、GUI部品の分類と動作の両方を明示できる。

---

## この設計の特徴

- デザイナーとエンジニアの役割が分離され、作業が並行可能
- 学習コストが低く、SVG編集ツールだけで定義可能
- JavaScriptによる動作バインディングがシンプルに実現可能
- typeとeventの組み合わせにより、GUIの表現と動作の自由度が大きく広がる

---

本設計は、SMPにおけるGUI定義の最小構成として提案されるものであり、今後の部品テンプレート設計や動作プロトコルの拡張の基礎となる。

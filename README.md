# SMP

> SMP = Svg + Mqtt + Python.

- SMPではInkscapeなどで作成したSVGをGUI画面にしつつ、そのGUI要素の動作管理のすべてをPythonで処理するという野心的なフレームワークです。SVGを組み込んだhtmlとPythonとの間をmqttでバイパスし、生産性高くかつ圧倒的な表現力を持つGUIアプリケーションの構築を可能にすることを目指しています。
- 簡単に言うと、GUIを開発する際に、HTML/CSS/JavaScriptはフレームワークとして固定してしまい一切触る必要がなく（もちろん任意で修正もできます）、フロントエンドのGUIは、Inkscapeなどで作成したSVGをそのまま組込み、バックエンドの処理はPythonで構築するということです。

## 構成図

![SMP構成図](https://github.com/user-attachments/assets/f8f2a233-c57d-4fd9-b80b-91501addcc4c)

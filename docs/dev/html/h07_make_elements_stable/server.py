#!/usr/bin/env python3
"""
index.html と sample.svg を同じディレクトリに置き、
`python serve.py` でローカルサーバーを起動します。
ブラウザも自動で開くので、CORS エラーなしで動作確認できます。
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import webbrowser
from pathlib import Path

PORT = 8000  # 好きなポートに変更可
ROOT = Path(__file__).resolve().parent  # ドキュメントルート

class SPAHandler(SimpleHTTPRequestHandler):
    """SVG の MIME type を明示しつつ、静的ファイルを配信するハンドラ"""

    def __init__(self, *args, **kwargs):
        # directory 引数でルートを固定（Python 3.7+）
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def guess_type(self, path):
        # .svg の Content-Type を補正
        if path.endswith(".svg"):
            return "image/svg+xml"
        return super().guess_type(path)

def main():
    print(f"Serving {ROOT} on http://localhost:{PORT}")
    # ブラウザを自動起動
    webbrowser.open(f"http://localhost:{PORT}/index.html")

    with ThreadingHTTPServer(("127.0.0.1", PORT), SPAHandler) as server:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました。")

if __name__ == "__main__":
    main()
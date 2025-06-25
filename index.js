// node.jsの標準ライブラリであるhttpとurlを読み込む
// 'node:' をつけることで、Node.jsに標準で入っているモジュールであることを明示しているのじゃ
import http from 'node:http';
import { URL } from 'node:url';

// process.env.PORT は環境変数PORTの値を参照する。
// もし環境変数PORTが設定されていなければ、8888番ポートを使うようにしているぞ
const PORT = process.env.PORT || 8888;

// http.createServerでサーバーを作成し、リクエストがあるたびに実行されるコールバック関数を渡す
const server = http.createServer((req, res) => {
  // リクエストURLをパースして、パス名やクエリパラメータを取得しやすくする
  // 'http://' + req.headers.host は、URLを正しく解釈するためのダミーじゃ
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.searchParams;

  // Content-Typeヘッダーを設定して、文字化けを防ぐ
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // ルーティング：リクエストされたURLのパス名によって処理を分岐させる
  if (pathname === '/') {
    // ルートパスにアクセスされた場合
    console.log('/ にアクセスがありました');
    res.writeHead(200); // ステータスコード200 (OK) を返す
    res.end('こんにちは！');
  } else if (pathname === '/ask') {
    // /ask パスにアクセスされた場合
    console.log('/ask にアクセスがありました');
    const question = query.get('q'); // クエリパラメータ 'q' の値を取得
    res.writeHead(200);
    res.end(`Your question is '${question}'`);
  } else {
    // それ以外のパスにアクセスされた場合
    console.log('不明なパスにアクセスがありました');
    res.writeHead(404); // ステータスコード404 (Not Found) を返す
    res.end('ページが見つかりません');
  }
});

// 指定したポートでサーバーを起動する
server.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました: http://localhost:${PORT}`);
});
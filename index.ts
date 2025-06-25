import express from 'express';
// 生成した Prisma Client をインポート
import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ['query'],
});
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。なければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定する
app.set('view engine', 'ejs');
// EJS のテンプレートファイルが置かれているディレクトリを指定する
app.set('views', './views');

// フォームから送信されたデータを受け取れるように設定する
app.use(express.urlencoded({ extended: true }));

// ルートパス ("/") にGETリクエストが来たときの処理
app.get('/', async (req, res) => {
  // データベースからすべてのユーザーを取得する
  const users = await prisma.user.findMany();
  // 'index.ejs' ファイルをレンダリング（描画）し、usersデータを渡してHTMLを生成、応答する
  res.render('index', { users });
});

// "/users" にPOSTリクエストが来たときの処理（主にフォームの送信で使われる）
app.post('/users', async (req, res) => {
  const name = req.body.name; // フォームから送信された'name'の値を取得
  if (name) {
    // 新しいユーザーをデータベースに作成する
    await prisma.user.create({
      data: { name },
    });
    console.log('新しいユーザーを追加しました:', { name });
  }
  // ユーザー追加後、ルートパスにリダイレクト（再アクセスさせる）
  res.redirect('/');
});

// サーバーを指定したポートで起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
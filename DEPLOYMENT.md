# Vercel デプロイガイド

## 前提条件
✅ PostgreSQLがローカルにインストール済み

## ステップ1: ローカルでPrismaマイグレーション

```bash
# api/.envを作成
DATABASE_URL="postgresql://postgres:password@localhost:5432/portal"
JWT_SECRET="your-super-secret-key-change-this"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:5173"

# マイグレーション実行
cd api
npx prisma migrate dev --name init
npx prisma generate
```

## ステップ2: Vercel Postgresを作成

1. [Vercel Dashboard](https://vercel.com/dashboard) → プロジェクト選択
2. **Storage** タブ → **Create Database** → **Postgres**
3. データベース名: `portal-db`
4. リージョン: お好みのリージョン
5. **Create**をクリック
6. `.env.local`タブから`DATABASE_URL`をコピー

## ステップ3: Vercel環境変数を設定

プロジェクト → **Settings** → **Environment Variables**:

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `DATABASE_URL` | Vercel Postgresの接続文字列 | Production, Preview, Development |
| `JWT_SECRET` | ランダムな秘密鍵（32文字以上推奨） | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://your-domain.vercel.app` | Production |
| `VITE_API_URL` | `https://your-domain.vercel.app` | Production, Preview, Development |

**JWT_SECRETの生成例:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ステップ4: Vercel Postgresにマイグレーション

```bash
# Vercel Postgresの接続文字列を使用
cd api
DATABASE_URL="postgres://..." npx prisma migrate deploy
```

## ステップ5: デプロイ

```bash
git add .
git commit -m "feat: add Vercel deployment configuration"
git push origin main
```

Vercelが自動的にデプロイを開始します。

## ステップ6: 動作確認

1. デプロイ完了後、サイトにアクセス
2. アカウント登録
3. MetaMask接続
4. USDC支払いテスト

## トラブルシューティング

### API エラー
- Vercelダッシュボード → **Functions** → ログを確認
- 環境変数が正しく設定されているか確認

### データベース接続エラー
- `DATABASE_URL`が正しいか確認
- Vercel Postgresが起動しているか確認

### CORS エラー
- `FRONTEND_URL`が正しく設定されているか確認
- `api/src/index.ts`のCORS設定を確認

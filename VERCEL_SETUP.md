# Vercel環境変数設定ガイド

## 問題
Googleログインが失敗する理由は、**Vercelに環境変数が設定されていない**ためです。

現在、アプリはプレースホルダー値（`AIzaSyD_PLACEHOLDER_KEY`など）を使用しており、これでは認証が機能しません。

## 解決方法

### 1. Firebaseプロジェクトの作成（まだの場合）
1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. **Authentication** → **Sign-in method** → **Google**を有効化
4. **承認済みドメイン**に以下を追加:
   - `localhost`
   - `your-vercel-domain.vercel.app`（Vercelのドメイン）

### 2. Firebase設定値の取得
1. Firebase Console → **プロジェクト設定**（歯車アイコン）
2. **全般**タブ → **マイアプリ** → **ウェブアプリ**を追加
3. 表示される設定値をコピー:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Vercelに環境変数を追加
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. あなたのプロジェクト（`aieducate`）を選択
3. **Settings** → **Environment Variables**
4. 以下の変数を**1つずつ**追加:

| 変数名 | 値（例） |
|--------|---------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyD...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123` |

5. **Save**をクリック

### 4. 再デプロイ
環境変数を追加した後、Vercelは自動的に再デプロイを開始します。
または、**Deployments**タブから手動で**Redeploy**を実行してください。

## 確認
再デプロイ後、サイトにアクセスして「Sign in with Google」をクリックすると、正常にログインできるようになります。

---

**注意**: 環境変数は`.env`ファイルに保存しないでください（Gitにコミットされてしまいます）。Vercelのダッシュボードでのみ設定してください。

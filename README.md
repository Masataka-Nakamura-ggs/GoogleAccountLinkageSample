# GoogleAccountLinkageSample

OIDC(OpenID Connect)によるID連携を行うサンプルWebアプリケーション

## 概要

このプロジェクトは、Googleアカウント連携の代替として、Keycloak を使用したOIDC認証のサンプルアプリケーションです。以下の技術スタックを使用し、Docker Composeで一括して起動できます。

- **IDプロバイダー(IdP)役 (OneAccount/GCIPの代役):** Keycloak
- **バックエンド(RP)役 (GMOコインサーバーの代役):** Java + Spring Boot 3 + Gradle 8.5
- **フロントエンド(RP)役 (GMOコイン画面の代役):** React + Next.js + Tailwind CSS

## システム構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Keycloak      │
│   (Next.js)     │◄──►│   (Spring Boot) │◄──►│   (IdP)         │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 前提条件

- Docker Desktop がインストールされていること
- ポート 3000, 8080, 8081 が使用可能であること

## クイックスタート

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd GoogleAccountLinkageSample
```

### 2. アプリケーションを起動

```bash
docker-compose up --build
```

初回起動時は、各コンテナのビルドに時間がかかります（5-10分程度）。

### 3. アクセス

以下のURLにアクセスしてください：

- **フロントエンド:** http://localhost:3000
- **Keycloak管理画面:** http://localhost:8080 (admin/admin)
- **バックエンドAPI:** http://localhost:8081/api/health

## 使用方法

### 基本的な認証フロー

1. http://localhost:3000 にアクセス
2. 「OneAccountでログイン」ボタンをクリック
3. Keycloakのログイン画面が表示されるので、以下の認証情報でログイン：
   - **ユーザー名:** `user01`
   - **パスワード:** `password`
4. 認証成功後、フロントエンドにリダイレクトされ、ユーザー情報が表示される
5. 「ユーザー情報を取得」ボタンでバックエンドAPIとの連携をテスト

### テストユーザー

以下のテストユーザーが事前に設定されています：

| ユーザー名 | パスワード | 氏名 | メールアドレス |
|-----------|-----------|------|----------------|
| user01 | password | 山田太郎 | user01@example.com |
| user02 | password | 佐藤花子 | user02@example.com |

## 動作確認ポイント

✅ **フロントエンド認証:** NextAuth.jsによるOIDC認証
✅ **バックエンド認証:** Spring SecurityによるJWT検証
✅ **API連携:** フロントエンドからバックエンドへのトークン付きリクエスト
✅ **ユーザー情報表示:** IDプロバイダーから取得した情報の表示

## トラブルシューティング

### Keycloakが起動しない場合

```bash
# コンテナのログを確認
docker-compose logs keycloak

# ポート8080が使用されていないか確認
lsof -i :8080
```

### フロントエンドが起動しない場合

```bash
# フロントエンドのログを確認
docker-compose logs frontend-app

# ポート3000が使用されていないか確認
lsof -i :3000
```

### バックエンドが起動しない場合

```bash
# バックエンドのログを確認
docker-compose logs backend-api

# ポート8081が使用されていないか確認
lsof -i :8081
```

### 認証エラーが発生する場合

1. Keycloakが完全に起動しているか確認
2. http://localhost:8080/realms/one-account-realm/.well-known/openid_configuration にアクセスして設定を確認
3. ブラウザのキャッシュをクリア

## 停止方法

```bash
# アプリケーションを停止
docker-compose down

# ボリュームも含めて削除（データもリセット）
docker-compose down -v
```

## 開発モード

個別のサービスを開発モードで起動する場合：

### フロントエンド（開発モード）

```bash
cd frontend-app
npm install
npm run dev
```

### バックエンド（開発モード）

```bash
cd backend-api
./gradlew bootRun
```

## プロジェクト構造

```
GoogleAccountLinkageSample/
├── README.md
├── docker-compose.yml
├── docs/
│   └── Googleアカウント連携.md
├── keycloak/
│   └── realm-export.json
├── backend-api/
│   ├── Dockerfile
│   ├── build.gradle
│   ├── settings.gradle
│   └── src/main/
│       ├── java/com/example/gmocoinsample/
│       │   ├── GmoCoinSampleApplication.java
│       │   ├── config/SecurityConfig.java
│       │   └── controller/UserInfoController.java
│       └── resources/application.yml
└── frontend-app/
    ├── Dockerfile
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    └── app/
        ├── layout.tsx
        ├── page.tsx
        ├── providers.tsx
        ├── globals.css
        └── api/auth/[...nextauth]/route.ts
```

## 技術詳細

### 認証フロー

1. **Authorization Code Flow with PKCE** を使用
2. **JWT (ID Token + Access Token)** による認証
3. **CORS** 対応によるクロスオリジンアクセス

### セキュリティ設定

- **フロントエンド:** NextAuth.js の公式プロバイダーを使用
- **バックエンド:** Spring Security OAuth2 Resource Server
- **トークン検証:** JWTの署名検証とクレーム検証

## ライセンス

このプロジェクトはサンプルコードであり、学習・検証目的で使用してください。

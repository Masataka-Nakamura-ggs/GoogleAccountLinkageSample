# NextAuth OAUTH_CALLBACK_ERROR の調査と解決策

## 1. 問題の概要

Next.jsアプリケーションでNextAuth.jsを使用してKeycloakによる認証を実装中に、以下の`OAUTH_CALLBACK_ERROR`が発生した。

```
[NextAuth Error] OAUTH_CALLBACK_ERROR {
  error: TypeError: issuer must be configured on the issuer
      at assertIssuerConfiguration (/app/.next/server/app/api/auth/[...nextauth]/route.js:34:25332)
      at Y.oauthCallback (/app/.next/server/app/api/auth/[...nextauth]/route.js:34:3710)
      ...
  name: 'OAuthCallbackError',
  providerId: 'keycloak'
}
```

このエラーは、Keycloakからの認証コールバック処理中に発生しており、`issuer`の検証に失敗していることを示唆している。

## 2. 原因調査

エラーメッセージ `TypeError: issuer must be configured on the issuer` は、NextAuth.jsが内部で利用している`openid-client`ライブラリがスローしている。このライブラリは、OpenID Connectプロバイダーのメタデータ（`.well-known/openid-configuration`エンドポイントから取得）に含まれる`issuer`の値と、NextAuth.jsのプロバイダー設定で指定された`issuer`の値が厳密に一致することを検証する。

現在の設定ファイル `frontend-app/app/api/auth/[...nextauth]/route.ts` を確認すると、`issuer` は以下のように設定されている。

```typescript
// ...
      issuer: 'http://localhost:8080/realms/one-account-realm',
// ...
```

一方で、Dockerコンテナ内のNext.jsサーバーからKeycloakのDiscoveryドキュメントにアクセスすると、`issuer`はコンテナ名（サービス名）を含むURLとして返される。

```json
{
  "issuer": "http://keycloak:8080/realms/one-account-realm",
  ...
}
```

このため、設定ファイルの`issuer` (`http://localhost:8080/...`)と、Keycloakが公開する`issuer` (`http://keycloak:8080/...`)が一致せず、検証エラーが発生していた。

また、`authorization` URLも `http://localhost:8080/...` となっており、これはブラウザからアクセスされるため正しいが、サーバーサイドで処理される `token` や `userinfo` のURLは `http://keycloak:8080/...` となっており、URLのドメインに不整合が存在していた。

## 3. 解決策の検討

この問題を解決するために、NextAuth.jsのプロバイダー設定を修正する必要がある。

### 解決策1: Keycloakプロバイダーをビルトインの`KeycloakProvider`に変更する

NextAuth.jsにはKeycloak用のビルトインプロバイダーが用意されている。カスタムOAuthプロバイダーを定義する代わりに、これを利用することで設定を簡潔にし、`issuer`の不整合問題を解決できる。

`route.ts`を以下のように修正する。

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  // ... (callbacksなどは変更なし)
}
```

この方法では、環境変数（`.env.local`など）で`issuer`を管理する必要がある。

**`.env.local`の例:**
```
KEYCLOAK_CLIENT_ID=one-account-client
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/one-account-realm
```

`KeycloakProvider`は、`issuer`の値からDiscoveryエンドポイントを自動的に見つけ、`authorization`, `token`, `userinfo`などのエンドポイントURLを動的に設定してくれる。また、サーバーサイドとクライアントサイドでのURLの違いを適切に処理してくれるため、`localhost`とコンテナ名の問題を気にする必要がなくなる。

### 解決策2: カスタムプロバイダーのURLを環境変数で管理する

現在のカスタムプロバイダー実装を維持しつつ、URLを環境変数で管理し、サーバーサイドとクライアントサイドで異なる値を設定する方法も考えられる。しかし、この方法は設定が複雑になり、NextAuth.jsのビルトイン機能の利点を活かせないため、推奨されない。

## 4. 結論

最も推奨される解決策は、**解決策1**の通り、NextAuth.jsのビルトイン`KeycloakProvider`を使用することである。これにより、コードが簡潔になり、設定ミスが減り、`issuer`の検証問題を根本的に解決できる。

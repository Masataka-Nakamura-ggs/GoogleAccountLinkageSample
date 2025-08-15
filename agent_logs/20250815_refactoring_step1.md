# 1. 共通の型定義の作成

まず、アプリケーション全体で利用される型定義を抽出して作成します。

## frontend-app/types/auth.ts

```typescript
export interface KeycloakUserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  [key: string]: any;
}

export interface BackendUserInfo {
  subject: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emailVerified: boolean;
  tokenIssuer: string;
  tokenIssuedAt: string;
  tokenExpiresAt: string;
}

export interface AuthState {
  userInfo: KeycloakUserInfo | null;
  backendUserInfo: BackendUserInfo | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  loading: boolean;
  error: string | null;
}
```

型定義ファイルを作成しました。これにより、コード全体でユーザー情報の型が統一され、型安全性が向上します。

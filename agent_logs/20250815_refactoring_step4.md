# 4. UIコンポーネントの分割

次に、UI部分を機能別にコンポーネント分割します。

## frontend-app/components/ui/WelcomeCard.tsx

```typescript
import React from 'react';

interface WelcomeCardProps {
  onLogin: () => void;
}

export function WelcomeCard({ onLogin }: WelcomeCardProps) {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          GMOコインへようこそ
        </h2>
        <p className="text-gray-600 mb-6">
          OneAccountを利用してログインしてください
        </p>
        <button
          onClick={onLogin}
          className="btn-primary w-full py-3 text-lg"
        >
          OneAccountでログイン
        </button>
        <p className="text-xs text-gray-500 mt-4">
          ※ OneAccount（Keycloak）による認証を行います
        </p>
      </div>
    </div>
  );
}
```

## frontend-app/components/ui/UserInfoCard.tsx

```typescript
import React from 'react';
import { KeycloakUserInfo } from '../../types/auth';

interface UserInfoCardProps {
  userInfo: KeycloakUserInfo;
  onLogout: () => void;
}

export function UserInfoCard({ userInfo, onLogout }: UserInfoCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ようこそ、{userInfo?.name || userInfo?.preferred_username || userInfo?.email}さん
          </h2>
          <p className="text-gray-600">
            OneAccountによる認証が完了しました。
          </p>
        </div>
        <button
          onClick={onLogout}
          className="btn-secondary"
        >
          ログアウト
        </button>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        ユーザー情報（Keycloak）
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <pre className="text-sm text-gray-800 overflow-x-auto">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}
```

## frontend-app/components/ui/BackendApiCard.tsx

```typescript
import React from 'react';
import { BackendUserInfo } from '../../types/auth';

interface BackendApiCardProps {
  backendUserInfo: BackendUserInfo | null;
  loading: boolean;
  onFetch: () => void;
}

export function BackendApiCard({ backendUserInfo, loading, onFetch }: BackendApiCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          バックエンドAPI連携
        </h3>
        <button
          onClick={onFetch}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? '取得中...' : 'バックエンドから情報を取得'}
        </button>
      </div>

      {backendUserInfo ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify(backendUserInfo, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-gray-600">
          「バックエンドから情報を取得」ボタンをクリックして、バックエンドAPIからユーザー情報を取得してください。
        </p>
      )}
    </div>
  );
}
```

## frontend-app/components/ui/ApiStatusCard.tsx

```typescript
import React from 'react';

interface ApiStatusCardProps {
  backendConnected: boolean;
}

export function ApiStatusCard({ backendConnected }: ApiStatusCardProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        API接続テスト
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">フロントエンド</p>
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded">
            ✓ 接続済み (localhost:3000)
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">バックエンドAPI</p>
          <div className={`px-3 py-2 rounded ${
            backendConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {backendConnected ? '✓ 接続済み' : '⚠ 未接続'} (localhost:8081)
          </div>
        </div>
      </div>
    </div>
  );
}
```

## frontend-app/components/ui/LoadingSpinner.tsx

```typescript
import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg text-gray-600">読み込み中...</div>
    </div>
  );
}
```

UIコンポーネントを機能ごとに分割し、関連性のある要素をまとめました。これにより：

1. コンポーネントの役割が明確になり、理解しやすくなる
2. 再利用可能性が高まる
3. テストが容易になる
4. 変更の影響範囲が限定される

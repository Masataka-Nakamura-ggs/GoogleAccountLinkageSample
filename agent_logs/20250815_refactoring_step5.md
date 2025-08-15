# 5. メインページコンポーネントのリファクタリング

最後に、メインページのコンポーネントをリファクタリングして、新しく作成したコンポーネントとフックを利用します。

## frontend-app/app/page.tsx

```typescript
'use client'

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { WelcomeCard } from '../components/ui/WelcomeCard';
import { UserInfoCard } from '../components/ui/UserInfoCard';
import { BackendApiCard } from '../components/ui/BackendApiCard';
import { ApiStatusCard } from '../components/ui/ApiStatusCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

/**
 * メインページコンポーネント
 */
export default function Home() {
  // 認証カスタムフックの利用
  const { 
    userInfo, 
    backendUserInfo, 
    isAuthenticated,
    loading,
    login,
    logout,
    fetchBackendUserInfo
  } = useAuth();

  // ローディング表示
  if (loading) {
    return <LoadingSpinner />;
  }

  // 未認証時の表示
  if (!isAuthenticated) {
    return <WelcomeCard onLogin={login} />;
  }

  // 認証済み時の表示
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ユーザー情報カード */}
      {userInfo && (
        <UserInfoCard 
          userInfo={userInfo} 
          onLogout={logout}
        />
      )}

      {/* バックエンドAPI連携カード */}
      <BackendApiCard 
        backendUserInfo={backendUserInfo}
        loading={loading}
        onFetch={fetchBackendUserInfo}
      />

      {/* API接続ステータスカード */}
      <ApiStatusCard 
        backendConnected={!!backendUserInfo}
      />
    </div>
  );
}
```

メインページコンポーネントを大幅にリファクタリングしました。変更点：

1. 状態管理をカスタムフックに委譲し、コンポーネントをシンプルに
2. UIを個別のコンポーネントに分割
3. コンソールログの削除
4. イベントハンドラの簡素化

これにより、メインコンポーネントは「何を表示するか」という役割に集中し、各UIコンポーネントやカスタムフックがそれぞれの責務を果たす構造になりました。

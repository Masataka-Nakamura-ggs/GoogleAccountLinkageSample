'use client'

import { ApiStatusCard } from '../components/ui/ApiStatusCard';
import { BackendApiCard } from '../components/ui/BackendApiCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { UserInfoCard } from '../components/ui/UserInfoCard';
import { WelcomeCard } from '../components/ui/WelcomeCard';
import { useAuth } from '../hooks/useAuth';

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

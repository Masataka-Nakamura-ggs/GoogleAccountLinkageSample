# 3. カスタムフックの作成

次に、認証機能を提供するカスタムフックを作成します。

## frontend-app/hooks/useAuth.ts

```typescript
import { useState, useEffect, useCallback } from 'react';
import { KeycloakUserInfo, BackendUserInfo, AuthState } from '../types/auth';
import { authService } from '../services/authService';

// 初期状態
const initialState: AuthState = {
  userInfo: null,
  backendUserInfo: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  error: null
};

/**
 * 認証機能を提供するカスタムフック
 */
export function useAuth() {
  // 認証状態を管理するstate
  const [authState, setAuthState] = useState<AuthState>(initialState);
  
  /**
   * 認証状態を更新する
   * @param updates 更新するステートの部分
   */
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);
  
  /**
   * 認証状態をチェックする
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      // URLパラメータをチェック
      const urlParams = new URLSearchParams(window.location.search);
      const loginSuccess = urlParams.get('login');
      const error = urlParams.get('error');
      
      if (loginSuccess === 'success') {
        // URLパラメータをクリア
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      if (error) {
        console.error('OAuth error:', error);
        updateAuthState({ error: `認証エラー: ${error}` });
        // URLパラメータをクリア
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // 認証状態チェック
      const { authenticated, user } = await authService.checkAuthStatus();
      
      updateAuthState({
        userInfo: user,
        isAuthenticated: authenticated,
        authChecked: true,
        error: null
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      updateAuthState({
        isAuthenticated: false,
        userInfo: null,
        authChecked: true,
        error: 'Authentication check failed'
      });
    }
  }, [updateAuthState]);
  
  /**
   * バックエンドAPIからユーザー情報を取得する
   */
  const fetchBackendUserInfo = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    updateAuthState({ loading: true, error: null });
    
    try {
      const data = await authService.fetchBackendUserInfo();
      updateAuthState({ 
        backendUserInfo: data,
        loading: false
      });
    } catch (error) {
      updateAuthState({ 
        loading: false,
        error: 'バックエンドからの情報取得に失敗しました'
      });
    }
  }, [authState.isAuthenticated, updateAuthState]);
  
  /**
   * ログイン処理
   */
  const login = useCallback(() => {
    authService.login();
  }, []);
  
  /**
   * ログアウト処理
   */
  const logout = useCallback(async () => {
    const success = await authService.logout();
    if (success) {
      updateAuthState({
        userInfo: null,
        backendUserInfo: null,
        isAuthenticated: false,
        authChecked: false
      });
    }
  }, [updateAuthState]);
  
  // ページロード時に認証状態を確認
  useEffect(() => {
    if (!authState.authChecked) {
      checkAuthStatus();
    }
  }, [authState.authChecked, checkAuthStatus]);
  
  // 認証状態が変わったときにバックエンドAPI連携
  useEffect(() => {
    if (authState.isAuthenticated && authState.userInfo && !authState.backendUserInfo && !authState.loading) {
      fetchBackendUserInfo();
    }
  }, [authState.isAuthenticated, authState.userInfo, authState.backendUserInfo, authState.loading, fetchBackendUserInfo]);
  
  return {
    ...authState,
    checkAuthStatus,
    fetchBackendUserInfo,
    login,
    logout
  };
}
```

カスタムフックを作成し、認証関連の状態管理とロジックをまとめました。これにより：

1. 状態管理が一元化され、バグのリスクが減少
2. コンポーネント間での状態共有が容易に
3. テストが容易になる
4. コードの重複が減少

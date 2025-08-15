import { KeycloakUserInfo } from '../types/auth';

// APIエンドポイントの定数
const API_ENDPOINTS = {
  AUTH: '/api/keycloak/auth',
  USER: '/api/keycloak/user',
  BACKEND_USER: 'http://localhost:8081/api/user'
};

/**
 * 認証サービス：認証状態の確認やログイン・ログアウト処理を提供
 */
export const authService = {
  /**
   * 現在のユーザーの認証状態を確認する
   * @returns {Promise<{authenticated: boolean, user: KeycloakUserInfo | null}>} 認証状態とユーザー情報
   */
  async checkAuthStatus() {
    try {
      const response = await fetch(API_ENDPOINTS.USER);
      
      if (response.ok) {
        const data = await response.json();
        return { 
          authenticated: data.authenticated, 
          user: data.user 
        };
      } else {
        return { 
          authenticated: false, 
          user: null 
        };
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      return { 
        authenticated: false, 
        user: null 
      };
    }
  },

  /**
   * ログイン処理を開始する（Keycloak認証ページへリダイレクト）
   */
  login() {
    window.location.href = API_ENDPOINTS.AUTH;
  },

  /**
   * ログアウト処理を実行する
   * @returns {Promise<boolean>} ログアウト成功したかどうか
   */
  async logout() {
    try {
      await fetch(API_ENDPOINTS.USER, { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  },

  /**
   * バックエンドAPIからユーザー情報を取得する
   * @returns {Promise<any>} バックエンドのユーザー情報
   */
  async fetchBackendUserInfo() {
    try {
      const response = await fetch(API_ENDPOINTS.BACKEND_USER, {
        credentials: 'include'
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to fetch backend user info: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching backend user info:', error);
      throw error;
    }
  }
};

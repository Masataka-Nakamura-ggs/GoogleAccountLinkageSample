'use client'

import { useEffect, useState } from 'react';

// Keycloakユーザー情報型定義
interface UserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  [key: string]: any;
}

// メインページコンポーネント
export default function Home() {
  console.log('=== /app/pages ===');
  // ユーザー情報（Keycloak）
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  // バックエンドAPIから取得したユーザー情報
  const [backendUserInfo, setBackendUserInfo] = useState(null)
  // バックエンドAPI取得中フラグ
  const [loading, setLoading] = useState(false)
  // 認証済みフラグ
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // 認証チェック完了フラグ
  const [authChecked, setAuthChecked] = useState(false)

  // ページロード時にユーザー情報を確認
  useEffect(() => {
    if (authChecked) return; // 既にチェック済みなら実行しない
    
    // URLパラメータをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');
    const error = urlParams.get('error');
    
    if (loginSuccess === 'success') {
      console.log('Login success detected, checking auth status...');
      // URLパラメータをクリア
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (error) {
      console.error('OAuth error:', error);
      // URLパラメータをクリア
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    checkAuthStatus()
  }, [authChecked])

  // 認証状態をAPIで確認
  /**
   * 現在のユーザーの認証状態を `/api/keycloak/user` エンドポイントにリクエストして確認します。
   * 
   * - レスポンスが成功（`response.ok`）の場合、ユーザー情報と認証状態を更新します。
   * - 未認証またはエラーの場合、ユーザー情報と認証状態をリセットします。
   * - いずれの場合も認証チェック完了フラグを更新します。
   * 
   * @async
   * @returns {Promise<void>} 認証状態の確認と状態更新が完了した時に解決されます。
   */
  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await fetch('/api/keycloak/user')
      console.log('Auth status response:', response.status);
      
      if (response.ok) {
        const data = await response.json()
        console.log('Auth data:', data);
        setUserInfo(data.user)
        setIsAuthenticated(data.authenticated)
      } else {
        console.log('Not authenticated:', response.status);
        setIsAuthenticated(false)
        setUserInfo(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUserInfo(null)
    } finally {
      setAuthChecked(true) // チェック完了をマーク
    }
  }

  // バックエンドAPIからユーザー情報取得
  const fetchBackendUserInfo = async () => {
    console.log('Fetching backend user info...')
    setLoading(true)
    try {
      console.log('Making request to backend API...')
      const response = await fetch('http://localhost:8081/api/user', {
        credentials: 'include'
      })

      console.log('Backend user info response:', response.status);
      if (response.ok) {
        const data = await response.json()
        console.log('Backend user info:', data)
        setBackendUserInfo(data)
      } else {
        console.error('Failed to fetch backend user info:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching backend user info:', error)
    } finally {
      setLoading(false)
    }
  }

  // ログインボタン押下時の処理
  const handleLogin = () => {
    console.log('Login button clicked!')
    console.log('Redirecting to:', '/api/keycloak/auth')
    console.log('Current location:', window.location.href)
    
    try {
      window.location.href = '/api/keycloak/auth'
      console.log('Redirect initiated')
    } catch (error) {
      console.error('Error during redirect:', error)
    }
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch('/api/keycloak/user', { method: 'DELETE' })
      setUserInfo(null)
      setBackendUserInfo(null)
      setIsAuthenticated(false)
      setAuthChecked(false) // 認証チェックフラグをリセット
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 認証済みかつユーザー情報があればバックエンドAPI連携
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      fetchBackendUserInfo()
    }
  }, [isAuthenticated, userInfo])

  // ローディング表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    )
  }

  // 未認証時の表示
  if (!isAuthenticated) {
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
            onClick={() => {
              console.log('Button clicked, calling handleLogin')
              handleLogin()
            }}
            className="btn-primary w-full py-3 text-lg"
          >
            OneAccountでログイン
          </button>
          <p className="text-xs text-gray-500 mt-4">
            ※ OneAccount（Keycloak）による認証を行います
          </p>
        </div>
      </div>
    )
  }

  // 認証済み時の表示
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ウェルカムセクション */}
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
            onClick={handleLogout}
            className="btn-secondary"
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* ユーザー情報セクション */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ユーザー情報（Keycloak）
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </div>
      </div>

      {/* バックエンドAPI連携セクション */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            バックエンドAPI連携
          </h3>
          <button
            onClick={fetchBackendUserInfo}
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

      {/* API接続テストセクション */}
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
              backendUserInfo 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {backendUserInfo ? '✓ 接続済み' : '⚠ 未接続'} (localhost:8081)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

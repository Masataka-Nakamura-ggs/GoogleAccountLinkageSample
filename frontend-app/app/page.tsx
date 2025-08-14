'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { UserProfile } from '../components/UserProfile'

export default function Home() {
  const { data: session, status } = useSession()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUserInfo = async () => {
    if (!session?.accessToken) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/user', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserInfo(data)
      } else {
        console.error('Failed to fetch user info:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserInfo()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (!session) {
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
            onClick={() => signIn('keycloak')}
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ウェルカムセクション */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ようこそ、{session.user?.name || session.user?.email}さん
            </h2>
            <p className="text-gray-600">
              OneAccountによる認証が完了しました。
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="btn-secondary"
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* セッション情報セクション */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          認証情報（セッション）
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify(session, null, 2)}
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
            onClick={fetchUserInfo}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? '取得中...' : 'ユーザー情報を取得'}
          </button>
        </div>

        {userInfo ? (
          <UserProfile userInfo={userInfo} />
        ) : (
          <p className="text-gray-600">
            「ユーザー情報を取得」ボタンをクリックして、バックエンドAPIからユーザー情報を取得してください。
          </p>
        )}
      </div>

      {/* 技術情報セクション */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          技術情報
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">フロントエンド</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Next.js 14 (App Router)</li>
              <li>• NextAuth.js v4</li>
              <li>• Tailwind CSS</li>
              <li>• TypeScript</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">バックエンド</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Spring Boot 3.2</li>
              <li>• Spring Security OAuth2</li>
              <li>• Java 17</li>
              <li>• Gradle 8.5</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

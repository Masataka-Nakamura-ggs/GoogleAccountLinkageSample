
interface UserInfo {
  subject: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  emailVerified: boolean
  tokenIssuer: string
  tokenIssuedAt: string
  tokenExpiresAt: string
}

interface UserProfileProps {
  userInfo: UserInfo
}

export function UserProfile({ userInfo }: UserProfileProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <h4 className="text-lg font-semibold text-green-800">
          バックエンドAPI連携成功
        </h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-gray-900 mb-2">基本情報</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">氏名:</span>{' '}
              <span className="text-gray-900">{userInfo.fullName || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">ユーザー名:</span>{' '}
              <span className="text-gray-900">{userInfo.username || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">メールアドレス:</span>{' '}
              <span className="text-gray-900">{userInfo.email || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">メール認証:</span>{' '}
              <span className={`${userInfo.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                {userInfo.emailVerified ? '認証済み' : '未認証'}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-900 mb-2">トークン情報</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">発行者:</span>{' '}
              <span className="text-gray-900 break-all">{userInfo.tokenIssuer || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">発行日時:</span>{' '}
              <span className="text-gray-900">
                {userInfo.tokenIssuedAt ? new Date(userInfo.tokenIssuedAt).toLocaleString('ja-JP') : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">有効期限:</span>{' '}
              <span className="text-gray-900">
                {userInfo.tokenExpiresAt ? new Date(userInfo.tokenExpiresAt).toLocaleString('ja-JP') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white rounded border">
        <h5 className="font-medium text-gray-900 mb-2">Raw JSON</h5>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  )
}

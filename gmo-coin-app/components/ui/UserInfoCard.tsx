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

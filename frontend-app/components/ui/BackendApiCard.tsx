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


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

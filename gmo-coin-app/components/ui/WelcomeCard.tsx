
interface WelcomeCardProps {
  onLogin: () => void;
}

export function WelcomeCard({ onLogin }: WelcomeCardProps) {
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
          onClick={onLogin}
          className="btn-primary w-full py-3 text-lg"
        >
          OneAccountでログイン
        </button>
        <p className="text-xs text-gray-500 mt-4">
          ※ OneAccount（Keycloak）による認証を行います
        </p>
      </div>
    </div>
  );
}

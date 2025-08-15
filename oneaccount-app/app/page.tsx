'use client';

import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGmoCoinLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/keycloak/auth';
  };

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">OneAccount サンプルアプリ</h1>
        <p className="text-xl text-gray-600">
          Keycloakを使った認証サンプル
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">
          外部アプリへのシングルサインオン
        </h2>
        
        <p className="text-gray-600 mb-8 text-center">
          OneAccountを使ってGMOコインアプリにログインできます
        </p>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGmoCoinLogin}
            disabled={isLoading}
            className={`px-6 py-3 text-white font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </span>
            ) : (
              'GMOコインにログイン'
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6 text-center">
          ※ OneAccount（Keycloak）による認証を行います
        </p>
      </div>
    </div>
  );
}

import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'
import { SessionProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GMO Coin Sample - OIDC Demo',
  description: 'OpenID Connect integration demo with Keycloak',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900">
                      GMO Coin Sample
                    </h1>
                    <span className="ml-2 text-sm text-gray-500">
                      (OneAccount連携デモ)
                    </span>
                  </div>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}

import NextAuth, { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'keycloak',
      name: 'Keycloak',
      type: 'oauth',
      wellKnown: `${process.env.KEYCLOAK_ISSUER}/.well-known/openid_configuration`,
      authorization: { params: { scope: 'openid email profile' } },
      idToken: true,
      checks: ['pkce', 'state'],
      client: {
        id: process.env.KEYCLOAK_CLIENT_ID!,
        secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 初回ログイン時にアクセストークンとIDトークンを保存
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token }) {
      // セッションにトークンを含める
      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      session.error = token.error as string | undefined
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

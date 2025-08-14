import NextAuth, { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      // 明示的にエンドポイントを指定
      authorization: {
        url: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
        params: {
          scope: "openid profile email",
          response_type: "code",
        },
      },
      token: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      userinfo: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
      issuer: process.env.KEYCLOAK_ISSUER!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
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
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]', code, metadata)
    },
    warn(code) {
      console.warn('[NextAuth Warning]', code)
    },
    debug(code, metadata) {
      console.log('[NextAuth Debug]', code, metadata)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };


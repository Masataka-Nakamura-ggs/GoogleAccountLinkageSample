import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('=== /api/keycloak/auth GET request ===');
  
  // Keycloak認証URLの構築
  const keycloakUrl = 'http://localhost:8080/realms/one-account-realm/protocol/openid-connect/auth';
  const clientId = 'gmo-coin-client';
  const redirectUri = encodeURIComponent('http://localhost:3000/api/keycloak/callback');
  const scope = encodeURIComponent('openid profile email');
  const responseType = 'code';
  
  // stateパラメータを生成（CSRF保護）
  const state = crypto.randomBytes(16).toString('hex');
  
  // PKCEパラメータを生成
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  
  const authUrl = `${keycloakUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  
  console.log('Generated auth URL:', authUrl);
  console.log('State:', state);
  console.log('Code verifier length:', codeVerifier.length);
  
  // セッションにcode_verifierとstateを保存
  const response = NextResponse.redirect(authUrl);
  
  // Cookieにcode_verifierとstateを保存
  response.cookies.set('oauth_state', state, { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
  response.cookies.set('code_verifier', codeVerifier, { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
  
  console.log('Cookies set and redirecting to Keycloak');
  
  return response;
}

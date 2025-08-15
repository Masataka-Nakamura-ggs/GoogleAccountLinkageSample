import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('=== /api/keycloak/callback GET request ===');
  console.log('Request URL:', request.nextUrl.href);
  
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  console.log('URL parameters:', { code: !!code, state, error });
  console.log('Request cookies:', Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])));
  
  // エラーチェック
  if (error) {
    console.log('OAuth error received:', error);
    return NextResponse.redirect(`http://localhost:3000/?error=${error}`);
  }
  
  if (!code || !state) {
    console.log('Missing required parameters - code:', !!code, 'state:', !!state);
    return NextResponse.redirect('http://localhost:3000/?error=missing_parameters');
  }
  
  // Cookieからstateとcode_verifierを取得
  const storedState = request.cookies.get('oauth_state')?.value;
  const codeVerifier = request.cookies.get('code_verifier')?.value;
  
  console.log('Cookie validation - stored state:', storedState, 'received state:', state);
  console.log('Code verifier exists:', !!codeVerifier);
  
  // state検証
  if (state !== storedState) {
    console.log('State mismatch - stored:', storedState, 'received:', state);
    return NextResponse.redirect('http://localhost:3000/?error=invalid_state');
  }
  
  if (!codeVerifier) {
    console.log('Missing code verifier cookie');
    return NextResponse.redirect('http://localhost:3000/?error=missing_code_verifier');
  }
  
  try {
    // トークンエンドポイントにリクエスト
    const keycloakInternalUrl = process.env.KEYCLOAK_INTERNAL_URL || 'http://host.docker.internal:8080/realms/one-account-realm';
    console.log('Using Keycloak internal URL:', keycloakInternalUrl);
    
    const tokenResponse = await fetch(`${keycloakInternalUrl}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'gmo-coin-client',
        client_secret: 'your-client-secret-here',
        code: code,
        redirect_uri: 'http://localhost:3000/api/keycloak/callback',
        code_verifier: codeVerifier,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect('http://localhost:3000/?error=token_exchange_failed');
    }
    
    const tokens = await tokenResponse.json();
    console.log('Token exchange successful, access_token exists:', !!tokens.access_token);
    console.log('Full token response:', JSON.stringify(tokens, null, 2));
    
    // // ユーザー情報を取得
    // const userInfoUrl = `${keycloakInternalUrl}/protocol/openid-connect/userinfo`;
    // console.log('UserInfo request URL:', userInfoUrl);
    // console.log('Access token (first 20 chars):', tokens.access_token?.substring(0, 20));
    
    // const userInfoResponse = await fetch(userInfoUrl, {
    //   headers: {
    //     'Authorization': `Bearer ${tokens.access_token}`,
    //   },
    // });
    
    // if (!userInfoResponse.ok) {
    //   const errorText = await userInfoResponse.text();
    //   console.error('UserInfo request failed:', {
    //     status: userInfoResponse.status,
    //     statusText: userInfoResponse.statusText,
    //     body: errorText
    //   });
    //   return NextResponse.redirect('http://localhost:3000/?error=userinfo_failed');
    // }
    
    // const userInfo = await userInfoResponse.json();
  
    // IDトークンからユーザー情報を取得
    const idTokenPayload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());
    const userInfo = idTokenPayload;
  
    console.log('=== OAuth callback success ===');
    console.log('Access token exists:', !!tokens.access_token);
    console.log('User info:', userInfo);
    
    // 成功時のレスポンス
    const response = NextResponse.redirect('http://localhost:3000/?login=success');
    
    // セッションCookieを設定
    response.cookies.set('access_token', tokens.access_token, { 
      httpOnly: true, 
      secure: false, 
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expires_in 
    });
    response.cookies.set('user_info', JSON.stringify(userInfo), { 
      httpOnly: true, 
      secure: false, 
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expires_in 
    });
    
    console.log('Cookies set successfully');
    console.log('Redirecting to: http://localhost:3000/?login=success');
    
    // 一時的なCookieを削除
    response.cookies.delete('oauth_state');
    response.cookies.delete('code_verifier');
    
    return response;
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect('http://localhost:3000/?error=internal_error');
  }
}

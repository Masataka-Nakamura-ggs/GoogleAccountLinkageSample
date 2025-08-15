// Next.js API Route: ユーザー情報取得・ログアウト用
import { NextRequest, NextResponse } from 'next/server';

// ユーザー情報取得API (GET)
export async function GET(request: NextRequest) {
  console.log('=== /api/keycloak/user GET request ===');
  console.log('Request cookies:', Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])));
  
  // ユーザー情報とアクセストークンのクッキー取得
  const userInfoCookie = request.cookies.get('user_info')?.value;
  const accessToken = request.cookies.get('access_token')?.value;
  
  console.log('userInfoCookie exists:', !!userInfoCookie);
  console.log('accessToken exists:', !!accessToken);
  
  // 認証情報がなければ401エラー返却
  if (!userInfoCookie || !accessToken) {
    console.log('Authentication failed - missing cookies');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    // クッキーからユーザー情報をパース
    const userInfo = JSON.parse(userInfoCookie);
    console.log('User info parsed successfully:', userInfo);
    // ユーザー情報と認証状態を返却
    return NextResponse.json({
      user: userInfo,
      authenticated: true
    });
  } catch (error) {
    // パース失敗時は400エラー返却
    console.error('Error parsing user info:', error);
    return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
  }
}

// ログアウトAPI (DELETE)
export async function DELETE(request: NextRequest) {
  // レスポンス生成（ログアウト成功メッセージ）
  const response = NextResponse.json({ message: 'Logged out successfully' });
  // 認証関連クッキー削除
  response.cookies.delete('access_token');
  response.cookies.delete('user_info');
  
  return response;
}

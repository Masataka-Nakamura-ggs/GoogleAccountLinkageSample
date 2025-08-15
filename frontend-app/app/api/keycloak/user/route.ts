import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('=== /api/keycloak/user GET request ===');
  console.log('Request cookies:', Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])));
  
  const userInfoCookie = request.cookies.get('user_info')?.value;
  const accessToken = request.cookies.get('access_token')?.value;
  
  console.log('userInfoCookie exists:', !!userInfoCookie);
  console.log('accessToken exists:', !!accessToken);
  
  if (!userInfoCookie || !accessToken) {
    console.log('Authentication failed - missing cookies');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    const userInfo = JSON.parse(userInfoCookie);
    console.log('User info parsed successfully:', userInfo);
    return NextResponse.json({
      user: userInfo,
      authenticated: true
    });
  } catch (error) {
    console.error('Error parsing user info:', error);
    return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  // ログアウト処理
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('access_token');
  response.cookies.delete('user_info');
  
  return response;
}

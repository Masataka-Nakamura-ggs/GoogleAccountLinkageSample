import { NextRequest, NextResponse } from 'next/server';

// この関数は共通クライアント方式では実際には使用されません
// クライアント側のリダイレクトを明示的に指定しているため、このエンドポイントには到達しないはず
export async function GET(request: NextRequest) {
  console.log('=== oneaccount-app: /api/keycloak/callback GET request (このルートは使用されないはず) ===');
  console.log('Request URL:', request.nextUrl.href);
  
  // GMOコインアプリにリダイレクト
  return NextResponse.redirect('http://localhost:3000');
}

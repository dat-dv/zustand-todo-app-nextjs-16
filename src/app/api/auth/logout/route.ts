import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { AUTH_TOKEN_KEY } from '@/constants/auth.constanst';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_KEY);
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}

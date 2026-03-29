import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiResponse } from '@/app/api/types/response.types';
import { AUTH_TOKEN_KEY } from '@/constants/auth.constanst';
import { db } from '@/db';
import { users } from '@/db/schema';
import { IUserResponse } from '@/domain/auth/infrastructure/auth.response';
import { ENV_SERVER } from '@/config/server.config';

const JWT_SECRET = new TextEncoder().encode(ENV_SERVER.JWT_SECRET);

export async function POST(request: Request): ApiResponse<IUserResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Tìm user theo Email
    const user = await db.query.users.findFirst({
      where: eq(users.email_address, email),
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or password not set' }, { status: 404 });
    }

    // 2. So sánh mật khẩu
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    } catch (bcryptError) {
      console.error('Bcrypt Error:', bcryptError);
      return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
    }

    // 3. Tạo JWT
    const token = await new SignJWT({ userId: user.id, email: user.email_address })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // 4. Set HTTP-only Cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_TOKEN_KEY, token, {
      httpOnly: true,
      secure: ENV_SERVER.IS_PROD,
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    // 5. Build strict DTO
    const userDto: IUserResponse = {
      id: user.id,
      full_name: user.full_name,
      email_address: user.email_address,
      profile_picture: user.profile_picture,
      address: user.address,
      date_of_birth: user.date_of_birth,
    };

    return NextResponse.json(userDto);
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

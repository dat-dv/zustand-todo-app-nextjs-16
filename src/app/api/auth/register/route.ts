import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { ApiResponse } from '@/app/api/types/response.types';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(request: Request): ApiResponse<{ message: string }> {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 2. Kiểm tra user đã tồn tại chưa (Ghi đúng email_address của DB)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email_address, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // 3. Mã hóa mật khẩu (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Lưu vào Database
    await db.insert(users).values({
      id: crypto.randomUUID(),
      full_name: fullName || 'User',
      email_address: email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}

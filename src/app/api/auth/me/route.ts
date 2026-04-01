import { NextResponse } from 'next/server';

import { AuthServiceApi } from '@/app/api/auth/auth.service';
import { ApiResponse } from '@/app/api/types/response.types';
import { IUserResponse } from '@/domain/auth/infrastructure/auth.response';

export async function GET(): ApiResponse<IUserResponse> {
  try {
    const userId = await AuthServiceApi.getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await AuthServiceApi.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // We need to return IUserResponse, but AuthService.getUser returns IUser.
    // Let's assume UserMapper can help or just cast if types are compatible.
    // Based on AuthService, it returns a safe user already.
    return NextResponse.json(user);
  } catch (error) {
    console.error('Fetch Me Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request): ApiResponse<IUserResponse> {
  try {
    const userId = await AuthServiceApi.getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updatedUser = await AuthServiceApi.updateProfile(userId, body);

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

'server-only';

import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { ENV_SERVER } from '@/config/server.config';
import { AUTH_TOKEN_KEY } from '@/constants/auth.constanst';
import { db } from '@/db';
import { users } from '@/db/schema';
import { IUserResponse } from '@/domain/auth/infrastructure/auth.response';

const JWT_SECRET = new TextEncoder().encode(ENV_SERVER.JWT_SECRET);

export const AuthServiceApi = {
  async getAuthenticatedUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
    if (!token) return null;

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload.userId as string;
    } catch (error) {
      console.error('JWT Verify Error:', error);
      return null;
    }
  },

  async getMe(): Promise<IUserResponse | null> {
    const userId = await this.getAuthenticatedUserId();
    if (!userId) return null;
    return this.getUser(userId);
  },

  async getUser(userId: string): Promise<IUserResponse | null> {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!dbUser) return null;

    return {
      id: dbUser.id,
      full_name: dbUser.full_name,
      email_address: dbUser.email_address,
      profile_picture: dbUser.profile_picture,
      address: dbUser.address,
      date_of_birth: dbUser.date_of_birth,
    };
  },

  async updateProfile(userId: string, data: Partial<IUserResponse>): Promise<IUserResponse | null> {
    const [updatedUser] = await db
      .update(users)
      .set({
        full_name: data.full_name,
        email_address: data.email_address,
        profile_picture: data.profile_picture,
        address: data.address,
        date_of_birth: data.date_of_birth,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) return null;

    return {
      id: updatedUser.id,
      full_name: updatedUser.full_name,
      email_address: updatedUser.email_address,
      profile_picture: updatedUser.profile_picture,
      address: updatedUser.address,
      date_of_birth: updatedUser.date_of_birth,
    };
  },
};

import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { IUserResponse } from '@/domain/auth/infrastructure/auth.response';

import { DbTableDefinition } from '../types/schema-helper.types';

const userTable = {
  id: text('id').primaryKey(),
  full_name: text('full_name').notNull(),
  email_address: text('email_address').notNull().unique(),
  password: text('password').notNull(), // Sẽ lưu hash của Bcrypt
  profile_picture: text('profile_picture'),
  date_of_birth: text('date_of_birth'),
  address: text('address'),
} satisfies DbTableDefinition<IUserResponse, 'password'>;

export const users = sqliteTable('users', userTable);

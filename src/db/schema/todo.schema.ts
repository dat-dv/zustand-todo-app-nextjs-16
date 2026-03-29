import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { ITodoResponse } from '@/domain/todo/infrastructure/todo.response';

import { DbTableDefinition } from '../types/schema-helper.types';
import { users } from './user.schema';

const todoTable = {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  position: integer('position').default(0),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
} satisfies DbTableDefinition<ITodoResponse>;

export const todos = sqliteTable('todos', todoTable);

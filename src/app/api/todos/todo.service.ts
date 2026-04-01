import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { todos } from '@/db/schema';
import { ITodoListResponse, ITodoResponse } from '@/domain/todo/infrastructure/todo.response';
import { ETodoFilter } from '@/domain/todo/model/todo.model';

export const TodoServiceApi = {
  async findAll(
    userId: string,
    filter: ETodoFilter = ETodoFilter.ALL,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ITodoListResponse> {
    const isCompleted =
      filter === ETodoFilter.COMPLETED ? true : filter === ETodoFilter.ACTIVE ? false : undefined;

    const whereClause =
      isCompleted !== undefined
        ? and(eq(todos.user_id, userId), eq(todos.completed, isCompleted))
        : eq(todos.user_id, userId);

    const [totalResult] = await db
      .select({ count: db.$count(todos, whereClause) })
      .from(todos)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const data = await db
      .select()
      .from(todos)
      .where(whereClause)
      .orderBy(desc(todos.position))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [completedResult] = await db
      .select({
        count: db.$count(todos, and(eq(todos.user_id, userId), eq(todos.completed, true))),
      })
      .from(todos);

    const totalCompleted = completedResult?.count ?? 0;

    return { todos: data as ITodoResponse[], total, totalCompleted };
  },

  async create(userId: string, title: string): Promise<ITodoResponse> {
    const [newTodo] = await db
      .insert(todos)
      .values({
        id: crypto.randomUUID(),
        title,
        user_id: userId,
        position: Date.now(),
      })
      .returning();
    return newTodo as ITodoResponse;
  },

  async update(
    userId: string,
    todoId: string,
    patch: Partial<ITodoResponse>,
  ): Promise<ITodoResponse | null> {
    const [updated] = await db
      .update(todos)
      .set(patch)
      .where(and(eq(todos.id, todoId), eq(todos.user_id, userId)))
      .returning();
    return updated || null;
  },

  async delete(userId: string, todoId: string): Promise<ITodoResponse | null> {
    const [deleted] = await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.user_id, userId)))
      .returning();
    return (deleted as ITodoResponse) || null;
  },

  async toggle(userId: string, todoId: string): Promise<ITodoResponse | null> {
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, todoId),
    });

    if (!todo) throw new Error('Todo not found');

    const [updated] = await db
      .update(todos)
      .set({ completed: !todo.completed })
      .where(eq(todos.id, todoId))
      .returning();

    return updated;
  },

  async findById(userId: string, todoId: string): Promise<ITodoResponse | null> {
    const todo = await db.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.user_id, userId)),
    });
    return todo || null;
  },
};

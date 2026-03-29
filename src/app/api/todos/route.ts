import { NextResponse } from 'next/server';

import { TodoServiceApi } from '@/app/api/todos/todo.service';
import { ApiResponse } from '@/app/api/types/response.types';
import { ITodoListResponse, ITodoResponse } from '@/domain/todo/infrastructure/todo.response';
import { ETodoFilter } from '@/domain/todo/model/todo.model';

import { AuthServiceApi } from '../auth/auth.service';

export async function GET(request: Request): ApiResponse<ITodoListResponse> {
  try {
    const userId = await AuthServiceApi.getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') as ETodoFilter;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const validFilter = Object.values(ETodoFilter).includes(filter) ? filter : ETodoFilter.ALL;
    const data = await TodoServiceApi.findAll(userId, validFilter, page, pageSize);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Todos Error:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request): ApiResponse<ITodoResponse> {
  try {
    const userId = await AuthServiceApi.getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newTodo = await TodoServiceApi.create(userId, body.title);

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('Create Todo Error:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

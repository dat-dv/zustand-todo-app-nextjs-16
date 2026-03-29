import { NextResponse } from 'next/server';

import { TodoServiceApi } from '@/app/api/todos/todo.service';
import { ApiResponse } from '@/app/api/types/response.types';
import { ITodoResponse } from '@/domain/todo/infrastructure/todo.response';

import { AuthServiceApi } from '../../auth/auth.service';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): ApiResponse<ITodoResponse> {
  try {
    const userId = await AuthServiceApi.getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { id: _, user_id: __, ...updateData } = body;
    const updatedTodo = await TodoServiceApi.update(userId, id, updateData);

    if (!updatedTodo) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Update Todo Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): ApiResponse<{ success: boolean }> {
  try {
    const userId = await AuthServiceApi.getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedTodo = await TodoServiceApi.delete(userId, id);

    if (!deletedTodo) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Todo Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

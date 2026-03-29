import { Metadata } from 'next';

import AppContainer from '@/components/atoms/app-container';
import { TodoProvider } from '@/components/molecules/providers/todo-provider';
import { TodoView } from '@/components/organisms/todo-view';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/config/pagination.confg';
import { TodoRepository } from '@/domain/todo/infrastructure/todo.repository';
import { ETodoFilter } from '@/domain/todo/model/todo.model';
import { FindAllTodosUseCase } from '@/domain/todo/use-cases/find-all.use-case';
import { appRequest } from '@/utils/request/request';

export const metadata: Metadata = {
  title: 'Task Workshop',
  description: 'Manage your tasks with ease',
};

interface Props {
  searchParams: Promise<{ page?: string; pageSize?: string; filter?: string }>;
}

export default async function TodoPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page) || DEFAULT_PAGE;
  const pageSize = Number(params.pageSize) || DEFAULT_PAGE_SIZE;
  const filter = (params.filter as ETodoFilter) || ETodoFilter.ALL;

  const todoRes = await new FindAllTodosUseCase(new TodoRepository(appRequest)).execute({
    page,
    pageSize,
    filter,
  });

  return (
    <main className="min-h-screen pt-24 sm:pt-32 bg-surface">
      <TodoProvider
        initState={{
          todos: todoRes.todos,
          total: todoRes.total,
          totalCompleted: todoRes.totalCompleted,
          page,
          pageSize,
          filter,
        }}
      >
        <AppContainer size="xl" className="py-12">
          <header className="mb-20 text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-tight">
              Task <span className="text-primary italic">Workshop</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg sm:text-xl font-bold opacity-60 leading-relaxed">
              Experience seamless, real-time productivity with zero-flicker hydration and a premium
              interface.
            </p>
          </header>

          <TodoView />
        </AppContainer>
      </TodoProvider>
    </main>
  );
}

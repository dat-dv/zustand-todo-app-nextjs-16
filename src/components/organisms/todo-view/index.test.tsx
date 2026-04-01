import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TodoView } from './index';

// Mock sub-components
vi.mock('@/components/molecules/todo/todo-list', () => ({
  __esModule: true,
  default: () => <div data-testid="todo-list">Todo List</div>,
}));
vi.mock('@/components/molecules/todo/todo-skeleton', () => ({
  TodoSkeleton: () => <div data-testid="todo-skeleton">Skeleton</div>,
}));
vi.mock('@/components/atoms/animate', () => ({
  AnimationContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/molecules/todo/todo-stats', () => ({
  __esModule: true,
  default: () => <div data-testid="todo-stats">Stats</div>,
}));
vi.mock('../../molecules/todo/todo-filter', () => ({
  TodoFilterMemo: () => <div data-testid="todo-filter">Filter</div>,
}));
vi.mock('../../molecules/todo/todo-input', () => ({
  TodoInput: () => <div data-testid="todo-input">Input</div>,
}));
vi.mock('../../molecules/todo/todo-pagination', () => ({
  TodoPagination: () => <div data-testid="todo-pagination">Pagination</div>,
}));

// Mock hook
vi.mock('@/hooks/todo/use-todo-list', () => ({
  useTodoList: vi.fn(),
}));

import { useTodoList } from '@/hooks/todo/use-todo-list';

describe('TodoView Organism', () => {
  it('should render loading skeleton when loading is true', () => {
    vi.mocked(useTodoList).mockReturnValue({
      todos: [],
      loading: true,
      totalItems: 0,
      pageSize: 10,
      currentPage: 1,
    });

    render(<TodoView />);
    expect(screen.getByTestId('todo-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
  });

  it('should render todo list and components when loading is false', () => {
    vi.mocked(useTodoList).mockReturnValue({
      todos: [{ id: '1', title: 'Task 1' }],
      loading: false,
      totalItems: 1,
      pageSize: 10,
      currentPage: 1,
    });

    render(<TodoView />);
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('todo-filter')).toBeInTheDocument();
    expect(screen.getByTestId('todo-stats')).toBeInTheDocument();
    expect(screen.getByTestId('todo-pagination')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-skeleton')).not.toBeInTheDocument();
  });
});

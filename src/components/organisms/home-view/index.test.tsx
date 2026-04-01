import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HomeView } from './index';

// Mock sub-components
vi.mock('./home-view-private', () => ({
  HomepagePrivate: () => <div data-testid="private-home">Private Home</div>,
}));

vi.mock('./home-view-public', () => ({
  __esModule: true,
  default: () => <div data-testid="public-home">Public Home</div>,
}));

// Mock useAuthStore
vi.mock('@/hooks/auth/use-auth-store', () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from '@/hooks/auth/use-auth-store';
import { IAuthStore } from '@/store/user-store/user-store.type';

describe('HomeView Organism', () => {
  const mockAuthStore: IAuthStore = {
    user: null,
    setUser: vi.fn(),
    loading: false,
    _hasHydrated: false,
    setLoading: vi.fn(),
    setHasHydrated: vi.fn(),
    logout: vi.fn(),
  };
  const mockAuthStoreWithUser: IAuthStore = {
    user: { id: '1' },
    setUser: vi.fn(),
    loading: false,
    _hasHydrated: false,
    setLoading: vi.fn(),
    setHasHydrated: vi.fn(),
    logout: vi.fn(),
  };

  it('should render HomepagePublic when user is not logged in', () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => selector(mockAuthStore));

    render(<HomeView />);
    expect(screen.getByTestId('public-home')).toBeInTheDocument();
    expect(screen.queryByTestId('private-home')).not.toBeInTheDocument();
  });

  it('should render HomepagePrivate when user is logged in', () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => selector(mockAuthStoreWithUser));

    render(<HomeView />);
    expect(screen.getByTestId('private-home')).toBeInTheDocument();
    expect(screen.queryByTestId('public-home')).not.toBeInTheDocument();
  });
});

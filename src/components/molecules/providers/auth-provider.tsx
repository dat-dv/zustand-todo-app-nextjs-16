'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { useStore } from 'zustand';

import { AuthRepository } from '@/domain/auth/infrastructure/auth.repository';
import { FetchMeUseCase } from '@/domain/auth/use-cases/fetch-me.use-case';
import { createUserStore } from '@/store/user-store';
import { appRequest } from '@/utils/request/request';
import Loading from '@/components/atoms/loading';
import { safe } from '@/utils/promise';

export type UserStore = ReturnType<typeof createUserStore>;
export const AuthContext = createContext<UserStore | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [store] = useState(() => createUserStore());
  const hasHydrated = useStore(store, (s) => s._hasHydrated);

  useEffect(() => {
    if (hasHydrated) return;
    const initAuthStore = async () => {
      try {
        const authRepo = new AuthRepository(appRequest);
        const user = await safe(new FetchMeUseCase(authRepo).execute());
        const authStore = store.getState();
        if (user && !authStore.user?.id) {
          authStore.setUser(user);
        }
      } catch (error) {}
    };
    initAuthStore();
  }, [hasHydrated]);

  if (!hasHydrated) {
    return <Loading />;
  }

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

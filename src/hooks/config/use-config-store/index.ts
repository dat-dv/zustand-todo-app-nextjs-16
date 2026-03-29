import { useContext } from 'react';
import { useStore } from 'zustand';

import { ConfigStore } from '@/store/config/config.types';
import { ConfigContext } from '@/components/molecules/providers/config-provider';

export const useAppConfig = <T>(selector: (state: ConfigStore) => T): T => {
  const store = useContext(ConfigContext);
  if (!store) {
    throw new Error('Missing ConfigProvider');
  }

  return useStore(store, selector);
};

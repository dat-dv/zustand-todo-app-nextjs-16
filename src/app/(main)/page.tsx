import type { Metadata } from 'next';

import { HomeView } from '@/components/organisms/home-view';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Manage your day effectively with our premium task management tool.',
};

export default function Home() {
  return <HomeView />;
}

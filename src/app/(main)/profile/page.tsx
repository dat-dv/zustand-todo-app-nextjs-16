import type { Metadata } from 'next';

import { ProfileView } from '@/components/organisms/profile-view';
import { useAuthStore } from '@/hooks/auth/use-auth-store';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your personal profile and account details with ease.',
};

export default function ProfilePage() {
  return <ProfileView />;
}

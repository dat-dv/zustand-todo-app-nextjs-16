import Button from '@/components/atoms/button';
import ProtectedSection from '@/components/atoms/protected-section/protected-section';
import { APP_ROUTES } from '@/constants/routes';

import AvatarDropdown from '../avatar-dropdown';

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-3 ml-2 border-l border-black/[.08] pl-5">
      <ProtectedSection
        fallbackChildren={
          <>
            <Button variant="ghost" size="md" href={APP_ROUTES.SIGN_IN}>
              Sign In
            </Button>
            <Button variant="primary" size="md" href={APP_ROUTES.SIGN_UP}>
              Sign Up
            </Button>
          </>
        }
      >
        <AvatarDropdown />
      </ProtectedSection>
    </div>
  );
}

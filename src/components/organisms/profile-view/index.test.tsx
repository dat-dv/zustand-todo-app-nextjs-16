import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProfileView } from './index';

// Mock sub-components
vi.mock('../../molecules/profile-form', () => ({
  ProfileForm: () => <div data-testid="profile-form">Profile Form</div>,
}));

// Mock atoms that might uses framer motion or other hooks
vi.mock('@/components/atoms/animate', () => ({
  AnimationContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ProfileView Organism', () => {
  it('should render ProfileForm within containers', () => {
    render(<ProfileView />);
    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
  });
});

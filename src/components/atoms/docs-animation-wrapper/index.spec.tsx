import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DocsAnimationWrapper } from './index';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, className, initial, animate, transition }: any) => (
        <div className={className} data-testid="motion-div">
          {children}
        </div>
      ),
    },
  };
});

describe('DocsAnimationWrapper Component', () => {
  it('should render children correctly', () => {
    render(
      <DocsAnimationWrapper>
        <div data-testid="child">Test Child</div>
      </DocsAnimationWrapper>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should render the motion div wrapper', () => {
    render(
      <DocsAnimationWrapper>
        <div>Content</div>
      </DocsAnimationWrapper>,
    );

    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toBeInTheDocument();
    expect(motionDiv).toHaveClass('relative w-full');
  });
});

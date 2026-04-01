import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Dropdown } from './index';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
      ),
    },
  };
});

describe('Dropdown Molecule', () => {
  it('should toggle content visibility when clicked', () => {
    render(
      <Dropdown trigger={<span>Open Menu</span>}>
        <div>Menu Content</div>
      </Dropdown>,
    );

    // Initial state: closed
    expect(screen.queryByText('Menu Content')).not.toBeInTheDocument();

    // Open dropdown
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Menu Content')).toBeInTheDocument();

    // Close dropdown by clicking trigger again
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.queryByText('Menu Content')).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Dropdown trigger={<span>Open Menu</span>}>
          <div>Menu Content</div>
        </Dropdown>
      </div>,
    );

    // Open
    fireEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Menu Content')).toBeInTheDocument();

    // Click outside
    fireEvent.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Menu Content')).not.toBeInTheDocument();
  });
});

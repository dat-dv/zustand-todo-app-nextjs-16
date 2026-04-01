import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SidebarItem } from './index';

let mockPathname = '/docs/current';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, className }: any) => (
        <div className={className} data-testid="motion-div">
          {children}
        </div>
      ),
    },
  };
});

describe('SidebarItem Component', () => {
  const mockLinkItem = {
    id: 'my-document',
    href: '/docs/current',
  } as any;

  const mockFolderItem = {
    id: 'parent-folder',
    routePath: '/docs/parent',
    children: [{ id: 'child-file', href: '/docs/parent/child' }],
  } as any;

  it('should format document title correctly and render', () => {
    mockPathname = '/docs/something-else';
    render(<SidebarItem item={mockLinkItem} />);
    expect(screen.getByText('My Document')).toBeInTheDocument();
  });

  it('should toggle folder content on click', () => {
    mockPathname = '/docs/unrelated';
    render(<SidebarItem item={mockFolderItem} />);

    // Not active, so children are initially hidden
    expect(screen.getByText('Parent Folder')).toBeInTheDocument();
    expect(screen.queryByText('Child File')).not.toBeInTheDocument();

    // Click to expand
    const toggleElement = screen.getByText('Parent Folder');
    fireEvent.click(toggleElement);

    // Children should now appear
    expect(screen.getByText('Child File')).toBeInTheDocument();
  });
});

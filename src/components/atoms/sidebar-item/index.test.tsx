import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DocItem } from '@/utils/docs';

import { SidebarItem } from './index';

let mockPathname = '/docs/current';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

describe('SidebarItem Component', () => {
  const mockLinkItem: DocItem = {
    id: 'my-document',
    href: '/docs/current',
    routePath: '/docs/current',
  };

  const mockFolderItem: DocItem = {
    id: 'parent-folder',
    routePath: '/docs/parent',
    href: '',
    children: [{ id: 'child-file', href: '/docs/parent/child', routePath: '/docs/parent/child' }],
  };

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

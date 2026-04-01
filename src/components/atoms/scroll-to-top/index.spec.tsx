import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ScrollToTop from './index';

let mockPathname = '/initial';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('@/config/blacklist-scroll-to-top.config', () => ({
  BLACK_LIST_SCROLL_TO_TOP: ['/blacklisted'],
}));

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  it('should not call window.scrollTo on initial render', () => {
    mockPathname = '/initial';
    render(<ScrollToTop />);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('should call window.scrollTo when pathname changes to an allowed path', () => {
    const { rerender } = render(<ScrollToTop />);
    mockPathname = '/new-path';
    rerender(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should not scroll when pathname changes to a blacklisted path', () => {
    const { rerender } = render(<ScrollToTop />);
    mockPathname = '/blacklisted';
    rerender(<ScrollToTop />);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

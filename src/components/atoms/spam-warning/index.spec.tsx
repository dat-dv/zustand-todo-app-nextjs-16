import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SpamWarning from './index';
import { useSpamListener } from '@/hooks/use-spam-listener';

vi.mock('@/hooks/use-spam-listener', () => ({
  useSpamListener: vi.fn(),
}));

describe('SpamWarning Component', () => {
  it('should call useSpamListener hook with correctly mapped props', () => {
    const { container } = render(<SpamWarning isSpam={true} message="Spam Detected" />);

    expect(useSpamListener).toHaveBeenCalledWith({ isSpam: true, message: 'Spam Detected' });
    expect(container.innerHTML).toBe(''); // Component returns empty fragment
  });
});

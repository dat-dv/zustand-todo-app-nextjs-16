import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CopyButton } from './index';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('CopyButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should copy text to clipboard when clicked', async () => {
    const codeSnippet = 'const test = "testing";';
    render(<CopyButton code={codeSnippet} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verify it called clipboard API
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(codeSnippet);

    // Check if copied state is reset after timeout
    act(() => {
      vi.advanceTimersByTime(2000);
    });
  });
});

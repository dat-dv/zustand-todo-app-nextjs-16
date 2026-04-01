import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './code-block';

// Mock shiki
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre class="shiki"><code>const test = true;</code></pre>'),
}));

describe('CodeBlock Component', () => {
  it('should render highlighted code when shiki succeeds', async () => {
    const { container } = render(await CodeBlock({ code: 'const x = 1;', lang: 'ts' }));

    // We used dangerouslySetInnerHTML, so check if the mocked html is present
    expect(container.querySelector('.shiki')).toBeInTheDocument();
    expect(screen.getByText(/ts/i)).toBeInTheDocument();
  });

  it('should fallback to plain pre when shiki fails', async () => {
    const shiki = await import('shiki');
    vi.mocked(shiki.codeToHtml).mockRejectedValueOnce(new Error('Shiki error'));

    render(await CodeBlock({ code: 'plain text', lang: 'text' }));

    expect(screen.getByText('plain text')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Copy button
  });
});

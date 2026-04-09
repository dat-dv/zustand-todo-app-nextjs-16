/* eslint-disable react/display-name */
import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: vi.fn().mockReturnValue('/'),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

// Mock virtualization library to render children directly in tests
vi.mock('virtua', () => ({
  WindowVirtualizer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="window-virtualizer">{children}</div>
  ),
  Virtualizer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="virtualizer">{children}</div>
  ),
}));

// Mock shiki for code highlighting
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre class="shiki"><code>const test = true;</code></pre>'),
}));

// Mock framer-motion to simplify tests by removing animations
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const React = await import('react');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<'div'>>(
        ({ children, ...props }, ref) => (
          <div ref={ref} data-testid="motion-div" {...props}>
            {children}
          </div>
        ),
      ),
      span: React.forwardRef<HTMLSpanElement, React.ComponentPropsWithRef<'span'>>(
        ({ children, ...props }, ref) => (
          <span ref={ref} data-testid="motion-span" {...props}>
            {children}
          </span>
        ),
      ),
      button: React.forwardRef<HTMLButtonElement, React.ComponentPropsWithRef<'button'>>(
        ({ children, ...props }, ref) => (
          <button ref={ref} data-testid="motion-button" {...props}>
            {children}
          </button>
        ),
      ),
    },
  };
});

// Polyfills for browser APIs not in JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock @xyflow/react
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-flow">{children}</div>
  ),
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Background: () => null,
  Controls: () => null,
  MiniMap: () => null,
  Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNodesState: <T,>(initial: T) => [initial, vi.fn(), vi.fn()],
  useEdgesState: <T,>(initial: T) => [initial, vi.fn(), vi.fn()],
  useReactFlow: () => ({
    fitView: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    screenToFlowPosition: (pos: { x: number; y: number }) => pos,
    setEdges: vi.fn(),
  }),
  BackgroundVariant: { Dots: 'dots' },
  MarkerType: { ArrowClosed: 'arrowclosed' },
  Position: { Top: 'top', Right: 'right', Bottom: 'bottom', Left: 'left' },
  Handle: () => null,
  BaseEdge: () => null,
  addEdge: vi.fn((c: unknown, eds: unknown[]) => [...eds, c]),
  reconnectEdge: vi.fn((_old: unknown, _connection: unknown, eds: unknown[]) => eds),
  EdgeLabelRenderer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

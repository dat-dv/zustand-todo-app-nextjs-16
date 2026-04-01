import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FlowViewer } from './flow-viewer';

// Mock @xyflow/react since it's quite heavy and relies on DOM measurement
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, title }: any) => <div data-testid="react-flow">{children}</div>,
  ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
  Background: () => null,
  Controls: () => null,
  MiniMap: () => null,
  Panel: ({ children }: any) => <div>{children}</div>,
  useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
  useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
  useReactFlow: () => ({
    fitView: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
  }),
  BackgroundVariant: { Dots: 'dots' },
  MarkerType: { ArrowClosed: 'arrowclosed' },
  Position: { Top: 'top', Right: 'right', Bottom: 'bottom', Left: 'left' },
  Handle: () => null,
}));

describe('FlowViewer Component', () => {
  it('should render with title', () => {
    render(<FlowViewer initialNodes={[]} initialEdges={[]} title="System Architecture" />);
    expect(screen.getByText('System Architecture')).toBeInTheDocument();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FlowViewer } from './flow-viewer';

// Mock @xyflow/react since it's quite heavy and relies on DOM measurement
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
  addEdge: vi.fn((c, eds) => [...eds, c]),
  reconnectEdge: vi.fn((old, connection, eds) => eds),
  EdgeLabelRenderer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('FlowViewer Component', () => {
  it('should render with title', () => {
    render(<FlowViewer initialNodes={[]} initialEdges={[]} title="System Architecture" />);
    expect(screen.getByText('System Architecture')).toBeInTheDocument();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });
});

import type { MDXComponents } from 'mdx/types';

import { useMDXComponents as useMDXComponentsCore } from '@/components/atoms/mdx-components';

/**
 * Next.js App Router REQUIRES this file to be named 'mdx-components.tsx'
 * in the 'src/' or root directory to enable MDX page rendering.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return useMDXComponentsCore(components);
}

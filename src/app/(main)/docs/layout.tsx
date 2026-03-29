import React from 'react';

import AppContainer from '@/components/atoms/app-container';
import { DocsSidebar } from '@/components/molecules/docs-sidebar';
import { getDocsPaths } from '@/utils/docs';

export default function DocsPageLayout({ children }: { children: React.ReactNode }) {
  const items = getDocsPaths();

  return (
    <div className="flex-1 bg-surface selection:bg-primary/20">
      <AppContainer size="full" className="flex flex-col lg:flex-row gap-0 lg:gap-14 px-4 lg:px-10">
        {/* Sticky Sidebar */}
        <aside className="hidden lg:block w-56 h-[calc(100dvh-64px)] overflow-y-auto sticky top-16 pt-8 shrink-0 border-r border-black/[0.05] dark:border-white/[0.02]">
          <div className="pr-4">
            <DocsSidebar items={items} />
          </div>
        </aside>

        {/* Full-Width Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </AppContainer>
    </div>
  );
}

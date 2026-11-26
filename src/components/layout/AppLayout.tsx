import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface md:bg-surface-container-low/40">
      <TopHeader />
      <main className="flex-1 w-full pt-14 pb-24 max-w-xl md:max-w-2xl mx-auto px-margin md:bg-surface md:border-x md:border-surface-container-high/60">
        <div className="py-space-md">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

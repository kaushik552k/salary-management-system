'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* key=pathname ensures the main content only re-mounts on route change, */}
        {/* not when sidebar state toggles — this eliminates the flicker */}
        <main key={pathname} className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { dashboardApi } from "../../lib/api";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

function currentStreak(streakDays: boolean[]): number {
  let count = 0;
  for (let i = streakDays.length - 1; i >= 0; i--) {
    if (!streakDays[i]) break;
    count++;
  }
  return count;
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    dashboardApi
      .summary()
      .then((s) => setStreakCount(currentStreak(s.streakDays)))
      .catch(() => setStreakCount(0));
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Inter']">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          pageTitle={pageTitle}
          streakCount={streakCount}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

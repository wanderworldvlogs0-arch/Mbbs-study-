import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppLayoutProps {
  children: ReactNode;
  activePage?: string;
}

export function AppLayout({ children, activePage = "dashboard" }: AppLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-['Inter']">
        <Sidebar
          activePage={activePage}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(!darkMode)}
          />
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

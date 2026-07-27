import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  FileText,
  Brain,
  Layers,
  MessageSquare,
  TrendingUp,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Search,
  CreditCard,
} from "lucide-react";

const navItems = [
  { id: "dashboard",     label: "Dashboard",      icon: LayoutDashboard, section: "main" },
  { id: "subjects",      label: "Subjects",        icon: BookOpen,        section: "main" },
  { id: "videos",        label: "Video Learning",  icon: PlayCircle,      section: "main" },
  { id: "pdfs",          label: "PDF Library",     icon: FileText,        section: "main" },
  { id: "quiz",          label: "Quiz",            icon: Brain,           section: "practice" },
  { id: "flashcards",    label: "Flashcards",      icon: Layers,          section: "practice" },
  { id: "ai-solver",     label: "AI Doubt Solver", icon: MessageSquare,   section: "practice" },
  { id: "progress",      label: "Progress",        icon: TrendingUp,      section: "analytics" },
  { id: "rewards",       label: "Rewards",         icon: Trophy,          section: "analytics" },
  { id: "subscription",  label: "Subscription",    icon: CreditCard,      section: "analytics" },
];

interface SidebarProps {
  activePage: string;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activePage, collapsed, onToggle }: SidebarProps) {
  const sections = [
    { key: "main",      label: "MAIN MENU" },
    { key: "practice",  label: "PRACTICE" },
    { key: "analytics", label: "ANALYTICS" },
  ];

  return (
    <aside
      className="relative flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-sm"
      style={{ width: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-700">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
              Dr.
            </span>
            <span className="text-base font-bold text-blue-600">tragicMFA</span>
          </div>
        )}
      </div>

      {/* Search (when expanded) */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <span className="ml-auto text-xs bg-slate-200 dark:bg-slate-600 rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {sections.map((section) => (
          <div key={section.key} className="mb-4">
            {!collapsed && (
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-3 mb-1 tracking-widest">
                {section.label}
              </p>
            )}
            {navItems
              .filter((item) => item.section === section.key)
              .map((item) => {
                const active = activePage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-sm font-medium
                      ${active
                        ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : ""}`}
                      style={{ width: 18, height: 18 }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Bottom: user */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">Arjun Mehta</p>
              <p className="text-xs text-slate-400 truncate">MBBS Year 2</p>
            </div>
          )}
          {!collapsed && <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-slate-500" />
          : <ChevronLeft className="w-3 h-3 text-slate-500" />
        }
      </button>
    </aside>
  );
}

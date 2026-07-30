import { Link, useLocation } from "wouter";
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
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "main", href: "/dashboard" },
  { id: "subjects", label: "Subjects", icon: BookOpen, section: "main", href: "/subjects" },
  { id: "videos", label: "Video Learning", icon: PlayCircle, section: "main", href: "/videos" },
  { id: "pdfs", label: "PDF Library", icon: FileText, section: "main", href: "/pdfs" },
  { id: "quiz", label: "Quiz", icon: Brain, section: "practice", href: "/quiz" },
  { id: "flashcards", label: "Flashcards", icon: Layers, section: "practice", href: "/flashcards" },
  { id: "ai-solver", label: "AI Doubt Solver", icon: MessageSquare, section: "practice", href: "/ai-solver" },
  { id: "progress", label: "Progress", icon: TrendingUp, section: "analytics", href: "/progress" },
  { id: "rewards", label: "Rewards", icon: Trophy, section: "analytics", href: "/rewards" },
  { id: "subscription", label: "Subscription", icon: CreditCard, section: "analytics", href: "/subscription" },
];

// Only these are actually built so far — everything else in the sidebar
// still routes to a "coming soon" placeholder rather than a 404.
const BUILT_PAGES = new Set(["dashboard", "subjects","videos","pdfs","quiz","flashcards","ai-solver","progress","rewards"]);

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  const sections = [
    { key: "main", label: "MAIN MENU" },
    { key: "practice", label: "PRACTICE" },
    { key: "analytics", label: "ANALYTICS" },
  ];

  return (
    <aside
      className="relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shadow-sm"
      style={{ width: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-base font-bold text-slate-800 tracking-tight">Dr.</span>
            <span className="text-base font-bold text-blue-600">tragicMFA</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {sections.map((section) => (
          <div key={section.key} className="mb-4">
            {!collapsed && (
              <p className="text-xs font-semibold text-slate-400 px-3 mb-1 tracking-widest">
                {section.label}
              </p>
            )}
            {navItems
              .filter((item) => item.section === section.key)
              .map((item) => {
                const active = location.startsWith(item.href);
                const Icon = item.icon;
                const built = BUILT_PAGES.has(item.id);
                return (
                  <Link
                    key={item.id}
                    href={built ? item.href : "/coming-soon"}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-sm font-medium
                      ${active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-blue-600" : ""}`}
                      style={{ width: 18, height: 18 }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Bottom: user */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.academicYear ?? ""}</p>
            </div>
          )}
          {!collapsed && <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-500" />
        )}
      </button>
    </aside>
  );
}

import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
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
  Search,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../lib/api";

const navItems = [
  { id: "search", label: "Search", icon: Search, section: "main", href: "/search" },
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
  { id: "admin", label: "Admin Panel", icon: ShieldCheck, section: "admin", href: "/admin" },
];

const BUILT_PAGES = new Set(["search", "dashboard", "subjects", "videos", "pdfs", "quiz", "flashcards", "ai-solver", "progress", "rewards", "subscription", "admin"]);

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    adminApi
      .check()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, [user]);

  const sections = [
    { key: "main", label: "MAIN MENU" },
    { key: "practice", label: "PRACTICE" },
    { key: "analytics", label: "ANALYTICS" },
    ...(isAdmin ? [{ key: "admin", label: "ADMIN" }] : []),
  ];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={
          mobileOpen
            ? "fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 shadow-sm translate-x-0"
            : "fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 shadow-sm -translate-x-full md:translate-x-0"
        }
        style={{ width: collapsed ? 72 : 240 }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Dr.</span>
              <span className="text-base font-bold text-blue-600">tragicMFA</span>
            </div>
          )}
        </div>

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
                  const active = location.startsWith(item.href);
                  const Icon = item.icon;
                  const built = BUILT_PAGES.has(item.id);
                  const linkClass = active
                    ? "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-sm font-medium bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400"
                    : "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100";
                  return (
                    <Link
                      key={item.id}
                      href={built ? item.href : "/coming-soon"}
                      onClick={onMobileClose}
                      className={linkClass}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={active ? "w-4.5 h-4.5 flex-shrink-0 text-blue-600 dark:text-blue-400" : "w-4.5 h-4.5 flex-shrink-0"}
                        style={{ width: 18, height: 18 }}
                      />
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-700">
          <Link href="/profile" onClick={onMobileClose} className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.academicYear ?? ""}</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/settings" onClick={onMobileClose}>
                <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0 cursor-pointer" />
              </Link>
            )}
          </Link>
        </div>

        <button
          onClick={onToggle}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </aside>
    </>
  );
                     }

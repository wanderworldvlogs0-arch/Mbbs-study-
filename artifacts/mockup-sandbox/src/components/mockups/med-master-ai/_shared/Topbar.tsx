import { Bell, Moon, Sun, Flame, Coins } from "lucide-react";

interface TopbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  pageTitle?: string;
}

export function Topbar({ darkMode, onToggleDark, pageTitle }: TopbarProps) {
  return (
    <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-5 gap-4 flex-shrink-0">
      {pageTitle && (
        <h1 className="text-base font-semibold text-slate-800 dark:text-white mr-auto">{pageTitle}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        {/* Streak badge */}
        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full px-3 py-1 text-sm font-semibold">
          <Flame className="w-4 h-4" />
          <span>12</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full px-3 py-1 text-sm font-semibold">
          <Coins className="w-4 h-4" />
          <span>2,450</span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}

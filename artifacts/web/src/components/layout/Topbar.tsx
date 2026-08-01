import { Bell, Flame, LogOut, Menu } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  pageTitle?: string;
  streakCount: number;
  onMenuClick?: () => void;
}

export function Topbar({ pageTitle, streakCount, onMenuClick }: TopbarProps) {
  const { user, signOut } = useAuth();
  const [, navigate] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 md:px-5 gap-3 md:gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {pageTitle && (
        <h1 className="text-sm md:text-base font-semibold text-slate-800 mr-auto truncate">
          {pageTitle}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Streak badge */}
        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 rounded-full px-2.5 md:px-3 py-1 text-sm font-semibold">
          <Flame className="w-4 h-4" />
          <span>{streakCount}</span>
        </div>

        {/* Notifications (not wired to a real feed yet) */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative flex-shrink-0">
          <Bell className="w-4.5 h-4.5" />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer flex-shrink-0"
          title={user?.name}
        >
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>

        <button
          onClick={handleSignOut}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
          title="Sign out"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}

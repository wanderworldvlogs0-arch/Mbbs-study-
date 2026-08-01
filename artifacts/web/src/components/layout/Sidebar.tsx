href={built ? item.href : "/coming-soon"}
                      onClick={onMobileClose}
                      className={
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-sm font-medium
                        ${active
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={w-4.5 h-4.5 flex-shrink-0 ${active ? "text-blue-600" : ""}}
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

        <div className="p-3 border-t border-slate-100">
          <Link href="/profile" onClick={onMobileClose} className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.academicYear ?? ""}</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/settings" onClick={onMobileClose}>
                <Settings className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-pointer" />
              </Link>
            )}
          </Link>
        </div>

        <button
          onClick={onToggle}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-slate-500" />
          )}
        </button>
      </aside>
    </>
  );
}

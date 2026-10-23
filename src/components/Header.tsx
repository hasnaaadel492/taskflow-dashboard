"use client";

import { LayoutDashboard, Sun, Moon, Plus, History } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onOpenModal: () => void;
  onOpenActivityLog: () => void; // 👈 إضافة الـ Prop الجديدة
}

export default function Header({ isDark, toggleTheme, onOpenModal, onOpenActivityLog }: HeaderProps) {
  return (
    <header className={`border-b sticky top-0 z-30 backdrop-blur-md transition-colors ${
      isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white/80"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            TaskFlow <span className="text-indigo-500 font-bold text-xs bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Activity Log Button */}
          <button
            onClick={onOpenActivityLog}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark 
                ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                : "bg-stone-100 border-stone-200 text-slate-700 hover:bg-stone-200"
            }`}
            title="سجل الأنشطة"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark 
                ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" 
                : "bg-stone-100 border-stone-200 text-indigo-600 hover:bg-stone-200"
            }`}
            title="تغيير المظهر"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة مهمة جديدة</span>
          </button>
        </div>
      </div>
    </header>
  );
}
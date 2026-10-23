"use client";

import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  id: string;
  title: string;
  colorClass: string;
  badgeClass: string;
  count: number;
  children: React.ReactNode;
  isDark: boolean;
}

export default function KanbanColumn({ 
  id, 
  title, 
  colorClass, 
  badgeClass, 
  count, 
  children, 
  isDark 
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 p-3 rounded-2xl transition-colors min-h-[350px] ${
        isOver 
          ? (isDark ? "bg-slate-900/80 border border-indigo-500/50 shadow-lg" : "bg-indigo-50/60 border border-indigo-300 shadow-sm") 
          : (isDark ? "bg-slate-900/20 border border-slate-800/50" : "bg-slate-100/50 border border-slate-200/60")
      }`}
    >
      <div className={`flex items-center justify-between pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
          <h3 className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}>{title}</h3>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}>
          {count}
        </span>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
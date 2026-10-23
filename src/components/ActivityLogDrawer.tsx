"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { X, History, PlusCircle, RefreshCw, Trash2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export default function ActivityLogDrawer({ isOpen, onClose, isDark }: ActivityLogDrawerProps) {
  const { activities } = useTaskStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // تأخير بسيط جداً لضمان تشغيل الـ Fade In بسلاسة عند التركيب (Mount)
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300); // نفس مدة الـ transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "create":
        return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case "update":
        return <RefreshCw className="w-4 h-4 text-indigo-500" />;
      case "delete":
        return <Trash2 className="w-4 h-4 text-rose-500" />;
      case "subtask":
        return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-start">
      {/* Backdrop تتلاشى بسلاسة */}
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Drawer بظهور واختفاء Fade In / Out سلس جداً بدون أي حركة جانبية */}
      <div className={`relative w-full max-w-md h-full border-r shadow-2xl p-6 flex flex-col justify-between z-10 transition-all duration-300 ease-out transform ${
        isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
      } ${
        isDark ? "bg-slate-900/95 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
      }`}>
        <div className="space-y-6">
          {/* Header */}
          <div className={`flex items-center justify-between pb-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold">سجل الأنشطة والأحداث</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pl-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">لا يوجد أنشطة مسجلة حتى الآن.</p>
            ) : (
              activities.map((act) => (
                <div 
                  key={act.id} 
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    isDark ? "bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/70" : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/20 border border-slate-700/20 mt-0.5">
                    {getIcon(act.type)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className={`text-xs font-semibold leading-relaxed ${
                      isDark ? "text-slate-200" : "text-slate-800"
                    }`}>
                      {act.text}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
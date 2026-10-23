"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, Trash2, GripVertical, CheckSquare, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useTaskStore, Task } from "@/store/useTaskStore";

interface TaskCardProps {
  task: Task;
  isDark: boolean;
}

export default function TaskCard({ task, isDark }: TaskCardProps) {
  const { deleteTask, toggleSubtask, addSubtask } = useTaskStore();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // حساب إحصائيات المهام الفرعية
  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((st) => st.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-2xl border transition-all space-y-3 shadow-sm select-none ${
        isDragging ? "opacity-50 border-indigo-500 scale-105 shadow-xl" : ""
      } ${
        isDark ? "bg-slate-900/90 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Top Bar / Drag Handle & Priority Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button 
            {...listeners} 
            {...attributes} 
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-500 transition-colors p-0.5"
            title="اسحب لنقل المهمة"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            {task.category}
          </span>
        </div>

        {task.priority === "high" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">عالية</span>}
        {task.priority === "medium" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">متوسطة</span>}
        {task.priority === "low" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">منخفضة</span>}
      </div>

      {/* Task Title */}
      <h4 className={`text-xs font-bold leading-relaxed ${isDark ? "text-white" : "text-slate-800"}`}>{task.title}</h4>

      {/* Subtasks Progress Bar Section */}
      {totalSubtasks > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              <span>المهام الفرعية ({completedSubtasks}/{totalSubtasks})</span>
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/20 rounded-full overflow-hidden border border-slate-700/20">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Subtasks Toggle & Checklist */}
      <div className="pt-1">
        <button
          onClick={() => setShowSubtasks(!showSubtasks)}
          className={`w-full flex items-center justify-between py-1 text-[11px] font-semibold transition-colors ${
            isDark ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <span>{showSubtasks ? "إخفاء قائمة المراجعة" : "عرض/إضافة قائمة المراجعة"}</span>
          {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showSubtasks && (
          <div className="mt-2 space-y-2 pt-2 border-t border-slate-800/40">
            {/* Checklist items */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {subtasks.map((st) => (
                <label
                  key={st.id}
                  className={`flex items-center gap-2 text-[11px] p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubtask(task.id, st.id)}
                    className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <span className={`${st.completed ? "line-through text-slate-500" : isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {st.title}
                  </span>
                </label>
              ))}
            </div>

            {/* Form to add subtask */}
            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="إضافة عنصر فرعي..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className={`w-full px-2.5 py-1 rounded-lg border text-[11px] focus:outline-none focus:border-indigo-500 ${
                  isDark ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-lg transition-colors cursor-pointer"
                title="إضافة"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className={`flex items-center justify-between text-[11px] pt-2 border-t ${
        isDark ? "text-slate-500 border-slate-800/80" : "text-slate-400 border-slate-100"
      }`}>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{task.dueDate}</span>
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          title="حذف المهمة"
          className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
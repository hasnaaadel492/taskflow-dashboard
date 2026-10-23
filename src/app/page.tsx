"use client";

import { useState, useEffect } from "react";
import { useTaskStore, Priority } from "@/store/useTaskStore";
import Header from "@/components/Header";
import ActivityLogDrawer from "@/components/ActivityLogDrawer";
import TaskCard from "@/components/TaskCard";
import KanbanColumn from "@/components/KanbanColumn";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  Plus, 
  Search, 
  Sparkles,
  TrendingUp,
  X
} from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const { 
    tasks, 
    searchQuery, 
    selectedPriority, 
    theme,
    toggleTheme,
    addTask, 
    updateTaskStatus,
    setSearchQuery, 
    setSelectedPriority 
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      category: newTaskCategory || "عام",
      priority: newTaskPriority,
      status: "todo",
      dueDate: newTaskDueDate || new Date().toISOString().split("T")[0],
    });

    setNewTaskTitle("");
    setNewTaskCategory("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
    setIsModalOpen(false);
  };

  // معالجة حدث السحب والإفلات بين الأعمدة
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as "todo" | "in-progress" | "completed";

    if (["todo", "in-progress", "completed"].includes(newStatus)) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const isDark = theme === "dark";

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={`min-h-screen font-sans antialiased transition-colors duration-300 pb-20 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}>
        
<Header 
  isDark={isDark} 
  toggleTheme={toggleTheme} 
  onOpenModal={() => setIsModalOpen(true)}
  onOpenActivityLog={() => setIsActivityLogOpen(true)}
/>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {/* Stats Grid */}
          <div className="space-y-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <span>لوحة تحكم الإنتاجية</span>
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </h1>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                تتبع أداء مهامك وإدارتها بكل سهولة وانسيابية عبر السحب والإفلات.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div>
                  <span className="text-xs font-medium text-slate-500">إجمالي المهام</span>
                  <div className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{totalTasks}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20"><ListTodo className="w-5 h-5" /></div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div>
                  <span className="text-xs font-medium text-slate-500">قيد التنفيذ</span>
                  <div className="text-2xl font-bold text-amber-500 mt-1">{inProgressTasks}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20"><Clock className="w-5 h-5" /></div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div>
                  <span className="text-xs font-medium text-slate-500">المهام المكتملة</span>
                  <div className="text-2xl font-bold text-emerald-500 mt-1">{completedTasks}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20"><CheckCircle2 className="w-5 h-5" /></div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                <div>
                  <span className="text-xs font-medium text-slate-500">نسبة الإنجاز</span>
                  <div className="text-2xl font-bold text-purple-500 mt-1">{completionRate}%</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20"><TrendingUp className="w-5 h-5" /></div>
              </div>
            </div>
          </div>

          {/* Filter & Search */}
          <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl border ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                placeholder="ابحث عن مهمة أو تصنيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                name="no-search-autofill"
                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isDark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap pl-2">الأولوية:</span>
              {[
                { id: "all", label: "الكل" },
                { id: "high", label: "عالية" },
                { id: "medium", label: "متوسطة" },
                { id: "low", label: "منخفضة" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPriority(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedPriority === p.id ? "bg-indigo-600 text-white" : isDark ? "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white" : "bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban Board with Drag & Drop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn
              id="todo"
              title="قيد الانتظار"
              colorClass="bg-slate-400"
              badgeClass={isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-slate-100 text-slate-600 border-slate-200"}
              count={filteredTasks.filter((t) => t.status === "todo").length}
              isDark={isDark}
            >
              {filteredTasks.filter((t) => t.status === "todo").map((task) => (
                <TaskCard key={task.id} task={task} isDark={isDark} />
              ))}
            </KanbanColumn>

            <KanbanColumn
              id="in-progress"
              title="قيد التنفيذ"
              colorClass="bg-amber-400"
              badgeClass={isDark ? "bg-slate-900 text-amber-400 border-slate-800" : "bg-amber-50 text-amber-700 border-amber-200"}
              count={filteredTasks.filter((t) => t.status === "in-progress").length}
              isDark={isDark}
            >
              {filteredTasks.filter((t) => t.status === "in-progress").map((task) => (
                <TaskCard key={task.id} task={task} isDark={isDark} />
              ))}
            </KanbanColumn>

            <KanbanColumn
              id="completed"
              title="مكتملة"
              colorClass="bg-emerald-400"
              badgeClass={isDark ? "bg-slate-900 text-emerald-400 border-slate-800" : "bg-emerald-50 text-emerald-700 border-emerald-200"}
              count={filteredTasks.filter((t) => t.status === "completed").length}
              isDark={isDark}
            >
              {filteredTasks.filter((t) => t.status === "completed").map((task) => (
                <TaskCard key={task.id} task={task} isDark={isDark} />
              ))}
            </KanbanColumn>
          </div>

        </main>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"></div>
            <div className={`relative w-full max-w-md border rounded-3xl p-6 shadow-2xl z-10 space-y-5 ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
              <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <span>إضافة مهمة جديدة</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">عنوان المهمة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تطوير الواجهة الأمامية..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">التصنيف</label>
                  <input
                    type="text"
                    placeholder="مثال: برمجة، تصميم"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">الأولوية</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">تاريخ التسليم</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-lg shadow-indigo-600/20 cursor-pointer mt-2"
                >
                  إنشاء المهمة
                </button>
              </form>
            </div>
          </div>
        )}
<ActivityLogDrawer 
  isOpen={isActivityLogOpen} 
  onClose={() => setIsActivityLogOpen(false)} 
  isDark={isDark} 
/>
      </div>
    </DndContext>
  );
}
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "completed";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  subtasks?: Subtask[];
}

export interface Activity {
  id: string;
  text: string;
  time: string;
  type: "create" | "update" | "delete" | "subtask";
}

interface TaskState {
  tasks: Task[];
  activities: Activity[];
  searchQuery: string;
  selectedPriority: string;
  theme: "dark" | "light";
  toggleTheme: () => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: Status) => void;
  deleteTask: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPriority: (priority: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, subtaskTitle: string) => void;
  addActivity: (text: string, type: Activity["type"]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      tasks: [
        {
          id: "1",
          title: "تصميم واجهة متجر AuraPods",
          category: "التصميم والواجهات",
          priority: "high",
          status: "completed",
          dueDate: "2026-10-20",
          subtasks: [
            { id: "s1", title: "رسم الـ Wireframes", completed: true },
            { id: "s2", title: "تطبيق متطلبات الـ Responsive", completed: true },
          ],
        },
        {
          id: "2",
          title: "ربط Zustand Store بالـ Checkout",
          category: "البرمجة والتطوير",
          priority: "high",
          status: "in-progress",
          dueDate: "2026-10-24",
          subtasks: [
            { id: "s3", title: "إنشاء الـ Store الخاص بالطلب", completed: true },
            { id: "s4", title: "إضافة خاصية الحفظ LocalStorage", completed: false },
          ],
        },
      ],
      activities: [
        {
          id: "act-1",
          text: "تم إكمال جميع المهام الفرعية لـ AuraPods",
          time: "منذ 10 دقائق",
          type: "subtask",
        },
        {
          id: "act-2",
          text: "تم نقل المهمة 'ربط Zustand' إلى قيد التنفيذ",
          time: "منذ نصف ساعة",
          type: "update",
        },
      ],
      searchQuery: "",
      selectedPriority: "all",

      addActivity: (text, type) => {
        const newAct: Activity = {
          id: Date.now().toString(),
          text,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          type,
        };
        set((state) => ({
          activities: [newAct, ...state.activities.slice(0, 19)], // الاحتفاظ بآخر 20 نشاطاً
        }));
      },

      addTask: (task) => {
        const newTask = {
          ...task,
          id: Date.now().toString(),
          subtasks: task.subtasks || [],
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
        get().addActivity(`تم إنشاء المهمة الجديدة "${task.title}"`, "create");
      },

      updateTaskStatus: (id, status) => {
        const task = get().tasks.find((t) => t.id === id);
        const statusMap = {
          todo: "قيد الانتظار",
          "in-progress": "قيد التنفيذ",
          completed: "مكتملة",
        };
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        }));
        if (task) {
          get().addActivity(`تم نقل "${task.title}" إلى حالة ${statusMap[status]}`, "update");
        }
      },

      deleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        if (task) {
          get().addActivity(`تم حذف المهمة "${task.title}"`, "delete");
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedPriority: (priority) => set({ selectedPriority: priority }),

      toggleSubtask: (taskId, subtaskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        const subtask = task?.subtasks?.find((s) => s.id === subtaskId);
        
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === taskId && t.subtasks) {
              return {
                ...t,
                subtasks: t.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st
                ),
              };
            }
            return t;
          }),
        }));

        if (subtask && task) {
          const newStatus = !subtask.completed ? "إكمال" : "إلغاء إكمال";
          get().addActivity(`تم ${newStatus} العنصر الفرعي "${subtask.title}" في "${task.title}"`, "subtask");
        }
      },

      addSubtask: (taskId, subtaskTitle) => {
        const task = get().tasks.find((t) => t.id === taskId);
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === taskId) {
              const newSubtask: Subtask = {
                id: Date.now().toString(),
                title: subtaskTitle,
                completed: false,
              };
              return {
                ...t,
                subtasks: [...(t.subtasks || []), newSubtask],
              };
            }
            return t;
          }),
        }));
        if (task) {
          get().addActivity(`تم إضافة عنصر فرعي جديد إلى "${task.title}"`, "subtask");
        }
      },
    }),
    {
      name: "taskflow-storage",
    }
  )
);
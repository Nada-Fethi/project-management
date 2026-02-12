import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileStackIcon,
  ZapIcon,
} from "lucide-react";

import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";

export default function ProjectDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const tab = searchParams.get("tab") || "tasks";

  const navigate = useNavigate();
  const projects =
    useSelector((state) => state?.workspace?.currentWorkspace?.projects) || [];

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(tab);
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  useEffect(() => {
    if (projects.length) {
      const p = projects.find((proj) => proj.id === id);
      setProject(p);
      setTasks(p?.tasks || []);
    }
  }, [id, projects]);

  const statusColors = {
    PLANNING: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200",
    ACTIVE:
      "bg-emerald-200 text-emerald-900 dark:bg-emerald-500/80 dark:text-emerald-950",
    ON_HOLD:
      "bg-amber-200 text-amber-900 dark:bg-amber-500/80 dark:text-amber-950",
    COMPLETED:
      "bg-blue-200 text-blue-900 dark:bg-blue-500/80 dark:text-blue-950",
    CANCELLED: "bg-red-200 text-red-900 dark:bg-red-500/80 dark:text-red-950",
  };

  if (!project) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-bold mb-6">Project not found</h2>
        <button
          onClick={() => navigate("/projects")}
          className="px-5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
        >
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-zinc-900 dark:text-white">
      {/* ===== HEADER / HERO ===== */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/projects")}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-zinc-800 transition"
            >
              <ArrowLeftIcon className="size-4" />
            </button>

            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${statusColors[project.status]}`}
              >
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-blue-500 to-purple-600
            text-white shadow hover:scale-105 transition"
          >
            <PlusIcon className="size-4" />
            New Task
          </button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tasks",
            value: tasks.length,
            color: "text-zinc-900 dark:text-white",
          },
          {
            label: "Completed",
            value: tasks.filter((t) => t.status === "DONE").length,
            color: "text-emerald-600",
          },
          {
            label: "In Progress",
            value: tasks.filter(
              (t) => t.status === "IN_PROGRESS" || t.status === "TODO",
            ).length,
            color: "text-amber-600",
          },
          {
            label: "Team Members",
            value: project.members?.length || 0,
            color: "text-blue-600",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 flex justify-between items-center
            bg-white/70 dark:bg-zinc-900/60 backdrop-blur
            border border-zinc-200 dark:border-white/10
            shadow-sm hover:shadow-xl transition"
          >
            <div>
              <p className="text-sm text-zinc-500">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <ZapIcon className={`size-5 opacity-70 ${card.color}`} />
          </div>
        ))}
      </div>

      {/* ===== TABS ===== */}
      <div className="border-b border-zinc-200 dark:border-white/10 flex gap-6">
        {[
          { key: "tasks", label: "Tasks", icon: FileStackIcon },
          { key: "calendar", label: "Calendar", icon: CalendarIcon },
          { key: "analytics", label: "Analytics", icon: BarChart3Icon },
          { key: "settings", label: "Settings", icon: SettingsIcon },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key);
              setSearchParams({ id, tab: t.key });
            }}
            className={`relative pb-3 flex items-center gap-2 text-sm transition
            ${
              activeTab === t.key
                ? "text-blue-600 font-semibold"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <t.icon className="size-4" />
            {t.label}
            {activeTab === t.key && (
              <span className="absolute left-0 -bottom-px h-0.5 w-full bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="rounded-2xl p-4 bg-white dark:bg-zinc-900 shadow border border-zinc-200 dark:border-white/10">
        {activeTab === "tasks" && <ProjectTasks tasks={tasks} />}
        {activeTab === "calendar" && <ProjectCalendar tasks={tasks} />}
        {activeTab === "analytics" && (
          <ProjectAnalytics tasks={tasks} project={project} />
        )}
        {activeTab === "settings" && <ProjectSettings project={project} />}
      </div>

      {/* ===== MODAL ===== */}
      {showCreateTask && (
        <CreateTaskDialog
          showCreateTask={showCreateTask}
          setShowCreateTask={setShowCreateTask}
          projectId={id}
        />
      )}
    </div>
  );
}

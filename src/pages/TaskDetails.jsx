import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { CalendarIcon, MessageCircle, PenIcon } from "lucide-react";
import { assets } from "../assets/assets";

const TaskDetails = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const taskId = searchParams.get("taskId");

  const user = { id: "user_1" };
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const { currentWorkspace } = useSelector((state) => state.workspace);

  const fetchTaskDetails = async () => {
    setLoading(true);
    if (!projectId || !taskId) return;

    const proj = currentWorkspace.projects.find((p) => p.id === projectId);
    if (!proj) return;

    const tsk = proj.tasks.find((t) => t.id === taskId);
    if (!tsk) return;

    setTask(tsk);
    setProject(proj);
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      toast.loading("Adding comment...");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate API call

      const newCmt = {
        id: Date.now(),
        user: { id: 1, name: "User", image: assets.profile_img_a },
        content: newComment,
        createdAt: new Date(),
      };

      setComments((prev) => [...prev, newCmt]);
      setNewComment("");
      toast.dismissAll();
      toast.success("Comment added!");
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.message || "Failed to add comment");
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  if (loading)
    return (
      <div className="text-gray-500 dark:text-zinc-400 p-6">
        Loading task details...
      </div>
    );

  if (!task)
    return <div className="text-red-500 p-6">Task not found or deleted.</div>;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* ===== Left: Comments ===== */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="p-5 rounded-md border border-gray-300 dark:border-zinc-800 flex flex-col lg:h-[80vh] bg-white dark:bg-zinc-900">
          <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <MessageCircle className="size-5" /> Task Discussion (
            {comments.length})
          </h2>

          <div className="flex-1 overflow-y-auto no-scrollbar mb-4">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-md border border-gray-300 dark:border-zinc-700
                    ${c.user.id === user.id ? "ml-auto bg-blue-50 dark:bg-blue-900/30" : "mr-auto bg-zinc-100 dark:bg-zinc-800/60"}
                    max-w-[90%]`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-zinc-400">
                      <img
                        src={c.user.image}
                        alt="avatar"
                        className="size-5 rounded-full"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {c.user.name}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-zinc-600">
                        • {format(new Date(c.createdAt), "dd MMM yyyy, HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-zinc-200">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              onClick={handleAddComment}
              className="px-5 py-2 rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* ===== Right: Task & Project Info ===== */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Task Info */}
        <div className="p-5 rounded-md border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <h1 className="text-lg font-medium text-gray-900 dark:text-zinc-100">
            {task.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 text-xs">
              {task.status}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300 text-xs">
              {task.type}
            </span>
            <span className="px-2 py-0.5 rounded bg-green-200 dark:bg-emerald-900 text-green-900 dark:text-emerald-300 text-xs">
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-3">
              {task.description}
            </p>
          )}

          <hr className="my-3 border-zinc-200 dark:border-zinc-700" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <img
                src={task.assignee?.image}
                alt="assignee"
                className="size-5 rounded-full"
              />
              {task.assignee?.name || "Unassigned"}
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-500" />
              Due: {format(new Date(task.due_date), "dd MMM yyyy")}
            </div>
          </div>
        </div>

        {/* Project Info */}
        {project && (
          <div className="p-4 rounded-md border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200">
            <p className="text-xl font-medium mb-4">Project Details</p>
            <h2 className="flex items-center gap-2 text-gray-900 dark:text-zinc-100">
              <PenIcon className="size-4" /> {project.name}
            </h2>
            <p className="text-xs mt-3">
              Start Date: {format(new Date(project.start_date), "dd MMM yyyy")}
            </p>
            <div className="flex flex-wrap gap-4 text-sm mt-3">
              <span>Status: {project.status}</span>
              <span>Priority: {project.priority}</span>
              <span>Progress: {project.progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;

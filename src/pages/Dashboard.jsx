import { Plus } from "lucide-react";
import { useState } from "react";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";

const Dashboard = () => {
  const user = { fullName: "User" };
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-900/30 to-purple-900/40 dark:from-purple-900/30 dark:to-blue-900/30 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-200">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Track your progress & manage projects smarter
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl
      bg-gradient-to-r from-purple-400 to-purple-600
      text-white shadow-lg hover:scale-105 transition"
        >
          <Plus size={16} /> New
        </button>

        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      <StatsGrid />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProjectOverview />
          <RecentActivity />
        </div>
        <div>
          <TasksSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

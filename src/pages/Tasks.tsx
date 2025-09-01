import TaskManager from "@/components/tasks/TaskManager";
import { CheckSquare } from "lucide-react";

export default function Tasks() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Task & Habit Management</h1>
        </div>

        <TaskManager />
      </div>
    </div>
  );
}
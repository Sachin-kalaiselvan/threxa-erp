import React from "react";

interface GanttTask {
  id: string;
  name: string;
  start: number; // 0-100
  duration: number; // 0-100
  color?: string;
  status?: "completed" | "in_progress" | "pending";
}

interface GanttChartProps {
  title: string;
  tasks: GanttTask[];
  height?: number;
}

export default function GanttChart({
  title,
  tasks,
  height = 350,
}: GanttChartProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        className="bg-white rounded-lg p-6 border border-gray-200"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-600 font-semibold">{title}</p>
        <p className="text-gray-400 text-sm mt-4">No tasks available</p>
      </div>
    );
  }

  const statusColors = {
    completed: "#10b981",
    in_progress: "#3b82f6",
    pending: "#f59e0b",
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {/* Timeline header */}
        <div className="flex items-center gap-4">
          <div className="w-32 text-sm font-medium text-gray-700">Task</div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Tasks */}
        {tasks.map((task) => {
          const color =
            task.color ||
            statusColors[task.status || "pending"] ||
            "#3b82f6";

          return (
            <div key={task.id} className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-700 font-medium truncate">
                {task.name}
              </div>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg relative overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{
                    marginLeft: `${task.start}%`,
                    width: `${task.duration}%`,
                    backgroundColor: color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

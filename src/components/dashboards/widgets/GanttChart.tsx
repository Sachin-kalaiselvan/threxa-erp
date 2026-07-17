// src/components/dashboard/widgets/GanttChart.tsx

interface GanttItem {
  id: string;
  label: string;
  start: number;
  duration: number;
  status: "completed" | "in-progress" | "pending";
}

interface GanttChartProps {
  title: string;
  items: GanttItem[];
  maxTime?: number;
}

export default function GanttChart({
  title,
  items,
  maxTime = 24,
}: GanttChartProps) {
  const getStatusColor = (status: string) => {
    if (status === "completed") return "#10B981";
    if (status === "in-progress") return "#F59E0B";
    return "#D1D5DB";
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id}>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {item.label}
            </p>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-gray-100 rounded h-8 relative">
                <div
                  className="h-8 rounded flex items-center px-2 text-white text-xs font-semibold"
                  style={{
                    background: getStatusColor(item.status),
                    width: `${(item.duration / maxTime) * 100}%`,
                    marginLeft: `${(item.start / maxTime) * 100}%`,
                  }}
                  title={`${item.start}h - ${item.start + item.duration}h`}
                >
                  {item.duration}h
                </div>
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Time labels */}
      <div className="mt-4 text-xs text-gray-500 flex justify-between px-2">
        {Array.from({ length: Math.ceil(maxTime / 4) + 1 }).map((_, i) => (
          <span key={`time-${i}`}>{i * 4}h</span>
        ))}
      </div>
    </div>
  );
}

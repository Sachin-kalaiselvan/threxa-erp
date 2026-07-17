import React from "react";

interface HeatmapCell {
  label: string;
  value: number;
  max: number;
}

interface HeatmapProps {
  title: string;
  rows: Array<{
    name: string;
    cells: HeatmapCell[];
  }>;
}

export default function Heatmap({ title, rows }: HeatmapProps) {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 h-96 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const getColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 20) return "#fecaca"; // light red
    if (percentage < 40) return "#fca5a5"; // red
    if (percentage < 60) return "#fb923c"; // orange
    if (percentage < 80) return "#84cc16"; // lime
    return "#22c55e"; // green
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="pr-4 py-2 text-sm font-medium text-gray-700 w-32">
                  {row.name}
                </td>
                <td>
                  <div className="flex gap-2">
                    {row.cells.map((cell, cellIdx) => {
                      const color = getColor(cell.value, cell.max);
                      return (
                        <div key={cellIdx} className="flex flex-col items-center">
                          <div
                            className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-700"
                            style={{ backgroundColor: color }}
                            title={`${cell.label}: ${cell.value}/${cell.max}`}
                          >
                            {cell.value}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {cell.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fecaca" }} />
          <span>0-20%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fca5a5" }} />
          <span>20-40%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fb923c" }} />
          <span>40-60%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#84cc16" }} />
          <span>60-80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#22c55e" }} />
          <span>80-100%</span>
        </div>
      </div>
    </div>
  );
}

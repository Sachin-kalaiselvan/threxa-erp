// src/components/dashboard/widgets/Heatmap.tsx

interface HeatmapCell {
  value: number;
  min?: number;
  max?: number;
}

interface HeatmapProps {
  title: string;
  rows: string[];
  columns: string[];
  data: HeatmapCell[][];
  unit?: string;
}

export default function Heatmap({
  title,
  rows,
  columns,
  data,
  unit = "",
}: HeatmapProps) {
  // Find global min/max
  const allValues = data.flat().map((cell) => cell.value);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const range = globalMax - globalMin || 1;

  const getColor = (value: number) => {
    const normalized = (value - globalMin) / range;

    if (normalized < 0.33) {
      return "#EF4444"; // Red - low stock
    } else if (normalized < 0.66) {
      return "#F59E0B"; // Orange - medium
    } else {
      return "#10B981"; // Green - high
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24 text-left text-xs font-semibold text-gray-700 pb-3">
                Item
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-2 py-2 text-center text-xs font-semibold text-gray-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row}>
                <td className="font-medium text-sm text-gray-900 py-2">
                  {row}
                </td>
                {data[rowIndex]?.map((cell, colIndex) => (
                  <td
                    key={`${row}-${colIndex}`}
                    className="px-2 py-2 text-center"
                  >
                    <div
                      className="rounded p-2 text-white text-xs font-semibold text-center"
                      style={{
                        background: getColor(cell.value),
                      }}
                      title={`${cell.value}${unit} (Min: ${cell.min}, Max: ${cell.max})`}
                    >
                      {cell.value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-gray-600">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-gray-600">High</span>
        </div>
      </div>
    </div>
  );
}

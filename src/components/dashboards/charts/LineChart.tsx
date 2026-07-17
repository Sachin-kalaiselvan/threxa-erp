// src/components/dashboard/charts/LineChart.tsx

interface LineChartProps {
  title: string;
  labels: string[];
  data: number[];
  lineColor?: string;
  areaColor?: string;
  height?: number;
  showGrid?: boolean;
}

export default function LineChart({
  title,
  labels,
  data,
  lineColor = "#3B82F6",
  areaColor = "#DBEAFE",
  height = 250,
  showGrid = true,
}: LineChartProps) {
  const padding = 40;
  const chartHeight = height - 80;
  const chartWidth = 500;

  // Find min/max for scaling
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  // Calculate points
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = height - padding - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  // Create path
  const pathData = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const areaPathData =
    `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {/* Grid */}
        {showGrid &&
          Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 4}
              x2={chartWidth - padding}
              y2={padding + (i * (height - 2 * padding)) / 4}
              stroke="#E5E7EB"
              strokeDasharray="4"
            />
          ))}

        {/* Area fill */}
        <path d={areaPathData} fill={areaColor} opacity="0.3" />

        {/* Line */}
        <path d={pathData} stroke={lineColor} strokeWidth="2" fill="none" />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={lineColor}
          />
        ))}

        {/* X-axis labels */}
        {labels.map((label, i) => (
          <text
            key={`label-${i}`}
            x={padding + (i / (labels.length - 1)) * (chartWidth - 2 * padding)}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#6B7280"
          >
            {label}
          </text>
        ))}

        {/* Y-axis labels */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = minValue + (i * range) / 4;
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={padding + (i * (height - 2 * padding)) / 4 + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6B7280"
            >
              {Math.round(value)}
            </text>
          );
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#9CA3AF"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={chartWidth - padding}
          y2={height - padding}
          stroke="#9CA3AF"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

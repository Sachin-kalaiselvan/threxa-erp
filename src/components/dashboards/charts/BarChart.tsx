// src/components/dashboard/charts/BarChart.tsx

interface BarChartProps {
  title: string;
  categories: string[];
  data: Array<{
    name: string;
    values: number[];
    color: string;
  }>;
  height?: number;
  horizontal?: boolean;
}

export default function BarChart({
  title,
  categories,
  data,
  height = 300,
  horizontal = false,
}: BarChartProps) {
  const padding = 60;
  const chartHeight = height - 80;
  const chartWidth = 500;

  const maxValue = Math.max(
    ...data.flatMap((series) => series.values)
  );

  if (horizontal) {
    // Horizontal bars (for machine load, etc)
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="space-y-3">
          {categories.map((category, i) => (
            <div key={`bar-${i}`}>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {category}
              </p>
              <div className="flex gap-2">
                {data.map((series, j) => {
                  const percentage = (series.values[i] / maxValue) * 100;
                  return (
                    <div
                      key={`bar-segment-${j}`}
                      className="flex-1 rounded"
                      style={{
                        background: series.color,
                        height: "24px",
                        opacity: 0.8,
                      }}
                      title={`${series.name}: ${series.values[i]}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((data[0].values[i] / maxValue) * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical bars
  const barWidth = (chartWidth - 2 * padding) / (categories.length * data.length + categories.length - 1);
  const groupWidth = barWidth * data.length + 10;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
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

        {/* Bars */}
        {categories.map((category, catIndex) => (
          <g key={`group-${catIndex}`}>
            {data.map((series, seriesIndex) => {
              const value = series.values[catIndex];
              const barHeight = (value / maxValue) * (chartHeight - 20);
              const x =
                padding +
                catIndex * groupWidth +
                seriesIndex * barWidth;
              const y = height - padding - barHeight;

              return (
                <rect
                  key={`bar-${catIndex}-${seriesIndex}`}
                  x={x}
                  y={y}
                  width={barWidth - 2}
                  height={barHeight}
                  fill={series.color}
                  opacity="0.8"
                />
              );
            })}

            {/* X-axis label */}
            <text
              x={padding + catIndex * groupWidth + groupWidth / 2 - barWidth}
              y={height - 15}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
            >
              {category}
            </text>
          </g>
        ))}

        {/* Y-axis labels */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = Math.round((i * maxValue) / 4);
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={padding + ((4 - i) * (height - 2 * padding)) / 4 + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6B7280"
            >
              {value}
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

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center">
        {data.map((series, i) => (
          <div key={`legend-${i}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: series.color }}
            />
            <span className="text-sm text-gray-700">{series.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

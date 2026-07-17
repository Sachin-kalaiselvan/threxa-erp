import React from "react";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  data: BarData[];
  height?: number;
}

export default function BarChart({
  title,
  data,
  height = 300,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white rounded-lg p-6 border border-gray-200"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-600">{title}</p>
        <p className="text-gray-400 text-sm mt-4">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <svg
        viewBox="0 0 800 300"
        className="w-full"
        style={{ height: `${height}px` }}
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1="60"
            y1={60 + (i * 200) / 4}
            x2="780"
            y2={60 + (i * 200) / 4}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line x1="60" y1="260" x2="780" y2="260" stroke="#d1d5db" strokeWidth="2" />
        <line x1="60" y1="60" x2="60" y2="260" stroke="#d1d5db" strokeWidth="2" />

        {/* Bars */}
        {data.map((bar, idx) => {
          const barWidth = 700 / data.length;
          const barX = 70 + idx * barWidth;
          const barHeight = (bar.value / maxValue) * 200;
          const barY = 260 - barHeight;
          const color = bar.color || "#3b82f6";

          return (
            <g key={`bar-${idx}`}>
              <rect
                x={barX}
                y={barY}
                width={barWidth - 10}
                height={barHeight}
                fill={color}
                rx="4"
              />
              <text
                x={barX + (barWidth - 10) / 2}
                y="285"
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

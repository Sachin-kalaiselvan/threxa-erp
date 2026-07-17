import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  height?: number;
}

export default function LineChart({
  title,
  data,
  height = 300,
}: LineChartProps) {
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
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

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

        {/* Data points and line */}
        {data.map((point, idx) => {
          const x = 60 + (idx * 720) / (data.length - 1 || 1);
          const y = 260 - ((point.value - minValue) / range) * 200;
          return (
            <g key={`point-${idx}`}>
              <circle cx={x} cy={y} r="4" fill="#3b82f6" />
            </g>
          );
        })}

        {/* Path line connecting points */}
        <polyline
          points={data
            .map((point, idx) => {
              const x = 60 + (idx * 720) / (data.length - 1 || 1);
              const y = 260 - ((point.value - minValue) / range) * 200;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Labels */}
        {data.map((point, idx) => {
          const x = 60 + (idx * 720) / (data.length - 1 || 1);
          return (
            <text
              key={`label-${idx}`}
              x={x}
              y="285"
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

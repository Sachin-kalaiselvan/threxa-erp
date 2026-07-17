import React from "react";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: DonutData[];
}

export default function DonutChart({ title, data }: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 h-80 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { path, color: item.color, label: item.label, value: item.value };
  });

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          {slices.map((slice, idx) => (
            <path
              key={`slice-${idx}`}
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          <circle cx="100" cy="100" r="40" fill="white" />
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill="#1f2937"
          >
            {total}
          </text>
        </svg>

        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={`legend-${idx}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// src/components/dashboard/charts/DonutChart.tsx

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  segments: DonutSegment[];
  total: number;
  centerText?: string;
  centerSubtext?: string;
  size?: number;
}

export default function DonutChart({
  title,
  segments,
  total,
  centerText,
  centerSubtext,
  size = 200,
}: DonutChartProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 20;
  const innerRadius = outerRadius - 25;

  let currentAngle = 0;
  const arcs = segments.map((segment) => {
    const sliceAngle = (segment.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    currentAngle += sliceAngle;

    return { pathData, color: segment.color, segment };
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

      <div className="flex items-center justify-center gap-8">
        {/* Donut SVG */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc, i) => (
            <path
              key={`arc-${i}`}
              d={arc.pathData}
              fill={arc.color}
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Center text */}
          {centerText && (
            <>
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#1A202C"
              >
                {centerText}
              </text>
              {centerSubtext && (
                <text
                  x={centerX}
                  y={centerY + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6B7280"
                >
                  {centerSubtext}
                </text>
              )}
            </>
          )}
        </svg>

        {/* Legend */}
        <div className="space-y-2">
          {segments.map((segment, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: segment.color }}
              />
              <span className="text-sm text-gray-700">
                {segment.label}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {((segment.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

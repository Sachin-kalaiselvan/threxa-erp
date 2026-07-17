// src/components/dashboard/cards/KPICard.tsx

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  bgColor?: string;
  textColor?: string;
  icon?: string;
}

export default function KPICard({
  label,
  value,
  change,
  changeType = "neutral",
  bgColor = "#F0F4F8",
  textColor = "#1A202C",
  icon,
}: KPICardProps) {
  const getChangeColor = () => {
    if (changeType === "positive") return "#10B981";
    if (changeType === "negative") return "#EF4444";
    return "#6B7280";
  };

  return (
    <div
      className="rounded-lg p-6 shadow-sm"
      style={{
        background: bgColor,
        border: "1px solid #E5E7EB",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "#6B7280" }}
          >
            {label}
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: textColor }}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-3xl">{icon}</div>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className="text-sm font-semibold"
            style={{ color: getChangeColor() }}
          >
            {changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : "→"}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-500">
            vs yesterday
          </span>
        </div>
      )}
    </div>
  );
}

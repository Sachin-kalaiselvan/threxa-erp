// src/components/dashboard/tables/Table.tsx

interface TableColumn {
  key: string;
  label: string;
  type?: "text" | "number" | "badge" | "chart";
  width?: string;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

interface TableProps {
  title: string;
  columns: TableColumn[];
  rows: TableRow[];
  maxRows?: number;
}

export default function Table({
  title,
  columns,
  rows,
  maxRows = 5,
}: TableProps) {
  const displayRows = rows.slice(0, maxRows);

  const getBadgeColor = (value: string) => {
    if (value === "Completed" || value === "Dispatched") return "#10B981";
    if (value === "In Progress" || value === "In Transit") return "#F59E0B";
    if (value === "Pending") return "#6B7280";
    if (value === "Overdue") return "#EF4444";
    return "#6B7280";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ width: column.width || "auto" }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`border-b border-gray-100 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                {columns.map((column) => {
                  const value = row[column.key];

                  if (column.type === "badge") {
                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm"
                      >
                        <span
                          className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                          style={{
                            background: getBadgeColor(value),
                          }}
                        >
                          {value}
                        </span>
                      </td>
                    );
                  }

                  if (column.type === "number") {
                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm font-semibold text-gray-900 text-right"
                      >
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : value}
                      </td>
                    );
                  }

                  if (column.type === "chart") {
                    // Show a progress bar
                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="flex-1 bg-gray-200 rounded-full h-2"
                          >
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(value, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">
                            {value}%
                          </span>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > maxRows && (
        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-600">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}

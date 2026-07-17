import React from "react";

interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

interface TableProps {
  title: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export default function Table({ title, columns, rows }: TableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-sm font-semibold text-gray-900 text-${
                    col.align || "left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td
                    key={`${idx}-${col.key}`}
                    className={`px-6 py-4 text-sm text-gray-700 text-${
                      col.align || "left"
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  children,
  headerAction,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen p-8" style={{ background: "#e8e8e8" }}>
      <div className="max-w-full">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex gap-3">{headerAction}</div>}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

import React from "react";
import type { LucideIcon } from "lucide-react";
import "./StatCard.scss";

export type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: string;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = "var(--blue)",
}: StatCardProps) {
  return (
    <div className="stat-card card">
      <div className="icon" style={{ background: accent }}>
        <Icon size={20} color="#fff" />
      </div>
      <div className="meta">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  );
}

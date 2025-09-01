import React from "react";
import type { LucideIcon } from "lucide-react";
import "./QuickCard.scss";

export type QuickCardProps = {
  step: number;
  title: string;
  desc: string;
  icon: LucideIcon;
  iconBg: string; // CSS color for icon background
  actionLabel: string;
  actionTone?: "blue" | "green" | "violet";
  onAction?: () => void;
};

export default function QuickCard({
  step,
  title,
  desc,
  icon: Icon,
  iconBg,
  actionLabel,
  actionTone = "blue",
  onAction,
}: QuickCardProps) {
  return (
    <div className="quick-card">
      <div className="row">
        <div className="icon" style={{ background: iconBg }}>
          <Icon size={18} />
        </div>
        <div className="title">
          {step}) {title}
        </div>
      </div>
      <div className="desc">{desc}</div>
      <button className={`btn ${actionTone}`} onClick={onAction} type="button">
        {actionLabel}
      </button>
    </div>
  );
}

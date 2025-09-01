import React from "react";
import "./Pill.scss";

export type PillTone = "ok" | "warn" | "err";
export type PillProps = { tone?: PillTone; children: React.ReactNode };

export default function Pill({ tone = "ok", children }: PillProps) {
  return (
    <span className="pill">
      <span className={`dot ${tone}`} />
      {children}
    </span>
  );
}

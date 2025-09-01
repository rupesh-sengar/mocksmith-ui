import React from "react";
import "./ResultBadge.scss";

export type ResultBadgeProps = {
  tone?: "blue" | "green";
  children: React.ReactNode;
};

export default function ResultBadge({
  tone = "blue",
  children,
}: ResultBadgeProps) {
  return <span className={`res-badge ${tone}`}>{children}</span>;
}

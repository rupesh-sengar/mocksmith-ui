import React from "react";
import "./MethodBadge.scss";

export type MethodBadgeProps = {
  method: "GET" | "POST" | "PUT" | "DELETE" | string;
};
export function MethodBadge({ method }: MethodBadgeProps) {
  const key = method.toUpperCase();
  const cls =
    {
      GET: "method-get",
      POST: "method-post",
      PUT: "method-put",
      DELETE: "method-delete",
    }[key] ?? "method-get";
  return <span className={`badge ${cls}`}>{key}</span>;
}

export type StatusBadgeProps = { code: number };
export function StatusBadge({ code }: StatusBadgeProps) {
  const tone = code >= 500 ? "err" : code >= 400 ? "warn" : "ok";
  return (
    <span className={`badge status ${tone !== "ok" ? tone : ""}`}>{code}</span>
  );
}

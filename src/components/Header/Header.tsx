import React from "react";
import { HelpCircle } from "lucide-react";
import "./Header.scss";

export default function Header() {
  return (
    <div className="header card">
      <div className="crumbs muted">
        Home <span className="sep">›</span>{" "}
        <span className="current">Dashboard</span>
      </div>
      <div className="actions">
        <button className="btn">
          <HelpCircle size={16} /> Help
        </button>
        <div className="pill">
          <span className="dot" /> Connection{" "}
          <span className="ok">• Connected</span>
        </div>
      </div>
    </div>
  );
}

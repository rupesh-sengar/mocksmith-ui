import React from "react";
import {
  LayoutDashboard,
  Upload,
  Route as RouteIcon,
  TerminalSquare,
  ScrollText,
  FileDown,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import "./Sidebar.scss";

export type NavKey =
  | "dashboard"
  | "import"
  | "routes"
  | "playground"
  | "logs"
  | "exports"
  | "settings";

export type NavItem = {
  key: NavKey;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "import", label: "Import", icon: Upload },
  { key: "routes", label: "Routes", icon: RouteIcon },
  { key: "playground", label: "Playground", icon: TerminalSquare },
  { key: "logs", label: "Logs", icon: ScrollText },
  { key: "exports", label: "Exports", icon: FileDown },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

type SidebarProps = {
  current?: NavKey;
  onSelect?: (key: NavKey) => void;
};

export default function Sidebar({
  current = "dashboard",
  onSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">M</div>
        <div className="name">MockSmith</div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = key === current;
          return (
            <button
              key={key}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => onSelect?.(key)}
              aria-current={active ? "page" : undefined}
            >
              <span className="icon">
                <Icon size={18} />
              </span>
              <span className="text">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

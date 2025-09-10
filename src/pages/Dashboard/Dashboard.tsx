import React, { useState } from "react";
import "./Dashboard.scss";
import { Upload, Link2, Play, RefreshCw } from "lucide-react";
import QuickCard from "../../components/QuickCard/QuickCard";
import { MethodBadge, StatusBadge } from "../../components/Badges/MethodBadge";
import Pill from "../../components/Pill/Pill";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPage } from "../../store/appSlice";

type ActivityRow = {
  time: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | string;
  path: string;
  status: number;
  scenario: string;
  durationMs: number;
};

const SAMPLE_ROWS: ActivityRow[] = [
  {
    time: "10:31:02",
    method: "GET",
    path: "/users/123?active",
    status: 200,
    scenario: "ok-active",
    durationMs: 81,
  },
  {
    time: "10:30:58",
    method: "POST",
    path: "/orders",
    status: 201,
    scenario: "created-cod",
    durationMs: 152,
  },
];

export default function DashboardQS() {
  const [rows, setRows] = useState<ActivityRow[]>(SAMPLE_ROWS);
  const [auto, setAuto] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="dashboard-qspage">
      {/* Header row with project/env & connection pills */}
      <div className="header-row">
        <div>
          <div className="page-sub">
            Project: <span className="badge-soft">demo</span>
            &nbsp; Env: <span className="badge-soft green">dev</span>
          </div>
        </div>
        <div className="header-right">
          <Pill>Rate limit: 60 rpm</Pill>
          <Pill>Admin key set</Pill>
          <Pill>API key set</Pill>
        </div>
      </div>

      {/* Quick Start */}
      <section className="section">
        <h3 className="section-h">Quick Start</h3>
        <div className="quick-grid">
          <QuickCard
            step={1}
            title="Import Config"
            desc="Paste YAML/JSON → compile summary"
            icon={Upload}
            iconBg="#3b82f6"
            actionLabel="Upload Configuration"
            actionTone="blue"
            onAction={() => {
              dispatch(setPage("Import"));
              navigate("/import");
            }}
          />
          <QuickCard
            step={2}
            title="Review Routes"
            desc="See methods/paths, scenarios"
            icon={Link2}
            iconBg="#16a34a"
            actionLabel="View Routes"
            actionTone="green"
          />
          <QuickCard
            step={3}
            title="Try API"
            desc="Send sample requests"
            icon={Play}
            iconBg="#7c3aed"
            actionLabel="Open Playground"
            actionTone="violet"
            onAction={() => {
              dispatch(setPage("Playground"));
              navigate("/playground");
            }}
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="section">
        <div className="header-row">
          <h3 className="section-h">Recent Activity</h3>
          <div className="refresh-row">
            <button
              className="btn"
              type="button"
              onClick={() => setRows([...SAMPLE_ROWS])}
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <label className="auto">
              <input
                type="checkbox"
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
              />{" "}
              Auto-refresh
            </label>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 120 }}>TIME</th>
              <th style={{ width: 120 }}>METHOD</th>
              <th>PATH</th>
              <th style={{ width: 120 }}>STATUS</th>
              <th>SCENARIO</th>
              <th style={{ width: 140 }}>DURATION (MS)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.time}</td>
                <td>
                  <MethodBadge method={r.method} />
                </td>
                <td className="mono">{r.path}</td>
                <td>
                  <StatusBadge code={r.status} />
                </td>
                <td className="muted">{r.scenario}</td>
                <td className="strong">{r.durationMs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Status strip */}
      <section className="section">
        <h3 className="section-h">Status</h3>
        <div className="status-strip">
          <div className="status-item">
            <span className="status-dot" /> Project: demo
          </div>
          <div className="status-item">
            <span className="status-dot" /> Environment: dev
          </div>
          <div className="status-item">
            <span className="status-dot" /> Rate limit: 60 rpm
          </div>
          <div className="status-item">
            <span className="status-dot" /> Keys configured
          </div>
        </div>
      </section>
    </div>
  );
}

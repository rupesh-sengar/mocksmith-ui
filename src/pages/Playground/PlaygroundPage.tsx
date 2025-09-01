import React, { useEffect, useMemo, useState } from "react";
import "./PlaygroundPage.scss";
import {
  Plus,
  Upload,
  Share2,
  Copy,
  Send,
  Trash2,
  MoreVertical,
} from "lucide-react";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HeaderKV = { id: string; key: string; value: string };

type Preset = {
  id: string;
  label: string;
  method: Method;
  path: string;
  headers: HeaderKV[];
  body: string;
};

type HistoryRow = {
  id: string;
  timeLabel: string;
  method: Method;
  path: string;
  status: number;
  scenario?: string;
  durationMs: number;
};

export type PlaygroundProps = {
  /** e.g. http://localhost:8787 */
  baseUrl: string;
  /** mocksmith project, e.g. demo */
  project: string;
  /** mocksmith env, e.g. dev */
  env: string;
  /** mocksmith runtime key */
  apiKey: string;
};

const METHODS: Method[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const PRESETS_KEY = "mocksmith.playground.presets";

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}
function savePresets(p: Preset[]) {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(p));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function nowTimeLabel() {
  const d = new Date();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function toCurl(opts: {
  baseUrl: string;
  project: string;
  env: string;
  apiKey: string;
  method: Method;
  path: string;
  headers: HeaderKV[];
  body?: string;
}) {
  const { baseUrl, project, env, apiKey, method, path, headers, body } = opts;
  const url = `${baseUrl.replace(/\/$/, "")}/mock/${project}/${env}${
    path.startsWith("/") ? "" : "/"
  }${path}`;
  const hs = [
    `-H "x-mocksmith-key: ${apiKey}"`,
    ...headers
      .filter((h) => h.key.trim() !== "")
      .map((h) => `-H "${h.key}: ${h.value}"`),
  ];
  const data =
    body && method !== "GET" && method !== "DELETE"
      ? [`--data '${body.replace(/'/g, "'\\''")}'`]
      : [];
  return [`curl -X ${method}`, ...hs, ...data, `"${url}"`].join(" ");
}

export default function PlaygroundPage(props: PlaygroundProps) {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState<string>("/users/123?status=active");
  const [headers, setHeaders] = useState<HeaderKV[]>([
    { id: uid(), key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState<string>("");

  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string>("");

  const [resp, setResp] = useState<{
    status: number;
    timeMs: number;
    scenario?: string;
    headers: Record<string, string>;
    body: string | object | null;
  } | null>(null);

  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [presets, setPresets] = useState<Preset[]>(loadPresets());

  useEffect(() => savePresets(presets), [presets]);

  const disabledBody = method === "GET" || method === "DELETE";

  const curl = useMemo(
    () =>
      toCurl({
        baseUrl: props.baseUrl,
        project: props.project,
        env: props.env,
        apiKey: props.apiKey,
        method,
        path,
        headers,
        body,
      }),
    [
      props.baseUrl,
      props.project,
      props.env,
      props.apiKey,
      method,
      path,
      headers,
      body,
    ]
  );

  async function doSend() {
    setSending(true);
    setErr("");
    try {
      const url = `${props.baseUrl.replace(/\/$/, "")}/mock/${props.project}/${
        props.env
      }${path.startsWith("/") ? "" : "/"}${path}`;
      const hObj: Record<string, string> = {
        "x-mocksmith-key": props.apiKey,
      };
      headers.forEach((h) => {
        if (h.key.trim()) hObj[h.key] = h.value;
      });
      const t0 = performance.now();
      const res = await fetch(url, {
        method,
        headers: hObj,
        body: disabledBody ? undefined : body,
      });
      const ms = Math.round(performance.now() - t0);
      const txt = await res.text();
      let parsed: object | string | null = null;
      try {
        parsed = JSON.parse(txt);
      } catch {
        parsed = txt || null;
      }
      const headersObj = Object.fromEntries(res.headers.entries());
      const scenario =
        headersObj["x-mocksmith-scenario"] ||
        headersObj["x-scenario"] ||
        undefined;

      const r = {
        status: res.status,
        timeMs: ms,
        scenario,
        headers: headersObj,
        body: parsed,
      };
      setResp(r);
      // push into history
      setHistory((prev) => {
        const next: HistoryRow[] = [
          {
            id: uid(),
            timeLabel: nowTimeLabel(),
            method,
            path,
            status: r.status,
            scenario: r.scenario,
            durationMs: r.timeMs,
          },
          ...prev,
        ].slice(0, 10);
        return next;
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Request failed");
      }
      setResp(null);
    } finally {
      setSending(false);
    }
  }

  function addHeader() {
    setHeaders((h) => [...h, { id: uid(), key: "", value: "" }]);
  }
  function removeHeader(id: string) {
    setHeaders((h) => h.filter((x) => x.id !== id));
  }
  function updateHeader(id: string, patch: Partial<HeaderKV>) {
    setHeaders((h) => h.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function savePreset() {
    const label = prompt("Preset name", `${method} ${path}`)?.trim();
    if (!label) return;
    const p: Preset = {
      id: uid(),
      label,
      method,
      path,
      headers,
      body,
    };
    setPresets((arr) => [p, ...arr].slice(0, 10));
  }
  function applyPreset(p: Preset) {
    setMethod(p.method);
    setPath(p.path);
    setHeaders(p.headers);
    setBody(p.body);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      // ignore
    }
  }

  function exportResponse() {
    if (!resp) return;
    const blob = new Blob([JSON.stringify(resp, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "response.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="playground page">
      {/* Top right controls */}
      <div className="pg-toolbar">
        <div className="left">
          <span className="label">Presets:</span>
          <div className="chips">
            {presets.map((p) => (
              <button
                key={p.id}
                className="chip"
                onClick={() => applyPreset(p)}
                type="button"
                title={`${p.method} ${p.path}`}
              >
                {p.label}
              </button>
            ))}
            <button className="chip green" onClick={savePreset} type="button">
              <Plus size={14} /> Save preset
            </button>
          </div>
        </div>
        <div className="right">
          <button
            className="btn"
            type="button"
            onClick={exportResponse}
            disabled={!resp}
            title="Export last response JSON"
          >
            <Upload size={16} /> Export
          </button>
          <button
            className="btn blue"
            type="button"
            onClick={() => copy(curl)}
            title="Copy shareable cURL"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Request Builder */}
      <section className="card">
        <div className="section-head">Request Builder</div>
        <div className="req-row">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            className="method"
            title="Select HTTP method"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            className="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/users/123?status=active"
          />
          <button
            className="btn primary"
            type="button"
            onClick={doSend}
            disabled={sending}
            title="Send request"
          >
            <Send size={16} /> {sending ? "Sending..." : "Send"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => copy(curl)}
            title="Copy cURL"
          >
            <Copy size={16} /> Copy cURL
          </button>
        </div>

        <div className="kv-head">
          <span>Headers (key:value)</span>
          <button className="link" type="button" onClick={addHeader}>
            + Add header
          </button>
        </div>

        <table className="kv-table">
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "55%" }} />
            <col style={{ width: "5%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>KEY</th>
              <th>VALUE</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {headers.map((h) => (
              <tr key={h.id}>
                <td>
                  <input
                    className="input"
                    value={h.key}
                    onChange={(e) =>
                      updateHeader(h.id, { key: e.target.value })
                    }
                    placeholder="Header name"
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={h.value}
                    onChange={(e) =>
                      updateHeader(h.id, { value: e.target.value })
                    }
                    placeholder="Header value"
                  />
                </td>
                <td className="t-right">
                  <button
                    className="icon-btn"
                    onClick={() => removeHeader(h.id)}
                    title="Remove"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {headers.length === 0 && (
              <tr>
                <td colSpan={3} className="muted">
                  No headers
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={`body-wrap ${disabledBody ? "disabled" : ""}`}>
          <div className="body-label">
            Body (JSON){disabledBody && " — hidden for GET/DELETE"}
          </div>
          <textarea
            className="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              disabledBody
                ? "Request body is disabled for GET requests"
                : '{ "id": "123", "name": "rupesh" }'
            }
            disabled={disabledBody}
            spellCheck={false}
          />
        </div>

        {err && <div className="error">{err}</div>}
      </section>

      {/* Response */}
      <section className="card">
        <div className="section-head">Response</div>
        {!resp ? (
          <div className="muted" style={{ padding: 12 }}>
            Send a request to see response here.
          </div>
        ) : (
          <div className="resp">
            <div className="resp-top">
              <span>
                Status: <span className="badge green">{resp.status}</span>
              </span>
              <span>
                Time: <span className="badge">{resp.timeMs} ms</span>
              </span>
              {resp.scenario && (
                <span>
                  Scenario: <span className="badge grey">{resp.scenario}</span>
                </span>
              )}
            </div>

            <div className="resp-block">
              <div className="resp-title">Headers</div>
              <pre className="resp-pre">
                {JSON.stringify(resp.headers, null, 2)}
              </pre>
            </div>
            <div className="resp-block">
              <div className="resp-title">Body</div>
              <pre className="resp-pre">
                {typeof resp.body === "string"
                  ? resp.body
                  : JSON.stringify(resp.body, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>

      {/* History */}
      <section className="card">
        <div className="section-head">History (last 10)</div>
        <div className="history">
          {history.length === 0 ? (
            <div className="muted">No history yet.</div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="h-row" title={h.path}>
                <div className="h-left">
                  <div className="time">{h.timeLabel}</div>
                  <div className="method-badge">{h.method}</div>
                  <div className="path">{h.path}</div>
                  <div className="status-badge">{h.status}</div>
                  <div className="dur">{h.durationMs}ms</div>
                  {h.scenario && <div className="scenario">{h.scenario}</div>}
                </div>
                <button className="icon-btn" title="More" type="button">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

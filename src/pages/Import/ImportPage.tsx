import { useMemo, useState } from "react";
import "./ImportPage.scss";
import Segmented from "../../components/Segmented/Segmented";
import ResultBadge from "../../components/ResultBadge/ResultBadge";
import Dropzone from "../../components/Dropzone/Dropzone";
import { UploadCloud } from "lucide-react";
import { useImportConfigMutation } from "../../api/admin";

export default function ImportPage() {
  const [mode, setMode] = useState<"yaml" | "json">("yaml");
  const [text, setText] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [result, setResult] = useState<{
    routes: number;
    scenarios: number;
    valid: boolean;
  } | null>(null);

  const isYaml = mode === "yaml";

  const [mutate, { isLoading }] = useImportConfigMutation();

  const summary = useMemo(() => {
    const body = text || "";
    const routes =
      (body.match(/\bpath\s*:/g) || []).length ||
      (body.match(/"path"\s*:/g) || []).length;
    const scenarios =
      (body.match(/\bscenarios\s*:/g) || []).length > 0
        ? (body.match(/-\s*name\s*:/g) || []).length +
          (body.match(/"name"\s*:/g) || []).length
        : (body.match(/"scenarios"\s*:/g) || []).length;
    return { routes, scenarios, valid: body.trim().length > 0 };
  }, [text]);

  const handleClear = () => {
    setText("");
    setResult(null);
    setErr("");
  };

  const handleSample = () => {
    setMode("yaml");
    setText("");
    setResult(null);
    setErr("");
  };

  return (
    <div className="import-page">
      {/* Top toolbar */}
      <div className="toolbar">
        <div className="seg">
          <Segmented
            value={mode}
            options={[
              { label: "YAML", value: "yaml" },
              { label: "JSON", value: "json" },
            ]}
            onChange={(v) => setMode(v as "yaml" | "json")}
          />
        </div>
        <div className="actions">
          <button
            className="btn green"
            type="button"
            onClick={() =>
              mutate({
                body: text,
                isYaml,
                headers: {
                  "Content-Type": "application/yaml",
                  "X-ADMIN-KEY": "dev",
                },
              })
            }
            disabled={isLoading && !text.trim()}
          >
            {isLoading ? "Importing..." : "Import"}
          </button>
          <button className="btn" type="button" onClick={handleClear}>
            Clear
          </button>
          <button className="btn blue" type="button" onClick={handleSample}>
            Sample
          </button>
        </div>
      </div>

      {/* Content grid */}
      <div className="content-grid">
        <section className="editor card">
          <div className="editor-head">Configuration Editor</div>
          <textarea
            className="editor-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={isYaml ? "Paste YAML..." : "Paste JSON..."}
          />
          <Dropzone
            accept={[".yaml", ".yml", ".json"]}
            onText={(t) => setText(t)}
            icon={<UploadCloud size={18} />}
            label="Drag & drop your configuration file here"
            hint="Accepts .yaml, .yml, .json files"
          />
        </section>

        {/* Results */}
        <aside className="results card">
          <div className="results-head">Results</div>
          <div className="results-body">
            <div className="row">
              <span className="muted">Routes:</span>
              <ResultBadge tone="blue">
                {(result ?? summary).routes}
              </ResultBadge>
            </div>
            <div className="row">
              <span className="muted">Scenarios:</span>
              <ResultBadge tone="green">
                {(result ?? summary).scenarios}
              </ResultBadge>
            </div>

            <div className="divider" />

            {err ? (
              <div className="status err">
                <span className="dot" /> <span>{err}</span>
              </div>
            ) : (
              <div
                className={`status ${(result ?? summary).valid ? "ok" : "err"}`}
              >
                <span className="dot" />
                <span>
                  {(result ?? summary).valid
                    ? "Valid Configuration"
                    : "Invalid Configuration"}
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

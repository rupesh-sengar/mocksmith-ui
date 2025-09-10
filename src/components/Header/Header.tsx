import { HelpCircle } from "lucide-react";
import "./Header.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function Header() {
  const page = useSelector((state: RootState) => state.app.page);
  return (
    <div className="header card">
      <div className="crumbs muted">
        Home <span className="sep">›</span>{" "}
        <span className="current">{page}</span>
      </div>
      <div className="actions">
        <button className="btn" type="button">
          <HelpCircle size={16} /> Help
        </button>
      </div>
    </div>
  );
}

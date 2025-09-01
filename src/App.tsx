import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar, { type NavKey } from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.scss";
import ImportPage from "./pages/Import/ImportPage";
import PlaygroundPage from "./pages/Playground/PlaygroundPage";

function Shell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const current = ((): NavKey => {
    const seg = (pathname.split("/")[1] || "dashboard") as NavKey;
    const valid: NavKey[] = [
      "dashboard",
      "import",
      "routes",
      "playground",
      "logs",
      "exports",
      "settings",
    ];
    return valid.includes(seg) ? seg : "dashboard";
  })();

  return (
    <div className="app-shell">
      <Sidebar current={current} onSelect={(key) => navigate(`/${key}`)} />
      <div className="app-main">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/import" element={<ImportPage />} />
          <Route
            path="/playground"
            element={
              <PlaygroundPage
                baseUrl="http://localhost:8787"
                project="demo"
                env="dev"
                apiKey="DEMO_KEY"
              />
            }
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

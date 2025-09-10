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
import { useDispatch } from "react-redux";
import { setPage } from "./store/appSlice";

function Shell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

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
      <Sidebar
        current={current}
        onSelect={(key) => {
          dispatch(setPage(key.charAt(0).toUpperCase() + key.slice(1)));
          navigate(`/${key}`);
        }}
      />
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

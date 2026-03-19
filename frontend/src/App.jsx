import { useState, useEffect } from "react";
import BehaviorForm from "./components/BehaviorForm";
import Recommendations from "./components/Recommendations";
import RiskCard from "./components/RiskCard";
import TrendChart from "./components/TrendChart";
import { predictBurnout } from "./services/api";
import DashboardPage from "./pages/DashboardPage";
import PredictPage from "./pages/PredictPage";
import ResearchPage from "./pages/ResearchPage";
import CsvUploadPage from "./pages/CsvUploadPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("burnoutSenseDarkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("burnoutSenseDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1>BurnoutSense</h1>
            <span className="navbar-badge">Research Prototype</span>
          </div>
          <ul className="nav-tabs">
            <li>
              <button
                className={`nav-tab ${currentPage === "dashboard" ? "active" : ""}`}
                onClick={() => setCurrentPage("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`nav-tab ${currentPage === "predict" ? "active" : ""}`}
                onClick={() => setCurrentPage("predict")}
              >
                Predict
              </button>
            </li>
            <li>
              <button
                className={`nav-tab ${currentPage === "batch" ? "active" : ""}`}
                onClick={() => setCurrentPage("batch")}
              >
                Batch
              </button>
            </li>
            <li>
              <button
                className={`nav-tab ${currentPage === "analytics" ? "active" : ""}`}
                onClick={() => setCurrentPage("analytics")}
              >
                Analytics
              </button>
            </li>
            <li>
              <button
                className={`nav-tab ${currentPage === "research" ? "active" : ""}`}
                onClick={() => setCurrentPage("research")}
              >
                Research
              </button>
            </li>
            <li>
              <button
                className="nav-tab"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle dark mode"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === "dashboard" && <DashboardPage />}
        {currentPage === "predict" && <PredictPage />}
        {currentPage === "batch" && <CsvUploadPage />}
        {currentPage === "analytics" && <AnalyticsPage />}
        {currentPage === "research" && <ResearchPage />}
      </main>

      <footer className="footer">
        <p>&copy; 2024 BurnoutSense Research Prototype. Academic Burnout Index Analysis.</p>
        <p>Built with React, FastAPI, and scikit-learn for student well-being research.</p>
      </footer>
    </div>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import Skills from "./pages/Skills.jsx";
import Applications from "./pages/Applications.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </main>
    </div>
  );
}

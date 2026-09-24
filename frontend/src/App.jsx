import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserContext.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Internships from "./pages/Internships.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Applications from "./pages/Applications.jsx";
import Companies from "./pages/Companies.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App pages (sidebar layout inside each page) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<JobDetail />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}

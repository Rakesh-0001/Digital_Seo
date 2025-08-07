import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import './App.css';
import Dashboard_one from "./Components/Dashboard_one";
import Dashboard_two from "./Components/Dashboard_two";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On reload, restore token
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    if (token && role && name) {
      setUser({ token, role, name });
    }
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-bg d-flex min-vh-100" style={{ overflow: "hidden" }}>
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column">
          <Topbar user={user} onLogout={handleLogout} />
          <div className="main-content flex-grow-1 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/Dashboard_one" element={<Dashboard_one></Dashboard_one>} /> 
              <Route path="/Dashboard_two" element={<Dashboard_two></Dashboard_two>} /> 
              <Route path="*" element={<Navigate to="/Dashboard_one" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
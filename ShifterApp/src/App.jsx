import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Schedule from "./Components/Schedule";
import HomePage from "./Components/HomePage";
import { Navigate } from "react-router-dom";
import UserPanel from "./Components/UserPanel";
import Login from "./Components/Login";
import api from "./Components/ApiConfig";
import ShiftPlanner from "./Components/ShiftPlanner";
import { AuthProvider } from "./Components/AuthContext";

function App() {
 

  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/userpanel" element={<UserPanel />} />
          <Route path="/shiftPlanner" element={<ShiftPlanner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
function ConditionalNavbar() {
    const location = useLocation();
  
    return location.pathname === '/' ? null : <NavBar />;
  }

export default App;

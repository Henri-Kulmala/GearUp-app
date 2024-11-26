
//import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./Components/NavBar";
import Schedule from './Components/Schedule';
import HomePage from "./Components/HomePage";
import UserPanel from "./Components/UserPanel";
//import Login from './Components/Login';
//import axios from 'axios';
import ShiftPlanner from './Components/ShiftPlanner';

function App() {
    //const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, role: null });
//
    //
    //useEffect(() => {
    //    const checkAuthStatus = async () => {
    //        try {
    //            const response = await axios.get('http://localhost:8080/api/auth/status', { withCredentials: true });
    //            if (response.data.isAuthenticated) {
    //                setAuthStatus({ isAuthenticated: true, role: response.data.role });
    //            }
    //        } catch (err) {
    //            console.error("Error checking authentication status:", err);
    //            setAuthStatus({ isAuthenticated: false, role: null });
    //        }
    //    };
    //    checkAuthStatus();
    //}, []);

    return (
        <Router>
            <NavBar />
            <Routes> 
                <Route path="/userpanel" element={<UserPanel />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/shiftplanner" element={<ShiftPlanner />} />
                
            </Routes>
        </Router>
    );
}

export default App;

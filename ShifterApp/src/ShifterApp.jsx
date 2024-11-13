// ShifterApp.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from "./Components/NavBar";
import Schedule from './Components/Schedule';
import HomePage from "./Components/HomePage";
import SignIn from './Components/SignIn';
import axios from 'axios';

function ShifterApp() {
    const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, role: null });

    
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/status', { withCredentials: true });
                if (response.data.isAuthenticated) {
                    setAuthStatus({ isAuthenticated: true, role: response.data.role });
                }
            } catch (err) {
                console.error("Error checking authentication status:", err);
                setAuthStatus({ isAuthenticated: false, role: null });
            }
        };
        checkAuthStatus();
    }, []);

    return (
        <Router>
            <NavBar />
            <Routes> 

                <Route path="/home" element={<HomePage />} />
                <Route path="/schedule" element={<Schedule />} />
                {authStatus.isAuthenticated ? (
                    <>
                        
                        <Route path="*" element={<Navigate to="/home" />} />
                    </>
                ) : (
                    <>
                        <Route path="/signin" element={<SignIn setAuthStatus={setAuthStatus} />} />
                        <Route path="*" element={<Navigate to="/signin" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default ShifterApp;

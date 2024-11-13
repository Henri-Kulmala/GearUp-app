import { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import axios from 'axios';

function SignIn({ setAuthStatus }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Attempt login
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password,
            }, { withCredentials: true });
            
            if (response.status === 200) {
                console.log("Login successful. Retrieving auth status...");
                
                // Retrieve the CSRF token from cookies if using Spring's CookieCsrfTokenRepository
                const csrfToken = document.cookie.split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];

                // Check auth status with the CSRF token
                const statusResponse = await axios.get('http://localhost:8080/api/auth/status', {
                    withCredentials: true,
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                
                console.log('Status response:', statusResponse);
                
                if (statusResponse.data && statusResponse.data.isAuthenticated) {
                    setAuthStatus({ isAuthenticated: true, role: statusResponse.data.role });
                    navigate('/Home'); // Redirect to HomePage
                } else {
                    setError("Authentication status check failed.");
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Invalid username or password.");
            } else {
                console.error("Error signing in or retrieving status:", err);
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: 'white',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mt: 1, mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

SignIn.propTypes = {
    setAuthStatus: PropTypes.func.isRequired,
};

export default SignIn;

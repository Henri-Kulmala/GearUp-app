import { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from "./ApiConfig";
import {useAuth} from "./AuthContext";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await api.post('/api/auth/login', {
                username,
                password,
              });
            
            if (response.status === 200) {
                setAuth({ username, password });
                navigate('/home');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log("Authenticated params", username, password)
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


export default Login;

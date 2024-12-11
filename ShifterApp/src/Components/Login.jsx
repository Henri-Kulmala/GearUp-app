import { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import LoginIcon from '@mui/icons-material/Login';

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate('/home');
    } catch {
      setError("Invalid username or password");
    }
  };

    return (
        <Container component="main" maxWidth="xs">
            <Typography
                textAlign='center'
                variant='h1'
                fontWeight={600}
                sx={{color: '#191b1f'}}
            >
                Sign in to Shifter!
            </Typography>
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
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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
                        <LoginIcon />
                        Log In
                    </Button>

                </Box>
            </Box>
        </Container>
    );
}


export default Login;

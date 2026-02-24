import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RootState, AppDispatch } from '@/store';
import { loginUser, clearAuthError } from '@/store/slices/authSlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { med } from '@/styles/themes/theme';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 0),
  backgroundColor: med.surface,
}));

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/upload', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    dispatch(loginUser({ username: username.trim(), password }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <LoginContainer>
        <Container maxWidth="xs">
          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: `${med.radius + 4}px`, border: `1px solid ${med.border}`, boxShadow: 'none' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: `${med.radius}px`, bgcolor: med.primaryLight, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                <RemoveRedEyeIcon sx={{ fontSize: 26, color: med.primary }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                Sign in to continue to RetinaAI
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2 }}
                autoFocus
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !username.trim() || !password}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
              </Button>
            </Box>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 3 }}
            >
              Don't have an account?{' '}
              <MuiLink component={Link} to="/register" underline="hover">
                Register
              </MuiLink>
            </Typography>
          </Paper>
        </Container>
      </LoginContainer>

      <Footer />
    </Box>
  );
};

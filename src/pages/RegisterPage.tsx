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
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RootState, AppDispatch } from '@/store';
import { registerUser, clearAuthError } from '@/store/slices/authSlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { med } from '@/styles/themes/theme';

const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 0),
  backgroundColor: med.surface,
}));

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'ophthalmologist'>('patient');
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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
    setPasswordError('');
    if (!username.trim() || !email.trim() || !password) return;
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const result = await dispatch(
      registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <RegisterContainer>
        <Container maxWidth="xs">
          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: `${med.radius + 4}px`, border: `1px solid ${med.border}`, boxShadow: 'none' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: `${med.radius}px`, bgcolor: med.primaryLight, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                <RemoveRedEyeIcon sx={{ fontSize: 26, color: med.primary }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                Create account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                Register to start analysing retinal images
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Redirecting to login...
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
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
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
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                error={!!passwordError}
                helperText={passwordError}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: med.dark }}>I am a:</Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(_e, v) => v && setRole(v)}
                fullWidth
                sx={{ mb: 3 }}
                size="small"
              >
                <ToggleButton value="patient" sx={{ textTransform: 'none', borderRadius: `${med.radiusSm}px 0 0 ${med.radiusSm}px` }}>
                  <PersonIcon sx={{ mr: 0.75, fontSize: 18 }} /> Patient
                </ToggleButton>
                <ToggleButton value="ophthalmologist" sx={{ textTransform: 'none', borderRadius: `0 ${med.radiusSm}px ${med.radiusSm}px 0` }}>
                  <LocalHospitalIcon sx={{ mr: 0.75, fontSize: 18 }} /> Ophthalmologist
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !username.trim() || !email.trim() || !password || !confirmPassword}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>

            <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" underline="hover">
                Log In
              </MuiLink>
            </Typography>
          </Paper>
        </Container>
      </RegisterContainer>

      <Footer />
    </Box>
  );
};

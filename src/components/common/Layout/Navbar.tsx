import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { med } from '@/styles/themes/theme';

/* ── styled pieces ─────────────────────────────────────────── */

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: med.surfaceElevated,
  boxShadow: 'none',
  borderBottom: `1px solid ${med.border}`,
  backdropFilter: 'blur(12px)',
})) as typeof AppBar;

interface NavChipProps {
  $active?: boolean;
  component?: React.ElementType;
  to?: string;
}

const NavChip = styled(Button, {
  shouldForwardProp: (p) => p !== '$active',
})<NavChipProps>(({ $active }) => ({
  color: $active ? med.primary : med.muted,
  fontWeight: 600,
  fontSize: '0.8125rem',
  padding: '6px 14px',
  borderRadius: `${med.radiusXs}px`,
  backgroundColor: $active ? med.primaryLight : 'transparent',
  '&:hover': {
    backgroundColor: $active ? med.primaryLight : med.borderLight,
  },
  textTransform: 'none',
  minWidth: 'auto',
  transition: 'all 0.15s ease',
}));

/* role → colour helper */
const roleColor = (role?: string) => {
  switch (role) {
    case 'admin':
      return '#D64045';
    case 'ophthalmologist':
      return '#0D7C66';
    default:
      return '#5F6B7A';
  }
};

const roleLabel = (role?: string) => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'ophthalmologist':
      return 'Ophthalmologist';
    default:
      return 'Patient';
  }
};

/* ── component ─────────────────────────────────────────────── */

interface NavbarProps {
  onGetStarted?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();

  const { user, token } = useSelector((state: RootState) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon fontSize="small" /> },
    { path: '/upload', label: 'Scan', icon: <CloudUploadIcon fontSize="small" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
    { path: '/history', label: 'History', icon: <HistoryIcon fontSize="small" /> },
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
    dispatch(logout());
    navigate('/');
  };

  /* ── Mobile drawer ────── */
  const drawer = (
    <Box sx={{ width: 280, pt: 2, pb: 3 }}>
      {/* drawer header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RemoveRedEyeIcon sx={{ color: med.primary, fontSize: 26 }} />
          <Typography variant="h6" fontWeight={700} sx={{ color: med.dark }}>
            RetinaAI
          </Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* nav links */}
      <List sx={{ px: 1, mt: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  bgcolor: active ? med.primaryLight : 'transparent',
                  color: active ? med.primary : med.dark,
                  '&:hover': { bgcolor: med.primaryLight },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* auth section inside drawer */}
      {token && user ? (
        <Box sx={{ px: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: roleColor(user.role), fontSize: '0.875rem' }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{user.username}</Typography>
              <Typography variant="caption" sx={{ color: roleColor(user.role), fontWeight: 600 }}>
                {roleLabel(user.role)}
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: '10px' }}
          >
            Log Out
          </Button>
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => { setDrawerOpen(false); navigate('/login'); }}
            startIcon={<LoginIcon />}
            sx={{ borderRadius: '10px' }}
          >
            Log In
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => { setDrawerOpen(false); navigate('/register'); }}
            sx={{ borderRadius: '10px' }}
          >
            Create Account
          </Button>
        </Box>
      )}
    </Box>
  );

  /* ── Render ────── */
  return (
    <>
      <StyledAppBar position="sticky" elevation={0} component={'header' as React.ElementType}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 } }}>
            {/* Logo */}
            <RouterLink
              to="/"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 16 }}
            >
              <RemoveRedEyeIcon sx={{ fontSize: 28, color: med.primary, mr: 0.75 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: med.dark, fontSize: '1.125rem' }}>
                RetinaAI
              </Typography>
            </RouterLink>

            {/* Desktop nav */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center', gap: 0.5 }}>
                {navItems.map((item) => (
                  <NavChip
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    $active={location.pathname === item.path}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </NavChip>
                ))}
              </Box>
            )}

            {/* Spacer on mobile */}
            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* Desktop auth */}
            {!isMobile && (
              <>
                {token && user ? (
                  <>
                    <Button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '10px',
                        px: 1.5,
                        py: 0.75,
                        border: `1px solid ${med.border}`,
                        color: med.dark,
                        '&:hover': { bgcolor: med.borderLight },
                      }}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: roleColor(user.role),
                          fontSize: '0.75rem',
                          mr: 1,
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ textAlign: 'left', lineHeight: 1.2 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
                          {user.username}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: '0.6875rem', color: roleColor(user.role), fontWeight: 600 }}
                        >
                          {roleLabel(user.role)}
                        </Typography>
                      </Box>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuOpen}
                      onClose={() => setAnchorEl(null)}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      slotProps={{ paper: { sx: { mt: 1, borderRadius: '12px', minWidth: 180 } } }}
                    >
                      <MenuItem disabled sx={{ opacity: 1 }}>
                        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                        <ListItemText
                          primary={user.username}
                          secondary={roleLabel(user.role)}
                          secondaryTypographyProps={{ sx: { color: roleColor(user.role), fontWeight: 600, fontSize: '0.7rem' } }}
                        />
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ color: '#D64045' }}>
                        <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#D64045' }} /></ListItemIcon>
                        Log Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="text"
                      startIcon={<LoginIcon />}
                      sx={{ fontWeight: 600, color: med.dark, borderRadius: '10px' }}
                    >
                      Log In
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/register')}
                      sx={{ borderRadius: '10px' }}
                    >
                      Get Started
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Hamburger on mobile */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: med.dark }}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
};
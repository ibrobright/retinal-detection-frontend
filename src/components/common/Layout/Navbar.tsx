import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';

// ✅ Styled AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  borderBottom: '1px solid #E0E0E0',
}));

// ✅ Logo Text
const LogoText = styled(Typography)({
  flexGrow: 1,
  fontWeight: 700,
  fontSize: '1.5rem',
  color: '#1976D2',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

// ✅ FIXED: Proper TypeScript typing for component/to props
interface NavButtonProps {
  $active?: boolean;
  component?: React.ElementType;
  to?: string;
}

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$active',
})<NavButtonProps>(({ theme, $active }) => ({
  color: $active ? '#1976D2' : '#757575',
  fontWeight: 600,
  marginLeft: theme.spacing(2),
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: $active ? '#E3F2FD' : 'transparent',
  '&:hover': {
    backgroundColor: $active ? '#BBDEFB' : '#F5F7FA',
  },
  textTransform: 'none',
}));

// ✅ Get Started Button
const GetStartedButton = styled(Button)({
  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  color: '#FFFFFF',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '8px',
  marginLeft: '16px',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
  },
  textTransform: 'none',
});

// ✅ FIXED: NavbarProps interface with onGetStarted
interface NavbarProps {
  onGetStarted?: () => void;  // ✅ This must match Layout's prop
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted }) => {
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> },
    { path: '/upload', label: 'Upload', icon: <CloudUploadIcon sx={{ mr: 1, fontSize: 20 }} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon sx={{ mr: 1, fontSize: 20 }} /> },
    { path: '/history', label: 'History', icon: <HistoryIcon sx={{ mr: 1, fontSize: 20 }} /> },
  ];

  return (
    <StyledAppBar position="sticky" elevation={0} component="header">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <RouterLink 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center',
              marginRight: theme.spacing(2)
            }}
          >
            <PsychologyIcon sx={{ fontSize: 32, color: '#1976D2' }} aria-hidden="true" />
            <LogoText variant="h6" component="span">RetinaAI</LogoText>
          </RouterLink>

          {/* Navigation Items */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            justifyContent: 'center',
            gap: 1
          }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  $active={isActive}
                  startIcon={item.icon}
                >
                  {item.label}
                </NavButton>
              );
            })}
          </Box>

          {/* Get Started Button */}
          <GetStartedButton
            variant="contained"
            onClick={onGetStarted}  // ✅ Use the prop directly
          >
            Get Started
          </GetStartedButton>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};
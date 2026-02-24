import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// ✅ Interface with proper typing
interface LayoutProps {
  children: React.ReactNode;
  onGetStarted?: () => void;  // ✅ Optional callback
}

export const Layout: React.FC<LayoutProps> = ({ children, onGetStarted }) => {
  return (
    <>
      <CssBaseline />
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#FAFBFC',
        }}
      >
        {/* ✅ Pass onGetStarted to Navbar */}
        <Navbar onGetStarted={onGetStarted} />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        
        <Footer />
      </Box>
    </>
  );
};
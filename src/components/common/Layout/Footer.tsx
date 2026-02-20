import React from 'react';
import { Box, Container, Typography, Grid, Link, LinkProps, Divider } from '@mui/material'; // ✅ Import LinkProps
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';

// ✅ Styled Components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#0d1642',
  color: '#FFFFFF',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

// ✅ FIXED: Extend MUI's LinkProps + add our custom props
interface FooterLinkProps extends LinkProps {
  component?: React.ElementType;
  to?: string;
}

const FooterLink = styled(Link)<FooterLinkProps>(({ theme }) => ({
  color: '#B0BEC5',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '8px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#FFFFFF',
    textDecoration: 'none',
  },
  '&:focus-visible': {
    outline: '2px solid #64B5F6',
    outlineOffset: '2px',
  },
}));

const SectionTitle = styled(Typography)({
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '16px',
  color: '#FFFFFF',
});

export const Footer: React.FC = () => {
  return (
    <FooterContainer component="footer" role="contentinfo">
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PsychologyIcon sx={{ fontSize: 28, mr: 1 }} aria-hidden="true" />
              <Typography variant="h6" fontWeight={700} component="span">
                RetinaAI
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#B0BEC5', lineHeight: 1.6 }}>
              Advanced AI-powered retinal disease detection system helping ophthalmologists 
              and patients with early diagnosis and treatment planning.
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionTitle variant="h6" component="h3">Quick Links</SectionTitle>
            <nav aria-label="Quick Links">
              <FooterLink component={RouterLink} to="/" aria-label="Navigate to Home page">
                Home
              </FooterLink>
              <FooterLink component={RouterLink} to="/upload" aria-label="Navigate to Upload Scan page">
                Upload Scan
              </FooterLink>
              <FooterLink component={RouterLink} to="/dashboard" aria-label="Navigate to Dashboard page">
                Dashboard
              </FooterLink>
              <FooterLink component={RouterLink} to="/history" aria-label="Navigate to History page">
                History
              </FooterLink>
              <FooterLink component={RouterLink} to="/about" aria-label="Navigate to About Us page">
                About Us
              </FooterLink>
            </nav>
          </Grid>

          {/* Legal Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionTitle variant="h6" component="h3">Legal</SectionTitle>
            <nav aria-label="Legal Links">
              <FooterLink component={RouterLink} to="/privacy" aria-label="View Privacy Policy">
                Privacy Policy
              </FooterLink>
              <FooterLink component={RouterLink} to="/terms" aria-label="View Terms of Service">
                Terms of Service
              </FooterLink>
              <FooterLink component={RouterLink} to="/disclaimer" aria-label="View Medical Disclaimer">
                Medical Disclaimer
              </FooterLink>
            </nav>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#1E2A3A' }} />

        <Typography variant="body2" align="center" sx={{ color: '#78909C' }} component="p">
          © {new Date().getFullYear()} RetinaAI. All rights reserved.{' '}
          <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
            This is a medical AI tool for screening assistance only and does not replace professional medical diagnosis.
          </Box>
        </Typography>
      </Container>
    </FooterContainer>
  );
};
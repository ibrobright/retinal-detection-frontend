import React from 'react';
import { Box, Container, Typography, Grid, Link, LinkProps, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { med } from '@/styles/themes/theme';

const FooterContainer = styled('footer')(({ theme }) => ({
  background: med.dark,
  color: '#FFFFFF',
  padding: theme.spacing(7, 0, 3),
  marginTop: 'auto',
  borderTop: '1px solid rgba(255,255,255,0.06)',
}));

interface FooterLinkProps extends LinkProps {
  component?: React.ElementType;
  to?: string;
}

const FooterLink = styled(Link)<FooterLinkProps>(() => ({
  color: 'rgba(255,255,255,0.55)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '10px',
  fontSize: '0.8125rem',
  fontWeight: 500,
  letterSpacing: '-0.005em',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: '#FFFFFF',
    textDecoration: 'none',
  },
}));

const SectionTitle = styled(Typography)({
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '16px',
  color: 'rgba(255,255,255,0.35)',
});

export const Footer: React.FC = () => {
  return (
    <FooterContainer role="contentinfo">
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <RemoveRedEyeIcon sx={{ fontSize: 24, color: med.primary }} />
              <Typography variant="h6" fontWeight={700}>RetinaAI</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 340 }}>
              Advanced AI-powered retinal disease detection helping ophthalmologists 
              and patients with early diagnosis and treatment planning.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 4 }}>
            <SectionTitle>Quick Links</SectionTitle>
            <nav aria-label="Quick Links">
              <FooterLink component={RouterLink} to="/">Home</FooterLink>
              <FooterLink component={RouterLink} to="/upload">Upload Scan</FooterLink>
              <FooterLink component={RouterLink} to="/dashboard">Dashboard</FooterLink>
              <FooterLink component={RouterLink} to="/history">History</FooterLink>
            </nav>
          </Grid>

          {/* Legal */}
          <Grid size={{ xs: 6, md: 4 }}>
            <SectionTitle>Legal</SectionTitle>
            <nav aria-label="Legal Links">
              <FooterLink component={RouterLink} to="/privacy">Privacy Policy</FooterLink>
              <FooterLink component={RouterLink} to="/terms">Terms of Service</FooterLink>
              <FooterLink component={RouterLink} to="/disclaimer">Medical Disclaimer</FooterLink>
            </nav>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="caption" align="center" sx={{ color: 'rgba(255,255,255,0.35)', display: 'block' }}>
          © {new Date().getFullYear()} RetinaAI. All rights reserved. ·{' '}
          This is a medical AI screening tool and does not replace professional diagnosis.
        </Typography>
      </Container>
    </FooterContainer>
  );
};
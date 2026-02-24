import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldIcon from '@mui/icons-material/Shield';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { med } from '@/styles/themes/theme';

/* ── styled pieces ─────────────────────────────────────────── */

const HeroSection = styled(Box)(({ theme }) => ({
  background: med.surface,
  padding: theme.spacing(12, 0, 14),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background: med.border,
  },
}));

const FeatureCard = styled(Card)(() => ({
  padding: '32px 24px',
  textAlign: 'left',
  height: '100%',
  border: `1px solid ${med.border}`,
  boxShadow: 'none',
  borderRadius: `${med.radius}px`,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    borderColor: med.primary,
    boxShadow: '0 4px 20px rgba(13, 124, 102, 0.08)',
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  background: med.dark,
  color: '#FFFFFF',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const IconBox = styled(Box)<{ bg?: string; fg?: string }>(({ bg, fg }) => ({
  width: 48,
  height: 48,
  borderRadius: `${med.radiusSm}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  backgroundColor: bg || med.primaryLight,
  color: fg || med.primary,
}));

const Label = styled(Typography)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: med.primary,
  background: med.primaryLight,
  padding: '6px 14px',
  borderRadius: 20,
  marginBottom: 20,
});

/* ── component ─────────────────────────────────────────────── */

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 24 }} />,
      title: 'Fast Analysis',
      description: 'Results in under 2 seconds — optimized for busy clinical workflows.',
      bg: med.primaryLight,
      fg: med.primary,
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 24 }} />,
      title: 'High Accuracy',
      description: 'Validated on 100 000+ retinal images with > 85% sensitivity for major conditions.',
      bg: '#E8F5E9',
      fg: '#2E8B57',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 24 }} />,
      title: 'Explainable AI',
      description: 'Grad-CAM heatmaps show exactly which retinal regions drove the prediction.',
      bg: med.accentLight,
      fg: med.accent,
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 24 }} />,
      title: 'Secure & Private',
      description: 'All images are encrypted and HIPAA-aware. Your data stays yours.',
      bg: '#EDE7F6',
      fg: '#5E35B1',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload Image', desc: 'Upload a retinal fundus image in JPEG or PNG format.' },
    { num: '02', title: 'AI Analysis', desc: 'Our deep-learning model processes it in seconds.' },
    { num: '03', title: 'View Report', desc: 'See detailed results, heatmaps & recommendations.' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ── Hero ────────────────────────────── */}
      <HeroSection>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Label>AI-Powered Screening</Label>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                fontWeight: 800,
                letterSpacing: '-0.035em',
                mb: 2.5,
                color: med.dark,
                lineHeight: 1.1,
              }}
            >
              Detect retinal diseases
              <br />
              before they steal sight
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 5, color: med.muted, maxWidth: 560, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.0625rem' }, lineHeight: 1.7 }}
            >
              Upload a fundus image and get AI-driven analysis in seconds.
              Explainable results you — and your patients — can trust.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUploadIcon />}
                onClick={() => navigate('/upload')}
                sx={{ px: 4, py: 1.5 }}
              >
                Upload Scan
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{ px: 4, py: 1.5 }}
              >
                View Dashboard
              </Button>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>

      {/* ── Features ────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: med.primary, mb: 1.5, display: 'block' }}>
              Why RetinaAI
            </Typography>
            <Typography variant="h2" sx={{ mb: 1.5 }}>
              Built for clinical confidence
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540, mx: 'auto' }}>
              Cutting-edge deep learning meets clinical expertise — reliable screening
              assistance for hospitals and individuals alike.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.35 }}>
                  <FeatureCard>
                    <IconBox bg={f.bg} fg={f.fg}>{f.icon}</IconBox>
                    <Typography variant="h5" gutterBottom fontWeight={600}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>{f.description}</Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── How It Works ────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: med.surface }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: med.primary, mb: 1.5, display: 'block' }}>
              Simple Workflow
            </Typography>
            <Typography variant="h2">
              Three steps to insight
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {steps.map((s, i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={s.num}>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.35 }}>
                  <Box sx={{ textAlign: 'center', p: 4, borderRadius: `${med.radius}px`, bgcolor: '#FFFFFF', border: `1px solid ${med.border}` }}>
                    <Typography
                      sx={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: med.primaryLight,
                        mb: 1.5,
                        lineHeight: 1,
                        background: med.primaryGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {s.num}
                    </Typography>
                    <Typography variant="h6" gutterBottom fontWeight={600}>{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ─────────────────────────────── */}
      <CTASection>
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
              Ready to get started?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4.5, color: 'rgba(255,255,255,0.7)' }}>
              Start analysing retinal images today — secure, fast, and easy.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/upload')}
              sx={{
                bgcolor: '#FFFFFF',
                color: med.dark,
                fontWeight: 600,
                px: 5,
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
              }}
            >
              Start Analysis
            </Button>
          </motion.div>
        </Container>
      </CTASection>

      <Footer />
    </Box>
  );
};
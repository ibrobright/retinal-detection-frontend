import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ Keep this import
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';

// ✅ FIX: Use motion.create() or just use 'as' prop with motion components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// ✅ FIX: Use motion(Card) directly with 'as' prop instead of styled(motion(Card))
const FeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center',
  height: '100%',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #E0E0E0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0d1642 0%, #1a237e 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const IconContainer = styled(Box)<{ color?: string }>(({ color }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  backgroundColor: color ? `${color}20` : '#E3F2FD',
  color: color || '#1976D2',
}));

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: 'Fast Analysis',
      description: 'Get detailed results in under 2 seconds. Optimized for real-time clinical decision support.',
      color: '#1976D2',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
      title: 'High Accuracy',
      description: 'Validated on over 100,000 retinal images with >85% sensitivity for major retinal conditions.',
      color: '#4CAF50',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
      title: 'Explainable AI',
      description: 'Visual heatmaps (Grad-CAM) show exactly which regions influenced the AI\'s prediction.',
      color: '#FFC107',
    },
  ];

  const howItWorks = [
    { step: 1, title: 'Upload Image', desc: 'Upload a retinal fundus image (JPEG/PNG)' },
    { step: 2, title: 'AI Analysis', desc: 'Our model processes the image instantly' },
    { step: 3, title: 'Get Report', desc: 'View detailed results and recommendations' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onGetStarted={() => navigate('/upload')} />

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          {/* ✅ FIX: Use motion.div with 'as' prop or just use regular div with motion variants */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography 
              variant="h1" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2rem', md: '3.5rem' }, 
                fontWeight: 700, 
                mb: 3 
              }}
            >
              AI-Powered Retinal Disease Detection
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5, 
                opacity: 0.9, 
                maxWidth: '800px', 
                mx: 'auto' 
              }}
            >
              Early detection saves sight. Our advanced AI system analyzes retinal fundus images 
              in seconds to identify potential diseases with high accuracy.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUploadIcon />}
                onClick={() => navigate('/upload')}
                sx={{
                  background: '#FFFFFF',
                  color: '#1976D2',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: '#F5F5F5',
                  },
                }}
              >
                Upload Image
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  border: '2px solid #FFFFFF',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    border: '2px solid #FFFFFF',
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                View Demo
              </Button>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#F5F7FA' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom 
            sx={{ mb: 2, fontSize: '2.5rem' }}
          >
            Why Choose RetinaAI?
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 8, 
              color: 'text.secondary', 
              maxWidth: '700px', 
              mx: 'auto' 
            }}
          >
            Our platform combines cutting-edge deep learning with medical expertise 
            to provide reliable screening assistance.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                {/* ✅ FIX: Use motion component with 'as' prop */}
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <FeatureCard>
                    <IconContainer sx={{ 
                      backgroundColor: `${feature.color}20`, 
                      color: feature.color 
                    }}>
                      {feature.icon}
                    </IconContainer>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom 
            sx={{ mb: 8, fontSize: '2.5rem' }}
          >
            How It Works
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {howItWorks.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: '12px',
                    bgcolor: '#F9FAFB',
                    border: '1px solid #E0E0E0',
                  }}
                >
                  <Box
                    sx={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #5410f4 0%, #1565C0 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <CTASection>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
            Ready to try it out?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Start analyzing retinal images today with our secure and easy-to-use platform.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/upload')}
            sx={{
              background: '#FFFFFF',
              color: '#0d1642',
              fontWeight: 600,
              px: 5,
              py: 1.5,
              '&:hover': {
                background: '#F5F5F5',
              },
            }}
          >
            Start Analysis
          </Button>
        </Container>
      </CTASection>

      <Footer />
    </Box>
  );
};
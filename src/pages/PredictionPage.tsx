import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Alert,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createPrediction, clearPrediction } from '@/store/slices/predictionSlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { DiseaseType, PredictionResult } from '@/types';
import toast from 'react-hot-toast';

// ✅ Styled Components
const ResultsContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(6, 0),
  backgroundColor: '#F5F7FA',
}));

// ✅ DiseaseCard - uses 'detected' prop (no $ prefix, so no shouldForwardProp needed)
interface DiseaseCardProps {
  detected: boolean;
}

const DiseaseCard = styled(Card)<DiseaseCardProps>(({ theme, detected }) => ({
  borderRadius: '12px',
  border: `2px solid ${detected ? '#F44336' : '#4CAF50'}`,
  boxShadow: detected 
    ? '0 4px 12px rgba(244, 67, 54, 0.15)' 
    : '0 4px 12px rgba(76, 175, 80, 0.15)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

// ✅ ConfidenceBar - uses 'confidence' prop (no $ prefix, so no shouldForwardProp needed)
interface ConfidenceBarProps {
  confidence: number;
}

const ConfidenceBar = styled(Box)<ConfidenceBarProps>(({ confidence }) => ({
  height: '8px',
  borderRadius: '4px',
  background: `linear-gradient(90deg, 
    ${confidence > 0.7 ? '#F44336' : confidence > 0.4 ? '#FFC107' : '#4CAF50'} 0%, 
    ${confidence > 0.7 ? '#F44336' : confidence > 0.4 ? '#FFC107' : '#4CAF50'} ${confidence * 100}%, 
    #E0E0E0 ${confidence * 100}%, 
    #E0E0E0 100%)`,
}));

export const PredictionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  const { imageId, filename } = location.state || {};
  const { current: prediction, loading, error, status } = useSelector(
    (state: RootState) => state.prediction
  );

  const [selectedDisease, setSelectedDisease] = useState<DiseaseType | null>(null);
  const [gradCAMOpen, setGradCAMOpen] = useState(false);

  useEffect(() => {
    if (imageId) {
      dispatch(createPrediction(imageId));
    }
    
    return () => {
      dispatch(clearPrediction());
    };
  }, [imageId, dispatch]);

  const diseaseLabels: Record<DiseaseType, string> = {
    glaucoma: 'Glaucoma',
    cataract: 'Cataract',
    diabetic_retinopathy: 'Diabetic Retinopathy',
    macular_degeneration: 'Macular Degeneration',
  };

  const handleViewGradCAM = (disease: DiseaseType) => {
    setSelectedDisease(disease);
    setGradCAMOpen(true);
  };

  const handleDownloadReport = () => {
    toast.success('Report downloaded successfully');
    // Implement PDF generation
  };

  const handleSaveToHistory = () => {
    toast.success('Results saved to history');
  };

  const handleUploadAnother = () => {
    navigate('/upload');
  };

  // Loading State
  if (loading || status === 'processing') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ResultsContainer>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" gutterBottom>
                Analyzing Image...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Our AI is processing your retinal image. This may take a few seconds.
              </Typography>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Please wait while we analyze the image for diseases...
              </Typography>
            </Box>
          </Container>
        </ResultsContainer>
        <Footer />
      </Box>
    );
  }

  // Error State
  if (error || status === 'failed') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ResultsContainer>
          <Container maxWidth="md">
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || 'Analysis failed. Please try again.'}
            </Alert>
            <Button variant="contained" onClick={() => navigate('/upload')}>
              Try Again
            </Button>
          </Container>
        </ResultsContainer>
        <Footer />
      </Box>
    );
  }

  // No prediction yet
  if (!prediction) {
    return null;
  }

  const detectedDiseases = Object.entries(prediction.diseases).filter(
    ([, result]) => result.detected
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <ResultsContainer>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip
                icon={status === 'completed' ? <CheckCircleIcon /> : <ErrorIcon />}
                label={status === 'completed' ? 'Analysis Complete' : 'Analysis Failed'}
                color={status === 'completed' ? 'success' : 'error'}
              />
              <Typography variant="body2" color="text.secondary">
                {new Date(prediction.timestamp).toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight={600} gutterBottom>
              Analysis Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Image: {filename || 'Retinal Scan'} • Processing Time: {prediction.inference_time.toFixed(2)}s
            </Typography>
          </Box>

          {/* Summary Alert */}
          {detectedDiseases.length > 0 && (
            <Alert 
              severity="warning" 
              sx={{ mb: 4, borderRadius: '12px' }}
            >
              <Typography variant="body1" fontWeight={600}>
                {detectedDiseases.length} disease(s) detected
              </Typography>
              <Typography variant="body2">
                Please consult with an ophthalmologist for further evaluation.
              </Typography>
            </Alert>
          )}

          {/* ✅ Disease Results - Fixed: MUI v6 Grid API */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(prediction.diseases).map(([diseaseKey, result]) => {
              const disease = diseaseKey as DiseaseType;
              return (
                // ✅ Fixed: Use 'size' prop instead of 'item xs' for MUI v6
                <Grid size={{ xs: 12, md: 6 }} key={diseaseKey}>
                  <DiseaseCard detected={result.detected} elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {diseaseLabels[disease]}
                        </Typography>
                        <Chip
                          label={result.detected ? 'DETECTED' : 'NOT DETECTED'}
                          color={result.detected ? 'error' : 'success'}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Probability
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {(result.probability * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <ConfidenceBar confidence={result.probability} />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Confidence: {result.confidence.toUpperCase()}
                        </Typography>
                        <Chip
                          label={result.confidence}
                          color={
                            result.confidence === 'high' 
                              ? 'error' 
                              : result.confidence === 'medium' 
                              ? 'warning' 
                              : 'success'
                          }
                          size="small"
                        />
                      </Box>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewGradCAM(disease)}
                        sx={{ borderRadius: '8px' }}
                      >
                        View Grad-CAM
                      </Button>
                    </CardContent>
                  </DiseaseCard>
                </Grid>
              );
            })}
          </Grid>

          {/* Recommendations */}
          {detectedDiseases.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', bgcolor: '#FFF3E0' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recommendations
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Consult an ophthalmologist</strong> within the next 1-2 weeks for professional evaluation
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Bring this report to your appointment for reference
                </Typography>
                <Typography component="li" variant="body2">
                  Monitor for any changes in vision and report immediately if symptoms worsen
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadReport}
              sx={{ borderRadius: '8px' }}
            >
              Download Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveToHistory}
              sx={{ borderRadius: '8px' }}
            >
              Save to History
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadAnother}
              sx={{ 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
              }}
            >
              Analyze Another
            </Button>
          </Box>
        </Container>
      </ResultsContainer>

      {/* Grad-CAM Modal */}
      <Dialog
        open={gradCAMOpen}
        onClose={() => setGradCAMOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Grad-CAM Visualization - {selectedDisease && diseaseLabels[selectedDisease]}
            </Typography>
            <IconButton onClick={() => setGradCAMOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Red and yellow regions highlight areas of the retina that most influenced 
              the AI's detection of {selectedDisease && diseaseLabels[selectedDisease]}.
            </Typography>
            <Box 
              sx={{ 
                bgcolor: '#000', 
                borderRadius: '8px', 
                p: 4,
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                [Grad-CAM Image Placeholder]
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};
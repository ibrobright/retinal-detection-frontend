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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchResultById } from '@/store/slices/predictionSlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { DiseaseKey, DISEASE_LABELS } from '@/types';
import { med } from '@/styles/themes/theme';
import toast from 'react-hot-toast';

/* ── styled pieces ─────────────────────────────────────────── */

const ResultsContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(5, 0),
  backgroundColor: med.surface,
}));

interface DiseaseCardProps {
  $detected: boolean;
}

const DiseaseCard = styled(Card)<DiseaseCardProps>(({ $detected }) => ({
  border: `1.5px solid ${$detected ? '#D64045' : '#2E8B57'}`,
  borderRadius: `${med.radius}px`,
  boxShadow: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    boxShadow: $detected
      ? '0 4px 16px rgba(214,64,69,0.10)'
      : '0 4px 16px rgba(46,139,87,0.08)',
  },
}));

const ProbabilityBar = styled(Box)<{ value: number }>(({ value }) => ({
  height: 6,
  borderRadius: 3,
  background: `linear-gradient(90deg, 
    ${value > 0.7 ? '#D64045' : value > 0.4 ? '#E9A820' : '#2E8B57'} 0%, 
    ${value > 0.7 ? '#D64045' : value > 0.4 ? '#E9A820' : '#2E8B57'} ${value * 100}%, 
    ${med.border} ${value * 100}%, ${med.border} 100%)`,
}));

/* ── component ─────────────────────────────────────────────── */

export const PredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const { predictionId } = useParams<{ predictionId?: string }>();

  const { current: prediction, savedResult, loading, error, status } = useSelector(
    (state: RootState) => state.prediction
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (predictionId && !savedResult) {
      dispatch(fetchResultById(predictionId));
    }
  }, [predictionId, dispatch, savedResult]);

  const [selectedDisease, setSelectedDisease] = useState<DiseaseKey | null>(null);
  const [gradCAMOpen, setGradCAMOpen] = useState(false);
  const [gradcamTab, setGradcamTab] = useState(0); // 0=heatmap, 1=original (if available)

  const handleViewGradCAM = (disease: DiseaseKey) => {
    setSelectedDisease(disease);
    setGradcamTab(0);
    setGradCAMOpen(true);
  };

  const handleDownloadReport = () => {
    if (!token) {
      toast.error('Please log in to download the report');
      navigate('/login');
      return;
    }
    if (!displayData) return;

    const lines: string[] = [
      'RETINAI — ANALYSIS REPORT',
      '='.repeat(50),
      '',
      `Date:          ${new Date(displayData.timestamp).toLocaleString()}`,
      `Prediction ID: ${displayData.predictionId}`,
      displayData.filename ? `Image:         ${displayData.filename}` : '',
      '',
      '-'.repeat(50),
      'SUMMARY',
      '-'.repeat(50),
      `Diseases Detected: ${displayData.diseasesDetected}`,
      displayData.detectedList.length > 0
        ? `Findings:          ${displayData.detectedList.join(', ')}`
        : 'Findings:          No diseases detected',
      '',
      '-'.repeat(50),
      'DETAILED RESULTS',
      '-'.repeat(50),
    ];

    Object.entries(displayData.predictions).forEach(([, result]) => {
      lines.push('');
      lines.push(`  ${result.name}`);
      lines.push(`    Status:      ${result.detected ? 'DETECTED' : 'Clear'}`);
      lines.push(`    Probability: ${(result.probability * 100).toFixed(1)}%`);
      lines.push(`    Confidence:  ${result.confidence}`);
      if (result.threshold_used != null) {
        lines.push(`    Threshold:   ${(result.threshold_used * 100).toFixed(0)}%`);
      }
    });

    if (displayData.detectedEntries.length > 0) {
      lines.push('');
      lines.push('-'.repeat(50));
      lines.push('RECOMMENDATIONS');
      lines.push('-'.repeat(50));
      lines.push('• Consult an ophthalmologist within 1–2 weeks for professional evaluation.');
      lines.push('• Bring this report to your appointment for reference.');
      lines.push('• Monitor vision and report immediately if symptoms worsen.');
    }

    lines.push('');
    lines.push('-'.repeat(50));
    lines.push('DISCLAIMER: This is an AI screening tool and does not replace');
    lines.push('professional medical diagnosis. Always consult a qualified');
    lines.push('ophthalmologist for clinical decisions.');
    lines.push('-'.repeat(50));

    const blob = new Blob([lines.filter(Boolean).join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RetinaAI_Report_${displayData.predictionId.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  /* ── Loading ────── */
  if (loading || status === 'processing') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ResultsContainer>
          <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: `${med.radius}px`, bgcolor: med.primaryLight, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <CloudUploadIcon sx={{ color: med.primary, fontSize: 28 }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Analysing Image…
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Our AI is processing your retinal image. This usually takes a few seconds.
              </Typography>
              <LinearProgress sx={{ borderRadius: 2 }} />
            </Box>
          </Container>
        </ResultsContainer>
        <Footer />
      </Box>
    );
  }

  /* ── Error ────── */
  if (error || status === 'failed') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ResultsContainer>
          <Container maxWidth="sm">
            <Alert severity="error" sx={{ mb: 3 }}>{error || 'Analysis failed. Please try again.'}</Alert>
            <Button variant="contained" onClick={() => navigate('/upload')}>Try Again</Button>
          </Container>
        </ResultsContainer>
        <Footer />
      </Box>
    );
  }

  /* ── Normalize data ────── */
  const displayData = (() => {
    if (prediction) {
      const detectedEntries = Object.entries(prediction.predictions).filter(([, r]) => r.detected);
      return {
        predictionId: prediction.prediction_id,
        timestamp: prediction.timestamp,
        filename: prediction.filename,
        success: prediction.success,
        diseasesDetected: prediction.summary.diseases_detected,
        detectedList: prediction.summary.detected_list,
        predictions: prediction.predictions,
        gradcamUrls: prediction.gradcam_urls,
        detectedEntries,
      };
    }
    if (savedResult) {
      const predictions: Record<string, { name: string; probability: number; detected: boolean; confidence: string; threshold_used?: number }> = {};
      for (const [key, disease] of Object.entries(savedResult.predicted_diseases)) {
        const dk = key as DiseaseKey;
        predictions[key] = {
          name: disease.name || DISEASE_LABELS[dk] || key,
          probability: disease.probability,
          detected: disease.detected,
          confidence: disease.confidence ?? savedResult.confidence_scores[dk] ?? 'Low',
          threshold_used: disease.threshold_used,
        };
      }
      const detectedEntries = Object.entries(predictions).filter(([, r]) => r.detected);
      return {
        predictionId: savedResult.prediction_id,
        timestamp: savedResult.timestamp,
        filename: '',
        success: true,
        diseasesDetected: savedResult.detected_diseases.length,
        detectedList: savedResult.detected_diseases,
        predictions,
        gradcamUrls: savedResult.gradcam_images,
        detectedEntries,
      };
    }
    return null;
  })();

  /* ── No data ────── */
  if (!displayData) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ResultsContainer>
          <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>No Results Yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a retinal image to get started.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/upload')}>Upload Image</Button>
            </Box>
          </Container>
        </ResultsContainer>
        <Footer />
      </Box>
    );
  }

  /* ── Main render ────── */
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <ResultsContainer>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <Chip
                icon={displayData.success ? <CheckCircleIcon /> : <ErrorIcon />}
                label={displayData.success ? 'Analysis Complete' : 'Analysis Failed'}
                color={displayData.success ? 'success' : 'error'}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {new Date(displayData.timestamp).toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.025em' }}>Analysis Results</Typography>
            <Typography variant="body2" color="text.secondary">
              {displayData.filename ? `Image: ${displayData.filename} · ` : ''}
              ID: {displayData.predictionId.slice(0, 12)}…
            </Typography>
          </Box>

          {/* Summary alert */}
          {displayData.diseasesDetected > 0 ? (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600}>
                {displayData.diseasesDetected} disease(s) detected: {displayData.detectedList.join(', ')}
              </Typography>
              <Typography variant="caption">Please consult an ophthalmologist for further evaluation.</Typography>
            </Alert>
          ) : (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600}>No diseases detected</Typography>
              <Typography variant="caption">The scan appears normal. Continue regular eye check-ups.</Typography>
            </Alert>
          )}

          {/* Disease cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {Object.entries(displayData.predictions).map(([diseaseKey, result]) => {
              const dk = diseaseKey as DiseaseKey;
              return (
                <Grid size={{ xs: 12, sm: 6 }} key={diseaseKey}>
                  <DiseaseCard $detected={result.detected} elevation={0}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography variant="h6" fontWeight={600}>{result.name}</Typography>
                        <Chip
                          label={result.detected ? 'DETECTED' : 'CLEAR'}
                          color={result.detected ? 'error' : 'success'}
                          size="small"
                        />
                      </Box>

                      {/* probability bar */}
                      <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">Probability</Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {(result.probability * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <ProbabilityBar value={result.probability} />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {result.threshold_used != null && (
                          <Typography variant="caption" color="text.secondary">
                            Threshold: {(result.threshold_used * 100).toFixed(0)}%
                          </Typography>
                        )}
                        {result.threshold_used == null && <Box />}
                        <Chip
                          label={result.confidence}
                          color={result.confidence === 'High' ? 'error' : result.confidence === 'Medium' ? 'warning' : 'success'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      {/* Grad-CAM button */}
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewGradCAM(dk)}
                        disabled={!displayData.gradcamUrls || !displayData.gradcamUrls[diseaseKey]}
                        sx={{ mt: 1.5 }}
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
          {displayData.detectedEntries.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, bgcolor: med.accentLight, border: `1px solid ${med.accent}30` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Recommendations</Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                  <strong>Consult an ophthalmologist</strong> within 1–2 weeks for professional evaluation.
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                  Bring this report to your appointment for reference.
                </Typography>
                <Typography component="li" variant="body2">
                  Monitor vision and report immediately if symptoms worsen.
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadReport}>
              Download Report
            </Button>
            <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => navigate('/upload')}>
              Analyse Another
            </Button>
          </Box>
        </Container>
      </ResultsContainer>

      {/* ── Grad-CAM Dialog with zoom/pan ────── */}
      <Dialog
        open={gradCAMOpen}
        onClose={() => setGradCAMOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
          <Typography variant="h6" component="span" fontWeight={600}>
            Grad-CAM — {selectedDisease && DISEASE_LABELS[selectedDisease]}
          </Typography>
          <IconButton onClick={() => setGradCAMOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Explanation banner */}
          <Box sx={{ px: 3, py: 1.5, bgcolor: med.primaryLight }}>
            <Typography variant="caption" color="text.secondary">
              <strong>How to read this:</strong> Red/yellow regions highlight areas of the retina that most influenced
              the AI's prediction. Scroll to zoom · Drag to pan.
            </Typography>
          </Box>

          {/* Tabs: Heatmap / Legend */}
          <Box sx={{ borderBottom: `1px solid ${med.border}` }}>
            <Tabs value={gradcamTab} onChange={(_e, v) => setGradcamTab(v)} variant="fullWidth">
              <Tab label="Heatmap" />
              <Tab label="Legend" />
            </Tabs>
          </Box>

          {gradcamTab === 0 && selectedDisease && displayData.gradcamUrls && displayData.gradcamUrls[selectedDisease] ? (
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={5}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  {/* Zoom controls */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, py: 1, bgcolor: '#FAFAFA', borderBottom: `1px solid ${med.border}` }}>
                    <IconButton size="small" onClick={() => zoomIn()}><ZoomInIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => zoomOut()}><ZoomOutIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => resetTransform()}><RestartAltIcon fontSize="small" /></IconButton>
                  </Box>
                  <TransformComponent wrapperStyle={{ width: '100%', maxHeight: isMobile ? '60vh' : '500px', cursor: 'grab' }}>
                    <Box
                      component="img"
                      src={displayData.gradcamUrls![selectedDisease]}
                      alt={`Grad-CAM for ${DISEASE_LABELS[selectedDisease]}`}
                      sx={{ width: '100%', display: 'block', objectFit: 'contain' }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          ) : gradcamTab === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#000' }}>
              <Typography color="grey.500">No Grad-CAM available for this disease.</Typography>
            </Box>
          ) : (
            /* Legend tab */
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The Grad-CAM heatmap uses colours to indicate regions of clinical interest:
              </Typography>
              {[
                { color: '#D64045', label: 'High activation', desc: 'Strongly influenced the prediction' },
                { color: '#E9A820', label: 'Medium activation', desc: 'Moderate contribution to the result' },
                { color: '#2E8B57', label: 'Low activation', desc: 'Minor or no contribution' },
                { color: '#1B2A4A', label: 'Background', desc: 'Not considered in the analysis' },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: item.color, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};
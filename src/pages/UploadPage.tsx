import React, { useCallback, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Alert,
  LinearProgress,
  Slider,
  Switch,
  Collapse,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { addFiles, removeFile, clearFiles, setMetadata } from '@/store/slices/uploadSlice';
import { runPrediction } from '@/store/slices/predictionSlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { med } from '@/styles/themes/theme';
import toast from 'react-hot-toast';

/* ── styled pieces ─────────────────────────────────────────── */

const UploadContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(5, 0),
  backgroundColor: med.surface,
}));

interface DropzoneAreaProps {
  $isDragActive?: boolean;
}

const DropzoneArea = styled(Paper, {
  shouldForwardProp: (p) => p !== '$isDragActive',
})<DropzoneAreaProps>(({ theme, $isDragActive }) => ({
  border: `2px dashed ${$isDragActive ? med.primary : med.border}`,
  borderRadius: `${med.radius + 2}px`,
  padding: theme.spacing(7),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  backgroundColor: $isDragActive ? med.primaryLight : '#FFFFFF',
  '&:hover': {
    borderColor: med.primary,
    backgroundColor: med.surface,
  },
}));

const ImagePreviewCard = styled(Paper)(() => ({
  position: 'relative',
  borderRadius: `${med.radius}px`,
  overflow: 'hidden',
  border: `1px solid ${med.border}`,
  boxShadow: 'none',
  transition: 'border-color 0.15s ease',
  '&:hover': {
    borderColor: med.primary,
  },
}));

interface PreviewFile extends File {
  preview?: string;
  id: string;
}

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { files, uploading, metadata, errors } = useSelector(
    (state: RootState) => state.upload
  );
  const { loading: predicting } = useSelector(
    (state: RootState) => state.prediction
  );

  const [localError, setLocalError] = useState<string | null>(null);
  const [generateGradcam, setGenerateGradcam] = useState(true);
  const [useCustomThreshold, setUseCustomThreshold] = useState(false);
  const [customThreshold, setCustomThreshold] = useState<number>(0.5);

  const isProcessing = uploading || predicting;

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: readonly { readonly file: File; readonly errors: readonly { code: string; message: string }[] }[]) => {
    rejectedFiles.forEach((file) => {
      if (file.errors[0]?.code === 'file-too-large') {
        toast.error(`${file.file.name}: File too large (max 10MB)`);
      } else if (file.errors[0]?.code === 'file-invalid-type') {
        toast.error(`${file.file.name}: Invalid file type (JPEG/PNG only)`);
      }
    });

    const validFiles = acceptedFiles.filter((file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      dispatch(addFiles(validFiles));
      setLocalError(null);
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10485760,
    multiple: true,
  });

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId));
  };

  const handleClearAll = () => {
    dispatch(clearFiles());
    setLocalError(null);
  };

  /**
   * The main flow: POST /api/predict with the file directly.
   * This uploads + predicts in one step.
   */
  const handleAnalyze = async () => {
    if (files.length === 0) {
      setLocalError('Please select at least one image');
      return;
    }

    if (!metadata.consentGiven) {
      setLocalError('Please confirm consent to proceed');
      return;
    }

    try {
      // Use the first file for prediction
      const file = files[0];
      const result = await dispatch(
        runPrediction({
          file,
          generateGradcam,
          threshold: useCustomThreshold ? customThreshold : undefined,
        })
      ).unwrap();

      toast.success('Analysis complete!');
      // Navigate to prediction page — pass the prediction result via state
      navigate('/prediction', {
        state: { predictionId: result.prediction_id },
      });
    } catch (err: unknown) {
      const message = typeof err === 'string' ? err : 'Analysis failed';
      toast.error(message);
      setLocalError(message);
    }
  };

  const handleMetadataChange = (field: string, value: boolean) => {
    dispatch(setMetadata({ [field]: value }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <UploadContainer>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="overline" sx={{ color: med.primary, mb: 1, display: 'block' }}>Upload</Typography>
            <Typography variant="h3" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.025em' }}>
              Upload Retinal Images
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
              Upload fundus images for AI-powered disease detection.
              Supported formats: JPEG, PNG (max 10 MB).
            </Typography>
          </Box>

          {/* Dropzone */}
          <DropzoneArea
            {...getRootProps()}
            $isDragActive={isDragActive}
            elevation={0}
          >
            <input {...getInputProps()} />
            <Box sx={{ width: 64, height: 64, borderRadius: `${med.radius}px`, bgcolor: med.primaryLight, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
              <CloudUploadIcon sx={{ fontSize: 28, color: med.primary }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop images here...' : 'Drag & drop retinal images'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse files
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Supports JPEG, PNG (Max 10MB)
            </Typography>
          </DropzoneArea>

          {/* Errors */}
          {(localError || errors.length > 0) && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {localError || errors.join(', ')}
            </Alert>
          )}

          {/* File Previews */}
          {files.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Selected Images ({files.length})
                </Typography>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleClearAll}
                  color="error"
                  size="small"
                >
                  Clear All
                </Button>
              </Box>

              <Grid container spacing={2}>
                {files.map((file: PreviewFile) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={file.id}>
                    <ImagePreviewCard>
                      <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="body2" noWrap fontWeight={500}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFile(file.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          '&:hover': { bgcolor: 'white' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </ImagePreviewCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Upload Options */}
          {files.length > 0 && (
            <Paper sx={{ mt: 4, p: 3, borderRadius: `${med.radius}px`, border: `1px solid ${med.border}` }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                Analysis Options
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={generateGradcam}
                        onChange={(e) => setGenerateGradcam(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Generate Grad-CAM heatmaps (visual explainability for detected diseases)
                      </Typography>
                    }
                  />
                </Grid>

                {/* Custom threshold toggle */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Override the model's default per-disease detection thresholds with a single custom value" arrow>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={useCustomThreshold}
                            onChange={(e) => setUseCustomThreshold(e.target.checked)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Use custom detection threshold
                          </Typography>
                        }
                      />
                    </Tooltip>
                  </Box>

                  <Collapse in={useCustomThreshold}>
                    <Box sx={{ pl: 4, pr: 2, pt: 1, pb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        A lower threshold detects more diseases (higher sensitivity) but may increase false positives.
                        The default thresholds are optimised per disease by the model.
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Slider
                          value={customThreshold}
                          onChange={(_e, v) => setCustomThreshold(v as number)}
                          min={0.1}
                          max={0.9}
                          step={0.05}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(v) => `${(v * 100).toFixed(0)}%`}
                          sx={{ flex: 1 }}
                        />
                        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40, textAlign: 'right' }}>
                          {(customThreshold * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={metadata.consentGiven || false}
                        onChange={(e) => handleMetadataChange('consentGiven', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I confirm that these images are anonymized and I have the necessary consent 
                        to process them for medical analysis purposes. I understand that this AI tool 
                        is for screening assistance only and does not replace professional medical diagnosis.
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Progress */}
          {isProcessing && (
            <Box sx={{ mt: 4 }}>
              <LinearProgress
                variant="indeterminate"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Analyzing image... Please wait.
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          {files.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearAll}
                disabled={isProcessing}
                sx={{ px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={isProcessing || files.length === 0}
                startIcon={<CloudUploadIcon />}
                sx={{ px: 4 }}
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </Box>
          )}
        </Container>
      </UploadContainer>

      <Footer />
    </Box>
  );
};
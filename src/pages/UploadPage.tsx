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
  TextField,
  Alert,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
// ✅ Fixed: Ensure action name matches export from slice
import { addFiles, removeFile, clearFiles, setMetadata, uploadImages } from '@/store/slices/uploadSlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import toast from 'react-hot-toast';

// ✅ Styled Components
const UploadContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(6, 0),
  backgroundColor: '#F5F7FA',
}));

interface DropzoneAreaProps {
  $isDragActive?: boolean;
}

const DropzoneArea = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$isDragActive',
})<DropzoneAreaProps>(({ theme, $isDragActive }) => ({
  border: `2px dashed ${$isDragActive ? '#1976D2' : '#E0E0E0'}`,
  borderRadius: '12px',
  padding: theme.spacing(8),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: $isDragActive ? '#E3F2FD' : '#FFFFFF',
  '&:hover': {
    borderColor: '#1976D2',
    backgroundColor: '#FAFAFA',
  },
}));

const ImagePreviewCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

// ✅ Type for file with preview
interface PreviewFile extends File {
  preview?: string;
  id: string;
}

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  const { files, uploading, uploadProgress, metadata, errors } = useSelector(
    (state: RootState) => state.upload
  );

  const [localError, setLocalError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach((file) => {
      if (file.errors[0]?.code === 'file-too-large') {
        toast.error(`${file.file.name}: File too large (max 10MB)`);
      } else if (file.errors[0]?.code === 'file-invalid-type') {
        toast.error(`${file.file.name}: Invalid file type (JPEG/PNG only)`);
      }
    });

    // Validate and add accepted files
    const validFiles = acceptedFiles.filter((file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
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
    maxSize: 10485760, // 10MB
    multiple: true,
  });

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId));
  };

  const handleClearAll = () => {
    dispatch(clearFiles());
    setLocalError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setLocalError('Please select at least one image');
      return;
    }

    if (!metadata.consentGiven) {
      setLocalError('Please confirm consent to proceed');
      return;
    }

    try {
      const result = await dispatch(
        uploadImages({ files, metadata })
      ).unwrap();

      toast.success(`Successfully uploaded ${result.length} image(s)`);
      
      // Navigate to prediction page with first image
      if (result.length > 0) {
        navigate('/prediction', { 
          state: { imageId: result[0].image_id, filename: result[0].filename } 
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      setLocalError(error.message || 'Upload failed');
    }
  };

  const handleMetadataChange = (field: string, value: any) => {
    // ✅ Fixed: Use correct action name from slice
    dispatch(setMetadata({ [field]: value }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <UploadContainer>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={600} gutterBottom>
              Upload Retinal Images
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload fundus images for AI-powered disease detection. 
              Supported formats: JPEG, PNG.
            </Typography>
          </Box>

          {/* Dropzone */}
          <DropzoneArea
            {...getRootProps()}
            $isDragActive={isDragActive}
            elevation={0}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 64, color: '#1976D2', mb: 2 }} />
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

              {/* ✅ Fixed: MUI v6 Grid API - use 'size' prop instead of 'item xs' */}
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
            <Paper sx={{ mt: 4, p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                Upload Options
              </Typography>

              {/* ✅ Fixed: MUI v6 Grid API */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Patient ID (Optional)"
                    variant="outlined"
                    value={metadata.patientId || ''}
                    onChange={(e) => handleMetadataChange('patientId', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={metadata.notes || ''}
                    onChange={(e) => handleMetadataChange('notes', e.target.value)}
                  />
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
          {uploading && (
            <Box sx={{ mt: 4 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          {files.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearAll}
                disabled={uploading}
                sx={{ borderRadius: '8px', px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderRadius: '8px',
                  px: 4,
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                }}
              >
                {uploading ? 'Uploading...' : 'Analyze Images'}
              </Button>
            </Box>
          )}
        </Container>
      </UploadContainer>

      <Footer />
    </Box>
  );
};
import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { fetchHistory, setSkip, setLimit } from '@/store/slices/historySlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { MyResultsItem } from '@/types';
import { med } from '@/styles/themes/theme';

const HistoryContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(5, 0),
  backgroundColor: med.surface,
}));

export const HistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { results, loading, error, total, skip, limit } = useSelector(
    (state: RootState) => state.history
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchHistory({ skip: 0, limit: 20 }));
    }
  }, [dispatch, token]);

  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const newSkip = newPage * limit;
    dispatch(setSkip(newSkip));
    dispatch(fetchHistory({ skip: newSkip, limit }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit(newLimit));
    dispatch(fetchHistory({ skip: 0, limit: newLimit }));
  };

  const handleViewDetails = (predictionId: string) => {
    navigate(`/results/${predictionId}`);
  };

  const getMaxProbability = (predicted: Record<string, { probability: number } | number>) => {
    const vals = Object.values(predicted).map((v) =>
      typeof v === 'object' && v !== null ? v.probability : v
    );
    return vals.length > 0 ? Math.max(...vals) : 0;
  };

  const getRiskColor = (detected: string[]): 'error' | 'warning' | 'success' => {
    if (detected.length >= 2) return 'error';
    if (detected.length === 1) return 'warning';
    return 'success';
  };

  // Not authenticated
  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <HistoryContainer>
          <Container maxWidth="md">
            <Alert severity="info" sx={{ mb: 3 }}>
              Please log in to view your scan history.
            </Alert>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </Container>
        </HistoryContainer>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <HistoryContainer>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: med.primary, display: 'block' }}>History</Typography>
              <Typography variant="h3" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.025em' }}>
                Scan History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View past analysis results ({total} total)
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/upload')}
            >
              New Scan
            </Button>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Results — Table on desktop, Cards on mobile */}
          {!loading && results.length > 0 && (
            <>
              {isMobile ? (
                /* ── Mobile card layout ── */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {results.map((result: MyResultsItem) => {
                    const riskColor = getRiskColor(result.detected_diseases);
                    return (
                      <Card
                        key={result.prediction_id}
                        sx={{ cursor: 'pointer', border: `1px solid ${med.border}` }}
                        onClick={() => handleViewDetails(result.prediction_id)}
                      >
                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {result.prediction_id.slice(0, 10)}…
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                            {result.detected_diseases.length > 0 ? (
                              result.detected_diseases.map((d, i) => (
                                <Chip key={i} label={d} color={riskColor} size="small" />
                              ))
                            ) : (
                              <Chip label="Normal" color="success" size="small" />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Max probability: {(getMaxProbability(result.predicted_diseases) * 100).toFixed(1)}%
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              ) : (
                /* ── Desktop table ── */
                <TableContainer component={Paper} sx={{ border: `1px solid ${med.border}` }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Prediction ID</TableCell>
                        <TableCell>Date &amp; Time</TableCell>
                        <TableCell>Findings</TableCell>
                        <TableCell>Max Probability</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((result: MyResultsItem) => {
                        const riskColor = getRiskColor(result.detected_diseases);
                        return (
                          <TableRow key={result.prediction_id} hover sx={{ cursor: 'pointer' }} onClick={() => handleViewDetails(result.prediction_id)}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {result.prediction_id.slice(0, 12)}…
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{new Date(result.timestamp).toLocaleDateString()}</Typography>
                              <Typography variant="caption" color="text.secondary">{new Date(result.timestamp).toLocaleTimeString()}</Typography>
                            </TableCell>
                            <TableCell>
                              {result.detected_diseases.length > 0 ? (
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {result.detected_diseases.map((d, i) => (
                                    <Chip key={i} label={d} color={riskColor} size="small" />
                                  ))}
                                </Box>
                              ) : (
                                <Chip label="Normal" color="success" size="small" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{(getMaxProbability(result.predicted_diseases) * 100).toFixed(1)}%</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewDetails(result.prediction_id); }} color="primary">
                                <ViewIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={total}
                page={Math.floor(skip / limit)}
                onPageChange={handlePageChange}
                rowsPerPage={limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{ mt: 2 }}
              />
            </>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && !error && (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: `${med.radius}px`, border: `1px solid ${med.border}` }}>
              <Typography variant="h6" gutterBottom>
                No scan history yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a retinal image to get started.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/upload')}>
                Upload Image
              </Button>
            </Paper>
          )}
        </Container>
      </HistoryContainer>

      <Footer />
    </Box>
  );
};
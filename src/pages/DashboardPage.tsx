import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import {
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  BubbleChart as ConditionsIcon,
  TrendingUp as TrendingUpIcon,
  CloudUpload as UploadIcon,
  Psychology as PredictionIcon,
  Memory as ModelIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { fetchHistory } from '@/store/slices/historySlice';
import {
  fetchAdminStats,
  fetchModelInfo,
  fetchAdminResults,
  fetchThresholds,
} from '@/store/slices/adminSlice';
import { StatCard } from '@/components/common/Card/StatCard';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { MyResultsItem } from '@/types';
import { med } from '@/styles/themes/theme';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(5, 0),
  backgroundColor: med.surface,
}));

const COLORS = [med.primary, '#2E8B57', '#E9A820', '#D64045', '#5E35B1'];

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: PieLabelRenderProps) => {
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent || percent < 0.05) return null;
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = Number(cy) + radius * Math.sin(-midAngle * (Math.PI / 180));
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={500}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { results, loading, total } = useSelector(
    (state: RootState) => state.history
  );
  const { token, user } = useSelector((state: RootState) => state.auth);
  const admin = useSelector((state: RootState) => state.admin);

  const isAdmin = user?.role === 'admin';

  // Admin results pagination
  const [adminPage, setAdminPage] = useState(0);
  const [adminRowsPerPage, setAdminRowsPerPage] = useState(10);

  useEffect(() => {
    if (token) {
      dispatch(fetchHistory({ skip: 0, limit: 100 }));
    }
  }, [dispatch, token]);

  // Fetch admin data when admin is logged in
  useEffect(() => {
    if (token && isAdmin) {
      dispatch(fetchAdminStats());
      dispatch(fetchModelInfo());
      dispatch(fetchThresholds());
      dispatch(fetchAdminResults({ skip: 0, limit: adminRowsPerPage }));
    }
  }, [dispatch, token, isAdmin, adminRowsPerPage]);

  // Refetch admin results on page change
  useEffect(() => {
    if (token && isAdmin) {
      dispatch(fetchAdminResults({ skip: adminPage * adminRowsPerPage, limit: adminRowsPerPage }));
    }
  }, [dispatch, token, isAdmin, adminPage, adminRowsPerPage]);

  // Derive stats from loaded history
  const stats = useMemo(() => {
    const diseaseCount: Record<string, number> = {};
    let totalDetected = 0;

    results.forEach((r: MyResultsItem) => {
      r.detected_diseases.forEach((d) => {
        diseaseCount[d] = (diseaseCount[d] || 0) + 1;
        totalDetected++;
      });
    });

    const distribution = Object.entries(diseaseCount).map(([name, value]) => ({
      name,
      value,
    }));

    return { totalScans: total, totalDetected, distribution };
  }, [results, total]);

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <DashboardContainer>
          <Container maxWidth="md">
            <Alert severity="info" sx={{ mb: 3 }}>
              Please log in to view the dashboard.
            </Alert>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </Container>
        </DashboardContainer>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <DashboardContainer>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ color: med.primary, display: 'block' }}>Dashboard</Typography>
            <Typography variant="h3" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.025em' }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your analysis statistics
            </Typography>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Scans"
                value={stats.totalScans.toLocaleString()}
                icon={<AssessmentIcon sx={{ fontSize: 24 }} />}
                iconColor={med.primary}
                trend={{ value: 0, positive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Issues Detected"
                value={stats.totalDetected.toLocaleString()}
                icon={<WarningIcon sx={{ fontSize: 24 }} />}
                iconColor="#D64045"
                trend={{ value: 0, positive: false }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Conditions Found"
                value={stats.distribution.length.toString()}
                icon={<ConditionsIcon sx={{ fontSize: 24 }} />}
                iconColor="#2E8B57"
                trend={{ value: 0, positive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Records Loaded"
                value={results.length.toString()}
                icon={<TrendingUpIcon sx={{ fontSize: 24 }} />}
                iconColor="#5E35B1"
                trend={{ value: 0, positive: true }}
              />
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            {/* Disease Distribution Pie */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={{ p: 3, border: `1px solid ${med.border}` }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Disease Distribution
                </Typography>
                {stats.distribution.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={stats.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.distribution.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: `${med.radiusXs}px`,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(15,26,46,0.12)',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                      {stats.distribution.map((entry, index) => (
                        <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '2px',
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <Typography variant="caption" sx={{ fontSize: '11px' }}>
                            {entry.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No disease data available yet.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Recent Scans */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={{ p: 3, border: `1px solid ${med.border}` }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Recent Scans
                </Typography>
                {results.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {results.slice(0, 8).map((r: MyResultsItem) => (
                      <Box
                        key={r.prediction_id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: `${med.radiusSm}px`,
                          backgroundColor: med.surface,
                          border: `1px solid ${med.border}`,
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          '&:hover': { backgroundColor: med.primaryLight },
                        }}
                        onClick={() => navigate(`/results/${r.prediction_id}`)}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {r.prediction_id.slice(0, 12)}...
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(r.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {r.detected_diseases.length > 0 ? (
                            r.detected_diseases.map((d, i) => (
                              <Chip key={i} label={d} size="small" color="warning" />
                            ))
                          ) : (
                            <Chip label="Normal" size="small" color="success" />
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent scans. Upload a retinal image to get started.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* ========== ADMIN PANEL ========== */}
          {isAdmin && (
            <Box sx={{ mt: 6 }}>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AdminIcon sx={{ color: '#D64045', fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                  Admin Panel
                </Typography>
                <Chip label="Admin Only" size="small" sx={{ backgroundColor: '#D6404518', color: '#D64045', fontWeight: 600 }} />
              </Box>

              {admin.loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} />
                </Box>
              )}

              {admin.error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: `${med.radiusSm}px` }}>
                  {admin.error}
                </Alert>
              )}

              {/* Platform Stats */}
              {admin.stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      title="Total Images Uploaded"
                      value={admin.stats.total_images_uploaded.toLocaleString()}
                      icon={<UploadIcon sx={{ fontSize: 24 }} />}
                      iconColor="#5E35B1"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      title="Total Predictions"
                      value={admin.stats.total_predictions.toLocaleString()}
                      icon={<PredictionIcon sx={{ fontSize: 24 }} />}
                      iconColor={med.primary}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      title="Active Model"
                      value={admin.stats.active_model_version || '—'}
                      icon={<ModelIcon sx={{ fontSize: 24 }} />}
                      iconColor="#E9A820"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      title="Disease Types Seen"
                      value={Object.keys(admin.stats.disease_detection_counts).length.toString()}
                      icon={<ConditionsIcon sx={{ fontSize: 24 }} />}
                      iconColor="#D64045"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Disease Detection Counts & Model Info side by side */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Disease detection counts */}
                {admin.stats && Object.keys(admin.stats.disease_detection_counts).length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, border: `1px solid ${med.border}`, borderRadius: `${med.radius}px` }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                        Disease Detection Counts
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {Object.entries(admin.stats.disease_detection_counts)
                          .sort(([, a], [, b]) => b - a)
                          .map(([disease, count]) => {
                            const maxCount = Math.max(...Object.values(admin.stats!.disease_detection_counts));
                            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            return (
                              <Box key={disease}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                                    {disease.replace(/_/g, ' ')}
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                                    {count}
                                  </Typography>
                                </Box>
                                <Box sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: med.border,
                                  overflow: 'hidden',
                                }}>
                                  <Box sx={{
                                    height: '100%',
                                    width: `${pct}%`,
                                    borderRadius: 3,
                                    backgroundColor: med.primary,
                                    transition: 'width 0.4s ease',
                                  }} />
                                </Box>
                              </Box>
                            );
                          })}
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* Model info */}
                {admin.modelInfo && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, border: `1px solid ${med.border}`, borderRadius: `${med.radius}px` }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                        Active Model Details
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {[
                          ['Version', admin.modelInfo.version],
                          ['Architecture', admin.modelInfo.architecture],
                          ['Accuracy', admin.modelInfo.accuracy
                            ? `${(admin.modelInfo.accuracy <= 1 ? admin.modelInfo.accuracy * 100 : admin.modelInfo.accuracy).toFixed(1)}%`
                            : 'N/A'],
                          ['AUC-ROC', admin.modelInfo.auc_roc
                            ? (admin.modelInfo.auc_roc <= 1 ? admin.modelInfo.auc_roc : admin.modelInfo.auc_roc / 100).toFixed(3)
                            : 'N/A'],
                          ['Training Date', new Date(admin.modelInfo.training_date).toLocaleDateString()],
                          ['Status', admin.modelInfo.is_active ? 'Active' : 'Inactive'],
                        ].map(([label, val]) => (
                          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                            <Typography variant="body2" fontWeight={600}>{val}</Typography>
                          </Box>
                        ))}
                        {admin.modelInfo.description && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Description</Typography>
                            <Typography variant="body2">{admin.modelInfo.description}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* Thresholds */}
                {admin.thresholds && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, border: `1px solid ${med.border}`, borderRadius: `${med.radius}px` }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                        Detection Thresholds
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {Object.entries(admin.thresholds)
                          .filter(([, v]) => typeof v === 'number')
                          .map(([disease, threshold]) => (
                          <Box key={disease} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                              {disease.replace(/_/g, ' ')}
                            </Typography>
                            <Chip
                              label={`${(threshold <= 1 ? threshold * 100 : threshold).toFixed(0)}%`}
                              size="small"
                              sx={{
                                backgroundColor: `${med.primary}14`,
                                color: med.primary,
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* All Prediction Results Table */}
              <Paper sx={{ border: `1px solid ${med.border}`, borderRadius: `${med.radius}px`, overflow: 'hidden' }}>
                <Box sx={{ p: 3, pb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    All Prediction Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Platform-wide prediction history across all users
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 600, color: 'text.secondary', borderColor: med.border } }}>
                        <TableCell>Prediction ID</TableCell>
                        <TableCell>User ID</TableCell>
                        <TableCell>Detected Diseases</TableCell>
                        <TableCell>Timestamp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {admin.results.length > 0 ? (
                        admin.results.map((r) => (
                          <TableRow key={r.prediction_id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                {r.prediction_id.slice(0, 16)}…
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                {r.user_id ? `${r.user_id.slice(0, 12)}…` : '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {r.detected_diseases.length > 0 ? (
                                  r.detected_diseases.map((d, i) => (
                                    <Chip key={i} label={d.replace(/_/g, ' ')} size="small" color="warning" sx={{ textTransform: 'capitalize' }} />
                                  ))
                                ) : (
                                  <Chip label="Normal" size="small" color="success" />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary" fontSize="12px">
                                {new Date(r.timestamp).toLocaleString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No prediction results found.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={admin.resultsTotal}
                  page={adminPage}
                  onPageChange={(_, newPage) => setAdminPage(newPage)}
                  rowsPerPage={adminRowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setAdminRowsPerPage(parseInt(e.target.value, 10));
                    setAdminPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  sx={{ borderTop: `1px solid ${med.border}` }}
                />
              </Paper>
            </Box>
          )}
        </Container>
      </DashboardContainer>

      <Footer />
    </Box>
  );
};
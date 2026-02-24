import React, { useEffect, useMemo } from 'react';
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
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { fetchHistory } from '@/store/slices/historySlice';
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
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchHistory({ skip: 0, limit: 100 }));
    }
  }, [dispatch, token]);

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
        </Container>
      </DashboardContainer>

      <Footer />
    </Box>
  );
};
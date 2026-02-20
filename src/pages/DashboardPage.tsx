import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchStatistics, fetchHistory } from '@/store/slices/historySlice';
import { StatCard } from '@/components/common/Card/StatCard';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';

// ✅ Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(6, 0),
  backgroundColor: '#F5F7FA',
}));

const COLORS = ['#1976D2', '#4CAF50', '#FFC107', '#F44336', '#9C27B0'];

// Mock data (replace with API data in production)
const mockMonthlyData = [
  { month: 'Jan', totalScans: 420, issuesDetected: 245 },
  { month: 'Feb', totalScans: 300, issuesDetected: 140 },
  { month: 'Mar', totalScans: 200, issuesDetected: 95 },
  { month: 'Apr', totalScans: 278, issuesDetected: 130 },
  { month: 'May', totalScans: 189, issuesDetected: 78 },
  { month: 'Jun', totalScans: 239, issuesDetected: 112 },
];

const mockDiseaseDistribution = [
  { name: 'Cataract', value: 320 },
  { name: 'Diabetic Retinopathy', value: 280 },
  { name: 'Glaucoma', value: 190 },
  { name: 'Macular Degeneration', value: 150 },
];

// ✅ FIX: Custom label function that returns proper SVG <Text> element
const renderCustomizedLabel = ({ 
  cx, cy, midAngle, innerRadius, outerRadius, percent, name, index 
}: any) => {
  // Only show labels for slices with significant percentage
  if (percent < 0.05) return null;
  
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  
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
  const theme = useTheme();
  
  const { statistics, loading } = useSelector((state: RootState) => state.history);

  // Mock user ID - replace with actual auth in production
  const userId = 'user-123';

  useEffect(() => {
    dispatch(fetchStatistics(userId));
    dispatch(fetchHistory({ userId, page: 1, pageSize: 10, filters: {} }));
  }, [dispatch, userId]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <DashboardContainer>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={600} gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor system performance and analysis statistics
            </Typography>
          </Box>

          {/* ✅ Stats Cards - MUI v6 Grid API */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Scans"
                value={statistics?.total_images?.toLocaleString() || '1,234'}
                icon={<AssessmentIcon sx={{ fontSize: 28 }} />}
                iconColor="#1976D2"
                trend={{ value: 12.5, positive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Diseases Detected"
                value={statistics?.total_detected_diseases?.toLocaleString() || '843'}
                icon={<WarningIcon sx={{ fontSize: 28 }} />}
                iconColor="#F44336"
                trend={{ value: 8.2, positive: false }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Active Patients"
                value={statistics?.total_predictions?.toLocaleString() || '567'}
                icon={<PeopleIcon sx={{ fontSize: 28 }} />}
                iconColor="#4CAF50"
                trend={{ value: 15.3, positive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Avg. Accuracy"
                value="98.2%"
                icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                iconColor="#9C27B0"
                trend={{ value: 2.1, positive: true }}
              />
            </Grid>
          </Grid>

          {/* ✅ Charts Section - MUI v6 Grid API */}
          <Grid container spacing={3}>
            {/* Monthly Scan Volume */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Monthly Scan Volume
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={mockMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="totalScans" fill="#1976D2" name="Total Scans" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="issuesDetected" fill="#FFC107" name="Issues Detected" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Disease Distribution - ✅ FIXED: Pie chart label */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Disease Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={mockDiseaseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // ✅ FIX: Use custom label function that returns SVG element
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockDiseaseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend below chart */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  {mockDiseaseDistribution.map((entry, index) => (
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
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent scan activity would be displayed here...
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </DashboardContainer>

      <Footer />
    </Box>
  );
};
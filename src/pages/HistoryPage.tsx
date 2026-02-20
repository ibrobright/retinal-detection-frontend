import React, { useState, useEffect } from 'react';
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
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchHistory, setFilters, setPage, setPageSize } from '@/store/slices/historySlice';
import { Navbar } from '@/components/common/Layout/Navbar';
import { Footer } from '@/components/common/Layout/Footer';
import { HistoryResult, DiseaseType } from '@/types';
import toast from 'react-hot-toast';

// ✅ Styled Components
const HistoryContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 200px)',
  padding: theme.spacing(6, 0),
  backgroundColor: '#F5F7FA',
}));

const FilterPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
}));

const diseaseOptions: DiseaseType[] = [
  'glaucoma',
  'cataract',
  'diabetic_retinopathy',
  'macular_degeneration',
];

const diseaseLabels: Record<DiseaseType, string> = {
  glaucoma: 'Glaucoma',
  cataract: 'Cataract',
  diabetic_retinopathy: 'Diabetic Retinopathy',
  macular_degeneration: 'Macular Degeneration',
};

export const HistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  const { results, loading, pagination, filters, statistics } = useSelector(
    (state: RootState) => state.history
  );

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);

  // Mock user ID - replace with actual auth
  const userId = 'user-123';

  useEffect(() => {
    dispatch(fetchHistory({ userId, page: 1, pageSize: 20, filters: {} }));
  }, [dispatch, userId]);

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setPage(newPage + 1));
    dispatch(fetchHistory({ userId, page: newPage + 1, pageSize: pagination.pageSize, filters }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newPageSize));
    dispatch(fetchHistory({ userId, page: 1, pageSize: newPageSize, filters }));
  };

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Debounce search in real implementation
  };

  const handleViewDetails = (resultId: string) => {
    setViewDetailsId(resultId);
    // Navigate to detailed view or open dialog
  };

  const handleDownloadReport = (resultId: string) => {
    toast.success('Report downloaded successfully');
    // Implement PDF download
  };

  const handleToggleComparison = (resultId: string) => {
    setSelectedForComparison(prev =>
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId].slice(0, 4) // Max 4 for comparison
    );
  };

  const getRiskColor = (diseases: Record<string, any>) => {
    const hasHighRisk = Object.values(diseases).some(
      (d: any) => d.detected && d.probability > 0.7
    );
    const hasMediumRisk = Object.values(diseases).some(
      (d: any) => d.detected && d.probability > 0.4 && d.probability <= 0.7
    );

    if (hasHighRisk) return 'error';
    if (hasMediumRisk) return 'warning';
    return 'success';
  };

  const getDetectedDiseases = (diseases: Record<string, any>) => {
    return Object.entries(diseases)
      .filter(([, result]: [string, any]) => result.detected)
      .map(([name]: [string, any]) => diseaseLabels[name as DiseaseType] || name);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <HistoryContainer>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" fontWeight={600} gutterBottom>
                Scan History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage past analysis results
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                sx={{ borderRadius: '8px' }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/upload'}
                sx={{
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                }}
              >
                New Scan
              </Button>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search by Patient ID, Name, or Date..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1, maxWidth: '400px' }}
              size="small"
            />
            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ borderRadius: '8px' }}
            >
              Filters
            </Button>
          </Box>

          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel elevation={0}>
              {/* ✅ Fixed: MUI v6 Grid API - use 'size' prop instead of 'item xs' */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="From Date"
                      value={filters.dateFrom}
                      onChange={(date) => handleFilterChange('dateFrom', date)}
                      slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="To Date"
                      value={filters.dateTo}
                      onChange={(date) => handleFilterChange('dateTo', date)}
                      slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Diseases</InputLabel>
                    <Select
                      multiple
                      value={filters.diseases}
                      label="Diseases"
                      onChange={(e) => handleFilterChange('diseases', e.target.value as DiseaseType[])}
                      renderValue={(selected) => selected.map(d => diseaseLabels[d]).join(', ')}
                    >
                      {diseaseOptions.map((disease) => (
                        <MenuItem key={disease} value={disease}>
                          <Checkbox checked={filters.diseases.indexOf(disease) > -1} />
                          <ListItemText primary={diseaseLabels[disease]} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => dispatch(setFilters({
                      dateFrom: null,
                      dateTo: null,
                      diseases: [],
                      riskLevels: [],
                      searchQuery: '',
                      status: [],
                    }))}
                    sx={{ borderRadius: '8px', height: '40px' }}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </FilterPanel>
          )}

          {/* Results Table */}
          <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell><strong>Scan ID</strong></TableCell>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Patient ID</strong></TableCell>
                  <TableCell><strong>Findings</strong></TableCell>
                  <TableCell><strong>Confidence</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => {
                  const detectedDiseases = getDetectedDiseases(result.diseases);
                  const riskColor = getRiskColor(result.diseases);

                  return (
                    <TableRow
                      key={result.prediction_id}
                      hover
                      selected={selectedForComparison.includes(result.prediction_id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedForComparison.includes(result.prediction_id)}
                          onChange={() => handleToggleComparison(result.prediction_id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {result.prediction_id.slice(0, 12)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {result.patient_id || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {detectedDiseases.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {detectedDiseases.map((disease, idx) => (
                              <Chip
                                key={idx}
                                label={disease}
                                color={riskColor as any}
                                size="small"
                              />
                            ))}
                          </Box>
                        ) : (
                          <Chip label="Normal" color="success" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: '60px',
                              height: '6px',
                              borderRadius: '3px',
                              backgroundColor: riskColor === 'error' ? '#F44336' : 
                                             riskColor === 'warning' ? '#FFC107' : '#4CAF50',
                            }}
                          />
                          <Typography variant="body2">
                            {Math.max(...Object.values(result.diseases).map((d: any) => d.probability)) * 100}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(result.prediction_id)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadReport(result.prediction_id)}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.pageSize}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{ mt: 2 }}
          />

          {/* Comparison Panel */}
          {selectedForComparison.length > 0 && (
            <Paper
              sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                px: 3,
                py: 2,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                zIndex: 1000,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  {selectedForComparison.length} selected for comparison
                </Typography>
                <Button
                  size="small"
                  startIcon={<CompareIcon />}
                  variant="contained"
                  sx={{ borderRadius: '8px' }}
                >
                  Compare
                </Button>
                <Button
                  size="small"
                  onClick={() => setSelectedForComparison([])}
                >
                  Clear
                </Button>
              </Box>
            </Paper>
          )}
        </Container>
      </HistoryContainer>

      <Footer />
    </Box>
  );
};
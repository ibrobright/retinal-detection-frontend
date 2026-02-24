import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { theme } from '@/styles/themes/theme';

// Pages
import { HomePage } from '@/pages/HomePage';
import { UploadPage } from '@/pages/UploadPage';
import { PredictionPage } from '@/pages/PredictionPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

// Error Boundary
import { ErrorBoundary } from '@/components/common/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/results/:predictionId" element={<PredictionPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="*"
                element={
                  <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" style={{ color: '#0D7C66' }}>Go Home</a>
                  </div>
                }
              />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid #E5E9F0',
                boxShadow: '0 4px 16px rgba(15,26,46,0.08)',
                fontSize: '0.875rem',
                fontFamily: '"Onest", sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#2E8B57',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#D64045',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
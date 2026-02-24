import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              py: 8,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#F44336', mb: 3 }} />
            <Typography variant="h3" gutterBottom fontWeight={600}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  bgcolor: '#F5F5F5',
                  p: 2,
                  borderRadius: '8px',
                  mb: 3,
                  maxWidth: '600px',
                  textAlign: 'left',
                }}
              >
                <Typography variant="caption" color="error">
                  {this.state.error.message}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={this.handleReload}
                sx={{
                  borderRadius: '8px',
                  background: '#0D7C66',
                }}
              >
                Reload Page
              </Button>
              <Button variant="outlined" onClick={this.handleGoHome} sx={{ borderRadius: '8px' }}>
                Go Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
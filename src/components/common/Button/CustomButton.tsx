import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const StyledButton = styled(Button)<CustomButtonProps>(({ theme, variant, size }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  
  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
      transform: 'translateY(-1px)',
    },
  }),
  
  ...(variant === 'secondary' && {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#388E3C',
    },
  }),
  
  ...(variant === 'outlined' && {
    border: '2px solid #1976D2',
    color: '#1976D2',
    '&:hover': {
      border: '2px solid #1565C0',
      backgroundColor: '#E3F2FD',
    },
  }),
  
  ...(variant === 'danger' && {
    backgroundColor: '#F44336',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  }),
  
  ...(size === 'small' && {
    padding: '6px 16px',
    fontSize: '0.875rem',
  }),
  
  ...(size === 'large' && {
    padding: '14px 32px',
    fontSize: '1.125rem',
  }),
}));

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant === 'text' ? 'text' : 'contained'}
      size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};
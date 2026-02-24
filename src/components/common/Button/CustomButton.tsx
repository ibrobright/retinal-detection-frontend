import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { med } from '@/styles/themes/theme';

type CustomVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: CustomVariant;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const StyledButton = styled(Button)<{ $customVariant?: CustomVariant }>(({ $customVariant, size }) => ({
  borderRadius: `${med.radiusSm}px`,
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  transition: 'all 0.15s ease',
  
  ...($customVariant === 'primary' && {
    backgroundColor: med.primary,
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#0A6B58',
    },
  }),
  
  ...($customVariant === 'secondary' && {
    backgroundColor: med.accent,
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#C06730',
    },
  }),
  
  ...($customVariant === 'outlined' && {
    border: `1.5px solid ${med.border}`,
    color: med.dark,
    '&:hover': {
      borderColor: med.primary,
      backgroundColor: med.primaryLight,
    },
  }),
  
  ...($customVariant === 'danger' && {
    backgroundColor: '#D64045',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#B71C1C',
    },
  }),
  
  ...(size === 'small' && {
    padding: '6px 14px',
    fontSize: '0.8125rem',
  }),
  
  ...(size === 'large' && {
    padding: '13px 28px',
    fontSize: '0.9375rem',
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
      $customVariant={variant}
      size={size}
      disabled={disabled || loading}
      disableElevation
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};
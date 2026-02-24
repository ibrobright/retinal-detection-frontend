import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { med } from '@/styles/themes/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StyledCard = styled(Card)(() => ({
  border: `1px solid ${med.border}`,
  borderRadius: `${med.radius}px`,
  boxShadow: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    borderColor: med.primary,
    boxShadow: '0 4px 16px rgba(13, 124, 102, 0.06)',
  },
}));

const IconBox = styled(Box)<{ bg?: string; fg?: string }>(({ bg, fg }) => ({
  width: 44,
  height: 44,
  borderRadius: `${med.radiusSm}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bg || med.primaryLight,
  color: fg || med.primary,
  marginBottom: 14,
}));

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  trend,
}) => {
  return (
    <StyledCard>
      <CardContent sx={{ p: 2.5 }}>
        <IconBox bg={iconColor ? `${iconColor}18` : undefined} fg={iconColor || undefined}>
          {icon}
        </IconBox>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {value}
        </Typography>
        
        {trend && trend.value !== 0 && (
          <Typography
            variant="caption"
            color={trend.positive ? 'success.main' : 'error.main'}
            sx={{ mt: 0.5, display: 'block' }}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};
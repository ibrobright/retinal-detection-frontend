import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #E0E0E0',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const IconContainer = styled(Box)<{ color?: string }>(({ color }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? `${color}20` : '#E3F2FD',
  color: color || '#1976D2',
  marginBottom: '16px',
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
      <CardContent sx={{ p: 3 }}>
        <IconContainer color={iconColor}>
          {icon}
        </IconContainer>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {value}
        </Typography>
        
        {trend && (
          <Typography
            variant="body2"
            color={trend.positive ? 'success.main' : 'error.main'}
            sx={{ mt: 1 }}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};
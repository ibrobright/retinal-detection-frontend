import { createTheme } from '@mui/material/styles';

/*
 * RetinaAI Design System — Remedial Health–inspired
 * ───────────────────────────────────────────────────
 * Font     : Onest (tracking tight)
 * Primary  : Clinical teal-green  (#0D7C66)
 * Surfaces : Near-white (#FAFBFC) with subtle cool borders (#E5E9F0)
 * Dark     : Deep navy (#0F1A2E) for headings / footer
 * Accent   : Warm coral (#E8834A) for CTAs
 * Cards    : White with 1px border, ultra-light shadow
 * Radius   : 12px (cards), 10px (buttons), 8px (chips/inputs)
 */

const fontFamily = '"Onest", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D7C66',
      light: '#E8F5F1',
      dark: '#065A49',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8834A',
      light: '#FFF3EB',
      dark: '#C06730',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#E9A820',
      light: '#FEF7E6',
      dark: '#C08B10',
    },
    error: {
      main: '#D64045',
      light: '#FDECEC',
      dark: '#B71C1C',
    },
    success: {
      main: '#2E8B57',
      light: '#E8F5E9',
      dark: '#1B5E20',
    },
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F1A2E',
      secondary: '#5C6A82',
    },
    divider: '#E5E9F0',
  },
  typography: {
    fontFamily,
    h1: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.035em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: '1.0625rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.65,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
      letterSpacing: '-0.005em',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '-0.005em',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '-0.01em',
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(15,26,46,0.04)',
    '0 1px 4px rgba(15,26,46,0.06)',
    '0 2px 8px rgba(15,26,46,0.06)',
    '0 4px 12px rgba(15,26,46,0.07)',
    '0 6px 16px rgba(15,26,46,0.08)',
    '0 8px 24px rgba(15,26,46,0.09)',
    ...Array(18).fill('0 4px 12px rgba(15,26,46,0.07)'),
  ] as unknown as typeof createTheme extends (o: infer O) => unknown
    ? O extends { shadows: infer S } ? S : never
    : never,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily,
          letterSpacing: '-0.01em',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 22px',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '-0.01em',
        },
        containedPrimary: {
          backgroundColor: '#0D7C66',
          '&:hover': {
            backgroundColor: '#0A6B58',
          },
        },
        outlinedPrimary: {
          borderColor: '#D0D7E2',
          color: '#0F1A2E',
          '&:hover': {
            borderColor: '#0D7C66',
            backgroundColor: '#F0FAF7',
          },
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '13px 28px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #E5E9F0',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontSize: '0.9375rem',
            '& fieldset': {
              borderColor: '#E5E9F0',
            },
            '&:hover fieldset': {
              borderColor: '#C4CDD9',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '-0.005em',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F8FA',
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: '#0F1A2E',
            fontSize: '0.75rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 5,
          backgroundColor: '#E5E9F0',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          letterSpacing: '-0.01em',
        },
      },
    },
  },
});

/* ── Design tokens used outside MUI theme ── */
export const med = {
  primary: '#0D7C66',
  primaryLight: '#E8F5F1',
  primaryGradient: 'linear-gradient(135deg, #0D7C66 0%, #065A49 100%)',
  accent: '#E8834A',
  accentLight: '#FFF3EB',
  dark: '#0F1A2E',
  darkGradient: 'linear-gradient(135deg, #0F1A2E 0%, #0A1220 100%)',
  surface: '#FAFBFC',
  surfaceElevated: '#FFFFFF',
  border: '#E5E9F0',
  borderLight: '#F0F2F5',
  muted: '#5C6A82',
  cardShadow: '0 1px 4px rgba(15,26,46,0.05)',
  elevatedShadow: '0 8px 24px rgba(15,26,46,0.08)',
  radius: 12,
  radiusSm: 10,
  radiusXs: 8,
};
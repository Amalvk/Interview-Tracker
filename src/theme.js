import { createTheme } from '@mui/material/styles';

const RADIUS = 10;

export function getTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#4ade80' : '#16a34a',
        contrastText: '#ffffff',
      },
      success: { main: isDark ? '#4ade80' : '#16a34a' },
      warning: { main: isDark ? '#fbbf24' : '#d97706' },
      error: { main: isDark ? '#f87171' : '#dc2626' },
      background: {
        default: isDark ? '#0f1115' : '#f4faf6',
        paper: isDark ? '#161a20' : '#ffffff',
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
      text: {
        primary: isDark ? '#e5e7eb' : '#1e293b',
        secondary: isDark ? '#9ca3af' : '#64748b',
      },
    },
    shape: { borderRadius: RADIUS },
    typography: {
      fontFamily: [
        'Inter',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1.05rem' },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0f1115' : '#f4faf6',
          },
          '*:focus-visible': {
            outline: `2px solid ${isDark ? '#4ade80' : '#16a34a'}`,
            outlineOffset: 2,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: RADIUS,
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS + 4,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)'}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: RADIUS + 4 },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: RADIUS },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.045)',
          },
        },
      },
    },
  });
}

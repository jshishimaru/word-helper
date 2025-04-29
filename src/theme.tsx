import { createTheme, ThemeProvider, PaletteMode } from '@mui/material';
import { createContext, useState, useMemo, ReactNode } from 'react';

// Color design tokens
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#3a6ff7',
          },
          secondary: {
            main: '#6c5ce7',
          },
          background: {
            default: '#f7f9fc',
            paper: '#ffffff',
          },
          text: {
            primary: '#2d3748',
            secondary: '#4a5568',
          },
        }
      : {
          // Dark mode
          primary: {
            main: '#60a5fa',
          },
          secondary: {
            main: '#a78bfa',
          },
          background: {
            default: '#111827',
            paper: '#1f2937',
          },
          text: {
            primary: '#e2e8f0',
            secondary: '#cbd5e1',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  // Fixed shadow array to have exactly 25 elements
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.15)',
    '0px 12px 24px rgba(0,0,0,0.18)',
    '0px 14px 28px rgba(0,0,0,0.2)',
    '0px 16px 32px rgba(0,0,0,0.22)',
    '0px 18px 36px rgba(0,0,0,0.25)',
    '0px 20px 40px rgba(0,0,0,0.28)',
    '0px 22px 44px rgba(0,0,0,0.3)',
    '0px 24px 48px rgba(0,0,0,0.32)',
    '0px 26px 52px rgba(0,0,0,0.35)',
    '0px 28px 56px rgba(0,0,0,0.38)',
    '0px 30px 60px rgba(0,0,0,0.4)',
    '0px 32px 64px rgba(0,0,0,0.42)',
    '0px 34px 68px rgba(0,0,0,0.45)',
    '0px 36px 72px rgba(0,0,0,0.48)',
    '0px 38px 76px rgba(0,0,0,0.5)',
    '0px 40px 80px rgba(0,0,0,0.52)',
    '0px 42px 84px rgba(0,0,0,0.55)',
    '0px 44px 88px rgba(0,0,0,0.58)',
    '0px 46px 92px rgba(0,0,0,0.6)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.12)',
          },
        },
        containedPrimary: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode,
});

// Theme provider component
export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  )

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

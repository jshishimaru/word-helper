import { createTheme, ThemeProvider, PaletteMode, ThemeOptions } from '@mui/material';
import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { keyframes } from '@mui/system';

// Animation keyframes
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(58, 111, 247, 0.5); }
  50% { box-shadow: 0 0 20px rgba(58, 111, 247, 0.8); }
  100% { box-shadow: 0 0 5px rgba(58, 111, 247, 0.5); }
`;

export const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Color design tokens
const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
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
      letterSpacing: '-0.5px'
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
    '0px 48px 96px rgba(0,0,0,0.62)',
  ] as const,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '200%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.12)',
            '&::after': {
              opacity: 1,
              animation: `${shimmerAnimation} 1s linear infinite`,
            },
          },
        },
        containedPrimary: {
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:focus-within': {
            transform: 'scale(1.01)',
          }
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h3: {
          animation: `${fadeIn} 1s ease-out`,
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
            '&:focus-within': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          },
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
  // Initialize mode from localStorage or default to 'light'
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('colorMode');
    return (savedMode as PaletteMode) || 'light';
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('colorMode', mode);
  }, [mode]);

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

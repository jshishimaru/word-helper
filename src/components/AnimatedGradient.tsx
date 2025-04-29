import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface AnimatedGradientProps {
  children?: React.ReactNode;
}

const AnimatedGradient = ({ children }: AnimatedGradientProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Define the animation
  const gradientAnimation = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: isDark
          ? 'radial-gradient(ellipse at top, #111827, transparent), radial-gradient(ellipse at bottom, #0f172a, transparent)'
          : 'radial-gradient(ellipse at top, #f0f9ff, transparent), radial-gradient(ellipse at bottom, #f8fafc, transparent)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 15s ease infinite`,
        opacity: 0.7,
        zIndex: -1,
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedGradient;
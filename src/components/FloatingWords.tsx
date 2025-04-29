import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Words to float in background
const words = [
  'PUZZLE', 'SCRABBLE', 'WORDLE', 'LETTERS', 'DICTIONARY',
  'PLAY', 'WORDS', 'GAME', 'SPELL', 'VOCAB', 'LANGUAGE',
  'ANAGRAM', 'SOLVE', 'HELPER', 'FIND', 'MATCH'
];

interface FloatingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export const FloatingWords = () => {
  const [floatingWords, setFloatingWords] = useState<FloatingWord[]>([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  useEffect(() => {
    // Create initial floating words
    const initialWords: FloatingWord[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      word: words[Math.floor(Math.random() * words.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.8, // 0.8 - 2.3rem
      speed: (Math.random() * 15) + 10, // 10-25 seconds
      opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2 opacity
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20, // -10 to 10 deg/s
    }));

    setFloatingWords(initialWords);

    // Animation loop
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setFloatingWords(prevWords => 
        prevWords.map(word => {
          // Update y position (move upward)
          let newY = word.y - (deltaTime * 100 / word.speed);
          
          // Reset position if word goes beyond the top
          if (newY < -10) {
            return {
              ...word,
              y: 110, // Start from below the screen
              x: Math.random() * 100,
              word: words[Math.floor(Math.random() * words.length)],
              opacity: Math.random() * 0.15 + 0.05,
              size: Math.random() * 1.5 + 0.8,
            };
          }
          
          // Update rotation
          const newRotation = word.rotation + word.rotationSpeed * deltaTime;
          
          return { ...word, y: newY, rotation: newRotation };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup animation frame
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none', // Don't interfere with user interactions
        userSelect: 'none', // Prevent text selection
        zIndex: 0,
      }}
    >
      {floatingWords.map((word) => (
        <Box
          key={word.id}
          sx={{
            position: 'absolute',
            left: `${word.x}%`,
            top: `${word.y}%`,
            fontSize: `${word.size}rem`,
            fontWeight: 700,
            opacity: word.opacity,
            transform: `rotate(${word.rotation}deg)`,
            transition: 'transform 0.5s ease',
            color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            textShadow: isDark ? '0 0 10px rgba(255,255,255,0.1)' : '0 0 10px rgba(0,0,0,0.05)',
            letterSpacing: '1px',
          }}
        >
          {word.word}
        </Box>
      ))}
    </Box>
  );
};

export default FloatingWords;
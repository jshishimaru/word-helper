import  { useState, useEffect, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Box, 
  Paper, 
  Typography,
  Stack,
  InputLabel,
  FormControl,
  OutlinedInput,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  Zoom,
  Fade
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { loadDictionary, isRealWord } from './dictionary';
import { ColorModeContext, pulseAnimation, glowAnimation } from './theme';
import FloatingWords from './components/FloatingWords';
import ParticleAnimation from './components/ParticleAnimation';
import AnimatedGradient from './components/AnimatedGradient';

const WordHelper = () => {
  // Initialize state from localStorage or default values
  const [letters, setLetters] = useState(() => {
    return localStorage.getItem('letters') || '';
  });
  
  const [wordLength, setWordLength] = useState(() => {
    return localStorage.getItem('wordLength') || '';
  });
  
  const [patternChars, setPatternChars] = useState<string[]>(() => {
    try {
      const savedPattern = localStorage.getItem('patternChars');
      return savedPattern ? JSON.parse(savedPattern) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [results, setResults] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Get theme and color mode from context
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';

  // Load dictionary on component mount
  useEffect(() => {
    async function initDictionary() {
      const dict = await loadDictionary();
      setDictionary(dict);
    }
    initDictionary();

    // Set initial load flag to false after a delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Update pattern boxes when word length changes
  useEffect(() => {
    const length = parseInt(wordLength) || 0;
    setPatternChars(Array(length).fill(''));
  }, [wordLength]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('letters', letters);
  }, [letters]);

  useEffect(() => {
    localStorage.setItem('wordLength', wordLength);
  }, [wordLength]);

  useEffect(() => {
    localStorage.setItem('patternChars', JSON.stringify(patternChars));
  }, [patternChars]);

  const handlePatternChange = (index: number, value: string) => {
    const newPatternChars = [...patternChars];
    newPatternChars[index] = value.charAt(0); // Only keep the first character
    setPatternChars(newPatternChars);
  };

  const generateWords = () => {
    if (!letters || !wordLength) {
      return;
    }
    
    setIsLoading(true);
    
    // Using setTimeout to prevent UI blocking for larger calculations
    setTimeout(() => {
      const perms = getPermutations(letters.toLowerCase(), parseInt(wordLength));
      
      // Filter by pattern and real words
      const filteredResults = perms.filter(word => {
        // First filter by pattern
        const matchesPattern = patternChars.every((char, i) => 
          !char || char.toLowerCase() === word[i]
        );
        
        // Then check if it's a real word
        return matchesPattern && isRealWord(word, dictionary);
      });
      
      setResults([...new Set(filteredResults)]);
      setIsLoading(false);
    }, 0);
  };

  const getPermutations = (str: string, length: number) => {
    if (length === 1) return str.split('');
    let result: string[] = [];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remaining = str.slice(0, i) + str.slice(i + 1);
      const perms = getPermutations(remaining, length - 1);
      for (const perm of perms) {
        result.push(char + perm);
      }
    }
    return result;
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        bgcolor: 'background.default',
        color: 'text.primary',
        py: 6,
        transition: 'background-color 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background animations */}
      <AnimatedGradient />
      <ParticleAnimation intensity={isDark ? 'medium' : 'low'} />
      <FloatingWords />
      
      <Container maxWidth="md" sx={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Theme toggle with enhanced animation */}
          <Zoom in={!isInitialLoad} style={{ transitionDelay: '300ms' }}>
            <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
              <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                <IconButton 
                  onClick={colorMode.toggleColorMode} 
                  color="inherit"
                  sx={{ 
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      transform: 'rotate(90deg)',
                    },
                    transition: 'transform 0.5s ease, background 0.3s ease',
                  }}
                >
                  {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Zoom>

          <Fade in={!isInitialLoad} timeout={800}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              align="center"
              fontWeight="bold"
              color="primary"
              sx={{ 
                mb: 4, 
                fontSize: { xs: '2.2rem', md: '3rem' },
                background: isDark ? 
                  'linear-gradient(45deg, #60a5fa, #a78bfa)' : 
                  'linear-gradient(45deg, #3a6ff7, #6c5ce7)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textFillColor: 'transparent',
                textShadow: '0 5px 15px rgba(0,0,0,0.1)',
                animation: `${pulseAnimation} 3s ease-in-out infinite`,
              }}
            >
              Word Helper
            </Typography>
          </Fade>
          
          <Zoom in={!isInitialLoad} style={{ transitionDelay: '400ms' }}>
            <Card 
              sx={{ 
                mb: 5, 
                width: '100%',
                borderRadius: 4,
                boxShadow: theme.shadows[isDark ? 2 : 3],
                background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                animation: `${glowAnimation} 5s infinite alternate`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.01)',
                  boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 15px 35px rgba(0, 0, 0, 0.1)'
                }
              }}
              elevation={0}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={4}>
                  <Fade in={!isInitialLoad} timeout={1000} style={{ transitionDelay: '500ms' }}>
                    <TextField
                      fullWidth
                      label="Available Letters"
                      placeholder="Enter available letters (e.g., ABCE)"
                      value={letters}
                      onChange={(e) => setLetters(e.target.value.toUpperCase())}
                      variant="outlined"
                      InputProps={{
                        sx: { fontSize: '1.2rem', py: 0.5 }
                      }}
                      InputLabelProps={{
                        sx: { fontSize: '1.1rem' }
                      }}
                    />
                  </Fade>
                  
                  <Fade in={!isInitialLoad} timeout={1000} style={{ transitionDelay: '600ms' }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Word Length"
                      placeholder="Word length (e.g., 4)"
                      value={wordLength}
                      onChange={(e) => setWordLength(e.target.value)}
                      InputProps={{ 
                        inputProps: { min: 1, max: 10 },
                        sx: { fontSize: '1.2rem', py: 0.5 }
                      }}
                      InputLabelProps={{
                        sx: { fontSize: '1.1rem' }
                      }}
                      variant="outlined"
                    />
                  </Fade>
                  
                  {patternChars.length > 0 && (
                    <Fade in={!isInitialLoad} timeout={1000} style={{ transitionDelay: '700ms' }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel 
                          shrink 
                          htmlFor="pattern-input"
                          sx={{ fontSize: '1.1rem' }}
                        >
                          Pattern (leave empty for any letter)
                        </InputLabel>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 1.5, 
                              justifyContent: 'center',
                              maxWidth: '100%',
                              overflow: 'auto' 
                            }}
                          >
                            {patternChars.map((char, index) => (
                              <Zoom 
                                key={index} 
                                in={true} 
                                style={{ 
                                  transitionDelay: `${800 + index * 50}ms`,
                                  transformOrigin: 'center' 
                                }}
                              >
                                <Box>
                                  <OutlinedInput
                                    value={char}
                                    onChange={(e) => handlePatternChange(index, e.target.value.toUpperCase())}
                                    sx={{ 
                                      width: '56px',
                                      height: '56px',
                                      textAlign: 'center',
                                      input: { textAlign: 'center' },
                                      borderRadius: 2,
                                      background: theme.palette.background.default,
                                      transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                                      '&:focus-within': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 0 15px rgba(58, 111, 247, 0.5)'
                                      }
                                    }}
                                    inputProps={{
                                      maxLength: 1,
                                      style: { 
                                        textAlign: 'center', 
                                        padding: '8px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                      }
                                    }}
                                  />
                                </Box>
                              </Zoom>
                            ))}
                          </Box>
                        </Box>
                      </FormControl>
                    </Fade>
                  )}
                  
                  <Fade in={!isInitialLoad} timeout={1000} style={{ transitionDelay: '900ms' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={generateWords}
                      disabled={!letters || !wordLength || parseInt(wordLength) < 1 || isLoading || dictionary.size === 0}
                      size="large"
                      sx={{ 
                        mt: 3, 
                        py: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '12px',
                        alignSelf: 'center',
                        minWidth: '220px',
                        background: isDark ? 
                          'linear-gradient(90deg, #60a5fa, #a78bfa)' : 
                          'linear-gradient(90deg, #3a6ff7, #6c5ce7)',
                        boxShadow: '0 4px 14px rgba(58, 111, 247, 0.25)',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                          opacity: 0,
                          transform: 'scale(0.5)',
                          transition: 'transform 0.5s, opacity 0.5s',
                        },
                        '&:hover': {
                          background: isDark ? 
                            'linear-gradient(90deg, #60a5fa, #a78bfa)' : 
                            'linear-gradient(90deg, #3a6ff7, #6c5ce7)',
                          boxShadow: '0 6px 20px rgba(58, 111, 247, 0.35)',
                          transform: 'translateY(-2px)',
                          '&::after': {
                            opacity: 1,
                            transform: 'scale(1)',
                            animation: `${pulseAnimation} 1.5s infinite`,
                          }
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                          boxShadow: '0 2px 10px rgba(58, 111, 247, 0.25)',
                        },
                        '&:disabled': {
                          background: isDark ? 
                            'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      {isLoading ? <CircularProgress size={28} color="inherit" sx={{ mr: 1 }} /> : 'Find Real Words'}
                    </Button>
                  </Fade>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>
          
          <Fade in={!isInitialLoad || results.length > 0} timeout={1000}>
            <Box sx={{ width: '100%' }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                textAlign="center"
                fontWeight="600"
                sx={{ 
                  mb: 3,
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'opacity 0.3s ease',
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}
              >
                {isLoading ? 
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <CircularProgress size={24} /> Searching...
                  </Box> : 
                  results.length > 0 ? `Real Words (${results.length})` : 'No real words found'
                }
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: 'center'
              }}>
                {results.map((word, idx) => (
                  <Zoom 
                    in={true} 
                    style={{ transitionDelay: `${idx * 50}ms` }}
                    key={idx}
                  >
                    <Box 
                      sx={{ 
                        width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 11px)', md: 'calc(25% - 12px)' } 
                      }}
                    >
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2.5, 
                          textAlign: 'center',
                          bgcolor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                          borderRadius: 3,
                          fontWeight: 'medium',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)',
                          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                          backdropFilter: 'blur(8px)',
                          '&:hover': {
                            transform: 'translateY(-5px) scale(1.03)',
                            boxShadow: isDark ? 
                              '0 10px 25px rgba(0,0,0,0.5)' : 
                              '0 12px 28px rgba(0,0,0,0.15)',
                            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            background: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'
                          }
                        }}
                      >
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontSize: '1.25rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              width: '0%',
                              height: '2px',
                              bottom: '-2px',
                              left: '50%',
                              background: isDark ? 
                                'linear-gradient(90deg, #60a5fa, #a78bfa)' : 
                                'linear-gradient(90deg, #3a6ff7, #6c5ce7)',
                              transition: 'all 0.3s ease',
                              transform: 'translateX(-50%)',
                            },
                            '&:hover::after': {
                              width: '80%',
                            }
                          }}
                        >
                          {word}
                        </Typography>
                      </Paper>
                    </Box>
                  </Zoom>
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default WordHelper;
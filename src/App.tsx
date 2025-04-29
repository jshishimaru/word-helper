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
  useTheme
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { loadDictionary, isRealWord } from './dictionary';
import { ColorModeContext } from './theme';

const WordHelper = () => {
  const [letters, setLetters] = useState('');
  const [wordLength, setWordLength] = useState('');
  const [patternChars, setPatternChars] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
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
  }, []);

  // Update pattern boxes when word length changes
  useEffect(() => {
    const length = parseInt(wordLength) || 0;
    setPatternChars(Array(length).fill(''));
  }, [wordLength]);

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
        transition: 'background-color 0.3s ease'
      }}
    >
      <Container maxWidth="md" sx={{ width: '100%' }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Theme toggle */}
          <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
            <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                color="inherit"
                sx={{ 
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  '&:hover': {
                    background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  }
                }}
              >
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>

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
              textFillColor: 'transparent'
            }}
          >
            Word Helper
          </Typography>
          
          <Card 
            sx={{ 
              mb: 5, 
              width: '100%',
              borderRadius: 4,
              boxShadow: theme.shadows[isDark ? 2 : 3],
              background: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
            elevation={0}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={4}>
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
                
                {patternChars.length > 0 && (
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
                          <Box key={index}>
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
                        ))}
                      </Box>
                    </Box>
                  </FormControl>
                )}
                
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
                    '&:hover': {
                      background: isDark ? 
                        'linear-gradient(90deg, #60a5fa, #a78bfa)' : 
                        'linear-gradient(90deg, #3a6ff7, #6c5ce7)',
                      boxShadow: '0 6px 20px rgba(58, 111, 247, 0.35)',
                      transform: 'translateY(-2px)',
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
              </Stack>
            </CardContent>
          </Card>
          
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              textAlign="center"
              fontWeight="600"
              sx={{ mb: 3 }}
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
                <Box 
                  key={idx} 
                  sx={{ 
                    width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 11px)', md: 'calc(25% - 12px)' } 
                  }}
                >
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2.5, 
                      textAlign: 'center',
                      bgcolor: theme.palette.background.paper,
                      borderRadius: 3,
                      fontWeight: 'medium',
                      transition: 'all 0.2s ease',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)',
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: isDark ? 
                          '0 6px 20px rgba(0,0,0,0.3)' : 
                          '0 8px 16px rgba(0,0,0,0.1)',
                        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{ 
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {word}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WordHelper;
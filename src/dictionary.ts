// This file contains an enhanced English dictionary implementation

// Common English words dictionary
// We'll use a Set for O(1) lookups
let dictionarySet: Set<string> | null = null;

// List of dictionary sources in order of preference
const dictionarySources = [
  // Primary source - Comprehensive WordNet dictionary
  'https://raw.githubusercontent.com/wordnet/wordnet/master/dict/words.txt',
  // Second source - SCOWL (Spell Checker Oriented Word Lists) - medium size with American and British spellings
  'https://raw.githubusercontent.com/en-wl/wordlist/master/alt12dicts/2of12inf.txt',
  // Fallback to the original source if the above fail
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
  // Last resort - a smaller but reliable dictionary
  'https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt'
];

// Function to load the dictionary
export async function loadDictionary(): Promise<Set<string>> {
  // Return cached dictionary if available
  if (dictionarySet) return dictionarySet;
  
  for (const source of dictionarySources) {
    try {
      console.log(`Attempting to load dictionary from: ${source}`);
      const response = await fetch(source);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${source}, status: ${response.status}`);
      }
      
      const text = await response.text();
      let words: string[] = [];
      
      // Different sources need different parsing
      if (source.includes('2of12inf.txt')) {
        // Process SCOWL format - words with flags
        words = text
          .split('\n')
          .map(line => line.split(/[%~+!^&]/)[0])  // Remove special markers
          .filter(word => word && /^[a-z]+$/i.test(word));  // Only alphabetic words
      } else if (source.includes('wordnet')) {
        // Process WordNet format
        words = text
          .split('\n')
          .filter(line => !line.startsWith(' ') && !line.startsWith('#'))
          .map(word => word.trim().toLowerCase())
          .filter(word => word && /^[a-z]+$/i.test(word));  // Only alphabetic words
      } else {
        // Default processing for other sources
        words = text
          .split('\n')
          .map(word => word.trim().toLowerCase())
          .filter(word => word && /^[a-z]+$/i.test(word));  // Only alphabetic words
      }
      
      dictionarySet = new Set(words);
      console.log(`Dictionary loaded successfully from ${source} with ${dictionarySet.size} words`);
      return dictionarySet;
    } catch (error) {
      console.warn(`Failed to load dictionary from ${source}:`, error);
      // Continue to next source
    }
  }
  
  // If all sources fail, create a small hardcoded dictionary as last resort
  console.error('All dictionary sources failed. Using minimal fallback dictionary.');
  const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with',
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
    'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up',
    'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
    'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
    'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
    'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    // Basic set of 100 most common English words
  ];
  dictionarySet = new Set(commonWords);
  return dictionarySet;
}

// Function to check if a word is in the dictionary
export function isRealWord(word: string, dictionary: Set<string>): boolean {
  return dictionary.has(word.toLowerCase());
}

// Function to get dictionary size
export function getDictionarySize(): number {
  return dictionarySet?.size || 0;
}

// Function to check if dictionary is loaded
export function isDictionaryLoaded(): boolean {
  return dictionarySet !== null && dictionarySet.size > 0;
}

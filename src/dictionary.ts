// This file contains a simple English dictionary implementation

// Common English words dictionary
// We'll use a Set for O(1) lookups
let dictionarySet: Set<string> | null = null;

// Function to load the dictionary
export async function loadDictionary(): Promise<Set<string>> {
  if (dictionarySet) return dictionarySet;
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
    const text = await response.text();
    const words = text.split('\n').map(word => word.trim().toLowerCase());
    dictionarySet = new Set(words);
    return dictionarySet;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    // Fallback to an empty set if dictionary can't be loaded
    return new Set<string>();
  }
}

// Function to check if a word is in the dictionary
export function isRealWord(word: string, dictionary: Set<string>): boolean {
  return dictionary.has(word.toLowerCase());
}

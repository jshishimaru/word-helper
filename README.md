# Word Helper

![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![MUI](https://img.shields.io/badge/Material--UI-7.0.2-purple)
![Vite](https://img.shields.io/badge/Vite-6.3.1-yellow)

A modern, responsive web application that helps you find valid English words from a set of available letters. Perfect for word games like Wordscrapes , Scrabble, Wordle, or crossword puzzles.

## 🌟 Features

- **Letter Permutation**: Generate all possible word combinations from your available letters
- **Word Filtering**: Find only real English words using a comprehensive dictionary
- **Pattern Matching**: Specify a partial pattern to narrow down word possibilities
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Light/Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Modern UI**: Sleek interface built with Material UI components


## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/word-helper.git
cd word-helper
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Material UI](https://mui.com/) - Component library
- [Vite](https://vitejs.dev/) - Build tool and development server

## 📖 How to Use

1. Enter all available letters in the "Available Letters" field
2. Specify the desired word length
3. Optionally, fill in any known letter positions in the pattern boxes
4. Click "Find Real Words" to see all valid English words that match your criteria
5. Results will appear as cards below the search form

## ⚙️ Configuration

The application uses a comprehensive English dictionary fetched from an external source. The dictionary is loaded once when the application starts and stored in memory for quick lookups.

## 🔄 API Reference

The application fetches an English word dictionary from:
```
https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt
```

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm run test
```

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🖼️ Customization

You can modify the theme colors and component styles in `src/theme.tsx` file.


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [dwyl/english-words](https://github.com/dwyl/english-words) for providing the English word dictionary


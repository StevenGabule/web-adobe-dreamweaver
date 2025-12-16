import { v4 as uuidv4 } from 'uuid'
import type { FileNode } from '../types'

// File extension to language mapping for monaco
export const extensionToLanguage: Record<string, string> = {
  // Web
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  less: 'less',
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',

  // Backend
  php: 'php',
  py: 'python',
  rb: 'ruby',
  java: 'java',
  go: 'go',
  rs: 'rust',

  // Config
  xml: 'xml',
  yaml: 'yaml',
  toml: 'toml',
  ini: 'ini',
  env: 'plaintext',

  // Documentation
  md: 'markdown',
  mdx: 'markdown',
  txt: 'plaintext',

  // Data
  sql: 'sql',
  graphql: 'graphql',

  // Shell
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  ps1: 'powershell',

  // other
  svg: 'xml',
  vue: 'vue',
  svelte: 'svelte',
}

// Get language from file path
export const getLanguageFromPath = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || ''
  return extensionToLanguage[extension] || 'plaintext'
}

// Get file extension
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
}

// Get filename from path
export const getFilenameFromPath = (path: string): string => {
  return path.split('/').pop() || path
}

// Get parent path
export const getParentPath = (path: string): string => {
  const parts = path.split('/')
  parts.pop()
  return parts.join('/') || '/'
}

// Join paths
export const joinPaths = (...paths: string[]): string => {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/+$/, '')
      }
      return path.replace(/^\/+|\/+$/g, '')
    })
    .filter(Boolean)
    .join('/')
}

// Check if file is image
export const isImageFile = (filename: string): boolean => {
  const imageExtension = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp']
  const ext = getFileExtension(filename)
  return imageExtension.includes(ext)
}

// Check if file is binary
export const isBinaryFile = (filename: string): boolean => {
  const binaryExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'webp',
    'ico',
    'bmp',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'zip',
    'rar',
    '7z',
    'tar',
    'gz',
    'mp3',
    'mp4',
    'wav',
    'avi',
    'mov',
    'mkv',
    'exe',
    'dll',
    'so',
    'dylib',
    'woff',
    'woff2',
    'ttf',
    'otf',
    'eot',
  ]

  const ext = getFileExtension(filename)
  return binaryExtensions.includes(ext)
}

// Sort files (folders first, then alphabetically)
export const sortFiles = (files: FileNode[]): FileNode[] => {
  return [...files].sort((a, b) => {
    // Folder come first
    if (a.type === 'folder' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'folder') return 1

    // then sort alphabetically (case-insensitive)
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
}

// Create a mock file tree for demo purposes
export const createMockFileTree = (): FileNode => {
  return {
    id: uuidv4(),
    name: 'my-website',
    path: '/my-website',
    type: 'folder',
    isExpanded: true,
    children: sortFiles([
      {
        id: uuidv4(),
        name: 'src',
        path: '/my-website/src',
        type: 'folder',
        isExpanded: true,
        children: sortFiles([
          {
            id: uuidv4(),
            name: 'components',
            path: '/my-website/src/components',
            type: 'folder',
            children: sortFiles([
              {
                id: uuidv4(),
                name: 'Header.tsx',
                path: '/my-website/src/components/Header.tsx',
                type: 'file',
                extension: 'tsx',
              },
              {
                id: uuidv4(),
                name: 'Footer.tsx',
                path: '/my-website/src/components/Footer.tsx',
                type: 'file',
                extension: 'tsx',
              },
              {
                id: uuidv4(),
                name: 'Button.tsx',
                path: '/my-website/src/components/Button.tsx',
                type: 'file',
                extension: 'tsx',
              },
            ]),
          },
          {
            id: uuidv4(),
            name: 'styles',
            path: '/my-website/src/styles',
            type: 'folder',
            children: sortFiles([
              {
                id: uuidv4(),
                name: 'globals.css',
                path: '/my-website/src/styles/globals.css',
                type: 'file',
                extension: 'css',
              },
              {
                id: uuidv4(),
                name: 'variables.css',
                path: '/my-website/src/styles/variables.css',
                type: 'file',
                extension: 'css',
              },
            ]),
          },
          {
            id: uuidv4(),
            name: 'App.tsx',
            path: '/my-website/src/App.tsx',
            type: 'file',
            extension: 'tsx',
          },
          {
            id: uuidv4(),
            name: 'main.tsx',
            path: '/my-website/src/main.tsx',
            type: 'file',
            extension: 'tsx',
          },
        ]),
      },
      {
        id: uuidv4(),
        name: 'public',
        path: '/my-website/public',
        type: 'folder',
        children: sortFiles([
          {
            id: uuidv4(),
            name: 'images',
            path: '/my-website/public/images',
            type: 'folder',
            children: sortFiles([
              {
                id: uuidv4(),
                name: 'logo.svg',
                path: '/my-website/public/images/logo.svg',
                type: 'file',
                extension: 'svg',
              },
              {
                id: uuidv4(),
                name: 'hero.png',
                path: '/my-website/public/images/hero.png',
                type: 'file',
                extension: 'png',
              },
            ]),
          },
          {
            id: uuidv4(),
            name: 'favicon.ico',
            path: '/my-website/public/favicon.ico',
            type: 'file',
            extension: 'ico',
          },
        ]),
      },
      {
        id: uuidv4(),
        name: 'index.html',
        path: '/my-website/index.html',
        type: 'file',
        extension: 'html',
      },
      {
        id: uuidv4(),
        name: 'package.json',
        path: '/my-website/package.json',
        type: 'file',
        extension: 'json',
      },
      {
        id: uuidv4(),
        name: 'tsconfig.json',
        path: '/my-website/tsconfig.json',
        type: 'file',
        extension: 'json',
      },
      {
        id: uuidv4(),
        name: 'README.md',
        path: '/my-website/README.md',
        type: 'file',
        extension: 'md',
      },
      {
        id: uuidv4(),
        name: '.gitignore',
        path: '/my-website/.gitignore',
        type: 'file',
        extension: '',
      },
    ]),
  }
}

// Get mock file content based on path
export const getMockFileContent = (path: string): string => {
  const contents: Record<string, string> = {
    '/my-website/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Awesome Website</title>
  <link rel="stylesheet" href="/src/styles/globals.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`,
    '/my-website/src/App.tsx': `import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import './styles/globals.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <h1>Welcome to My Website</h1>
        <p>This is a beautiful website built with React and TypeScript.</p>
        
        <div className="counter-section">
          <p>Count: {count}</p>
          <Button onClick={() => setCount(c => c + 1)}>
            Increment
          </Button>
          <Button onClick={() => setCount(0)} variant="secondary">
            Reset
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;`,
    '/my-website/src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    '/my-website/src/components/Header.tsx': `import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'My Website' }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/images/logo.svg" alt="Logo" />
          <span>{title}</span>
        </div>
        
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/services" className="nav-link">Services</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
        
        <button className="menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;`,
    '/my-website/src/components/Footer.tsx': `import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>We create beautiful websites and applications.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="GitHub">GitHub</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} My Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;`,
    '/my-website/src/components/Button.tsx': `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'btn';
  const variantStyles = \`btn-\${variant}\`;
  const sizeStyles = \`btn-\${size}\`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseStyles} \${variantStyles} \${sizeStyles} \${className}\`}
    >
      {children}
    </button>
  );
};

export default Button;`,
    '/my-website/src/styles/globals.css': `/* Global Styles */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #6b7280;
  --color-danger: #ef4444;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --border-radius: 8px;
  --transition: all 0.2s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
}

.btn-danger {
  background-color: var(--color-danger);
  color: white;
}

.btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn-md { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn-lg { padding: 1rem 2rem; font-size: 1.125rem; }

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Header Styles */
.header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
}

.logo img {
  width: 32px;
  height: 32px;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--color-primary);
}

/* Footer Styles */
.footer {
  background: var(--color-text);
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}`,
    '/my-website/src/styles/variables.css': `/* CSS Variables / Design Tokens */

:root {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Neutrals */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}`,
    '/my-website/package.json': `{
  "name": "my-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}`,
    '/my-website/tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
    '/my-website/README.md': `# My Website

A modern website built with React and TypeScript.

## Features

- ⚡️ Lightning fast with Vite
- 🎨 Beautiful, responsive design
- 📦 Component-based architecture
- 🔒 Type-safe with TypeScript

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
my-website/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── styles/      # CSS files
│   ├── App.tsx      # Main app component
│   └── main.tsx     # Entry point
├── index.html       # HTML template
└── package.json     # Dependencies
\`\`\`

## License

MIT
`,
    '/my-website/.gitignore': `# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Cache
.cache/
.parcel-cache/
`,
    '/my-website/public/images/logo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#gradient)"/>
  <text x="50" y="65" font-family="Arial" font-size="40" font-weight="bold" fill="white" text-anchor="middle">M</text>
</svg>`,
  }

  return contents[path] || `// File: ${path}\n// Content not available`
}

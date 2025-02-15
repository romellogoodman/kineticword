# Project File Structure

## Key Directories and Files

```
kineticword/
├── docs/                  # Documentation
│   ├── features.md        # Feature list and usage tips
│   ├── installation.md    # Installation instructions
│   ├── technical-details.md # Technical implementation details
│   └── file-structure.md  # This file structure document
│
├── public/                # Static assets
│   ├── vite.svg           # Vite logo
│   └── public-sans/       # Public Sans font files
│       ├── PublicSans-Regular.woff
│       ├── PublicSans-Medium.woff
│       └── PublicSans-Bold.woff
│
├── src/                   # Source code
│   ├── App.jsx            # Main React component
│   ├── App.css            # Main stylesheet
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
├── README.md              # Project overview
└── .gitignore             # Git ignore file
```

## Key Components

### App.jsx

The main component that contains:

- Animation logic
- State management
- Controls component
- GIF export functionality
- Layout structure

### App.css

Contains:

- Animation keyframes
- Layout styling
- Control panel styling
- Color variables
- Responsive design

### Controls Component

Handles:

- Text input
- Frame slider
- Duration slider
- Play/pause buttons
- Color pickers
- Export button

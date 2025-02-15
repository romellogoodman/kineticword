# Kinetic Word Documentation

Welcome to the Kinetic Word documentation! This guide will help you understand, install, and use the Kinetic Word application.

## Table of Contents

- [Features and Usage](features.md)
- [Installation Guide](installation.md)
- [Technical Details](technical-details.md)
- [Project File Structure](file-structure.md)

## Overview

Kinetic Word is a React application that creates animated text with customizable parameters. The main features include:

- Sliding text animation with controllable timing
- Color customization for background and text
- Frame-by-frame animation control
- GIF export capability
- Responsive design with sidebar controls

## Key Technologies

### CSS Sprite Sheet Animations

This project is based on the technique explained in [Lean Rada's article about CSS sprite sheet animations](https://leanrada.com/notes/css-sprite-sheets/). Key aspects of this technique include:

- Using the CSS `steps()` function for frame-by-frame animation
- Precise control over animation timing and playback
- Better performance than JavaScript-based animations
- Ability to pause, reverse, or change animation speed dynamically

### Satori for SVG Generation

The GIF export functionality uses [Satori](https://github.com/vercel/satori), an enlightened library that converts HTML and CSS to SVG. Satori enables:

- High-quality vector-based frame generation
- Consistent text rendering across different devices
- Font embedding for reliable typography
- Dynamic layout calculation that matches browser rendering

## Getting Started

1. Check the [Installation Guide](installation.md) to set up the project
2. Read through [Features and Usage](features.md) to learn how to use the application
3. Explore [Technical Details](technical-details.md) if you're interested in how it works

## Creating a Demo GIF

To create a demo GIF for showcasing the application:

1. Run the application
2. Configure your desired text and colors
3. Click the "Export as GIF" button
4. Rename the downloaded file to "kinetic-word-demo.gif"
5. Place it in the docs/images directory
6. Uncomment the image line in the main README.md

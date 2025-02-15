# Technical Details

## Animation Implementation

The app uses CSS keyframe animations with React's state management to create a controllable sliding text effect. This is based on the CSS sprite sheet animation technique, but adapted for text animation.

### 1. Frame-Based Animation

- Uses 60 frames per second for smooth animation
- Implements `steps(60, jump-none)` timing function for precise frame control
- Calculates total frames based on duration (duration \* 60)
- Uses CSS transitions instead of JavaScript for better performance

### 2. CSS Keyframes

```css
@keyframes slide {
  0% {
    transform: translateY(200px);
  }
  25% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(200px);
  }
}
```

### 3. Dynamic Animation Control

- Animation properties applied via JavaScript
- Uses requestAnimationFrame for timing
- Calculates exact frame positions for precise control
- Supports scrubbing through animation frames
- Maintains animation state across play/pause

### 4. CSS Sprite Sheet Animation Technique

The animation is inspired by the CSS sprite sheet technique which offers several advantages:

- Easier to control than GIFs or APNGs
- Can be paused, reversed, or changed in speed
- Can be triggered by various CSS selectors/events
- Doesn't block the main thread (unlike JS animations)

The critical `steps()` timing function ensures the animation jumps precisely to each frame without interpolating between them, creating a frame-by-frame effect that's perfect for controlled animations.

## Controls Implementation

### 1. Text Input

- Allows custom text entry
- Automatically removes spaces
- Resets animation when text changes

### 2. Frame Slider

- Shows current frame and total frames
- Allows scrubbing through the animation
- Pauses animation when adjusted manually

### 3. Duration Control

- Adjusts animation length from 1-20 seconds
- Automatically updates frame count (duration \* 60)
- Resets to first frame when changed

### 4. Play/Pause Buttons

- Controls animation playback
- Shows active state for current mode
- Maintains current frame when paused

### 5. Color Pickers

- Uses CSS variables for dynamic color application
- Updates colors in real-time
- Preserves color choices when exporting GIFs

## React Implementation

### 1. React Hooks

- Uses useState for state management
- Uses useEffect for side effects
- Uses useRef for direct DOM manipulation

### 2. Animation Reset Logic

```javascript
// Reset the animation
slideRef.current.style.animation = 'none';
slideRef.current.offsetHeight; // Trigger reflow
```

### 3. Frame Calculation

```javascript
const frameTimeMs = (duration * 1000) / totalFrames;
const elapsedMs = timestamp - startTime;
const newFrame = Math.floor(elapsedMs / frameTimeMs) % totalFrames;
```

## GIF Export Functionality

### Core Technologies

The app uses:

- Satori for SVG generation
- GIF.js for encoding frames
- Dynamic font loading with fallbacks
- Canvas for compositing

### Satori SVG Generation

Satori is used to convert React components to SVG for each frame:

```javascript
const svg = await satori(element, {
  width: size,
  height: size,
  fonts: [font],
  debug: false,
});
```

Key features used:

- JSX to SVG conversion
- Font embedding for consistent text rendering
- Precise layout calculation
- Support for CSS properties like color, transform, and font styles

### Frame Generation Process

1. For each frame in the animation:

   - Calculate the current position based on progress
   - Create a JSX element with current styles and text
   - Use Satori to convert to SVG
   - Convert SVG to canvas
   - Add the canvas frame to GIF.js

2. The process handles:
   - Dynamic font loading with fallbacks
   - Proper sizing and positioning
   - Consistent text rendering across all frames
   - Color application from user selections

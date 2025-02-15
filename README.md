# Kinetic Word

A React application that displays animated text with customizable parameters. The text slides up and down with smooth animation, and users can control various aspects of the animation.

Based on [CSS sprite sheet animations by Lean Rada](https://leanrada.com/notes/css-sprite-sheets/).

## Features

- Animated text that slides up and down
- Control panel to customize the animation
- Text input with automatic space removal
- Frame-by-frame animation control
- Adjustable animation duration
- Play/pause controls

## Usage Tips

- Type any text in the input field (spaces will be removed)
- Use the frame slider to precisely position the animation
- Adjust duration to change how long one cycle takes
- Play/pause to control animation playback

## Installation

```bash
$ npm install
$ npm run dev
```

## How It Works

### Animation Implementation

The app uses CSS keyframe animations with React's state management to create a controllable sliding text effect:

1. **Frame-Based Animation**:

   - Uses 60 frames per second for smooth animation
   - Implements `steps(60, jump-none)` timing function for precise frame control
   - Calculates total frames based on duration (duration \* 60)

2. **CSS Keyframes**:

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

3. **Dynamic Animation Control**:
   - Animation properties applied via JavaScript
   - Uses requestAnimationFrame for timing
   - Calculates exact frame positions for precise control

### Controls

1. **Text Input**:

   - Allows custom text entry
   - Automatically removes spaces
   - Resets animation when text changes

2. **Frame Slider**:

   - Shows current frame and total frames
   - Allows scrubbing through the animation
   - Pauses animation when adjusted manually

3. **Duration Control**:

   - Adjusts animation length from 1-20 seconds
   - Automatically updates frame count (duration \* 60)
   - Resets to first frame when changed

4. **Play/Pause Buttons**:
   - Controls animation playback
   - Shows active state for current mode
   - Maintains current frame when paused

### Technical Details

1. **React Hooks**:

   - Uses useState for state management
   - Uses useEffect for side effects
   - Uses useRef for direct DOM manipulation

2. **Animation Reset Logic**:

   ```javascript
   // Reset the animation
   slideRef.current.style.animation = "none";
   slideRef.current.offsetHeight; // Trigger reflow
   ```

3. **Frame Calculation**:
   ```javascript
   const frameTimeMs = (duration * 1000) / totalFrames;
   const elapsedMs = timestamp - startTime;
   const newFrame = Math.floor(elapsedMs / frameTimeMs) % totalFrames;
   ```

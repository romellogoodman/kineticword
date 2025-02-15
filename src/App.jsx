import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Controls({ 
  text, 
  setText, 
  currentFrame,
  setCurrentFrame,
  totalFrames,
  isPlaying, 
  setIsPlaying,
  duration,
  setDuration
}) {
  const handleTextChange = (e) => {
    // Remove all spaces from the input
    const noSpaces = e.target.value.replace(/\s+/g, '');
    setText(noSpaces);
  };

  const handleFrameChange = (e) => {
    // Pause animation when slider changes
    setIsPlaying(false);
    setCurrentFrame(parseInt(e.target.value));
  };

  const handleDurationChange = (e) => {
    // Set the new duration and reset progress
    setDuration(parseInt(e.target.value));
    setCurrentFrame(0); // Reset to beginning when duration changes
  };

  return (
    <div className="controls">
      <div className="control-group">
        <label>Text:</label>
        <input 
          type="text" 
          value={text} 
          onChange={handleTextChange}
          placeholder="Enter text..."
        />
      </div>

      <div className="control-group">
        <label>Frame: {currentFrame} / {totalFrames-1}</label>
        <input 
          type="range" 
          min="0" 
          max={totalFrames-1} 
          value={currentFrame} 
          onChange={handleFrameChange}
          className="slider"
        />
      </div>

      <div className="control-group">
        <label>Duration: {duration}s</label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={duration} 
          onChange={handleDurationChange}
          className="slider"
        />
      </div>

      <div className="control-group buttons">
        <button 
          onClick={() => setIsPlaying(true)} 
          className={isPlaying ? 'active' : ''}
          disabled={isPlaying}
        >
          Play
        </button>
        <button 
          onClick={() => setIsPlaying(false)} 
          className={!isPlaying ? 'active' : ''}
          disabled={!isPlaying}
        >
          Pause
        </button>
      </div>
    </div>
  );
}

function App() {
  const [text, setText] = useState("SLIDE");
  const [duration, setDuration] = useState(4); // Default 4 seconds
  // Calculate total frames based on 60fps
  const totalFrames = duration * 60;
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const slideRef = useRef(null);
  
  // Reset progress when text changes
  const handleSetText = (newText) => {
    setText(newText);
    setCurrentFrame(0);
    setIsPlaying(false);
  };
  
  // Update the animation when frame or duration changes
  useEffect(() => {
    if (slideRef.current) {
      // Reset the animation
      slideRef.current.style.animation = 'none';
      slideRef.current.offsetHeight; // Trigger reflow
      
      // Calculate the delay based on current frame
      const delaySeconds = -(currentFrame / totalFrames) * duration;
      
      // Re-apply the animation with new properties
      slideRef.current.style.animation = '';
      slideRef.current.style.animationName = 'slide';
      slideRef.current.style.animationDuration = `${duration}s`;
      slideRef.current.style.animationTimingFunction = 'steps(60, jump-none)';
      slideRef.current.style.animationIterationCount = 'infinite';
      slideRef.current.style.animationFillMode = 'both';
      slideRef.current.style.animationPlayState = isPlaying ? 'running' : 'paused';
      slideRef.current.style.animationDelay = `${delaySeconds}s`;
    }
  }, [currentFrame, duration, isPlaying, totalFrames]);

  // Update CSS variables for animation
  useEffect(() => {
    document.documentElement.style.setProperty('--total-frames', totalFrames);
    document.documentElement.style.setProperty('--animation-duration', `${duration}s`);
  }, [duration, totalFrames]);

  // Setup animation frame polling when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    let animationFrameId;
    let startTime = null;
    
    const updateFrame = (timestamp) => {
      if (startTime === null) {
        // Initialize startTime on first frame
        const frameTimeMs = (duration * 1000) / totalFrames;
        const elapsedMs = currentFrame * frameTimeMs;
        startTime = timestamp - elapsedMs;
      }
      
      const frameTimeMs = (duration * 1000) / totalFrames;
      const elapsedMs = timestamp - startTime;
      const newFrame = Math.floor(elapsedMs / frameTimeMs) % totalFrames;
      
      setCurrentFrame(newFrame);
      animationFrameId = requestAnimationFrame(updateFrame);
    };
    
    animationFrameId = requestAnimationFrame(updateFrame);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, duration, totalFrames]);

  return (
    <>
      <Controls 
        text={text} 
        setText={handleSetText}
        currentFrame={currentFrame}
        setCurrentFrame={setCurrentFrame}
        totalFrames={totalFrames}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        duration={duration}
        setDuration={setDuration}
      />
      <div className="center">
        <div className="hidden-overflow">
          <p 
            ref={slideRef}
            className="truculenta slide"
          >
            {text}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
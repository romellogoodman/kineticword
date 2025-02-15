import React, { useState, useEffect, useRef } from 'react';
import GIF from 'gif.js';
import satori from 'satori';
import './App.css';

function ExportButton({ duration, isExporting, onExport }) {  
  return (
    <button 
      onClick={onExport}
      disabled={isExporting}
      className={isExporting ? 'exporting' : ''}
    >
      {isExporting ? 'Exporting...' : 'Export as GIF'}
    </button>
  );
}

function Controls({ 
  text, 
  setText, 
  currentFrame,
  setCurrentFrame,
  totalFrames,
  isPlaying, 
  setIsPlaying,
  duration,
  setDuration,
  isExporting,
  onExport
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
          disabled={isPlaying || isExporting}
        >
          Play
        </button>
        <button 
          onClick={() => setIsPlaying(false)} 
          className={!isPlaying ? 'active' : ''}
          disabled={!isPlaying || isExporting}
        >
          Pause
        </button>
      </div>
      
      <div className="control-group">
        <ExportButton 
          duration={duration}
          isExporting={isExporting}
          onExport={onExport}
        />
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
  const [isExporting, setIsExporting] = useState(false);
  const slideRef = useRef(null);
  const containerRef = useRef(null);
  
  // Reset progress when text changes
  const handleSetText = (newText) => {
    setText(newText);
    setCurrentFrame(0);
    setIsPlaying(false);
  };
  
  // Load Public Sans Medium from the public directory
  const loadFont = async () => {
    try {
      // Try to load the WOFF version of PublicSans-Medium
      const fontUrl = '/public-sans/PublicSans-Medium.woff';
      const fontResponse = await fetch(fontUrl);
      
      if (!fontResponse.ok) {
        throw new Error(`Failed to load font: ${fontResponse.status} ${fontResponse.statusText}`);
      }
      
      const fontData = await fontResponse.arrayBuffer();
      
      return {
        name: 'Public Sans',
        data: fontData,
        weight: 500,
        style: 'normal'
      };
    } catch (error) {
      console.error('Error loading Public Sans Medium:', error);
      
      // If that fails, try to load the Regular weight
      try {
        const fallbackUrl = '/public-sans/PublicSans-Regular.woff';
        const fallbackResponse = await fetch(fallbackUrl);
        
        if (!fallbackResponse.ok) {
          throw new Error(`Failed to load fallback font: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
        }
        
        const fallbackData = await fallbackResponse.arrayBuffer();
        
        return {
          name: 'Public Sans',
          data: fallbackData,
          weight: 400,
          style: 'normal'
        };
      } catch (fallbackError) {
        console.error('Error loading fallback font:', fallbackError);
        
        // As a last resort, use embedded Inter font that's known to work with Satori
        try {
          const base64Font = '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';
          
          const binaryString = atob(base64Font);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          return {
            name: 'Inter',
            data: bytes.buffer,
            weight: 400,
            style: 'normal'
          };
        } catch (embeddedError) {
          console.error('Error with embedded font:', embeddedError);
          throw error; // Throw the original error
        }
      }
    }
  };

  // Function to capture frames and create GIF
  const captureFrames = async () => {
    setIsExporting(true);
    setIsPlaying(false);
    
    // Temporarily store current frame to restore later
    const savedFrame = currentFrame;
    
    try {
      // Get font configuration (system fonts only)
      const font = await loadFont();
      
      // Calculate frame parameters
      const frameCount = Math.min(totalFrames, 60); // Limit to 60 frames for performance
      const frameSkip = Math.ceil(totalFrames / frameCount);
      
      // Get dimensions from animation-container
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      
      // Ensure square aspect ratio for the GIF
      const size = Math.min(width, height);
      
      // Create GIF encoder with square dimensions
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: size,
        height: size,
        workerScript: '/gif.worker.js'
      });
      
      // Generate frames
      for (let i = 0; i < totalFrames; i += frameSkip) {
        // Calculate current position in animation
        const progress = i / totalFrames;
        
        // Calculate Y position based on animation keyframes
        let yPosition;
        if (progress < 0.25) {
          // 0% to 25%: 200px to 0px
          yPosition = 200 - (progress * 4 * 200);
        } else if (progress < 0.5) {
          // 25% to 50%: stay at 0px
          yPosition = 0;
        } else {
          // 50% to 100%: 0px to 200px
          yPosition = ((progress - 0.5) * 2) * 200;
        }
        
        // Create JSX for Satori with square dimensions
        const element = (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: size,
              height: size,
              backgroundColor: '#3a3042',
            }}
          >
            <div
              style={{
                fontFamily: 'Public Sans, Inter, sans-serif',
                fontSize: Math.floor(size / 5) + 'px', // Dynamic font size based on container
                fontWeight: 500,
                color: '#d2bf55',
                transform: `translateY(${yPosition * size / 500}px)`, // Scale yPosition to container size
                textAlign: 'center',
              }}
            >
              {text}
            </div>
          </div>
        );
        
        // Generate SVG with Satori using square dimensions
        const svg = await satori(element, {
          width: size,
          height: size,
          fonts: [font],
          debug: false
        });
        
        // Create SVG Blob and Image
        const img = new Image();
        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        // Wait for image to load
        await new Promise((resolve) => {
          img.onload = () => {
            // Create a canvas to convert SVG to bitmap (needed for GIF.js in some browsers)
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Fill background
            ctx.fillStyle = '#3a3042';
            ctx.fillRect(0, 0, size, size);
            
            // Draw the SVG image
            ctx.drawImage(img, 0, 0, size, size);
            
            // Add canvas to GIF
            gif.addFrame(canvas, { 
              delay: (duration * 1000) / frameCount, 
              copy: true,
              dispose: 2 // Dispose previous frame
            });
            
            resolve();
          };
          img.src = url;
        });
        
        // Clean up URL
        URL.revokeObjectURL(url);
        
        // Update progress in UI (but don't actually change animation)
        setCurrentFrame(i);
      }
      
      // Generate the GIF
      gif.on('finished', function(blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${text.toLowerCase()}-animation.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Restore state
        setCurrentFrame(savedFrame);
        setIsExporting(false);
      });
      
      gif.render();
      
    } catch (error) {
      console.error('Error exporting GIF:', error);
      setCurrentFrame(savedFrame);
      setIsExporting(false);
    }
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
    <div className="app-container">
      <div className="sidebar">
        <h1 className="app-title">Kinetic Word</h1>
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
          isExporting={isExporting}
          onExport={captureFrames}
        />
      </div>
      <div className="main-content">
        <div className="animation-container" ref={containerRef}>
          <div className="hidden-overflow">
            <p 
              ref={slideRef}
              className="truculenta slide"
            >
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
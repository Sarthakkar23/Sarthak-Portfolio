import React from 'react';

/**
 * This component creates a visually appealing placeholder image for the Clear Pixel AI project.
 * You should replace this with a real image file at:
 * /src/assets/projects/clear-pixel-ai.png
 */
const ImagePlaceholder = () => {
  const style = {
    width: '100%',
    height: '200px',
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    zIndex: 2,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  };

  const subtitleStyle = {
    fontSize: '14px',
    opacity: 0.9,
    zIndex: 2,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  };

  // Create a grid of pixels for the background
  const pixelGridStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gridTemplateRows: 'repeat(10, 1fr)',
    opacity: 0.2,
    zIndex: 1,
  };

  // Generate random pixels
  const pixels = [];
  for (let i = 0; i < 100; i++) {
    const pixelStyle = {
      backgroundColor: Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'transparent',
      margin: '2px',
      borderRadius: '2px',
    };
    pixels.push(<div key={i} style={pixelStyle}></div>);
  }

  // Create a "before/after" effect
  const beforeAfterStyle = {
    position: 'absolute',
    bottom: '10px',
    width: '90%',
    height: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 2,
  };

  const beforeStyle = {
    width: '45%',
    height: '100%',
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    borderRadius: '4px',
  };

  const afterStyle = {
    ...beforeStyle,
    background: 'rgba(255,255,255,0.3)',
  };

  // Add an AI icon
  const aiIconStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    opacity: 0.7,
    zIndex: 2,
  };

  return (
    <div style={style}>
      <div style={pixelGridStyle}>{pixels}</div>
      <div style={aiIconStyle}>🤖</div>
      <div style={titleStyle}>Clear Pixel AI</div>
      <div style={subtitleStyle}>
        Image Enhancement with Deep Learning
      </div>
      <div style={beforeAfterStyle}>
        <div style={beforeStyle}>Before</div>
        <div style={afterStyle}>After</div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
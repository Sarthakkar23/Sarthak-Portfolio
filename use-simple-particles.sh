#!/bin/bash

echo "Switching to simple particles implementation..."

# Create a backup of the current Particle.js file
cp "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Particle.js" "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Particle.js.bak"

# Replace Particle.js with SimpleParticle.js content
cat > "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Particle.js" << 'EOL'
import React from "react";
import "./SimpleParticle.css";

function Particle() {
  return (
    <div className="particle-container">
      <div className="particle-background"></div>
      {Array.from({ length: 50 }).map((_, index) => (
        <div 
          key={index} 
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${Math.random() * 5 + 1}px`,
            height: `${Math.random() * 5 + 1}px`,
          }}
        ></div>
      ))}
    </div>
  );
}

export default Particle;
EOL

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
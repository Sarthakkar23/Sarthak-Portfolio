#!/bin/bash

echo "Switching to simple resume implementation..."

# Create a backup of the current Resume.js file
cp "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Resume/Resume.js" "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Resume/Resume.js.bak"

# Replace Resume.js with SimpleResume.js content
cp "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Resume/SimpleResume.js" "/Users/sarthakkar/Documents/Sarthak Portfolio/src/components/Resume/Resume.js"

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
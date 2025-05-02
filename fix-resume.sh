#!/bin/bash

echo "Fixing resume file path..."

# Create the resume directory if it doesn't exist
mkdir -p "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume"

# Check if the resume file exists
if [ -f "/Users/sarthakkar/Documents/Sarthak Portfolio/Sarthak Kar Resume.pdf" ]; then
  echo "Found resume file, copying to assets directory..."
  cp "/Users/sarthakkar/Documents/Sarthak Portfolio/Sarthak Kar Resume.pdf" "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/"
  echo "Resume file copied successfully."
else
  echo "Resume file not found at the root directory."
  echo "Creating a placeholder file..."
  echo "This is a placeholder for your resume PDF file." > "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/Sarthak Kar Resume.pdf"
  echo "Please manually copy your actual resume file to: /Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/Sarthak Kar Resume.pdf"
fi

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
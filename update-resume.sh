#!/bin/bash

echo "Updating resume file..."

# Create the resume directory if it doesn't exist
mkdir -p "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume"

# Remove the old resume file if it exists
if [ -f "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/Sarthak Kar Resume.pdf" ]; then
  echo "Removing old resume file..."
  rm "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/Sarthak Kar Resume.pdf"
fi

# Copy the new resume file
echo "Copying new resume file..."
cp "/Users/sarthakkar/Documents/Sarthak Portfolio/Sarthak Resume 2.pdf" "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/"
echo "Resume file copied successfully."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
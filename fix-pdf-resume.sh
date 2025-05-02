#!/bin/bash

echo "Updating resume file and fixing PDF display..."

# Create the resume directory if it doesn't exist
mkdir -p "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume"

# Copy the new resume file
echo "Copying resume file..."
cp "/Users/sarthakkar/Documents/Sarthak Portfolio/Sarthak Resume 2.pdf" "/Users/sarthakkar/Documents/Sarthak Portfolio/src/assets/resume/"
echo "Resume file copied successfully."

# Install required dependencies for PDF display
echo "Installing PDF dependencies..."
npm install react-pdf@7.1.2

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
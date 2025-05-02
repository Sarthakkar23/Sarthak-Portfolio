#!/bin/bash

echo "Fixed AboutCard.js with a clean version..."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
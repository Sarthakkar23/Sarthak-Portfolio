#!/bin/bash

echo "Updating About section with new content..."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
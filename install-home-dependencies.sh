#!/bin/bash

echo "Installing dependencies for enhanced homepage..."
npm install react-countup react-visibility-sensor

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
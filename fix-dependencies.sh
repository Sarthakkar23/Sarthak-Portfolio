#!/bin/bash

echo "Installing tsparticles dependencies..."
npm install @tsparticles/engine@latest @tsparticles/react@latest tsparticles@latest

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
#!/bin/bash

echo "Installing framer-motion for animations..."
npm install framer-motion

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
#!/bin/bash

echo "Fixing AboutCard.js syntax error..."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
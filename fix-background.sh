#!/bin/bash

echo "Fixing background image issue..."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
#!/bin/bash

echo "Applying new homepage design that matches the reference site..."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
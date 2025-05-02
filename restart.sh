#!/bin/bash

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm start
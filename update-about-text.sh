#!/bin/bash

echo "Updated AboutCard with your text..."

echo "Stopping any running React development server..."
pkill -f "react-scripts start" || true

echo "Starting development server..."
npm start
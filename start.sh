#!/bin/bash

# Install dependencies for client
echo "Installing client dependencies..."
cd client
npm install

# Install dependencies for server
echo "Installing server dependencies..."
cd ../server
npm install

# Navigate back to the root directory
cd ..

# Start client and server concurrently
echo "Starting client and server..."
npx concurrently --kill-others "npm start --prefix client" "npm start --prefix server"

# To run script follow the commands:
# chmod +x start.sh
# ./start.sh
s
# npm install -g concurrently

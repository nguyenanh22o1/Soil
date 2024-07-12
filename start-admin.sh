#!/bin/bash

# Install dependencies for admin client
echo "Installing admin client dependencies..."
cd admin-dashboard/admin_client
npm install

# Install dependencies for admin server
echo "Installing admin server dependencies..."
cd ../server
npm install

# Navigate back to the root directory
cd ../..

# Start admin client and server concurrently
echo "Starting admin client and server..."
npx concurrently --kill-others "npm start --prefix admin-dashboard/admin_client" "npm start --prefix admin-dashboard/server"

# To run script follow the commands:
# chmod +x start-admin.sh
# ./start-admin.sh

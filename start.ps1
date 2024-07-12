# Install dependencies for client
Write-Host "Installing client dependencies..."
cd client
npm install

# Install dependencies for server
Write-Host "Installing server dependencies..."
cd ../server
npm install

# Navigate back to the root directory
cd ..

# Start client and server concurrently
Write-Host "Starting client and server..."
npx concurrently --kill-others "npm start --prefix client" "npm start --prefix server"

# Run scrip with .\start.ps1
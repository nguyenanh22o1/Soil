# Install dependencies for admin client
Write-Host "Installing admin client dependencies..."
cd admin-dashboard/admin_client
npm install

# Install dependencies for admin server
Write-Host "Installing admin server dependencies..."
cd ../server
npm install

# Navigate back to the root directory
cd ../..

# Start admin client and server concurrently
Write-Host "Starting admin client and server..."
npx concurrently --kill-others "npm start --prefix admin-dashboard/admin_client" "npm start --prefix admin-dashboard/server"

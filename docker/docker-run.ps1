# Function to prompt for cache cleanup
$response = Read-Host "Do you want to clean the Docker cache? (y/n)"
if ($response -eq "y") {
    $cleanCache = $true
} else {
    $cleanCache = $false
}

# Stop and remove existing Docker containers if running
Write-Host "Stopping and removing existing Docker containers..."
docker-compose down

# Remove node_modules and dist directories if they exist
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules directory..."
    Remove-Item -Recurse -Force "node_modules"
} else {
    Write-Host "node_modules directory does not exist."
}

if (Test-Path "dist") {
    Write-Host "Removing dist directory..."
    Remove-Item -Recurse -Force "dist"
} else {
    Write-Host "dist directory does not exist."
}

# Clean Docker cache if prompted
if ($cleanCache) {
    Write-Host "Cleaning Docker cache..."
    docker system prune -f
} else {
    Write-Host "Skipping Docker cache cleanup."
}

# Rebuild and start Docker containers
Write-Host "Building Docker image..."
docker-compose build

Write-Host "Starting Docker containers..."
docker-compose up

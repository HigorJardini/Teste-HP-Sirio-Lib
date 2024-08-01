@echo off
:: Function to prompt for cache cleanup
set /p response="Do you want to clean the Docker cache? (y/n): "
if /i "%response%"=="y" (
  set clean_cache=true
) else (
  set clean_cache=false
)

:: Stop and remove existing Docker containers if running
echo Stopping and removing existing Docker containers...
docker-compose down

:: Remove node_modules and dist directories if they exist
if exist "node_modules" (
  echo Removing node_modules directory...
  rmdir /s /q node_modules
) else (
  echo node_modules directory does not exist.
)

if exist "dist" (
  echo Removing dist directory...
  rmdir /s /q dist
) else (
  echo dist directory does not exist.
)

:: Clean Docker cache if prompted
if "%clean_cache%"=="true" (
  echo Cleaning Docker cache...
  docker system prune -f
) else (
  echo Skipping Docker cache cleanup.
)

:: Rebuild and start Docker containers
echo Building Docker image...
docker-compose build

echo Starting Docker containers...
docker-compose up

@echo off
echo.
echo ========================================
echo   xStocks Price Screener - Starting
echo ========================================
echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo npm version:
npm --version

echo.
echo Checking .env file...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating from .env.example...
    copy .env.example .env
)

echo.
echo Starting development server...
echo.
echo Open your browser to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

npm run dev

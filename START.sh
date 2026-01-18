#!/bin/bash

echo "🚀 Starting xStocks Price Screener..."
echo ""
echo "📍 Project Directory: $(pwd)"
echo "📦 Node.js Version: $(node --version)"
echo "📦 npm Version: $(npm --version)"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please add your TWELVE_DATA_API_KEY before continuing."
    exit 1
fi

# Check if API key is set
if grep -q "TWELVE_DATA_API_KEY=your_api_key_here" .env; then
    echo "⚠️  Warning: API key not set in .env file!"
    echo ""
    echo "Please edit .env and add your Twelve Data API key."
    echo "Get your free API key at: https://twelvedata.com/"
    echo ""
    echo "You can still run the app to test the UI, but stock prices won't work."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Starting development server..."
echo ""
echo "🌐 Open your browser to: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev

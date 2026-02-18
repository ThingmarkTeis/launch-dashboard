#!/bin/bash

# Command Center Dashboard Startup Script

echo "🚀 Starting Command Center Dashboard..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set default workspace path if not provided
if [ -z "$WORKSPACE_PATH" ]; then
    export WORKSPACE_PATH="/home/clawdbot/.openclaw/workspace-website-boss"
fi

echo "📂 Workspace path: $WORKSPACE_PATH"

# Check if workspace exists
if [ ! -d "$WORKSPACE_PATH" ]; then
    echo "⚠️  Warning: Workspace directory does not exist at $WORKSPACE_PATH"
    echo "   Dashboard will show empty state until agent data is available"
fi

# Start the server
echo "🖥️  Dashboard available at: http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

npm start
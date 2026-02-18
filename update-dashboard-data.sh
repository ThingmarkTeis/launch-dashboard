#!/bin/bash
# Update dashboard data and push to GitHub

echo "📊 Updating dashboard data..."

# Generate fresh workspace data
python3 generate-workspace-data.py

# Copy to terminal directory
cp workspace-data.json terminal/

# Check if there are changes
if git diff --quiet workspace-data.json terminal/workspace-data.json; then
    echo "✅ No changes in workspace data"
else
    echo "📤 Pushing updates to GitHub..."
    git add workspace-data.json workspace-data.min.json terminal/workspace-data.json
    git commit -m "Update workspace data - $(date '+%Y-%m-%d %H:%M')"
    git push origin main
    echo "✅ Dashboard data updated!"
fi
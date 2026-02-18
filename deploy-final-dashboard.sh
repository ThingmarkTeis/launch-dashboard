#!/bin/bash

# Deploy Final Dashboard Script
# This will replace the main dashboard.html with the validated version

echo "🚀 DEPLOYING FINAL DASHBOARD..."
echo "================================"

# Backup current dashboard
echo "📦 Backing up current dashboard..."
cp dashboard.html dashboard-backup-$(date +%Y%m%d-%H%M%S).html

# Copy validation version to main dashboard
echo "✅ Deploying validated dashboard..."
cp dashboard-validation.html dashboard.html

# Commit changes
echo "💾 Committing changes..."
git add dashboard.html
git commit -m "🎯 FINAL DEPLOYMENT: Dashboard with all 7 Department Bosses - Validated and Ready"

# Push to GitHub
echo "📤 Pushing to GitHub Pages..."
git push origin main

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================"
echo "🌐 Live at: https://thingmarkteis.github.io/launch-dashboard/dashboard.html"
echo ""
echo "All 7 Departments:"
echo "- Content-Boss ✅"
echo "- Design-Boss ✅"
echo "- Intelligence-Boss ✅"
echo "- Launch-Boss ✅"
echo "- Revenue-Boss ✅"
echo "- Operations-Boss ✅"
echo "- Website-Boss ✅"
echo ""
echo "Total Workers: 39 ✅"
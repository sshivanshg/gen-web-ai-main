#!/bin/bash

# Quick Deployment Script for gen-web-ai
# This script helps prepare the project for deployment to Render and Vercel

echo "🚀 Gen Web AI - Deployment Preparation Script"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git is not initialized. Please run: git init"
    exit 1
fi

echo "✅ Git is initialized"
echo ""

# Check if all required files exist
FILES_TO_CHECK=(
    "server/package.json"
    "client/package.json"
    "server/index.js"
    "client/src/App.jsx"
    "render.yaml"
    "vercel.json"
    ".vercelignore"
)

echo "📋 Checking required files..."
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING!"
    fi
done

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create a GitHub repository and push this code:"
echo "   git add ."
echo "   git commit -m 'Add deployment configuration'"
echo "   git push -u origin main"
echo ""
echo "2. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set environment variables (see DEPLOYMENT.md)"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import GitHub repository"
echo "   - Set VITE_API_URL to your Render backend URL"
echo "   - Deploy"
echo ""
echo "4. Update environment variables in both platforms:"
echo "   - Backend (Render): All variables in server/.env"
echo "   - Frontend (Vercel): VITE_API_URL environment variable"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""

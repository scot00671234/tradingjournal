#!/bin/bash

set -eu

echo "Building CoinFeedly for Cloudron..."

# Ensure we have the required files
if [ ! -f "CloudronManifest.json" ]; then
    echo "Error: CloudronManifest.json not found"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "Error: Dockerfile not found"
    exit 1
fi

# Build the frontend and backend
echo "Building application..."
npm run build

# Create screenshots directory (placeholder)
mkdir -p screenshots
echo "# Add actual screenshots here" > screenshots/README.md

# Validate Cloudron manifest
echo "Validating Cloudron manifest..."
if command -v cloudron &> /dev/null; then
    cloudron build --check-manifest
    echo "✅ Cloudron manifest is valid"
else
    echo "⚠️  Cloudron CLI not found - skipping manifest validation"
    echo "Install with: npm install -g cloudron"
fi

echo "✅ CoinFeedly is ready for Cloudron deployment!"
echo ""
echo "Next steps:"
echo "1. Install Cloudron CLI: npm install -g cloudron"
echo "2. Build package: cloudron build"
echo "3. Install on Cloudron: cloudron install"
echo ""
echo "For more information, see README-CLOUDRON.md"
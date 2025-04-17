#!/bin/bash
set -e

echo "===== PRODUCTION DEPLOYMENT ====="

# Step 1: Build the application if it's not already built
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
  echo "No build detected, running build step first..."
  npm run build
fi

# Step 2: Start the production server
echo "Starting production server on port 5000..."
export NODE_OPTIONS="--max-old-space-size=512"
exec npx next start -p 5000 -H 0.0.0.0

#!/bin/bash
set -e

echo "===== TESTING DEPLOYMENT BUILD ====="

# Don't kill the dev server, we'll just build and verify
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
echo "The application can now be deployed via Replit Deployments."
echo "Use the deploy button to start the deployment process."
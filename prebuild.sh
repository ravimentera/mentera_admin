#!/bin/bash
set -e

echo "===== PREPARING FOR DEPLOYMENT ====="

# Clean the .next directory to avoid stale files
echo "Cleaning build directory..."
rm -rf .next/

echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
echo ""
echo "The application is now ready for deployment."
echo "Run './deploy.sh' to start the production server."
#!/usr/bin/env bash

set -e

# Get all folder names from apps directory
apps_folders=$(ls apps 2>/dev/null || echo "")

# Get all folder names from packages directory, excluding config
packages_folders=$(ls packages 2>/dev/null | grep -v "^config$" || echo "")

# Combine all folders into one list and add playwright
all_folders=($apps_folders $packages_folders "playwright")

echo "Running interactive dependency updates for the following workspaces:"
for folder in "${all_folders[@]}"; do
    echo "  - $folder"
done
echo ""

# Run pnpm up -L -i --filter for each folder
for folder in "${all_folders[@]}"; do
    echo "Updating dependencies for $folder..."
    pnpm up -L -i --filter="$folder"
    echo ""
done

echo "All interactive updates completed!"

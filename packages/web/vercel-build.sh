#!/bin/bash

# Check if changes were made to specific files or directories
if git -C "$(git rev-parse --show-toplevel)" diff --quiet HEAD^ HEAD -- .eslintrc .prettierrc package.json yarn.lock packages/web; then
  echo "No changes detected in relevant files. Skipping Vercel deployment."
  exit 0
else
  echo "Changes detected in relevant files. Triggering Vercel deployment."
  exit 1
fi
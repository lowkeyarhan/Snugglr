#!/bin/bash
# Check if there are changes in the client directory
# Exit 0 = skip build, Exit 1 = proceed with build

if git diff --quiet HEAD^ HEAD -- .; then
  echo "No changes detected in client directory. Skipping build."
  exit 0
else
  echo "Changes detected in client directory. Proceeding with build."
  exit 1
fi

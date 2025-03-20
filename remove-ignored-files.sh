#!/bin/bash

# Make the script exit on any error
set -e

echo "This script will remove files that should be ignored from the Git repository."
echo "The files will remain in your local directory but will be removed from Git tracking."
echo ""
echo "Starting the process..."

# First, commit the .gitignore files if they haven't been committed yet
git add .gitignore frontend/.gitignore backend/.gitignore
git commit -m "Add .gitignore files" || echo "No changes to commit for .gitignore files"

# Remove files that are now in .gitignore but were previously committed
echo "Removing tracked files that should be ignored..."

# Remove node_modules from Git tracking
git rm -r --cached node_modules 2>/dev/null || echo "No node_modules at root level"
git rm -r --cached frontend/node_modules 2>/dev/null || echo "No frontend/node_modules"
git rm -r --cached backend/node_modules 2>/dev/null || echo "No backend/node_modules"

# Remove Cypress screenshots, videos, and downloads
git rm -r --cached frontend/cypress/screenshots 2>/dev/null || echo "No frontend/cypress/screenshots"
git rm -r --cached frontend/cypress/videos 2>/dev/null || echo "No frontend/cypress/videos"
git rm -r --cached frontend/cypress/downloads 2>/dev/null || echo "No frontend/cypress/downloads"

# Remove logs
git rm --cached npm-debug.log* 2>/dev/null || echo "No npm-debug.log"
git rm --cached yarn-debug.log* 2>/dev/null || echo "No yarn-debug.log"
git rm --cached yarn-error.log* 2>/dev/null || echo "No yarn-error.log"
git rm --cached frontend/npm-debug.log* 2>/dev/null || echo "No frontend/npm-debug.log"
git rm --cached backend/npm-debug.log* 2>/dev/null || echo "No backend/npm-debug.log"

# Remove environment files
git rm --cached .env* 2>/dev/null || echo "No .env files at root level"
git rm --cached frontend/.env* 2>/dev/null || echo "No frontend/.env files"
git rm --cached backend/.env* 2>/dev/null || echo "No backend/.env files"

# Remove IDE files
git rm -r --cached .vscode 2>/dev/null || echo "No .vscode directory"
git rm -r --cached .idea 2>/dev/null || echo "No .idea directory"
git rm --cached **/.DS_Store 2>/dev/null || echo "No .DS_Store files"

# Remove any other files that should be ignored
echo "Removing all other files that should be ignored according to .gitignore..."
git ls-files -i --exclude-from=.gitignore | xargs git rm --cached 2>/dev/null || echo "No other files to remove from root"
git ls-files -i --exclude-from=frontend/.gitignore --directory=frontend | xargs git rm --cached 2>/dev/null || echo "No other files to remove from frontend"
git ls-files -i --exclude-from=backend/.gitignore --directory=backend | xargs git rm --cached 2>/dev/null || echo "No other files to remove from backend"

# Commit the changes
echo "Committing changes..."
git commit -m "Remove files that should be ignored according to .gitignore" || echo "No changes to commit"

echo ""
echo "Files have been removed from Git tracking but remain in your local directory."
echo "To push these changes to the remote repository, run: git push"
echo ""
echo "Done!"

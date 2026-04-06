#!/bin/sh

# Ensure the database directory exists and is writable (Dynamically use ENV_SERVER if available)
DB_PATH="${SQLITE_DB_PATH:-/app/data/sqlite.db}"
DB_DIR=$(dirname "$DB_PATH")

if [ ! -d "$DB_DIR" ]; then
  echo ">>> Directory $DB_DIR not found. Attempting to create..."
  mkdir -p "$DB_DIR"
fi

# Database Aggressive Initialization (Forces schema sync even if file exists)
echo ">>> Ensuring Database Directory exists: $DB_DIR"
mkdir -p "$DB_DIR"

echo ">>> Aggressive Schema Synchronization via drizzle-kit push..."
# drizzle-kit push is safe to run repeatedly; it ensures tables always exist.
npx drizzle-kit push

# FIX Permissions for Docker Volumes (Ensure write capacity for user nextjs)
if [ -f "$DB_PATH" ]; then
  echo ">>> Enforcing read/write permissions for database at $DB_PATH"
  chmod 666 "$DB_PATH"
fi

# Start the application using standalone server.js
echo ">>> Starting the application on port ${PORT:-3000}..."
node server.js

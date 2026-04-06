#!/bin/sh

# Ensure the database directory exists and is writable (Dynamically use ENV_SERVER if available)
DB_PATH="${SQLITE_DB_PATH:-/app/data/sqlite.db}"
DB_DIR=$(dirname "$DB_PATH")

if [ ! -d "$DB_DIR" ]; then
  echo ">>> Directory $DB_DIR not found. Attempting to create..."
  mkdir -p "$DB_DIR"
fi

# Database Automatic Initialization (As per your suggestion)
if [ ! -f "$DB_PATH" ]; then
  echo ">>> Database file not found at $DB_PATH. Initializing schema via drizzle-kit push..."
  # drizzle-kit push --force ensures the schema is correctly applied to a new database
  npx drizzle-kit push
else
  echo ">>> Database found at $DB_PATH. Skipping initialization."
fi

# Start the application using standalone server.js
echo ">>> Starting the application on port ${PORT:-3000}..."
node server.js

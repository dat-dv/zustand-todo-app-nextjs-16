#!/bin/sh

# Basic infrastructure setup
DB_PATH="${SQLITE_DB_PATH:-/app/data/sqlite.db}"
DB_DIR=$(dirname "$DB_PATH")
mkdir -p "$DB_DIR"

if [ -f "$DB_PATH" ]; then
  echo ">>> Enforcing write permissions for database at $DB_PATH"
  chmod 666 "$DB_PATH"
fi

echo ">>> Starting the application on port ${PORT:-3000}..."
# Use exec to ensure the Node.js process receives shutdown signals cleanly
exec node server.js

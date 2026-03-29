#!/bin/sh

# Ensure the database directory exists
mkdir -p /app/data

# Sync the database schema using best-practice migration script (much faster/smaller)
echo ">>> Automatically pushing database changes via Production Migrator..."
npm run db:migrate

# Let's start the app
echo ">>> Starting the application in Standard Mode on port $PORT..."
npm start

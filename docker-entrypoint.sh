#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma 2>/dev/null || {
  echo "No existing migrations found, running db push instead..."
  npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss 2>/dev/null || true
}

echo "Starting application..."
exec "$@"

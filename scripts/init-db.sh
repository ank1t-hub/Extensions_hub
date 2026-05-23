#!/usr/bin/env bash
# Wait for MySQL then verify connection (run after: docker compose up -d)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -f .env ]; then
  set -a
  # shellcheck source=/dev/null
  source .env
  set +a
fi

MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-extensionhub}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-extensionhub}"
MYSQL_DATABASE="${MYSQL_DATABASE:-extensionhub}"

echo "Waiting for MySQL at ${MYSQL_HOST}:${MYSQL_PORT}..."
until docker compose exec -T mysql mysqladmin ping -h localhost -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" --silent 2>/dev/null; do
  sleep 2
done

echo "MySQL is ready. Database: ${MYSQL_DATABASE}"
docker compose exec -T mysql mysql -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" "${MYSQL_DATABASE}"
echo "Connection OK."

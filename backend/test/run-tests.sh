set -euo pipefail
cd "$(dirname "$0")/.."

# Start test DB
docker-compose -f docker-compose.test.yml up -d

# Wait for DB to be healthy
echo "Waiting for MySQL to be ready..."
for i in {1..30}; do
  STATUS=$(docker inspect --format='{{json .State.Health.Status}}' "$(docker-compose -f docker-compose.test.yml ps -q db)" 2>/dev/null || echo null)
  if [[ "$STATUS" == '"healthy"' ]]; then
    echo "MySQL healthy"
    break
  fi
  sleep 1
done

# Export env for tests (connect to the container via host 127.0.0.1:3307)
export DB_HOST=127.0.0.1
export DB_PORT=3307
export DB_USER=root
export DB_PASSWORD=rootpassword
export DB_NAME=nextswim

# Run tests
npm test
EXIT_CODE=$?

# Tear down
docker-compose -f docker-compose.test.yml down
exit $EXIT_CODE

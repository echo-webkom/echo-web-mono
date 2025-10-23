#!/bin/bash

# How to run:
#
# ./scripts/run-tests.sh [--build] [--clean]

set -e

BUILD_FLAG=""
CLEAN_FLAG=""

for arg in "$@"
do
    case $arg in
        --build)
        BUILD_FLAG="--build"
        shift
        ;;
        --clean)
        CLEAN_FLAG="true"
        shift
        ;;
        *)
        echo "Unknown option: $arg"
        echo "Usage: ./run-tests.sh [--build] [--clean]"
        echo "  --build: Rebuild the Docker image before running tests"
        echo "  --clean: Remove volumes and clean up after tests"
        exit 1
        ;;
    esac
done

echo "🐳 Starting E2E tests in Docker..."

# Assert that scripts was run from the project root
if [ ! -f "docker-compose.yaml" ]; then
    echo "❗ Please run this script from the project root directory:"
    echo ""
    echo "./scripts/run-tests.sh [--build] [--clean]"
    exit 1
fi

# Clean up previous test results
rm -rf playwright/playwright-report playwright/test-results

# If clean flag is set, remove volumes
if [ "$CLEAN_FLAG" = "true" ]; then
    echo "🧹 Cleaning up Docker volumes..."
    docker compose --profile test down -v
fi

docker compose --profile test up $BUILD_FLAG --abort-on-container-exit --exit-code-from e2e

TEST_EXIT_CODE=$?

if [ "$CLEAN_FLAG" = "true" ]; then
    echo "🧹 Cleaning up containers and volumes..."
    docker compose --profile test down -v
else
    echo "🧹 Cleaning up containers (keeping volumes for faster subsequent runs)..."
    docker compose --profile test down
fi

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Tests passed!"
else
    echo "❌ Tests failed!"
    echo "📊 View the test report in playwright/playwright-report/"
fi

exit $TEST_EXIT_CODE

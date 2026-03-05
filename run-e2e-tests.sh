#!/bin/bash

# NextSwim E2E Test Runner Script
# This script provides an easy way to run Playwright E2E tests against Docker containers

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════════════"
echo "  NextSwim End-to-End Test Runner"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.e2e.yml"
TEST_TIMEOUT=120
BASE_URL="http://localhost:5173"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_notice() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_notice "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    if [ ! -f "frontend/package.json" ]; then
        print_error "Frontend package.json not found. Are you in the project root?"
        exit 1
    fi
    print_success "Project structure is correct"
}

# Start Docker services
start_services() {
    print_notice "Starting Docker services with $DOCKER_COMPOSE_FILE..."
    
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build
    
    print_success "Services started"
    print_notice "Waiting for services to be ready..."
    
    # Wait for frontend to be ready
    for i in {1..30}; do
        if curl -s "$BASE_URL" > /dev/null 2>&1; then
            print_success "Frontend is ready"
            break
        fi
        echo -n "."
        sleep 2
        if [ $i -eq 30 ]; then
            print_error "Frontend did not start in time"
            docker-compose -f "$DOCKER_COMPOSE_FILE" logs frontend
            exit 1
        fi
    done
}

# Run tests
run_tests() {
    print_notice "Running Playwright E2E tests..."
    echo ""
    
    cd frontend
    
    if npm run test:e2e -- --baseURL="$BASE_URL"; then
        print_success "All E2E tests passed!"
        TEST_RESULT=0
    else
        print_error "Some tests failed"
        TEST_RESULT=1
    fi
    
    cd ..
    return $TEST_RESULT
}

# Stop services
stop_services() {
    print_notice "Stopping Docker services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down -v
    print_success "Services stopped and cleaned up"
}

# Main execution
main() {
    case "${1:-run}" in
        run)
            check_prerequisites
            start_services
            if ! run_tests; then
                stop_services
                exit 1
            fi
            stop_services
            print_success "Test run completed successfully!"
            ;;
        start)
            check_prerequisites
            start_services
            print_notice "Services are running. Run 'npm run test:e2e' in the frontend directory"
            print_notice "When done, run: docker-compose -f $DOCKER_COMPOSE_FILE down -v"
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            start_services
            print_success "Services restarted"
            ;;
        logs)
            docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f
            ;;
        *)
            echo "Usage: $0 {run|start|stop|restart|logs}"
            echo ""
            echo "Commands:"
            echo "  run      - Start services, run tests, and stop services (default)"
            echo "  start    - Start services only"
            echo "  stop     - Stop services"
            echo "  restart  - Restart services"
            echo "  logs     - Show service logs"
            exit 1
            ;;
    esac
}

main "$@"

#!/bin/bash

set -e

echo "🚀 Real-time Chat Application - Local Development"
echo "================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the monorepo root directory"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
yarn install

# Build applications
print_status "Building applications..."
yarn build

# Start Redis (if available)
if command -v redis-server &> /dev/null; then
    print_status "Starting Redis..."
    redis-server --daemonize yes --port 6379
else
    print_warning "Redis not found. Install Redis for full functionality."
fi

# Start the server
print_status "Starting Socket.IO server..."
cd apps/server
yarn start &
SERVER_PID=$!
cd ../..

# Wait a moment for server to start
sleep 3

# Start the web app
print_status "Starting web application..."
cd apps/web
yarn start &
WEB_PID=$!
cd ../..

# Start the docs app
print_status "Starting docs application..."
cd apps/docs
yarn start &
DOCS_PID=$!
cd ../..

# Wait for services to start
print_status "Waiting for services to start..."
sleep 5

# Check if services are running
print_status "Checking service status..."

# Check server
if curl -s http://localhost:8000/health > /dev/null; then
    print_success "✅ Server is running on http://localhost:8000"
else
    print_error "❌ Server is not responding"
fi

# Check web app
if curl -s http://localhost:3000 > /dev/null; then
    print_success "✅ Web app is running on http://localhost:3000"
else
    print_error "❌ Web app is not responding"
fi

# Check docs
if curl -s http://localhost:3001 > /dev/null; then
    print_success "✅ Docs are running on http://localhost:3001"
else
    print_error "❌ Docs are not responding"
fi

echo ""
print_success "🎉 Application is running!"
echo ""
print_status "Your services are available at:"
echo "  • Web App: http://localhost:3000"
echo "  • Server: http://localhost:8000"
echo "  • Docs: http://localhost:3001"
echo ""
print_status "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    print_status "Stopping services..."
    kill $SERVER_PID $WEB_PID $DOCS_PID 2>/dev/null || true
    if command -v redis-server &> /dev/null; then
        redis-cli shutdown 2>/dev/null || true
    fi
    print_success "All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

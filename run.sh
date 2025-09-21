#!/bin/bash

# Simple script to run the real-time chat application
set -e

echo "🚀 Real-time Chat Application"
echo "============================="

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

# Function to show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev     - Start development servers locally"
    echo "  docker  - Start with Docker"
    echo "  build   - Build Docker images"
    echo "  stop    - Stop Docker services"
    echo "  logs    - View Docker logs"
    echo "  clean   - Clean Docker resources"
    echo "  help    - Show this help"
}

# Function to run development
run_dev() {
    print_status "Starting development servers..."
    yarn install
    yarn dev
}

# Function to run with Docker
run_docker() {
    print_status "Building and starting Docker services..."
    docker-compose build
    docker-compose up -d
    
    print_status "Waiting for services to start..."
    sleep 10
    
    print_status "Services are running at:"
    echo "  • Web App: http://localhost:3000"
    echo "  • Server: http://localhost:8000"
    echo "  • Docs: http://localhost:3001"
    echo ""
    print_status "To view logs: $0 logs"
    print_status "To stop: $0 stop"
}

# Function to build Docker images
build_docker() {
    print_status "Building Docker images..."
    docker-compose build
    print_success "Docker images built successfully"
}

# Function to stop Docker services
stop_docker() {
    print_status "Stopping Docker services..."
    docker-compose down
    print_success "Docker services stopped"
}

# Function to view logs
view_logs() {
    print_status "Viewing Docker logs..."
    docker-compose logs -f
}

# Function to clean Docker resources
clean_docker() {
    print_status "Cleaning Docker resources..."
    docker-compose down -v
    docker system prune -f
    print_success "Docker resources cleaned"
}

# Main script logic
case "${1:-help}" in
    "dev")
        run_dev
        ;;
    "docker")
        run_docker
        ;;
    "build")
        build_docker
        ;;
    "stop")
        stop_docker
        ;;
    "logs")
        view_logs
        ;;
    "clean")
        clean_docker
        ;;
    "help"|*)
        show_help
        ;;
esac

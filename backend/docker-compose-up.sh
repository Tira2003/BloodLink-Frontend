#!/bin/bash

# BloodLink Backend - Docker Compose Quick Start

echo "================================"
echo "BloodLink Backend Quick Start"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "Starting BloodLink microservices..."
echo ""

# Build and start services
docker-compose up --build

echo ""
echo "================================"
echo "Services are now running!"
echo "================================"
echo ""
echo "API Gateway:       http://localhost:8080"
echo "User Service:      http://localhost:8081"
echo "Donation Service:  http://localhost:8082"
echo "Inventory Service: http://localhost:8083"
echo "Notification Service: http://localhost:8084"
echo ""
echo "PostgreSQL Database:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: bloodlink_db"
echo "  Username: postgres"
echo "  Password: postgres"
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""

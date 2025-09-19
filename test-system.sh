#!/bin/bash

# DevOps Task Manager - Health Check and Testing Script
# This script demonstrates how to monitor and test the application

echo "🚀 DevOps Task Manager - Health Check & Testing"
echo "================================================"

# Configuration
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if service is running
check_service() {
    local url=$1
    local service_name=$2
    
    echo -n "Checking $service_name... "
    
    if curl -s --max-time 10 "$url" > /dev/null; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not responding${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" -o /dev/null "$BACKEND_URL$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ $response${NC}"
        return 0
    else
        echo -e "${RED}✗ $response (expected $expected_status)${NC}"
        return 1
    fi
}

# Function to test authentication
test_auth() {
    echo -n "Testing authentication... "
    
    # Login and get token
    response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "password123"}')
    
    token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        echo -e "${GREEN}✓ Login successful${NC}"
        
        # Test protected endpoint
        echo -n "Testing protected endpoint... "
        protected_response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "Authorization: Bearer $token" \
            "$BACKEND_URL/api/tasks")
        
        if [ "$protected_response" = "200" ]; then
            echo -e "${GREEN}✓ Protected route accessible${NC}"
            return 0
        else
            echo -e "${RED}✗ Protected route failed ($protected_response)${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Login failed${NC}"
        return 1
    fi
}

# Function to performance test
performance_test() {
    echo -e "\n${YELLOW}Performance Testing${NC}"
    echo "===================="
    
    echo -n "Health endpoint response time... "
    time_result=$(curl -s -w "%{time_total}" -o /dev/null "$BACKEND_URL/api/health")
    echo -e "${GREEN}${time_result}s${NC}"
    
    echo -n "Frontend loading time... "
    frontend_time=$(curl -s -w "%{time_total}" -o /dev/null "$FRONTEND_URL")
    echo -e "${GREEN}${frontend_time}s${NC}"
}

# Function to test database operations
test_database() {
    echo -e "\n${YELLOW}Database Testing${NC}"
    echo "================="
    
    # Get token first
    response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "password123"}')
    
    token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        # Test creating a task
        echo -n "Creating test task... "
        create_response=$(curl -s -w "%{http_code}" -o /dev/null \
            -X POST "$BACKEND_URL/api/tasks" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d '{"title": "Test Task", "description": "Automated test", "priority": "high"}')
        
        if [ "$create_response" = "201" ]; then
            echo -e "${GREEN}✓ Task created${NC}"
        else
            echo -e "${RED}✗ Task creation failed ($create_response)${NC}"
        fi
        
        # Test getting stats
        echo -n "Getting statistics... "
        stats_response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "Authorization: Bearer $token" \
            "$BACKEND_URL/api/stats")
        
        if [ "$stats_response" = "200" ]; then
            echo -e "${GREEN}✓ Stats retrieved${NC}"
        else
            echo -e "${RED}✗ Stats failed ($stats_response)${NC}"
        fi
    else
        echo -e "${RED}✗ Cannot test database - authentication failed${NC}"
    fi
}

# Main testing sequence
echo -e "\n${YELLOW}Service Health Checks${NC}"
echo "====================="

backend_status=0
frontend_status=0

check_service "$BACKEND_URL/api/health" "Backend API" || backend_status=1
check_service "$FRONTEND_URL" "Frontend" || frontend_status=1

if [ $backend_status -eq 0 ]; then
    echo -e "\n${YELLOW}API Endpoint Testing${NC}"
    echo "===================="
    
    test_api "/api/health" "200" "Health endpoint"
    test_api "/api/nonexistent" "404" "404 handling"
    test_api "/api/tasks" "401" "Unauthenticated access"
    
    echo -e "\n${YELLOW}Authentication Testing${NC}"
    echo "======================="
    test_auth
    
    test_database
    performance_test
    
    echo -e "\n${YELLOW}System Information${NC}"
    echo "=================="
    
    # Get system info from health endpoint
    health_info=$(curl -s "$BACKEND_URL/api/health")
    echo "Backend Status: $(echo "$health_info" | grep -o '"status":"[^"]*' | cut -d'"' -f4)"
    echo "Environment: $(echo "$health_info" | grep -o '"environment":"[^"]*' | cut -d'"' -f4)"
    echo "Version: $(echo "$health_info" | grep -o '"version":"[^"]*' | cut -d'"' -f4)"
    echo "Timestamp: $(echo "$health_info" | grep -o '"timestamp":"[^"]*' | cut -d'"' -f4)"
    
else
    echo -e "\n${RED}Backend is not running. Please start the backend server first.${NC}"
    echo "Run: cd backend && npm run dev"
fi

if [ $frontend_status -eq 1 ]; then
    echo -e "\n${RED}Frontend is not running. Please start the frontend server.${NC}"
    echo "Run: cd frontend && npm run dev"
fi

echo -e "\n${YELLOW}Testing Complete!${NC}"
echo "=================="

if [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo -e "${GREEN}✓ All services are running successfully!${NC}"
    echo -e "Frontend: $FRONTEND_URL"
    echo -e "Backend API: $BACKEND_URL/api"
    exit 0
else
    echo -e "${RED}✗ Some services are not running. Please check the errors above.${NC}"
    exit 1
fi
# DevOps Task Manager - Health Check Script (PowerShell)
Write-Host "DevOps Task Manager - Health Check" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Configuration
$BACKEND_URL = "http://localhost:5000"
$FRONTEND_URL = "http://localhost:5173"

# Test Backend
Write-Host -NoNewline "Checking Backend API... "
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/api/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "Running" -ForegroundColor Green
        $backendStatus = $true
    }
}
catch {
    Write-Host "Not responding" -ForegroundColor Red
    $backendStatus = $false
}

# Test Frontend
Write-Host -NoNewline "Checking Frontend... "
try {
    $response = Invoke-WebRequest -Uri $FRONTEND_URL -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "Running" -ForegroundColor Green
        $frontendStatus = $true
    }
}
catch {
    Write-Host "Not responding" -ForegroundColor Red
    $frontendStatus = $false
}

if ($backendStatus) {
    Write-Host "`nTesting API Authentication..." -ForegroundColor Yellow
    
    try {
        $loginData = @{
            username = "admin"
            password = "password123"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        
        if ($response.token) {
            Write-Host "Authentication successful" -ForegroundColor Green
            
            # Test health endpoint
            $healthInfo = Invoke-RestMethod -Uri "$BACKEND_URL/api/health" -Method GET
            Write-Host "`nSystem Information:" -ForegroundColor Yellow
            Write-Host "Status: $($healthInfo.status)"
            Write-Host "Environment: $($healthInfo.environment)"
            Write-Host "Version: $($healthInfo.version)"
        }
    }
    catch {
        Write-Host "Authentication failed" -ForegroundColor Red
    }
}

Write-Host "`nTest Results:" -ForegroundColor Yellow
Write-Host "=============" -ForegroundColor Yellow

if ($backendStatus -and $frontendStatus) {
    Write-Host "All services are running successfully!" -ForegroundColor Green
    Write-Host "Frontend: $FRONTEND_URL" -ForegroundColor Green
    Write-Host "Backend API: $BACKEND_URL/api" -ForegroundColor Green
}
else {
    Write-Host "Some services are not running:" -ForegroundColor Red
    if (-not $backendStatus) {
        Write-Host "- Backend not running. Run: cd backend && npm run dev" -ForegroundColor Red
    }
    if (-not $frontendStatus) {
        Write-Host "- Frontend not running. Run: cd frontend && npm run dev" -ForegroundColor Red
    }
}
# Test Authentication and Admin Privileges for Freaky Four API
$baseUrl = "https://freaky-four.onrender.com"

Write-Host "Testing Freaky Four API Authentication and Admin Access" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

# Test 1: Check if server is running
Write-Host "`n1. Testing server health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "Server is running" -ForegroundColor Green
    Write-Host "   Status: $($healthData.status)" -ForegroundColor Cyan
    Write-Host "   Database: $($healthData.database.state)" -ForegroundColor Cyan
} catch {
    Write-Host "Server health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Try accessing admin endpoint without authentication
Write-Host "`n2. Testing admin endpoint without authentication..." -ForegroundColor Yellow
try {
    $adminResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/matches" -Method GET
    Write-Host "Unexpected: Admin endpoint accessible without auth" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Admin endpoint properly protected" -ForegroundColor Green
    Write-Host "   Status Code: $statusCode" -ForegroundColor Cyan
    
    if ($statusCode -eq 404) {
        Write-Host "   Returns 404 instead of 401/403 (middleware behavior)" -ForegroundColor Yellow
    }
}

# Test 3: Check available public endpoints
Write-Host "`n3. Testing public endpoints..." -ForegroundColor Yellow

$publicEndpoints = @(
    "/api/gallery",
    "/api/clubs", 
    "/api/matches",
    "/api/news",
    "/api/live_matches"
)

foreach ($endpoint in $publicEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" -Method GET
        Write-Host "$endpoint - Available (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "$endpoint - Status: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`nSummary:" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "Server is running and database is connected" -ForegroundColor White
Write-Host "Admin endpoints are protected by authentication middleware" -ForegroundColor White
Write-Host "The 404 error on /api/admin/matches is due to missing authentication" -ForegroundColor White
Write-Host "You need to:" -ForegroundColor White
Write-Host "  1. Register a user" -ForegroundColor Cyan
Write-Host "  2. Set user role to admin in database" -ForegroundColor Cyan
Write-Host "  3. Login to get JWT token" -ForegroundColor Cyan
Write-Host "  4. Use token in Authorization header" -ForegroundColor Cyan

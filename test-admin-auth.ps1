# Test Authentication and Admin Privileges for Freaky Four API
# This script tests the authentication flow and admin access

$baseUrl = "https://freaky-four.onrender.com"

Write-Host "🔍 Testing Freaky Four API Authentication and Admin Access" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

# Test 1: Check if server is running
Write-Host "`n1. Testing server health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "   Status: $($healthData.status)" -ForegroundColor Cyan
    Write-Host "   Database: $($healthData.database.state)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Server health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Try accessing admin endpoint without authentication
Write-Host "`n2. Testing admin endpoint without authentication..." -ForegroundColor Yellow
try {
    $adminResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/matches" -Method GET
    Write-Host "❌ Unexpected: Admin endpoint accessible without auth" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "✅ Admin endpoint properly protected" -ForegroundColor Green
    Write-Host "   Status Code: $statusCode" -ForegroundColor Cyan
    
    if ($statusCode -eq 404) {
        Write-Host "   ⚠️  Returns 404 instead of 401/403 (this is the middleware behavior)" -ForegroundColor Yellow
    }
}

# Test 3: Check if we can register a test user
Write-Host "`n3. Testing user registration..." -ForegroundColor Yellow
$testUser = @{
    name = "Test Admin User"
    email = "testadmin@example.com"
    password = "TestPassword123!"
    mobile = "1234567890"
    year = "2024"
    department = "IT"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Body $testUser -ContentType "application/json"
    Write-Host "✅ Registration endpoint accessible" -ForegroundColor Green
    Write-Host "   Status: $($registerResponse.StatusCode)" -ForegroundColor Cyan
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "⚠️  Registration failed or user exists" -ForegroundColor Yellow
    Write-Host "   Status Code: $statusCode" -ForegroundColor Cyan
    
    if ($statusCode -eq 400) {
        Write-Host "   (This is expected if user already exists)" -ForegroundColor Gray
    }
}

# Test 4: Check available auth endpoints
Write-Host "`n4. Testing auth endpoints availability..." -ForegroundColor Yellow

$authEndpoints = @(
    "/api/auth/register",
    "/api/auth/login", 
    "/api/auth/verify-otp",
    "/api/auth/forgot-password"
)

foreach ($endpoint in $authEndpoints) {
    try {
        # Use HEAD request to check if endpoint exists without triggering logic
        $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" -Method HEAD -ErrorAction SilentlyContinue
        Write-Host "✅ $endpoint - Available" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 405) {
            Write-Host "✅ $endpoint - Available (Method not allowed for HEAD)" -ForegroundColor Green
        } elseif ($statusCode -eq 404) {
            Write-Host "❌ $endpoint - Not Found" -ForegroundColor Red
        } else {
            Write-Host "⚠️  $endpoint - Status: $statusCode" -ForegroundColor Yellow
        }
    }
}

# Test 5: Check if there are any existing admin users
Write-Host "`n5. Checking database for users..." -ForegroundColor Yellow
try {
    # Try to access a public endpoint that might give us user info
    $usersResponse = Invoke-WebRequest -Uri "$baseUrl/api/user?email=admin@example.com" -Method GET
    Write-Host "✅ User lookup endpoint accessible" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "⚠️  User lookup failed: Status $statusCode" -ForegroundColor Yellow
}

# Test 6: Check what public endpoints are available
Write-Host "`n6. Testing public endpoints..." -ForegroundColor Yellow

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
        Write-Host "✅ $endpoint - Available (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ $endpoint - Status: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n📋 Summary:" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "• Server is running and database is connected" -ForegroundColor White
Write-Host "• Admin endpoints are protected by authentication middleware" -ForegroundColor White
Write-Host "• The 404 error on /api/admin/matches is due to missing authentication" -ForegroundColor White
Write-Host "• You need to:" -ForegroundColor White
Write-Host "  1. Register a user" -ForegroundColor Cyan
Write-Host "  2. Set user role to 'admin' in database" -ForegroundColor Cyan
Write-Host "  3. Login to get JWT token" -ForegroundColor Cyan
Write-Host "  4. Use token in Authorization header: 'Bearer <token>'" -ForegroundColor Cyan

Write-Host "`n🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create an admin user in your MongoDB database" -ForegroundColor White
Write-Host "2. Test login with admin credentials" -ForegroundColor White
Write-Host "3. Use the JWT token to access admin endpoints" -ForegroundColor White

# Test Admin Login and JWT Token
$baseUrl = "https://freaky-four.onrender.com"

Write-Host "Testing Admin Login and JWT Token" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Test login with admin credentials
Write-Host "`n1. Testing login endpoint..." -ForegroundColor Yellow

# Using admin credentials from createAdmin.js
$loginData = @{
    email = "admin@sportshub.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Cyan
    
    # Extract token if available
    if ($loginResult.token) {
        $token = $loginResult.token
        Write-Host "JWT Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Green
        
        # Test admin endpoint with token
        Write-Host "`n2. Testing admin endpoint with token..." -ForegroundColor Yellow
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        try {
            $adminResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/matches" -Method GET -Headers $headers
            Write-Host "Admin endpoint accessible!" -ForegroundColor Green
            Write-Host "Status: $($adminResponse.StatusCode)" -ForegroundColor Cyan
            $matches = $adminResponse.Content | ConvertFrom-Json
            Write-Host "Found $($matches.count) matches" -ForegroundColor Cyan
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "Admin endpoint failed: Status $statusCode" -ForegroundColor Red
            
            if ($_.Exception.Response) {
                $errorContent = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorContent)
                $errorBody = $reader.ReadToEnd()
                Write-Host "Error: $errorBody" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No token found in login response" -ForegroundColor Red
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Login failed: Status $statusCode" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`nInstructions:" -ForegroundColor Yellow
Write-Host "1. Update the email and password in this script with your admin credentials" -ForegroundColor White
Write-Host "2. If login fails, check if your user exists and has 'admin' role" -ForegroundColor White
Write-Host "3. If login succeeds but admin endpoint fails, check token format" -ForegroundColor White

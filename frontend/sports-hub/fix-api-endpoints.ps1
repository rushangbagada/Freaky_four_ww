# PowerShell script to fix API endpoints in all files
# This script will update all files that are still using direct '/api/...' calls

$filesAndFixes = @(
    @{
        Path = "components\reviews.jsx"
        Changes = @(
            @{
                Find = "import React, { useState, useEffect } from 'react';"
                Replace = "import React, { useState, useEffect } from 'react';"
            },
            @{
                Find = "import './css/reviews.css';"
                Replace = "import { getApiUrl, API_ENDPOINTS } from '../src/config/api';`nimport './css/reviews.css';"
            },
            @{
                Find = "fetch('/api/reviews')"
                Replace = "fetch(getApiUrl('/api/reviews'))"
            },
            @{
                Find = "fetch('/api/reviews',"
                Replace = "fetch(getApiUrl('/api/reviews'),"
            }
        )
    },
    @{
        Path = "components\ResetPassword.jsx"
        Changes = @(
            @{
                Find = "import { useAuth } from '../src/AuthContext';"
                Replace = "import { useAuth } from '../src/AuthContext';`nimport { getApiUrl, API_ENDPOINTS } from '../src/config/api';"
            },
            @{
                Find = "fetch('/api/auth/reset-password',"
                Replace = "fetch(getApiUrl(API_ENDPOINTS.RESET_PASSWORD),"
            }
        )
    },
    @{
        Path = "components\register_form_club.jsx"
        Changes = @(
            @{
                Find = "import './css/register_form_club.css';"
                Replace = "import { getApiUrl, API_ENDPOINTS } from '../src/config/api';`nimport './css/register_form_club.css';"
            },
            @{
                Find = "fetch('/api/clubs/register',"
                Replace = "fetch(getApiUrl('/api/clubs/register'),"
            }
        )
    },
    @{
        Path = "components\calender.jsx"
        Changes = @(
            @{
                Find = "import './css/calender.css';"
                Replace = "import { getApiUrl, API_ENDPOINTS } from '../src/config/api';`nimport './css/calender.css';"
            },
            @{
                Find = "fetch('/api/events')"
                Replace = "fetch(getApiUrl(API_ENDPOINTS.EVENTS))"
            }
        )
    },
    @{
        Path = "components\club-details.jsx"
        Changes = @(
            @{
                Find = "import './css/club-details.css';"
                Replace = "import { getApiUrl, API_ENDPOINTS } from '../src/config/api';`nimport './css/club-details.css';"
            },
            @{
                Find = "fetch('/api/clubs')"
                Replace = "fetch(getApiUrl(API_ENDPOINTS.CLUBS))"
            },
            @{
                Find = "fetch('/api/clubs/join',"
                Replace = "fetch(getApiUrl('/api/clubs/join'),"
            }
        )
    }
)

Write-Host "Starting API endpoint fixes..." -ForegroundColor Green

foreach ($fileInfo in $filesAndFixes) {
    $filePath = $fileInfo.Path
    $fullPath = Join-Path $PSScriptRoot $filePath
    
    if (Test-Path $fullPath) {
        Write-Host "Processing $filePath..." -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        $modified = $false
        
        foreach ($change in $fileInfo.Changes) {
            if ($content -match [regex]::Escape($change.Find)) {
                $content = $content -replace [regex]::Escape($change.Find), $change.Replace
                $modified = $true
                Write-Host "  ✓ Updated: $($change.Find)" -ForegroundColor Cyan
            }
        }
        
        if ($modified) {
            Set-Content $fullPath -Value $content -NoNewline
            Write-Host "  ✅ File updated successfully" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️ No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ File not found: $fullPath" -ForegroundColor Red
    }
}

Write-Host "`nAPI endpoint fixes completed!" -ForegroundColor Green
Write-Host "Please verify the changes and test your application." -ForegroundColor Yellow

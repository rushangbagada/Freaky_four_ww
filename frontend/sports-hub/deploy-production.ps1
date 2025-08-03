# Production Deployment Script for Sports Hub
Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Green

# Set production environment
$env:NODE_ENV = "production"
$env:VITE_NODE_ENV = "production"

Write-Host "📝 Environment Variables Set:" -ForegroundColor Yellow
Write-Host "NODE_ENV: $env:NODE_ENV"
Write-Host "VITE_NODE_ENV: $env:VITE_NODE_ENV"

# Check if .env.production exists, if not copy from .env
if (-Not (Test-Path ".env.production")) {
    Write-Host "⚠️  .env.production not found, copying from .env..." -ForegroundColor Yellow
    Copy-Item ".env" ".env.production"
}

# Update .env.production to ensure production mode
Write-Host "🔧 Ensuring production configuration..." -ForegroundColor Cyan
(Get-Content ".env.production") -replace "VITE_NODE_ENV=development", "VITE_NODE_ENV=production" | Set-Content ".env.production"

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Build for production
Write-Host "🔨 Building for production..." -ForegroundColor Cyan
npm run build

# Check if build was successful
if (Test-Path "dist/index.html") {
    Write-Host "✅ Production build completed successfully!" -ForegroundColor Green
    Write-Host "📊 Build size analysis:" -ForegroundColor Yellow
    Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum | ForEach-Object {
        $size = [Math]::Round($_.Sum / 1MB, 2)
        Write-Host "Total size: $size MB"
    }
    
    Write-Host "🌐 You can now deploy the 'dist' folder to your hosting provider" -ForegroundColor Green
    Write-Host "🔍 To preview: npm run preview" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed! Check the errors above." -ForegroundColor Red
    exit 1
}

# Task Matrix - Build All Platforms
# Run this after editing index.html

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Task Matrix - Build All Platforms" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$SourceHTML = "E:\APPS\TaskMatrix\index.html"
$MobileHTML = "E:\APPS\ios\assets\html\index-v2.html"
$WindowsHTML = "E:\APPS\TaskMatrix-Windows\index.html"

# Step 1: Sync HTML to all platforms
Write-Host "📋 Step 1: Syncing HTML to all platforms..." -ForegroundColor Yellow
Copy-Item $SourceHTML -Destination $MobileHTML -Force
Copy-Item $SourceHTML -Destination $WindowsHTML -Force
Write-Host "✅ HTML synced!" -ForegroundColor Green
Write-Host ""

# Step 2: Build Windows
Write-Host "🪟 Step 2: Building Windows app..." -ForegroundColor Yellow
Push-Location "E:\APPS\TaskMatrix-Windows"
npm run build:win
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Windows build complete!" -ForegroundColor Green
    Write-Host "   Location: E:\APPS\TaskMatrix-Windows\dist\" -ForegroundColor Gray
} else {
    Write-Host "❌ Windows build failed!" -ForegroundColor Red
}
Pop-Location
Write-Host ""

# Step 3: Build Mobile (iOS + Android)
Write-Host "📱 Step 3: Mobile builds..." -ForegroundColor Yellow
Write-Host "   iOS and Android require EAS build (cloud)" -ForegroundColor Gray
Write-Host ""
Write-Host "   To build iOS:" -ForegroundColor Cyan
Write-Host "   cd E:\APPS\ios" -ForegroundColor Gray
Write-Host "   eas build --platform ios" -ForegroundColor Gray
Write-Host ""
Write-Host "   To build Android:" -ForegroundColor Cyan
Write-Host "   cd E:\APPS\ios" -ForegroundColor Gray
Write-Host "   eas build --platform android" -ForegroundColor Gray
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Build process complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Outputs:" -ForegroundColor Yellow
Write-Host "   Windows: E:\APPS\TaskMatrix-Windows\dist\" -ForegroundColor Gray
Write-Host "   iOS: Run EAS build command above" -ForegroundColor Gray
Write-Host "   Android: Run EAS build command above" -ForegroundColor Gray

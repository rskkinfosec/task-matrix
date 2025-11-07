# Task Matrix - Build Windows Only
# Quick build for Windows testing

Write-Host "Building Windows app..." -ForegroundColor Yellow
Write-Host ""

$SourceHTML = "E:\APPS\TaskMatrix\index.html"
$WindowsHTML = "E:\APPS\TaskMatrix-Windows\index.html"

# Sync HTML
Write-Host "Syncing HTML..." -ForegroundColor Cyan
Copy-Item $SourceHTML -Destination $WindowsHTML -Force
Write-Host "HTML synced!" -ForegroundColor Green
Write-Host ""

# Build
Write-Host "Building..." -ForegroundColor Cyan
Push-Location "E:\APPS\TaskMatrix-Windows"
npm run build:win
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Windows build complete!" -ForegroundColor Green
    Write-Host "Output: E:\APPS\TaskMatrix-Windows\dist\" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Build failed!" -ForegroundColor Red
}

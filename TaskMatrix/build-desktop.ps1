# Task Matrix - Build Desktop (Windows/Linux/macOS)
# Syncs HTML and builds desktop app

Write-Host " Building Desktop App..." -ForegroundColor Cyan
Write-Host ""

$SourceHTML = "E:\APPS\TaskMatrix\index.html"
$DesktopHTML = "E:\APPS\TaskMatrix-Desktop\index.html"

# Sync HTML
Write-Host " Syncing HTML..." -ForegroundColor Yellow
Copy-Item $SourceHTML -Destination $DesktopHTML -Force
Write-Host " HTML synced!" -ForegroundColor Green
Write-Host ""

# Build
Write-Host " Building Windows..." -ForegroundColor Yellow
Push-Location "E:\APPS\TaskMatrix-Desktop"
npm run build:win
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host " Desktop build complete!" -ForegroundColor Green
    Write-Host " Output: E:\APPS\TaskMatrix-Desktop\dist\" -ForegroundColor Gray
    Write-Host ""
    Write-Host " Files created:" -ForegroundColor Cyan
    Get-ChildItem "E:\APPS\TaskMatrix-Desktop\dist" -Filter "*.exe" | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }
} else {
    Write-Host ""
    Write-Host " Build failed!" -ForegroundColor Red
}

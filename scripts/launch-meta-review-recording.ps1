#!/usr/bin/env pwsh
# ============================================================
# GrowthPilot AI — Meta Review Recording Launcher
# Run this script BEFORE starting the Meta review flow.
# It opens the review page and attempts to launch Windows
# Game Bar (Win+G) recording if available.
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GROWTHPILOT AI — META REVIEW RECORDING LAUNCHER" -ForegroundColor Cyan
Write-Host "  Version 1.0.0-beta.1" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$reviewUrl = "https://growthpilot-ai-two.vercel.app/admin/meta-review"
$localUrl  = "http://localhost:3000/admin/meta-review"

# ── Step 1: Open the Meta Review Recording Mode page ─────────
Write-Host "[1/3] Opening Meta Review Recording Mode in Chrome..." -ForegroundColor Yellow
try {
    $chromePaths = @(
        "$env:PROGRAMFILES\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    $chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($chrome) {
        Start-Process $chrome "--new-window --app=$reviewUrl --window-size=1920,1080"
        Write-Host "    ✓ Opened in Chrome (app mode, full screen)" -ForegroundColor Green
    } else {
        Start-Process $reviewUrl
        Write-Host "    ✓ Opened in default browser" -ForegroundColor Green
    }
} catch {
    Write-Host "    ✗ Could not open browser automatically. Please open manually:" -ForegroundColor Red
    Write-Host "      $reviewUrl" -ForegroundColor White
}

Start-Sleep -Seconds 2

# ── Step 2: Try Windows Game Bar ─────────────────────────────
Write-Host ""
Write-Host "[2/3] Checking Windows Game Bar (Win+G) recording availability..." -ForegroundColor Yellow

$gameBarKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR"
$gameBarEnabled = $false
try {
    $val = Get-ItemProperty -Path $gameBarKey -Name "AppCaptureEnabled" -ErrorAction Stop
    $gameBarEnabled = ($val.AppCaptureEnabled -eq 1)
} catch {
    $gameBarEnabled = $false
}

if ($gameBarEnabled) {
    Write-Host "    ✓ Windows Game Bar is enabled." -ForegroundColor Green
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────────────────┐" -ForegroundColor Cyan
    Write-Host "  │  Press  Win + Alt + R  to START/STOP recording     │" -ForegroundColor White
    Write-Host "  │  Recordings saved to: Videos\Captures              │" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────┘" -ForegroundColor Cyan
} else {
    Write-Host "    ✗ Windows Game Bar recording not detected." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  OPTION A — Use the BUILT-IN browser recording button on the review page." -ForegroundColor Cyan
    Write-Host "             Click 'START RECORDING' on the page itself." -ForegroundColor White
    Write-Host ""
    Write-Host "  OPTION B — Enable Windows Game Bar:" -ForegroundColor Cyan
    Write-Host "             Settings > Gaming > Xbox Game Bar > ON" -ForegroundColor White
    Write-Host "             Then: Win + Alt + R to record" -ForegroundColor White
    Write-Host ""
    Write-Host "  OPTION C — Free alternatives:" -ForegroundColor Cyan
    Write-Host "             OBS Studio: https://obsproject.com (free, professional)" -ForegroundColor White
    Write-Host "             Loom:       https://loom.com        (free, browser-based)" -ForegroundColor White
}

# ── Step 3: Instructions ──────────────────────────────────────
Write-Host ""
Write-Host "[3/3] META REVIEW RECORDING INSTRUCTIONS" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Start recording (via browser button, Win+Alt+R, or OBS)" -ForegroundColor White
Write-Host "  2. Click 'START META REVIEW FLOW' on the page" -ForegroundColor White
Write-Host "  3. Steps auto-advance — watch for AMBER 'OWNER REQUIRED' pauses" -ForegroundColor White
Write-Host "  4. At STEP 2 (Instagram OAuth): click 'Connect Instagram' and authorize" -ForegroundColor White
Write-Host "  5. At STEP 3 (Facebook OAuth):  click 'Connect Facebook Page' and authorize" -ForegroundColor White
Write-Host "  6. After STEP 10 completes: stop recording" -ForegroundColor White
Write-Host "  7. If browser recording: click 'Download Recording' button on the page" -ForegroundColor White
Write-Host "  8. Upload the video to Google Drive (Anyone with link = viewer)" -ForegroundColor White
Write-Host "  9. Paste the shareable Google Drive link into Meta App Review submission" -ForegroundColor White
Write-Host ""
Write-Host "  Required permissions to demonstrate:" -ForegroundColor Cyan
Write-Host "    instagram_basic               instagram_content_publish" -ForegroundColor White
Write-Host "    instagram_manage_insights     pages_show_list" -ForegroundColor White
Write-Host "    pages_read_engagement         pages_manage_posts" -ForegroundColor White
Write-Host ""
Write-Host "  Meta App Review submission portal:" -ForegroundColor Cyan
Write-Host "    https://developers.facebook.com/apps/" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  READY — Meta review page is now open in your browser." -ForegroundColor Green
Write-Host "  Start recording, then click START META REVIEW FLOW." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

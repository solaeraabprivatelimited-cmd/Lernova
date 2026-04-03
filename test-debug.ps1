#!/usr/bin/env powershell

# Get a valid token from the deployed app
$healthUrl = "https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/server/health"
$debugUrl = "https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/server/webrtc/debug"

Write-Host "Testing /health endpoint..."
try {
  $health = Invoke-WebRequest -Uri $healthUrl -Method GET
  Write-Host "✓ Health check succeeded"
  Write-Host "Status: $($health.StatusCode)"
  Write-Host "Body: $($health.Content)"
} catch {
  Write-Host "✗ Health check failed: $($_.Exception.Message)"
  Write-Host "Status: $($_.Exception.Response.StatusCode)"
}

Write-Host "`nTesting /webrtc/debug endpoint..."
try {
  $debug = Invoke-WebRequest -Uri $debugUrl `
    -Method GET `
    -Headers @{
      "Authorization" = "Bearer test-token"
    }
  Write-Host "✓ Debug endpoint succeeded"
  Write-Host "Status: $($debug.StatusCode)"
  Write-Host "Body: $($debug.Content)"
} catch {
  Write-Host "✗ Debug endpoint failed: $($_.Exception.Message)"
  Write-Host "Status: $($_.Exception.Response.StatusCode)"
  Write-Host "Response: $($_.Exception.Response.Content)"
}

$port = 3000
$connections = Get-NetTCPConnection -LocalPort $port | Where-Object { $_.OwningProcess -ne 0 }

if ($connections.Count -eq 0) {
    Write-Output "Nothing is running on port $port."
    return
}

foreach ($conn in $connections) {
    try {
        Stop-Process -Id $conn.OwningProcess -Force
        Write-Output "Killed process on port $port (PID: $($conn.OwningProcess))"
    } catch {
        Write-Output "Failed to kill PID $($conn.OwningProcess): $_"
    }
}

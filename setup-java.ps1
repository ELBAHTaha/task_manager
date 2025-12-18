# Setup script for Java 17 and Maven Wrapper
Write-Host "Checking Java installation..." -ForegroundColor Cyan

# Check if Java 17 is installed
$java17Paths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-17.0.1",
    "C:\Program Files\Java\jdk-17.0.2",
    "C:\Program Files\Java\jdk-17.0.3",
    "C:\Program Files\Java\jdk-17.0.4",
    "C:\Program Files\Java\jdk-17.0.5",
    "C:\Program Files\Java\jdk-17.0.6",
    "C:\Program Files\Java\jdk-17.0.7",
    "C:\Program Files\Java\jdk-17.0.8",
    "C:\Program Files\Java\jdk-17.0.9",
    "C:\Program Files\Java\jdk-17.0.10",
    "C:\Program Files\Java\jdk-17.0.11",
    "C:\Program Files\Java\jdk-17.0.12"
)

$java17Found = $null
foreach ($path in $java17Paths) {
    if (Test-Path "$path\bin\java.exe") {
        $java17Found = $path
        break
    }
}

# Also check Program Files (x86)
if (-not $java17Found) {
    $java17PathsX86 = $java17Paths | ForEach-Object { $_ -replace "Program Files", "Program Files (x86)" }
    foreach ($path in $java17PathsX86) {
        if (Test-Path "$path\bin\java.exe") {
            $java17Found = $path
            break
        }
    }
}

# Search in all Java directories
if (-not $java17Found) {
    Write-Host "Searching for Java 17 installations..." -ForegroundColor Yellow
    $allJavaDirs = Get-ChildItem "C:\Program Files\Java" -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "jdk-17*" }
    if ($allJavaDirs) {
        $java17Found = $allJavaDirs[0].FullName
    }
}

if ($java17Found) {
    Write-Host "Found Java 17 at: $java17Found" -ForegroundColor Green
    $env:JAVA_HOME = $java17Found
    Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
    
    # Verify Java version
    $javaVersion = & "$java17Found\bin\java.exe" -version 2>&1 | Select-String "version"
    Write-Host "Java version: $javaVersion" -ForegroundColor Green
    
    Write-Host "`nYou can now run: .\mvnw.cmd spring-boot:run" -ForegroundColor Cyan
} else {
    Write-Host "`nJava 17 not found!" -ForegroundColor Red
    Write-Host "`nPlease install Java 17:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor White
    Write-Host "2. Install it (default location: C:\Program Files\Java\jdk-17)" -ForegroundColor White
    Write-Host "3. Run this script again, or set JAVA_HOME manually:" -ForegroundColor White
    Write-Host "   `$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'" -ForegroundColor Gray
    Write-Host "`nOr set it permanently:" -ForegroundColor Yellow
    Write-Host "   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'User')" -ForegroundColor Gray
}




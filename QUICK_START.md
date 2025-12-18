# Quick Start Guide

## Problem
You can't run `mvn spring-boot:run` because:
1. ❌ Maven is not installed (use `mvnw.cmd` instead)
2. ❌ Java 17 is required (you have Java 8)

## Solution

### Step 1: Install Java 17

**Option A: Download from Adoptium (Recommended)**
1. Go to: https://adoptium.net/temurin/releases/?version=17
2. Download Windows x64 JDK (`.msi` installer)
3. Run the installer
4. Default installation path: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`

**Option B: Download from Oracle**
1. Go to: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
2. Download Windows x64 installer
3. Install it

### Step 2: Set JAVA_HOME

After installing Java 17, run this in PowerShell:

```powershell
# Find your Java 17 installation (usually one of these):
# C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
# C:\Program Files\Java\jdk-17

# Set JAVA_HOME (replace with your actual path):
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.10+11-hotspot"

# Or use the setup script:
.\setup-java.ps1
```

**To set JAVA_HOME permanently:**
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.10+11-hotspot", "User")
```

### Step 3: Run the Application

```powershell
# Use Maven Wrapper (no need to install Maven):
.\mvnw.cmd spring-boot:run
```

## Verify Setup

```powershell
# Check Java version (should show 17):
java -version

# Check JAVA_HOME:
echo $env:JAVA_HOME

# Test Maven Wrapper:
.\mvnw.cmd --version
```

## Troubleshooting

**If `.\mvnw.cmd` says "JAVA_HOME not found":**
- Make sure Java 17 is installed
- Set JAVA_HOME to the JDK folder (not JRE, and must have `bin\java.exe` inside)
- Restart PowerShell after setting JAVA_HOME permanently

**If you get "Java version mismatch":**
- The project requires Java 17
- Check version: `java -version`
- Make sure JAVA_HOME points to Java 17, not Java 8



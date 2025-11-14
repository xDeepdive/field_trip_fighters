@echo off
REM Build script for Field Trip Fighters HTML5 export (Windows)

echo.
echo ========================================
echo   Field Trip Fighters - HTML5 Build
echo ========================================
echo.

REM Check if Godot path is provided
if "%1"=="" (
    echo ERROR: Please provide path to Godot 3.1.2 executable
    echo.
    echo Usage:
    echo   build.bat "C:\Path\To\Godot_v3.1.2-stable_win64.exe"
    echo.
    echo Download Godot 3.1.2:
    echo https://www.mudlakebiodiversity.ca/ftf/Godot_v3.1.2-stable_win64.exe
    echo.
    exit /b 1
)

set GODOT_PATH=%1

REM Check if Godot exists
if not exist "%GODOT_PATH%" (
    echo ERROR: Godot not found at: %GODOT_PATH%
    echo.
    exit /b 1
)

echo Using Godot: %GODOT_PATH%
echo.

REM Check if project.godot exists
if not exist "project.godot" (
    echo ERROR: project.godot not found!
    echo Please run this script from the project root directory
    echo.
    exit /b 1
)

echo Creating builds directory...
if not exist "builds\web" mkdir builds\web

echo.
echo Exporting to HTML5...
echo This may take 1-2 minutes...
echo.

"%GODOT_PATH%" --export "HTML5" builds/web/index.html

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Output files in: builds\web\
    dir builds\web
    echo.
    echo Next steps:
    echo   1. Test locally: cd builds\web ^&^& python -m http.server 8000
    echo   2. Deploy to Netlify: drag builds\web\ folder to netlify.com
    echo   3. Or commit and auto-deploy from GitHub
    echo.
) else (
    echo.
    echo ========================================
    echo   BUILD FAILED!
    echo ========================================
    echo Check the error messages above
    echo.
    exit /b 1
)

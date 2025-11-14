#!/bin/bash
# Build script for Field Trip Fighters HTML5 export

echo "🎮 Field Trip Fighters - HTML5 Build Script"
echo "============================================="
echo ""

# Check if Godot is installed
if ! command -v godot &> /dev/null; then
    echo "❌ Godot not found!"
    echo ""
    echo "Please download Godot 3.1.2:"
    echo "https://www.mudlakebiodiversity.ca/ftf/Godot_v3.1.2-stable_win64.exe"
    echo ""
    echo "Then add it to your PATH or run this script with:"
    echo "./build.sh /path/to/godot"
    exit 1
fi

# Use provided Godot path or default
GODOT_CMD="${1:-godot}"

echo "✅ Using Godot: $GODOT_CMD"
echo ""

# Check if project.godot exists
if [ ! -f "project.godot" ]; then
    echo "❌ project.godot not found!"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📦 Creating builds directory..."
mkdir -p builds/web

echo "🏗️  Exporting to HTML5..."
echo "   This may take 1-2 minutes..."
echo ""

$GODOT_CMD --export "HTML5" builds/web/index.html

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📂 Output files:"
    ls -lh builds/web/
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Test locally: cd builds/web && python3 -m http.server 8000"
    echo "   2. Deploy to Netlify: drag builds/web/ folder to netlify.com"
    echo "   3. Or commit and auto-deploy from GitHub"
    echo ""
else
    echo ""
    echo "❌ Build failed!"
    echo "   Check the error messages above"
    exit 1
fi

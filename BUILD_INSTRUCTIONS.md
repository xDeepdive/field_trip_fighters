# 🎮 How to Build Field Trip Fighters for Browser

## ⚠️ Important: The `builds/web/` folder doesn't exist yet!

You need to **export from Godot** first. Here's how:

---

## 📋 Prerequisites

**Required:**
- Godot Engine 3.1.2 (specific version!)
- Download: https://www.mudlakebiodiversity.ca/ftf/Godot_v3.1.2-stable_win64.exe

**Why 3.1.2?**
- Newer versions (3.2, 4.x) won't work with this project
- Game was built with 3.1.2 specific features

---

## 🚀 Method 1: Export from Godot (Recommended)

### Step 1: Install Godot 3.1.2

**Windows:**
```
1. Download: Godot_v3.1.2-stable_win64.exe
2. Run it (no installation needed)
```

**Mac:**
```
1. Download Godot 3.1.2 for Mac
2. Extract and run
```

**Linux:**
```bash
wget https://downloads.tuxfamily.org/godotengine/3.1.2/Godot_v3.1.2-stable_x11.64.zip
unzip Godot_v3.1.2-stable_x11.64.zip
chmod +x Godot_v3.1.2-stable_x11.64
```

### Step 2: Import Project

```
1. Open Godot 3.1.2
2. Click "Import"
3. Click "Browse"
4. Navigate to: field_trip_fighters/
5. Select: project.godot
6. Click "Import & Edit"
```

**⏳ Wait 2-5 minutes** for first import (importing assets)

### Step 3: Install HTML5 Export Templates

```
1. In Godot Editor: Editor → Manage Export Templates
2. Click "Download and Install"
3. Wait for download (may take a few minutes)
4. Close the window when done
```

### Step 4: Export to HTML5

```
1. Project → Export...
2. You should see "HTML5" preset already configured
3. Click "Export Project" button (bottom)
4. Navigate to project folder
5. Create folder: builds/web/
6. Save as: builds/web/index.html
7. Click "Save"
```

**⏳ Wait 1-2 minutes** for export

### Step 5: Verify Export

Check that these files were created:

```
builds/web/
├── index.html      (~10 KB)
├── index.wasm      (~40 MB - the game code)
├── index.pck       (~100 MB - all game assets)
└── index.png       (icon)
```

**Total size: ~140-150 MB**

### Step 6: Test Locally

```bash
# Navigate to web build
cd builds/web

# Start local server (Python 3)
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Open browser:
http://localhost:8000
```

---

## 🛠️ Method 2: Use Build Script

I've created build scripts for you!

### Linux/Mac:

```bash
# Make script executable
chmod +x build.sh

# Run build
./build.sh /path/to/godot

# Or if godot is in PATH:
./build.sh godot
```

### Windows:

```cmd
REM Run from project root
build.bat "C:\Path\To\Godot_v3.1.2-stable_win64.exe"
```

---

## 🌐 Deploy After Building

Once you have `builds/web/` folder:

### Option A: Netlify (Drag & Drop)

```
1. Go to netlify.com
2. Sign up / Log in
3. Drag the builds/web/ folder onto the page
4. Done! You get a URL like: https://your-game.netlify.app
```

### Option B: Netlify (Git Deploy)

```
1. Commit builds/web/ folder to git:
   git add builds/web
   git commit -m "Add browser build"
   git push

2. On netlify.com:
   - New site from Git
   - Connect GitHub
   - Publish directory: builds/web
   - Deploy!
```

### Option C: GitHub Pages

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Add builds to gh-pages
git add -f builds/web/*
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Enable in GitHub Settings → Pages
# URL: https://yourusername.github.io/field_trip_fighters
```

### Option D: Any Static Host

The `builds/web/` folder contains just static files. Upload to:
- Vercel
- Cloudflare Pages
- AWS S3
- Firebase Hosting
- Your own server

---

## 🐛 Troubleshooting

### "HTML5 export preset not found"

If you don't see "HTML5" in export presets:

```
1. Project → Export
2. Click "Add..." button
3. Select "HTML5"
4. Configure:
   - Export Path: builds/web/index.html
   - VRAM Texture Compression: Desktop
5. Close
6. Try export again
```

### "Export failed" or errors

```
1. Check you're using Godot 3.1.2 (not newer)
2. Make sure export templates installed
3. Try re-importing project (Project → Reload Current Project)
4. Check console for specific error messages
```

### Files are huge (200+ MB)

This is normal! The game has:
- 5 characters with hundreds of animation frames
- 11 stages with backgrounds
- Sound effects and music
- Combat system assets

Browser will download once and cache.

### Game loads but doesn't start

```
1. Check browser console (F12 → Console)
2. Make sure all 3 files exist (.html, .wasm, .pck)
3. Make sure served from web server (not file://)
4. Try different browser (Chrome works best)
```

### "SharedArrayBuffer not available"

This is a browser security feature. To fix:

**Option 1: Serve with proper headers**
```python
# Use this simple server
python3 -m http.server 8000 --bind 127.0.0.1
```

**Option 2: Add headers (if deploying)**
Add these headers on your server:
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

Netlify does this automatically!

---

## 📦 What Gets Built

**index.html** - Game loader
- Loads WASM and game data
- Shows loading bar
- Handles browser compatibility

**index.wasm** - Compiled game engine
- Godot engine compiled to WebAssembly
- Runs at native speed in browser

**index.pck** - Game assets
- All sprites, sounds, stages
- Character data
- Compressed but still large

---

## ✅ Quick Checklist

Before deploying:

- [ ] Exported with Godot 3.1.2
- [ ] All 3 files present (html, wasm, pck)
- [ ] Tested locally in browser
- [ ] Game loads and shows menu
- [ ] Can select character
- [ ] Can start match
- [ ] Audio works
- [ ] Controls work (keyboard/gamepad)

---

## 🚀 After Building

**Next steps:**

1. **Deploy game files** (builds/web/) to Netlify
2. **Deploy server** (server/) to Render.com
3. **Update game** to connect to your server URL
4. **Test matchmaking** with 2 browser tabs
5. **Share with beta testers!**

See `QUICK_START_BROWSER.md` for deployment instructions.

---

## 💡 Pro Tips

**Faster rebuilds:**
- Only export when making changes
- Keep Godot project open
- Use "Export Project" (not "Export PCK/Zip")

**Smaller file size:**
- Remove unused assets (later)
- Compress audio files
- Optimize sprite sheets

**Better performance:**
- Test on lower-end devices
- Monitor FPS in browser
- Check memory usage

---

## 📞 Need Help?

**Common questions:**

Q: "Which Godot version?"
A: 3.1.2 ONLY! Download from link above.

Q: "How long does export take?"
A: 1-2 minutes for first export, faster after that.

Q: "Can I use Godot 4?"
A: No, this project uses Godot 3.1.2 specific features.

Q: "Files are too big!"
A: Normal for a full fighting game. It's a one-time download.

Q: "Where's the builds folder?"
A: You create it during export! See Step 4 above.

---

**Ready to build?** Follow Method 1 step-by-step! 🎮

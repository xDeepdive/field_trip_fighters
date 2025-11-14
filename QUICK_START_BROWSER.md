# 🚀 Field Trip Fighters - Browser Version Quick Start

## 🎯 What You're Building

A **browser-based fighting game** where players can:
- Play directly in their browser (no downloads!)
- Find matches automatically
- Battle with 5 unique characters
- Earn tokens for playing (coming soon!)

---

## ⚡ Super Quick Deploy (5 Minutes!)

### Step 1: Export the Game (HTML5)

```bash
# In Godot 3.1.2:
1. Project → Export
2. Add "HTML5" preset (if not exists)
3. Export Project
4. Save to: ./builds/web/index.html
```

**You'll get:**
- `index.html` (game loader)
- `index.wasm` (game code)
- `index.pck` (game assets)

### Step 2: Deploy Game Files (FREE!)

**Option A: Netlify (Easiest)**
```bash
1. Go to netlify.com
2. Sign up (free)
3. Drag ./builds/web/ folder onto netlify
4. Done! You get URL like: https://random-name.netlify.app
```

**Option B: GitHub Pages**
```bash
1. Create GitHub repo
2. Push ./builds/web/ to gh-pages branch
3. Enable GitHub Pages in settings
4. URL: https://yourusername.github.io/game
```

### Step 3: Deploy Server (Also FREE!)

```bash
1. Go to render.com
2. Sign up (free)
3. New → Web Service
4. Connect your GitHub repo
5. Root Directory: server
6. Build Command: npm install
7. Start Command: npm start
8. Click "Create Web Service"
```

**Server URL**: `https://your-app.onrender.com`

### Step 4: Connect Game to Server

You'll need to update the game code to point to your server URL.

*(Instructions for this coming in next section)*

---

## 🎮 How It Works

```
Player's Browser → Game (HTML5) → WebSocket → Server → Opponent's Browser
```

**The Flow:**
1. Player opens game in browser
2. Clicks "Find Match"
3. Game connects to WebSocket server
4. Server pairs them with another player
5. Game starts!
6. All inputs relay through server
7. Both players see same game state

---

## 📊 What's Different from Desktop?

| Feature | Desktop (Old) | Browser (New) |
|---------|---------------|---------------|
| **Download** | Required | None! |
| **Platform** | Windows only | Any device with browser |
| **Networking** | P2P (UDP/TCP) | WebSocket relay |
| **Port Forwarding** | Required | Not needed! |
| **Matchmaking** | Manual IP entry | Automatic! |
| **Mobile Support** | No | Yes! (with touch controls) |

---

## 💰 Costs

**For Beta Testing:**
```
Game Hosting:  $0 (Netlify free tier)
Server:        $0 (Render.com free tier)
Total:         $0
```

**After Launch (if needed):**
```
Game CDN:      $0-20/month (Netlify scales automatically)
Server:        $7/month (Render.com Starter)
Total:         $7-27/month for thousands of players
```

---

## 🌐 URLs You'll Have

After deployment:

```
Game URL:    https://fieldtripfighters.netlify.app
Server URL:  https://ftf-server.onrender.com
API Status:  https://ftf-server.onrender.com/health
```

**Share the game URL** - that's all players need!

---

## 🎯 Next Steps

### This Week:
- [ ] Export HTML5 build from Godot
- [ ] Deploy to Netlify
- [ ] Deploy server to Render.com
- [ ] Test with 2 browser tabs

### Next Week:
- [ ] Update game code for WebSocket
- [ ] Add "Find Match" button
- [ ] Test with friends
- [ ] Fix any bugs

### Month 2:
- [ ] Add wallet connection (Phantom/Solflare)
- [ ] Implement points system
- [ ] Test token distribution
- [ ] Launch beta!

---

## 🐛 Common Issues

**"Game not loading in browser"**
- Check browser console for errors
- Make sure all 3 files exported (.html, .wasm, .pck)
- Try different browser (Chrome recommended)

**"Can't connect to server"**
- Check server is running: visit server URL
- Check browser console for WebSocket errors
- Make sure using `wss://` (not `ws://`) for HTTPS sites

**"Match not found"**
- Need at least 2 players online
- Check server status: `https://your-server/`
- Open game in 2 browser tabs to test

---

## 📱 Mobile Support (Bonus!)

Your game can work on mobile phones!

**To add touch controls:**
1. Add virtual buttons in Godot
2. Map touch to keyboard inputs
3. Export same HTML5 build
4. Works on phones/tablets!

**Result**: Players can battle on their phones! 🎮📱

---

## 🚀 Advanced: Auto-Deploy

Want automatic deployment when you push to GitHub?

**Setup:**
1. Create GitHub repo
2. Add secrets: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
3. Push code
4. GitHub Actions builds and deploys automatically!

See `.github/workflows/deploy.yml` for config.

---

## 💡 Pro Tips

1. **Test locally first:**
   ```bash
   # Run local server
   cd server
   npm install
   npm start

   # Open game in browser
   # Point to ws://localhost:8080
   ```

2. **Use browser dev tools:**
   - F12 → Console (see errors)
   - F12 → Network → WS (see WebSocket messages)
   - F12 → Application → Storage (check local data)

3. **Performance:**
   - Game runs at 60 FPS in browser
   - Works great even on older computers
   - Mobile might be 30 FPS (still playable)

4. **Sharing:**
   - Just share the game URL!
   - No install instructions needed
   - Works on Mac, Windows, Linux, mobile

---

## 🎊 You're Ready!

Your browser game is **easier to deploy** and **easier for players** than desktop!

**Players just:**
1. Visit URL
2. Click "Play"
3. Find match
4. Battle!

**No downloads, no setup, no hassle!** 🎮✨

---

## 📞 Need Help?

**Check these first:**
- `BROWSER_MULTIPLAYER_PLAN.md` - Detailed architecture
- `server/README.md` - Server documentation
- Browser console (F12) - Shows errors

**Still stuck?**
- Open an issue on GitHub
- Check server logs on Render.com
- Test with 2 browser tabs locally

---

**Let's build this!** 🚀

Next file to read: `BROWSER_MULTIPLAYER_PLAN.md` for detailed technical info.

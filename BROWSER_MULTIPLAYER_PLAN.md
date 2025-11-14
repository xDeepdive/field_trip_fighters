# Browser-Based Multiplayer Architecture

## 🚨 THE CHALLENGE

**Current System**: Uses TCP/UDP sockets directly
**Browser Limitation**: Browsers CANNOT use raw TCP/UDP sockets (security restriction)

**Solution**: We need to use **WebSocket** instead!

---

## 🏗️ New Architecture

### Option 1: WebSocket Relay Server (RECOMMENDED)

```
Player 1 (Browser) → WebSocket → Server → WebSocket → Player 2 (Browser)
```

**How it works:**
- Players connect to central server via WebSocket
- Server relays inputs between players
- Server validates matches (anti-cheat)
- Server handles matchmaking

**Pros:**
✅ Works in all browsers
✅ No port forwarding needed
✅ Can add matchmaking easily
✅ Server validates matches (prevents cheating)
✅ Perfect for token integration later
✅ Can scale to many players

**Cons:**
❌ Need to run a server (but cheap/easy)
❌ Slightly higher latency than P2P
❌ Server cost (but minimal for beta)

### Option 2: WebRTC P2P (Advanced)

```
Player 1 (Browser) ←→ WebRTC ←→ Player 2 (Browser)
                ↓
        Signaling Server (just for setup)
```

**Pros:**
✅ Lower latency (direct P2P)
✅ Less server bandwidth

**Cons:**
❌ Complex to implement
❌ Still needs signaling server
❌ NAT traversal issues
❌ Harder to prevent cheating
❌ Harder to add matchmaking

---

## 💡 MY RECOMMENDATION: WebSocket Server

For your use case (especially with Solana tokens), **WebSocket relay is best** because:

1. **Token Integration**: Server validates matches before giving tokens
2. **Anti-Cheat**: Server prevents fake match results
3. **Matchmaking**: Can add "Quick Match" button easily
4. **Stats Tracking**: Server stores all match data
5. **Simpler**: Easier to build and maintain

---

## 🛠️ Implementation Plan

### Step 1: Simple Node.js WebSocket Server

```javascript
// server.js - Simple relay server
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const waitingPlayers = [];
const activeMatches = new Map();

server.on('connection', (socket) => {
    console.log('Player connected');

    socket.on('message', (data) => {
        const msg = JSON.parse(data);

        if (msg.type === 'find_match') {
            // Matchmaking
            if (waitingPlayers.length > 0) {
                const opponent = waitingPlayers.shift();
                startMatch(socket, opponent);
            } else {
                waitingPlayers.push(socket);
                socket.send(JSON.stringify({ type: 'waiting' }));
            }
        } else if (msg.type === 'input') {
            // Relay inputs to opponent
            const match = activeMatches.get(socket);
            if (match && match.opponent) {
                match.opponent.send(JSON.stringify(msg));
            }
        }
    });
});

function startMatch(player1, player2) {
    const matchId = generateMatchId();

    activeMatches.set(player1, { opponent: player2, matchId });
    activeMatches.set(player2, { opponent: player1, matchId });

    player1.send(JSON.stringify({ type: 'match_start', playerNumber: 1 }));
    player2.send(JSON.stringify({ type: 'match_start', playerNumber: 2 }));
}

console.log('WebSocket server running on ws://localhost:8080');
```

### Step 2: Update Godot Networking

Replace the current UDP/TCP networking with WebSocket:

```gdscript
# browser_network_manager.gd
extends Node

var ws = null
var connected = false

func _ready():
    # Create WebSocket client
    ws = WebSocketClient.new()
    ws.connect("connection_established", self, "_on_connected")
    ws.connect("data_received", self, "_on_data_received")

func connect_to_server(server_url):
    # Connect to WebSocket server
    var err = ws.connect_to_url(server_url)
    if err != OK:
        print("Failed to connect")

func _on_connected(protocol):
    connected = true
    print("Connected to server!")

func _on_data_received():
    var data = ws.get_peer(1).get_packet().get_string_from_utf8()
    var msg = parse_json(data)

    if msg.type == "match_start":
        emit_signal("match_started", msg.playerNumber)
    elif msg.type == "input":
        emit_signal("opponent_input_received", msg)

func send_input(input_data):
    if connected:
        var msg = {
            "type": "input",
            "frame": input_data.frame,
            "buttons": input_data.buttons
        }
        ws.get_peer(1).put_packet(to_json(msg).to_utf8())

func _process(delta):
    if ws:
        ws.poll()
```

### Step 3: Minimal Changes to Existing Code

Good news! Most of your game code stays the same:
- Character controllers ✅ No changes
- Combat system ✅ No changes
- Animation system ✅ No changes
- UI ✅ Minor changes

**Only need to change:**
- `networkingManager.gd` - Use WebSocket instead of UDP/TCP
- `online_input_manager.gd` - Connect to WebSocket server
- `OnlineLobby.gd` - Remove IP input, add "Find Match" button

---

## 🌐 Hosting Options

### Free Options (For Beta):

**1. Glitch.com**
```bash
# Free Node.js hosting
# Automatic deployment
# Perfect for testing
# URL: your-game.glitch.me
```

**2. Render.com**
```bash
# Free tier available
# Auto-deploy from GitHub
# WebSocket support
# Good performance
```

**3. Railway.app**
```bash
# $5/month free credit
# Easy WebSocket setup
# Scales automatically
```

### For Game Files:

**1. Netlify** (BEST for static HTML5 game)
```bash
# Free tier: Perfect!
# Auto-deploy from GitHub
# CDN worldwide
# Custom domain support
# URL: your-game.netlify.app
```

**2. Vercel**
```bash
# Similar to Netlify
# Also free for static sites
# Great performance
```

**3. GitHub Pages**
```bash
# Completely free
# URL: yourusername.github.io/game
# Easy setup
```

---

## 📦 Full Stack Setup

### Architecture:

```
┌─────────────────────────────────────────┐
│  Player's Browser                        │
│  ┌────────────────────────────────┐    │
│  │  HTML5 Game (Godot WebAssembly)│    │
│  │  - Character select             │    │
│  │  - Game rendering               │    │
│  │  - Input handling               │    │
│  └────────────────────────────────┘    │
│            ↕ WebSocket                   │
└─────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│  WebSocket Server (Node.js)             │
│  - Matchmaking                           │
│  - Input relay                           │
│  - Match validation                      │
│  - Stats tracking                        │
│                                          │
│  Hosted on: Render/Railway/Glitch       │
└─────────────────────────────────────────┘
                   │
                   ↓ (Later: Blockchain)
┌─────────────────────────────────────────┐
│  Solana Blockchain                       │
│  - Token distribution                    │
│  - NFT minting                           │
│  - Wallet integration                    │
└─────────────────────────────────────────┘
```

### Deployment URLs:

```
Game URL: https://fieldtripfighters.netlify.app
Server URL: wss://ftf-server.render.com

Players just visit the game URL and click "Play"!
```

---

## ⚡ Quick Start Guide

### 1. Export HTML5 from Godot

```
1. Open Godot 3.1.2
2. Project → Export
3. Add "HTML5" preset
4. Export to ./builds/web/
5. You get: index.html + .wasm + .pck files
```

### 2. Deploy Game Files

```bash
# Option A: Drag & drop to Netlify
1. Go to netlify.com
2. Drag ./builds/web/ folder
3. Done! Get URL like: random-name-123.netlify.app

# Option B: GitHub + Netlify (Auto-deploy)
1. Push ./builds/web/ to GitHub
2. Connect Netlify to repo
3. Auto-deploys on every commit
```

### 3. Set Up Server

```bash
# Create server.js with code above
# Deploy to Render.com:
1. Create account on render.com
2. New → Web Service
3. Connect GitHub repo
4. Select Node.js
5. It auto-detects and deploys
6. Get URL like: https://your-game-server.onrender.com
```

### 4. Connect Game to Server

```gdscript
# In OnlineLobby.gd or network manager
const SERVER_URL = "wss://your-game-server.onrender.com"

func _ready():
    connect_to_server(SERVER_URL)
```

### 5. Test!

```
1. Open game URL in two browser tabs
2. Click "Find Match" in both
3. Game auto-connects them
4. Play!
```

---

## 🎯 Timeline

### Week 1: Basic Browser Version
- [ ] Export to HTML5
- [ ] Test locally (works offline)
- [ ] Fix any browser-specific bugs
- [ ] Deploy to Netlify

### Week 2: Simple WebSocket Server
- [ ] Create basic relay server
- [ ] Deploy to Render.com
- [ ] Update game to use WebSocket
- [ ] Test 1v1 matches online

### Week 3: Matchmaking
- [ ] Add "Find Match" button
- [ ] Auto-pair players
- [ ] Add waiting room UI
- [ ] Test with beta testers

### Week 4: Polish & Testing
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Add reconnection
- [ ] Prepare for token integration

---

## 💰 Costs

**For Beta (Free Tier is Enough!):**
```
Game Hosting (Netlify): $0/month
Server (Render.com):    $0/month (free tier)
Domain (optional):      $10/year

Total: $0-10 for beta testing!
```

**After Launch (Paid but Cheap):**
```
Game Hosting (Netlify): $0-20/month
Server (Render.com):    $7/month (hobby tier)
or AWS/DigitalOcean:    $5-20/month
Domain:                 $10/year

Total: ~$15-30/month for live game
```

---

## 🚀 Next Steps

Would you like me to:

1. **Create the WebSocket server code** (full implementation)?
2. **Update the game's networking layer** for WebSocket?
3. **Set up auto-deployment** (GitHub Actions)?
4. **Create a simple matchmaking UI**?
5. **All of the above**?

Let me know and I'll build it! 🎮

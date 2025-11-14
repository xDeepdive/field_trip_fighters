# Field Trip Fighters - WebSocket Server

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run server
npm start

# Or with auto-reload during development
npm run dev
```

Server will start on `http://localhost:8080`

WebSocket endpoint: `ws://localhost:8080`

### Test the Server

```bash
# Check if server is running
curl http://localhost:8080

# Check health
curl http://localhost:8080/health
```

## Deployment

### Option 1: Render.com (Recommended)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New → Web Service
4. Connect GitHub repo
5. Settings:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
6. Deploy!

Your server URL will be: `https://your-app.onrender.com`

### Option 2: Railway.app

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Select repo
5. Railway auto-detects Node.js and deploys
6. Done!

### Option 3: Heroku

```bash
# Install Heroku CLI
heroku create ftf-server

# Deploy
git push heroku main

# Your server: https://ftf-server.herokuapp.com
```

### Option 4: DigitalOcean/AWS

```bash
# SSH into server
ssh user@your-server-ip

# Clone repo
git clone your-repo
cd field_trip_fighters/server

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Install PM2 (process manager)
sudo npm install -g pm2

# Start server with PM2
pm2 start server.js --name ftf-server

# Make it run on startup
pm2 startup
pm2 save
```

## Environment Variables

Set these on your hosting platform:

```
PORT=8080                    # Server port (auto-set by most hosts)
NODE_ENV=production          # Production mode
```

## API Endpoints

### HTTP Endpoints

- `GET /` - Server status and stats
- `GET /health` - Health check

### WebSocket Messages

#### Client → Server

**Find Match:**
```json
{
  "type": "find_match",
  "character": "belt"
}
```

**Cancel Matchmaking:**
```json
{
  "type": "cancel_matchmaking"
}
```

**Send Input:**
```json
{
  "type": "input",
  "frame": 120,
  "buttons": 5,
  "directional": 2
}
```

**Match Loaded:**
```json
{
  "type": "match_loaded"
}
```

**Match Result:**
```json
{
  "type": "match_result",
  "winner": 1,
  "reason": "ko"
}
```

#### Server → Client

**Connected:**
```json
{
  "type": "connected",
  "playerId": "abc123",
  "serverVersion": "0.53.1"
}
```

**Waiting for Opponent:**
```json
{
  "type": "waiting",
  "position": 1
}
```

**Match Found:**
```json
{
  "type": "match_found",
  "matchId": "xyz789",
  "playerNumber": 1,
  "opponent": {
    "id": "def456",
    "character": "glove"
  }
}
```

**Match Start:**
```json
{
  "type": "match_start",
  "timestamp": 1699999999999
}
```

**Opponent Input:**
```json
{
  "type": "opponent_input",
  "frame": 120,
  "buttons": 3,
  "directional": 6
}
```

**Opponent Disconnected:**
```json
{
  "type": "opponent_disconnected"
}
```

## Monitoring

### Check Server Logs

**Render.com:**
- Go to your service dashboard
- Click "Logs" tab

**Railway:**
- Go to project
- Click "Deployments"
- View logs

**PM2:**
```bash
pm2 logs ftf-server
```

### Server Stats

Visit `http://your-server-url/` to see:
- Active players count
- Active matches count
- Players in matchmaking queue

## Scaling

### For 100-1000 concurrent players:
- Use Render.com Professional ($7/month)
- Or DigitalOcean Droplet ($6/month)
- Single server is enough

### For 1000-10000 concurrent players:
- Use load balancer
- Multiple server instances
- Redis for shared state
- Estimated cost: $50-100/month

### For 10000+ concurrent players:
- Kubernetes cluster
- Auto-scaling
- Database for match history
- CDN for game files
- Estimated cost: $200-500/month

## Security (For Production)

Add these features before launch:

1. **Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 60000, max: 100 }));
```

2. **CORS:**
```javascript
const cors = require('cors');
app.use(cors({ origin: 'https://your-game.netlify.app' }));
```

3. **Message Validation:**
```javascript
// Validate all incoming messages
// Prevent cheating/exploits
```

4. **Authentication (Optional):**
```javascript
// JWT tokens
// Wallet signatures for token integration
```

## Database Integration (For Token System)

When ready to add token rewards:

```javascript
// Example with MongoDB
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    matchId: String,
    player1: String,
    player2: String,
    winner: Number,
    duration: Number,
    tokensEarned: Number,
    timestamp: Date
});

// Save match results
// Trigger token distribution
```

## Troubleshooting

**"Cannot connect to server"**
- Check if server is running: `curl http://your-server/health`
- Check firewall settings
- Verify WebSocket port is open

**"Players can't find matches"**
- Check server logs
- Verify both players connected
- Check matchmaking queue: `curl http://your-server/`

**"High latency"**
- Use server closer to players geographically
- Consider using CDN
- Check server CPU/memory usage

## Next Steps

1. Deploy this server to Render.com
2. Get your server URL
3. Update Godot game to connect to this URL
4. Test matchmaking!

## Support

For issues, check:
- Server logs
- Client browser console
- Network tab in browser DevTools

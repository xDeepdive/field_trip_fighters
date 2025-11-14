/**
 * Field Trip Fighters - WebSocket Relay Server
 *
 * This server handles:
 * - Player matchmaking
 * - Input relay between players
 * - Match validation
 * - Stats tracking (ready for blockchain integration)
 */

const WebSocket = require('ws');
const express = require('express');
const http = require('http');

// Configuration
const PORT = process.env.PORT || 8080;
const MAX_PLAYERS_PER_MATCH = 2;

// Express app for health checks
const app = express();
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        game: 'Field Trip Fighters',
        version: '0.53.1 Beta',
        activePlayers: players.size,
        activeMatches: matches.size,
        waitingPlayers: waitingQueue.length
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Data structures
const players = new Map(); // socket -> playerInfo
const matches = new Map(); // matchId -> matchInfo
const waitingQueue = []; // Players waiting for match

// Player info structure
class PlayerInfo {
    constructor(socket) {
        this.socket = socket;
        this.id = generateId();
        this.matchId = null;
        this.character = null;
        this.playerNumber = null;
        this.connected = true;
        this.lastPing = Date.now();
    }
}

// Match info structure
class MatchInfo {
    constructor(player1, player2) {
        this.id = generateId();
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = Date.now();
        this.frameCount = 0;
        this.state = 'loading'; // loading, playing, finished
        this.winner = null;
    }

    getOpponent(player) {
        return player === this.player1 ? this.player2 : this.player1;
    }
}

// WebSocket connection handler
wss.on('connection', (socket) => {
    console.log('New player connected');

    const player = new PlayerInfo(socket);
    players.set(socket, player);

    // Send welcome message
    sendToPlayer(player, {
        type: 'connected',
        playerId: player.id,
        serverVersion: '0.53.1'
    });

    // Message handler
    socket.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());
            handleMessage(player, msg);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Connection close handler
    socket.on('close', () => {
        handleDisconnect(player);
    });

    // Error handler
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Ping handler (keep connection alive)
    socket.on('pong', () => {
        player.lastPing = Date.now();
    });
});

// Message router
function handleMessage(player, msg) {
    switch (msg.type) {
        case 'find_match':
            handleFindMatch(player, msg);
            break;
        case 'cancel_matchmaking':
            handleCancelMatchmaking(player);
            break;
        case 'input':
            handleInput(player, msg);
            break;
        case 'match_loaded':
            handleMatchLoaded(player);
            break;
        case 'match_result':
            handleMatchResult(player, msg);
            break;
        case 'ping':
            handlePing(player);
            break;
        default:
            console.log('Unknown message type:', msg.type);
    }
}

// Find match handler
function handleFindMatch(player, msg) {
    console.log(`Player ${player.id} looking for match...`);

    // Store player preferences
    player.character = msg.character || 'random';

    // Check if already in queue
    if (waitingQueue.includes(player)) {
        return;
    }

    // Try to match with waiting player
    if (waitingQueue.length > 0) {
        const opponent = waitingQueue.shift();

        // Create match
        const match = new MatchInfo(player, opponent);
        matches.set(match.id, match);

        player.matchId = match.id;
        player.playerNumber = 1;
        opponent.matchId = match.id;
        opponent.playerNumber = 2;

        console.log(`Match created: ${match.id}`);
        console.log(`  Player 1: ${player.id} (${player.character})`);
        console.log(`  Player 2: ${opponent.id} (${opponent.character})`);

        // Notify both players
        sendToPlayer(player, {
            type: 'match_found',
            matchId: match.id,
            playerNumber: 1,
            opponent: {
                id: opponent.id,
                character: opponent.character
            }
        });

        sendToPlayer(opponent, {
            type: 'match_found',
            matchId: match.id,
            playerNumber: 2,
            opponent: {
                id: player.id,
                character: player.character
            }
        });

    } else {
        // Add to waiting queue
        waitingQueue.push(player);
        sendToPlayer(player, {
            type: 'waiting',
            position: waitingQueue.length
        });
    }
}

// Cancel matchmaking
function handleCancelMatchmaking(player) {
    const index = waitingQueue.indexOf(player);
    if (index > -1) {
        waitingQueue.splice(index, 1);
        sendToPlayer(player, {
            type: 'matchmaking_cancelled'
        });
    }
}

// Input relay
function handleInput(player, msg) {
    if (!player.matchId) return;

    const match = matches.get(player.matchId);
    if (!match) return;

    const opponent = match.getOpponent(player);

    // Relay input to opponent
    sendToPlayer(opponent, {
        type: 'opponent_input',
        frame: msg.frame,
        buttons: msg.buttons,
        directional: msg.directional
    });

    // Update frame count
    match.frameCount = Math.max(match.frameCount, msg.frame || 0);
}

// Match loaded (both players ready)
function handleMatchLoaded(player) {
    if (!player.matchId) return;

    const match = matches.get(player.matchId);
    if (!match) return;

    console.log(`Player ${player.playerNumber} loaded`);

    // Check if both players loaded
    if (match.state === 'loading') {
        match.state = 'playing';

        // Start match for both players
        sendToPlayer(match.player1, {
            type: 'match_start',
            timestamp: Date.now()
        });

        sendToPlayer(match.player2, {
            type: 'match_start',
            timestamp: Date.now()
        });
    }
}

// Match result (for stats tracking)
function handleMatchResult(player, msg) {
    if (!player.matchId) return;

    const match = matches.get(player.matchId);
    if (!match) return;

    console.log(`Match ${match.id} result:`, msg);

    match.state = 'finished';
    match.winner = msg.winner;
    match.endTime = Date.now();
    match.duration = match.endTime - match.startTime;

    // TODO: Save to database for blockchain integration
    // This is where you'll:
    // 1. Validate the match
    // 2. Calculate points earned
    // 3. Trigger token distribution

    console.log(`Match finished: Winner P${msg.winner}, Duration: ${match.duration}ms`);
}

// Ping handler
function handlePing(player) {
    sendToPlayer(player, {
        type: 'pong',
        timestamp: Date.now()
    });
}

// Disconnect handler
function handleDisconnect(player) {
    console.log(`Player ${player.id} disconnected`);

    // Remove from waiting queue
    const queueIndex = waitingQueue.indexOf(player);
    if (queueIndex > -1) {
        waitingQueue.splice(queueIndex, 1);
    }

    // Handle active match
    if (player.matchId) {
        const match = matches.get(player.matchId);
        if (match) {
            const opponent = match.getOpponent(player);

            // Notify opponent
            sendToPlayer(opponent, {
                type: 'opponent_disconnected'
            });

            // Clean up match
            matches.delete(player.matchId);
        }
    }

    // Remove player
    players.delete(player.socket);
}

// Helper: Send message to player
function sendToPlayer(player, msg) {
    if (player && player.socket && player.socket.readyState === WebSocket.OPEN) {
        player.socket.send(JSON.stringify(msg));
    }
}

// Helper: Generate unique ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
}

// Heartbeat to detect dead connections
const heartbeatInterval = setInterval(() => {
    players.forEach((player, socket) => {
        if (!player.connected) {
            socket.terminate();
            return;
        }

        player.connected = false;
        socket.ping();
    });
}, 30000); // Every 30 seconds

wss.on('close', () => {
    clearInterval(heartbeatInterval);
});

// Start server
server.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════');
    console.log('  Field Trip Fighters - Multiplayer Server');
    console.log('═══════════════════════════════════════════════');
    console.log(`  Status: ONLINE`);
    console.log(`  Port: ${PORT}`);
    console.log(`  WebSocket: ws://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/health`);
    console.log('═══════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

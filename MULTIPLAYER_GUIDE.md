# Field Trip Fighters - Multiplayer Beta Guide

## 🎮 How to Play Online

### Quick Start

**For the HOST (Player hosting the game):**
1. Open Field Trip Fighters
2. Main Menu → Select "Host"
3. Choose your character and proficiencies
4. Select a stage
5. **Share your IP address with your opponent**
   - Windows: Open Command Prompt and type `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)
6. Wait for opponent to connect
7. Game starts automatically when connected!

**For the CLIENT (Player joining):**
1. Open Field Trip Fighters
2. Main Menu → Select "Connect to Host"
3. Choose your character and proficiencies
4. **Enter the host's IP address**
5. Click "Connect"
6. Game starts when connection established!

---

## 📡 Network Requirements

### Ports Used:
- **TCP Port**: 7777
- **UDP Port**: 7778

### Port Forwarding (For Host):
If playing over the internet (not on same Wi-Fi), the host needs to:

1. **Find your router's IP**:
   - Usually 192.168.1.1 or 192.168.0.1
   - Type this in web browser

2. **Login to router** (check router manual for password)

3. **Port Forward**:
   - Forward TCP port 7777 to your computer
   - Forward UDP port 7778 to your computer
   - Protocol: Both TCP and UDP

4. **Find your PUBLIC IP**:
   - Google "what is my ip"
   - Share THIS IP with your opponent (not your local 192.168.x.x)

### Firewall Settings:
Make sure Windows Firewall allows the game:
- Windows Security → Firewall & Network Protection
- Allow an app through firewall
- Add "Field Trip Fighters" executable
- Check both Private and Public networks

---

## 🌐 Connection Types

### LAN (Same Wi-Fi Network) - EASIEST
✅ No port forwarding needed
✅ Low latency
✅ Most reliable

**How to connect:**
- Host shares their LOCAL IP (192.168.x.x)
- Both players on same Wi-Fi
- Just works!

### Internet (Different Networks)
⚠️ Requires port forwarding
⚠️ Higher latency
⚠️ May have firewall issues

**How to connect:**
- Host forwards ports (see above)
- Host shares PUBLIC IP (not 192.168.x.x)
- Client enters public IP

---

## ⚡ Input Delay

The game uses **input delay netcode** to handle latency:

- **2 frames base delay** (minimum)
- Adjusts based on ping
- Higher ping = more delay (but game stays synchronized)

**For best experience:**
- Stable internet connection
- Low ping to opponent (<100ms ideal)
- Wired ethernet connection (not Wi-Fi)

---

## 🐛 Troubleshooting

### "Connection timed out"
- **Check firewall**: Make sure game is allowed
- **Check ports**: Verify ports 7777 and 7778 are open
- **Check IP**: Make sure you entered correct IP
- **Try LAN first**: Test on same Wi-Fi before internet

### "Failed to connect"
- **Host**: Check port forwarding settings
- **Client**: Verify you have correct IP address
- **Both**: Restart routers/game if issues persist

### "Connection lost"
- **Check internet**: Make sure both players online
- **Reconnect**: Click "Reconnect" button to try again
- **Restart**: If reconnect fails, restart match

### Game desyncs (players see different things)
- This is rare but can happen
- Game will attempt auto-recovery
- If it fails, you'll need to restart match

---

## 🎯 Beta Testing Tips

### What to test:
✅ All 5 characters work online
✅ All stages work correctly
✅ Combos connect properly
✅ No desyncs during matches
✅ Reconnection works after disconnect
✅ Input delay feels reasonable

### Report bugs:
When you find issues, please note:
- What character you were playing
- What character opponent was playing
- What stage
- What happened (describe the bug)
- Can you reproduce it?

---

## 🏆 Characters Available

1. **Belt** - Wrestling grappler with anger mode
2. **Glove** - Baseball fighter with projectile
3. **Hat** - Ball cap throwing specialist
4. **Microphone** - Opera/Rap stance switcher
5. **Whistle** - Pet summoner

Each character has unique mechanics - experiment to find your favorite!

---

## 💡 Pro Tips

- **Training Mode**: Practice combos and mechanics before going online
- **Proficiency System**: Choose proficiencies that match your playstyle
- **Frame Data**: Study your character's frame data in training mode
- **Netplay Etiquette**:
  - Don't rage quit (ruins stats)
  - Say "GG" after matches
  - Rematch to improve
  - Help new players learn

---

## 🚀 Future Features (Post-Beta)

- Matchmaking system (no IP addresses needed!)
- Ranked mode
- Replays
- Spectator mode
- Tournament system
- **Blockchain rewards** (earn tokens for playing!)

---

**Enjoy the beta and thanks for testing!** 🎮✨

Report issues to: [Your Discord/Email]

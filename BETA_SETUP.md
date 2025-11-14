# Field Trip Fighters - Beta Build Setup

## 🎯 Overview

This is the multiplayer beta version of Field Trip Fighters, prepared for testing before the Solana token integration.

**Version**: 0.53.1 Beta
**Characters**: 5 playable fighters
**Online Multiplayer**: ✅ Fully functional
**Blockchain**: 🔜 Coming after beta testing

---

## 🚀 Quick Start for Beta Testers

### Option 1: Download Pre-Built Game (Easiest)

1. Download `FieldTripFighters_Beta_Multiplayer.exe`
2. Extract to a folder
3. Run the .exe file
4. See `MULTIPLAYER_GUIDE.md` for how to play online

### Option 2: Build from Source

**Requirements:**
- Godot Engine 3.1.2 (specific version required!)
- Download: https://www.mudlakebiodiversity.ca/ftf/Godot_v3.1.2-stable_win64.exe

**Steps:**
1. Download Godot 3.1.2
2. Clone this repository
3. Open Godot → Import Project
4. Select `project.godot`
5. Wait for assets to import (2-5 minutes first time)
6. Press F5 to run

---

## 📦 Building the Game

### Using Godot Editor:

1. Open project in Godot 3.1.2
2. Project → Export
3. Select "Windows Desktop"
4. Click "Export Project"
5. Choose location and export

The game will be exported to: `./builds/FieldTripFighters_Beta_Multiplayer.exe`

### What Gets Built:

```
FieldTripFighters_Beta_Multiplayer.exe  (Main executable)
FieldTripFighters_Beta_Multiplayer.pck  (Game data)
```

**Note**: Both files must stay together!

---

## 🎮 What's Included in Beta

### Characters (5):
1. ✅ **Belt** - Wrestling grappler with anger mechanic
2. ✅ **Glove** - Baseball fighter with projectile management
3. ✅ **Hat** - Ball cap throwing and retrieval
4. ✅ **Microphone** - Opera/Rap stance switching
5. ✅ **Whistle** - Pet summoning system

### Game Modes:
- ✅ **Local VS** - Two players on same computer
- ✅ **Online VS** - Two players over internet
- ✅ **Training Mode** - Practice combos and mechanics
- ✅ **VS CPU** - Fight against AI

### Stages (11):
- Theater, Art Museum, Farm, Haunted Mansion
- Kayaking, Mountain Climbing, Observatory
- Radio Tower, Snow Carnival, Bridge, Dojo

### Features:
- ✅ Proficiency system (character customization)
- ✅ Combo system (magic series, reverse beat)
- ✅ Advanced mechanics (ripost, tech, push block, ability cancel)
- ✅ Replay system
- ✅ Frame data display in training mode
- ✅ Multiple skins per character

---

## 🔧 Technical Details

### Netcode:
- **Type**: Input delay netcode
- **Base delay**: 2 frames
- **Ports**: TCP 7777, UDP 7778
- **Connection**: Direct peer-to-peer
- **Desync detection**: Automatic with recovery

### Performance:
- **Fixed 60 FPS** (required for competitive play)
- **Input buffer**: 7 frames
- **Deterministic physics** (same on all machines)

### System Requirements:
- **OS**: Windows 10 or later
- **CPU**: 4-core processor (minimum)
- **RAM**: 4 GB
- **Graphics**: Any GPU with OpenGL support
- **Network**: Stable internet for online play

---

## 📊 What to Test

### Priority Testing:

1. **Character Balance**:
   - Play all 5 characters
   - Report overpowered/underpowered characters
   - Test all special moves and combos

2. **Online Multiplayer**:
   - Test LAN connections
   - Test internet connections
   - Report connection issues
   - Note any desyncs

3. **Bugs**:
   - Visual glitches
   - Gameplay bugs
   - Crashes
   - Performance issues

4. **Quality of Life**:
   - UI clarity
   - Controls responsiveness
   - Menu navigation
   - Tutorial/learning curve

### Reporting Format:

```
**Character**: [Which character]
**Stage**: [Which stage]
**Issue**: [Description]
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. etc.

**Expected**: What should happen
**Actual**: What actually happened
```

---

## 🎯 Beta Testing Roadmap

### Phase 1: Current Beta (Multiplayer Only)
- ✅ 5 playable characters
- ✅ Online multiplayer working
- ✅ Basic game mechanics tested
- 🎯 **Your feedback here!**

### Phase 2: Blockchain Integration (Next)
- Add Solana wallet connection
- Implement points system
- Add match validation
- Token reward system

### Phase 3: Full Launch
- Matchmaking server
- Ranked mode
- Tournaments
- Token economy live
- NFT character skins

---

## 📝 Known Issues

### Current Limitations:

1. **No Matchmaking**: Players must manually share IPs
2. **Port Forwarding Required**: Host needs to forward ports for internet play
3. **No Reconnection**: If connection drops, must restart match
4. **Limited to 1v1**: No spectators or lobbies

### These will be fixed in next version!

---

## 💬 Contact & Support

**For Beta Testing:**
- Discord: [Your Discord]
- Email: [Your Email]
- GitHub Issues: [Your Repo]

**For Bug Reports:**
Please include:
- Screenshots/videos if possible
- Your system specs
- Network setup (LAN vs internet)
- Steps to reproduce

---

## 🙏 Thank You!

Thanks for being an early beta tester! Your feedback will help make this game amazing before the token launch.

**Play hard, break things, and let us know what you find!** 🎮🔥

---

## 📋 Checklist for Testers

Before reporting "it doesn't work", please check:

- [ ] Using Godot 3.1.2 (not 3.2, not 4.0)
- [ ] All files imported correctly
- [ ] Firewall allows the game
- [ ] Ports 7777-7778 are open (for host)
- [ ] Using correct IP address
- [ ] Both players on stable internet
- [ ] Read `MULTIPLAYER_GUIDE.md`

If all checked and still issues, then please report!

---

**Version**: 0.53.1 Beta
**Last Updated**: 2025-11-14
**Build**: Multiplayer Beta - Pre-Token Launch

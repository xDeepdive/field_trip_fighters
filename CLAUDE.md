# Field Trip Fighters - AI Assistant Development Guide

## Project Overview

**Field Trip Fighters** is a sophisticated 2D fighting game built with Godot Engine 3.1.2. This is a frame-perfect, competitive fighting game featuring 6 unique characters, comprehensive combo systems, proficiency-based character customization, and training mode with frame data display.

**Game Version**: 0.53.1
**Engine**: Godot 3.1.2
**Language**: GDScript
**Platform**: Windows 10 (minimum 4-core CPU, 4GB RAM)
**YouTube Channel**: https://www.youtube.com/@fieldtripfighters4647

### Key Features
- 6 playable characters with unique mechanics
- 11+ stages with interactive elements
- Proficiency system (RPG-like character customization)
- Training mode with extensive frame data
- Replay system
- AI/CPU opponents with machine learning
- Combo system (magic series, reverse beat, proration)
- Advanced mechanics (ripost/parry, tech, push block, ability canceling)
- Fixed 60 FPS for competitive play determinism

---

## Technology Stack

### Core Technologies
- **Godot Engine 3.1.2** (stable)
- **GDScript** (Python-like scripting language for Godot)
- **Scene system** (.tscn files - Godot's node composition format)
- **Resource system** (.tres files - serialized Godot resources)

### Development Environment
- **Godot Editor** required for scene editing
- **Version Control**: Git
- **No external build tools** - Godot handles compilation

### System Requirements
- 60 FPS forced (`settings/fps/force_fps=60` in project.godot)
- Fixed delta time for determinism: `0.016667` seconds per frame
- Input buffer: 7 frames
- Window stretch mode: 2D with aspect keep

---

## Codebase Architecture

### Architectural Patterns

#### 1. Component-Based Composition
Players are assembled from multiple specialized components:
```
PlayerController (brain/orchestrator)
├── ActionAnimationManager (attack logic)
│   ├── SpriteAnimationManager (visual sprite handling)
│   └── MovementAnimationManager (physics/movement)
├── CollisionHandler (hitbox/hurtbox detection)
├── PlayerState (statistics tracking)
├── input_manager (input buffering/parsing)
└── Various handlers (ripost, guard, grab, tech, etc.)
```

#### 2. Manager Pattern
Each major system has a dedicated manager:
- **ActionAnimationManager**: Coordinates attack animations
- **MovementAnimationManager**: Handles physics and movement
- **SpriteAnimationManager**: Visual sprite frame management
- **TrainingModeManager**: Training mode logic

#### 3. Signal-Driven Communication
Extensive use of Godot signals for decoupled event handling:
```gdscript
# Example signals in PlayerController
signal player_was_hit
signal ripost_attempted
signal combo_level_up
signal ability_cancel
```

#### 4. Inheritance Hierarchy
```
PlayerController.gd (base class - 338KB!)
├── BeltController.gd (angry mode mechanic)
├── GloveController.gd (baseball projectile management)
├── HatController.gd (ball cap throwing)
├── MicController.gd (opera/rap stance switching)
└── WhistleController.gd (pet summoning)
```

### Two-Layer Animation System

**Visual Layer**: `SpriteAnimation` → `SpriteFrame` objects
- Visual representation, sprite changes
- Collision areas (hitboxes/hurtboxes) per frame
- Sound effects, particle effects

**Physics Layer**: `MovementAnimation` → `ComplexMovement` objects
- Velocity, acceleration, gravity
- Bounce physics, wall collisions
- Movement curves and trajectories

Both layers are **synchronized** through manager classes.

---

## Directory Structure

```
field_trip_fighters/
├── Root Level                      # Core game systems, entry points
│   ├── project.godot              # Godot project configuration
│   ├── root.tscn / root.gd        # Main game coordinator (entry point)
│   ├── stage.tscn / stage.gd      # Match coordinator
│   ├── Globals.gd                 # Autoload singleton (enums, constants)
│   ├── PlayerController.gd        # Base player class (massive: 338KB!)
│   └── [100+ core .gd/.tscn files]
│
├── fighters/                       # Character-specific implementations
│   ├── {character}.tscn           # Character scenes (1-2MB each!)
│   ├── {Character}Controller.gd   # Character-specific logic
│   ├── New{Character}ActionAnimationManager.gd  # Attack definitions
│   ├── main-menu-idle-animations/ # Character select animations
│   ├── belt/                      # Belt character assets
│   └── sprites/                   # Shared fighter sprites
│
├── stages/                         # Stage scenes and logic
│   ├── art-museum.tscn
│   ├── mountain-climbing/         # Stage-specific assets
│   ├── radio-tower/
│   └── loading-screen-bgds/       # Loading screen backgrounds
│
├── interface/                      # All UI/HUD components
│   ├── ability-resource/          # Ability bar UI
│   ├── character-select/          # Character selection
│   ├── main-menu/                 # Main menu screens
│   ├── new-combo-list/            # Combo display
│   ├── new-prof-select/           # Proficiency selection UI
│   ├── replays-menu/              # Replay browser
│   ├── settings-menu/             # Settings screens
│   ├── stage/                     # In-match HUD
│   ├── stats-menu/                # Statistics
│   ├── training/                  # Training mode UI
│   └── victory-info/              # Victory screen
│
├── ai/                             # AI system
│   ├── data/                      # Character-specific AI training data
│   └── test/                      # AI testing scripts
│
├── assets/                         # Art assets (organized by type)
│   ├── fighters/                  # Character sprites
│   │   ├── belt/, glove/, hat/
│   │   ├── microphone/, whistle/
│   │   └── ken/                   # Reference character
│   ├── common_collision_areas/    # Shared hitbox/hurtbox shapes
│   ├── interfaces/                # UI assets
│   └── bus/                       # Stage backgrounds
│
├── projectiles/                    # Projectile controllers/scenes
├── particles/                      # Visual effects and particle systems
├── music/                          # Audio files
├── fonts/                          # Font resources
└── tempSpriteSFX/                 # Temporary sprite effects
```

---

## Key Systems and Components

### 1. Combat System

**Core File**: `PlayerController.gd` (338,941 bytes)

**Major Subsystems**:
- **Ripost System** (`RipostHandler.gd`, `NewRipostHandler.gd`, `NewCounterRipostHandler.gd`)
  - Parry/counter mechanics with frame-perfect windows
  - Counter-ripost can interrupt ripost (6 frame window)
  - Auto-ripost option for defensive play

- **Combo System** (`ComboHandler.gd`)
  - Magic series combo validation
  - Reverse beat support
  - Combo level tracking (A → B → C)
  - Stale move negation

- **Guard/Block System** (`guardHandler.gd`)
  - High/low blocking with correct/incorrect block states
  - Perfect block (frame 1 block)
  - Guard break mechanics
  - Guard chip damage and regeneration

- **Grab System** (`grabHandler.gd`)
  - Throw mechanics with cooldown
  - Air grab support (character-dependent)
  - Counter-grab interactions

- **Tech System** (`TechHandler.gd`)
  - Wall/ceiling/floor tech options
  - Tech window timing
  - DI (Directional Influence) during tech

- **Ability Bar System** (`abilityBarLockHandler.gd`)
  - Resource meter for special actions
  - Ability canceling costs
  - Bar gain from damage taken/dealt

- **Damage Proration** (`hitstunProration.gd`)
  - Combo scaling based on combo length
  - Different scaling for light/medium/heavy attacks
  - Ability cancel affects proration

### 2. Input System

**Core File**: `input_manager.gd`

**Features**:
- **7-frame input buffer** (`INPUT_BUFFER_SIZE = 7`)
- **Button bitmap system** using bitwise operations for efficient storage
- **140+ command types** including:
  - Directional inputs (8-way + neutral)
  - Button combinations (A, B, X, Y, bumpers, triggers)
  - Special commands (236 motion, 623 motion, etc.)
  - Double-tap detection (10 frame window)
  - Charge moves
- **Multiple input sources**:
  - Keyboard (P1: QWER + arrows, P2: UIOP + YGHJ)
  - Gamepad (supports both P1 and P2 controllers)
  - Replay input (`ReplayInputManager.gd`)
  - Network input
  - AI input (`NPCInputManager.gd`)

### 3. Character System

**Character Roster**:
1. **Ken** - Reference Street Fighter-style character
2. **Glove** - Baseball theme, projectile management (one ball limit)
3. **Belt** - Wrestling theme, anger mechanic (4s duration, super armor)
4. **Microphone** - Opera/Rap stance switching
5. **Hat** - Ball cap throwing with retrieval mechanics
6. **Whistle** - Pet summoning system

**Character Implementation Pattern**:
Each character has:
- `{character}.tscn` (1-2MB) - Complete character scene
- `{Character}Controller.gd` - Unique mechanic implementation
- `New{Character}ActionAnimationManager.gd` (80-90KB) - Attack definitions
- Asset folder in `assets/fighters/{character}/` with 60+ animation subfolders

**Common Overrides**:
```gdscript
func init(sprite, collisionAreas, attackSFXs, bodyBox, activeNodes)
    # Initialize character-specific components

func restart_hook()
    # Reset to match start state

func _on_sprite_animation_played(spriteAnimation)
    # React to animation events

func trainingModeEnterCharDependentState(params)
    # Training mode special state entry
```

### 4. Stage System

**Core Files**: `stage.gd` + `stage.tscn`

**Features**:
- Player spawn points
- Camera boundaries (dynamic stage boundaries)
- Match timer
- Pause system
- Victory detection
- Hit freeze and slow motion effects
- Platform system (`platform.gd` - one-way platforms)

**Available Stages** (11 total):
- theater, art-museum, farm, haunted-mansion, kayaking
- mountain-climbing, observatory, radio-tower, snow-carnaval
- bridge, dojo

**Stage-Specific Components**:
- Scrolling backgrounds (`scrolling-texture.gd`)
- Animated stage elements (windmills, waterfalls, lights)
- Loading screen backgrounds

### 5. Proficiency System

**Definition**: RPG-like character customization affecting gameplay mechanics

**Core File**: `Globals.gd` (lines 110-352: `ProficiencyPropertyID` enum)

**Major Classes** (defined in `Globals.gd:110-114`):
- `MAJOR_ADVANTAGE` - Significant positive trait
- `MAJOR_DISADVANTAGE` - Significant negative trait
- `MINOR` - Small advantage/disadvantage

**Examples**:
- `GOOD_CAN_LOW_BLOCK_IN_AIR` - Defensive option in air
- `GOOD_RECOVER_AIR_DASH_ON_BLOCK` - Mobility preservation
- `BAD_ONLY_1_JUMP` - Mobility restriction
- `BAD_TAKE_TRIPLE_DAMAGE_IN_STUN` - High-risk playstyle
- `GOOD_PERFECT_BLOCK_ABILITY_BAR_REGEN` - Resource management

**Proficiency Affects**:
- Bar costs (ripost, tech, ability cancel, push block)
- Damage scaling
- Guard damage dealt/taken
- Air mobility (jumps, air dashes)
- Block options
- Grab mechanics

### 6. Training Mode

**Core File**: `TrainingModeManager.gd` (58,107 bytes)

**Features**:
- **NPC Behavior Modes**:
  - `Spam` - Repeat specific action
  - `Control (2nd Controller)` - Manual control
  - `Mirror Player Command` - Copy player actions
  - `CPU` - AI opponent

- **Guard Settings**:
  - No Block / Block High / Block Low / Block All
  - Block timing: Immediately / Random / After First Hit

- **Active Frame Auto Ability Cancel (AFAAC)**:
  - Disabled / Enabled / On-hit Only

- **Frame Data Display** (`frame-data-analyzer.gd`)

---

## Coding Conventions and Patterns

### File Naming

**Scripts (.gd)**:
- **PascalCase** for classes: `PlayerController.gd`, `ActionAnimationManager.gd`
- **camelCase** for handlers: `frameTimer.gd`, `inputLockHandler.gd`
- **kebab-case** for helpers: `air-dash-sfx.gd`, `frame-data-analyzer.gd`

**Scenes (.tscn)**:
- **kebab-case**: `character-select.tscn`, `map-selection.tscn`
- Character scenes: `{character}.tscn` (lowercase)
- Stage scenes: descriptive names like `mountain-climbing.tscn`

**Resources (.tres)**:
- **kebab-case**: `default_env.tres`, `samus-idle-hurtbox.tres`

### GDScript Conventions

**Variable Naming**:
```gdscript
# camelCase for local variables
var currentHealth = 100
var isBlocking = false

# PascalCase for class references
var GLOBALS = preload("res://Globals.gd")

# SCREAMING_SNAKE_CASE for constants
const MAX_COMBO_HITS = 99
const ANGRY_STATE_DURATION_IN_SECONDS = 4
```

**Signals**:
```gdscript
# snake_case for signal names
signal player_was_hit
signal combo_level_up
signal ability_cancel
```

**Functions**:
```gdscript
# camelCase for methods
func applyHitstun(damage, hitstunFrames):
    pass

# _prefixed for private/internal
func _on_player_hit():
    pass

# hook suffix for override points
func restart_hook():
    .restart_hook()  # Call parent
```

### Node References

**Using $ operator** (preferred for direct children):
```gdscript
sprite = $"active-nodes/Sprite"
hud = $"../HUD"
```

**Using get_node()** (for dynamic paths):
```gdscript
angryProgressBar = get_node("../HUD/angryProgressBar")
```

**Using exports** (for editor-set references):
```gdscript
export(NodePath) var sprite_path
onready var sprite = get_node(sprite_path)
```

### Scene Patterns

**Typical Scene Hierarchy**:
```
Character Scene (e.g., glove.tscn):
KinematicBody2D (root)
├── active-nodes (visual layer)
│   ├── Sprite
│   ├── Hitbox areas
│   └── Hurtbox areas
├── PlayerController (logic node)
│   ├── ActionAnimationManager
│   │   ├── SpriteAnimationManager
│   │   └── MovementAnimationManager
│   ├── CollisionHandler
│   └── PlayerState
├── HUD (UI overlay)
├── bodyBox (KinematicBody2D for stage collision)
└── SFX nodes (particles, sounds)
```

### Initialization Pattern

```gdscript
# Standard initialization chain
func _ready():
    # Godot lifecycle hook
    pass

func init(sprite, collisionAreas, attackSFXs, bodyBox, activeNodes):
    # Custom initialization with references
    .init()  # Call parent if overriding

    # Initialize components
    actionAnimationManager.init(sprite, movementAnimationManager, ...)
    collisionHandler.init(collisionAreas, ...)

func restart_hook():
    # Match restart logic
    .restart_hook()  # Call parent
    # Reset character-specific state
```

### Signal Connection Pattern

```gdscript
# Connect during init
func init(...):
    collisionHandler.connect("player_was_hit", self, "_on_player_was_hit")
    actionAnimeManager.connect("action_animation_finished", self, "_on_action_animation_finished")

# Check for existing connection (avoid duplicates)
if not opponentPlayerController.is_connected("being_attacked", self, "_on_opponent_being_attacked"):
    opponentPlayerController.connect("being_attacked", self, "_on_opponent_being_attacked")
```

### Constants Organization

**Global constants** in `Globals.gd`:
```gdscript
# Game-wide constants
const INPUT_BUFFER_SIZE = 7
const FRAMES_PER_SECOND = 60
const SECONDS_PER_FRAME = 0.016667

# Character names
const KEN_HERO_NAME = "ken"
const GLOVE_HERO_NAME = "glove"

# Enums
enum DirectionalInput { UP, FORWARD_UP, FORWARD, ... }
enum HitStunType { BASIC, NO_HITSTUN, KNOCKBACK_ONLY, ... }
```

**Class-specific constants** in their respective files:
```gdscript
# In BeltController.gd
const ANGRY_STATE_DURATION_IN_SECONDS = 4
const ANGRY_GUARD_DAMAGE_BONUS_MOD = 1.15
```

---

## Development Workflows

### Setting Up Development Environment

1. **Download Godot 3.1.2**:
   - Specific version required: https://www.mudlakebiodiversity.ca/ftf/Godot_v3.1.2-stable_win64.exe
   - Other versions may have compatibility issues

2. **Import Project**:
   ```
   - Run Godot 3.1.2
   - Click "Import"
   - Navigate to root folder
   - Select "project.godot"
   - Click "Import & Edit"
   - Wait for resource import (first time only, ~2-5 minutes)
   ```

3. **Run Game**:
   - Press F5 or click play button (sideways triangle)
   - Main scene: `res://root.tscn`

### Git Workflow

**Branches**:
- Development happens on feature branches prefixed with `claude/`
- Branch naming: `claude/claude-md-{session-id}`

**Commit Guidelines**:
- Concise messages focusing on "why" rather than "what"
- Use conventional commit format when appropriate
- Avoid committing binary files unnecessarily (`.import` files are auto-generated)

**Push/Pull**:
- Always push with `-u` flag: `git push -u origin <branch-name>`
- Network failures: retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- Fetch specific branches: `git fetch origin <branch-name>`

### Common Development Tasks

#### Adding a New Attack to a Character

1. **Open Character's ActionAnimationManager**:
   ```
   fighters/New{Character}ActionAnimationManager.gd
   ```

2. **Define Sprite Animation**:
   - Add constant for animation ID
   - Add animation to appropriate action group
   - Define `SpriteAnimation` with frames
   - Each `SpriteFrame` includes:
     - Duration
     - Sprite texture/offset
     - Collision areas (hitboxes/hurtboxes)
     - Sound effects

3. **Define Movement Animation** (if needed):
   - Create `MovementAnimation` in `MovementAnimationManager`
   - Define velocity, acceleration, gravity
   - Sync with sprite animation

4. **Update Character Scene**:
   - Add sprite assets to `assets/fighters/{character}/`
   - Update `.tscn` file (usually via Godot editor)

5. **Handle in Controller** (if special logic needed):
   ```gdscript
   func _on_sprite_animation_played(spriteAnimation):
       ._on_sprite_animation_played(spriteAnimation)

       match(spriteAnimation.id):
           actionAnimeManager.YOUR_NEW_ATTACK_ID:
               # Custom logic here
               pass
   ```

#### Adding a New Stage

1. **Create Stage Scene**:
   ```
   stages/your-stage-name.tscn
   ```

2. **Add Required Components**:
   - `StaticBody2D` for stage geometry (walls, floor, ceiling)
   - Collision shapes on appropriate layers:
     - Floor: `PLAYER1_STAGE_FLOOR_COLLISION_LAYER_BIT = 3`
     - Walls/Ceiling: `PLAYER1_STAGE_COLLISION_LAYER_BIT = 0`
   - Camera boundaries (defined in stage.gd)
   - Player spawn points

3. **Add Background**:
   - Import background art to `assets/bus/`
   - Use `Sprite` or `scrolling-texture.gd` for parallax

4. **Register Stage**:
   - Add scene path constant to `Globals.gd`:
     ```gdscript
     const YOUR_STAGE_SCENE_PATH = "res://stages/your-stage-name.tscn"
     ```
   - Add to stage selection UI

#### Modifying Proficiency System

1. **Define New Proficiency Property**:
   - Add to `ProficiencyPropertyID` enum in `Globals.gd`:
     ```gdscript
     enum ProficiencyPropertyID {
         # ... existing properties
         GOOD_YOUR_NEW_ADVANTAGE,
         BAD_YOUR_NEW_DISADVANTAGE,
     }
     ```

2. **Implement Property Effects**:
   - Locate relevant system (e.g., guard system, combo system)
   - Check for property in player's proficiency:
     ```gdscript
     if playerState.proficiencyProperties.has(GLOBALS.ProficiencyPropertyID.YOUR_PROPERTY):
         # Apply effect
     ```

3. **Add to Proficiency Selection**:
   - Update proficiency data files
   - Update UI in `interface/new-prof-select/`

#### Creating a Custom UI Component

1. **Create Scene**:
   ```
   interface/your-component/your-component.tscn
   ```

2. **Create Script**:
   ```gdscript
   # interface/your-component/your-component.gd
   extends Control  # or appropriate UI node type

   signal your_event

   func _ready():
       pass

   func update_display(data):
       # Update UI elements
       pass
   ```

3. **Add to Parent Scene**:
   - Instance your component in parent UI scene
   - Connect signals
   - Position appropriately

### Testing Considerations

**Manual Testing**:
- **Training Mode** is primary testing environment
  - Access frame data
  - Test specific scenarios (guard settings, NPC behavior)
  - Review hitboxes/hurtboxes (if debug collision enabled)

**Key Testing Areas**:
- **Frame-perfect mechanics**: Ripost windows, tech windows, perfect block
- **Character-specific mechanics**: Test all 6 characters
- **Proficiency interactions**: Test with different proficiency builds
- **Combo validation**: Test magic series and reverse beat rules
- **Stage interactions**: Wall bounce, ceiling tech, platform drop-through

**Performance**:
- Game must maintain 60 FPS for competitive play
- Monitor FPS counter (if enabled in debug mode)
- Large sprite files (1-2MB per character scene) can affect load times

**No Automated Tests**:
- Project does not have a test suite
- All testing is manual via Godot editor playtest

---

## Important Files Reference

### Must-Read Core Files

| File | Size | Purpose | Priority |
|------|------|---------|----------|
| `Globals.gd` | 23KB | All enums, constants, global state | **CRITICAL** |
| `project.godot` | 12KB | Godot project configuration, input mappings | **HIGH** |
| `root.gd` | 123KB | Main game coordinator, match flow | **HIGH** |
| `stage.gd` | Large | Match coordinator, pause, victory detection | **HIGH** |
| `PlayerController.gd` | 338KB | Base player class with all combat systems | **CRITICAL** |
| `input_manager.gd` | Medium | Input buffering, command parsing | **HIGH** |

### Character Implementation Examples

| File | Purpose | Size |
|------|---------|------|
| `fighters/BeltController.gd` | Simplest character example (anger mechanic) | 11KB |
| `fighters/NewBeltActionAnimationManager.gd` | Attack definitions example | 85KB |
| `fighters/belt.tscn` | Character scene structure | 1.5MB |

### System Examples

| System | Key Files | Notes |
|--------|-----------|-------|
| Ripost | `RipostHandler.gd`, `NewRipostHandler.gd` | Parry timing windows |
| Guard | `guardHandler.gd` | Block states, guard break |
| Combo | `ComboHandler.gd` | Magic series, reverse beat |
| Animation | `SpriteAnimationManager.gd`, `MovementAnimationManager.gd` | Two-layer system |

### UI Examples

| Component | Location | Purpose |
|-----------|----------|---------|
| Pause Menu | `PauseLayer.gd` (32KB) | Comprehensive pause system |
| Ability Bar | `interface/ability-resource/NewAbilityBar.gd` | Resource meter display |
| Combo Display | `interface/new-combo-list/ComboStateMachine.gd` | Combo counter UI |
| Health Bar | `CircularProgressDamageBar.gd` | Circular health display |

---

## Godot-Specific Considerations

### Scene Tree Structure

**Godot uses a scene tree** where everything is a node:
- Nodes have properties, methods, and signals
- Nodes are organized hierarchically (parent/child)
- Scripts attach to nodes to add behavior

**Common Node Types**:
- `Node` - Generic logic container
- `Node2D` - 2D spatial node (has position, rotation, scale)
- `KinematicBody2D` - Physics body with collision detection
- `Sprite` - 2D image display
- `Area2D` - Trigger zone for overlap detection
- `Control` - UI element base class

### Resource System

**Resources (.tres files)** are data containers:
- Can be shared across multiple scenes
- Examples: collision shapes, materials, fonts
- Can be created in editor or via script

### Signals (Observer Pattern)

**Signals are Godot's event system**:
```gdscript
# Define signal
signal player_hit(damage, position)

# Emit signal
emit_signal("player_hit", 50, Vector2(100, 200))

# Connect to signal
player.connect("player_hit", self, "_on_player_hit")

# Handler function
func _on_player_hit(damage, position):
    print("Player took ", damage, " damage at ", position)
```

### Autoload Singletons

**Globals.gd is an autoload**:
- Accessible from any script as `Globals`
- Persists across scene changes
- Used for game-wide state and constants

### Fixed Delta vs. Variable Delta

**This game uses fixed delta** for determinism:
```gdscript
const FIXED_FRAME_DURATION_IN_SECONDS = 0.016667  # 1/60
```

- Critical for frame-perfect mechanics
- Ensures consistent behavior across hardware
- Used in all time-based calculations

### Collision Layers and Masks

**Complex collision system** using bit layers:
```gdscript
# Player 1 hitbox hits Player 2 hurtbox
const PLAYER_1_HITBOX_LAYER_BIT = 12
const PLAYER_2_HURTBOX_LAYER_BIT = 15

# Stage collision
const PLAYER1_STAGE_COLLISION_LAYER_BIT = 0
```

**Understanding**:
- **Layer**: What layer this object is on
- **Mask**: What layers this object detects
- Bitwise operations for efficient collision filtering

### Preloading Resources

**Preload vs. Load**:
```gdscript
# Preload at compile time (faster, preferred)
var GLOBALS = preload("res://Globals.gd")
var frameTimerResource = preload("res://frameTimer.gd")

# Load at runtime (slower, dynamic)
var scene = load("res://stages/" + stage_name + ".tscn")
```

### Call Deferred

**Deferred calls execute after current frame**:
```gdscript
# Avoid issues with signal order or node state changes
call_deferred("becomeCalm")

# Equivalent to queuing for next frame
```

---

## Common Pitfalls and Best Practices

### ⚠️ Pitfalls to Avoid

1. **Don't Break Determinism**:
   - Always use `SECONDS_PER_FRAME` constant, not `delta`
   - Avoid `randf()` without seeded RNG
   - Be careful with floating-point comparisons (use `is_float_almost_equal`)

2. **Don't Modify Parent Class State Unexpectedly**:
   - Always call parent methods when overriding: `.method_name()`
   - Understand inheritance chain before modifying

3. **Signal Connection Leaks**:
   - Disconnect signals in cleanup if node persists
   - Check `is_connected()` before connecting to avoid duplicates

4. **Collision Layer Errors**:
   - Wrong layer bits = no collision detection
   - Use constants from `Globals.gd`, don't hardcode

5. **Large File Sizes**:
   - Character scenes are 1-2MB (many sprite frames)
   - Don't try to manually edit large .tscn files
   - Use Godot editor for scene modifications

### ✅ Best Practices

1. **Use Godot Editor for Scenes**:
   - Manually editing .tscn files is error-prone
   - Scene files are complex serialized formats

2. **Follow Naming Conventions**:
   - Consistent naming helps navigate large codebase
   - See "Coding Conventions" section

3. **Leverage Existing Patterns**:
   - Study existing characters before creating new ones
   - Copy-paste-modify is often faster than starting from scratch

4. **Document Complex Logic**:
   - Combat system is intricate with many edge cases
   - Add comments explaining frame windows, state transitions

5. **Test in Training Mode**:
   - Use training mode to verify changes
   - Enable frame data display for timing verification

6. **Use Constants Over Magic Numbers**:
   ```gdscript
   # Good
   if comboLevel == COMBO_TYPE_C:

   # Bad
   if comboLevel == 2:
   ```

7. **Respect Frame-Perfect Timing**:
   - Many mechanics have 1-6 frame windows
   - Off-by-one errors break competitive balance

---

## Quick Reference: Key Constants

### Frame Timing
```gdscript
FRAMES_PER_SECOND = 60
SECONDS_PER_FRAME = 0.016667
INPUT_BUFFER_SIZE = 7  # frames
RIPOST_REACTION_WINDOW = 2  # frames
COUNTER_RIPOST_OVERRIDES_RIPOST_WINDOW = 6 frames
```

### Character Names
```gdscript
KEN_HERO_NAME = "ken"
GLOVE_HERO_NAME = "glove"
BELT_HERO_NAME = "belt"
MICROPHONE_HERO_NAME = "microphone"
HAT_HERO_NAME = "hat"
WHISTLE_HERO_NAME = "whistle"
```

### Player IDs
```gdscript
PLAYER1_INPUT_DEVICE_ID = "P1"
PLAYER2_INPUT_DEVICE_ID = "P2"
```

### Collision Layers
```gdscript
# Hitbox/Hurtbox
PLAYER_1_HITBOX_LAYER_BIT = 12
PLAYER_1_HURTBOX_LAYER_BIT = 13
PLAYER_2_HITBOX_LAYER_BIT = 14
PLAYER_2_HURTBOX_LAYER_BIT = 15

# Stage Collision
PLAYER1_STAGE_COLLISION_LAYER_BIT = 0
PLAYER1_STAGE_FLOOR_COLLISION_LAYER_BIT = 3
```

### Damage & Combo
```gdscript
ABILITY_BAR_TO_MAX_HEALTH_RATIO = 0.55
DAMAGE_PER_STAR_MOD = 0.2  # Each star = 20% more damage
MAX_NUM_DMG_STARS = 5
```

---

## Example Code Patterns

### Creating a Character-Specific Mechanic

```gdscript
# In {Character}Controller.gd
extends "res://PlayerController.gd"

var specialMechanicActive = false
var mechanicTimer = null

func init(sprite, collisionAreas, attackSFXs, bodyBox, activeNodes):
    # Call parent init
    .init(sprite, collisionAreas, attackSFXs, bodyBox, activeNodes)

    # Initialize mechanic-specific components
    mechanicTimer = frameTimerResource.new()
    self.add_child(mechanicTimer)
    mechanicTimer.connect("timeout", self, "_on_mechanic_timeout")

func restart_hook():
    # Reset state at match start
    .restart_hook()
    specialMechanicActive = false
    mechanicTimer.stop()

func _on_sprite_animation_played(spriteAnimation):
    ._on_sprite_animation_played(spriteAnimation)

    # Check for mechanic activation
    match(spriteAnimation.id):
        actionAnimeManager.SPECIAL_MOVE_ID:
            activateSpecialMechanic()

func activateSpecialMechanic():
    specialMechanicActive = true
    mechanicTimer.startInSeconds(5.0)  # 5 second duration
    emit_signal("player_state_info_text_changed", "Special Active!")

func _on_mechanic_timeout():
    specialMechanicActive = false
    emit_signal("player_state_info_text_changed", "")
```

### Defining an Attack Animation

```gdscript
# In New{Character}ActionAnimationManager.gd

const YOUR_ATTACK_SPRITE_ANIME_ID = 9999
var YOUR_ATTACK_ACTION_ID

func init(...):
    .init(...)

    # Create sprite animation
    var attackAnim = spriteAnimResource.new()
    attackAnim.id = YOUR_ATTACK_SPRITE_ANIME_ID
    attackAnim.soundEffectIds = [4, -1, 8]  # SFX on frames 0 and 2

    # Frame 1: Startup (no hitbox)
    var frame1 = spriteFrameRes.new()
    frame1.durationInSeconds = 3 * GLOBALS.SECONDS_PER_FRAME  # 3 frames
    frame1.texture = load("res://assets/fighters/yourchar/attack/frame1.png")
    frame1.hurtboxAreas = [idleHurtbox]  # Use idle hurtbox
    attackAnim.add_child(frame1)

    # Frame 2: Active (has hitbox)
    var frame2 = spriteFrameRes.new()
    frame2.durationInSeconds = 2 * GLOBALS.SECONDS_PER_FRAME  # 2 frames
    frame2.texture = load("res://assets/fighters/yourchar/attack/frame2.png")

    # Define hitbox
    var hitbox = hitboxRes.new()
    hitbox.damage = 80
    hitbox.hitstunFrames = 15
    hitbox.guardHPDamage = 150
    hitbox.knockBackVelocity = Vector2(300, -200)
    # ... more properties

    frame2.hitboxAreas = [hitbox]
    frame2.hurtboxAreas = [idleHurtbox]
    attackAnim.add_child(frame2)

    # Frame 3: Recovery
    var frame3 = spriteFrameRes.new()
    frame3.durationInSeconds = 5 * GLOBALS.SECONDS_PER_FRAME  # 5 frames
    frame3.texture = load("res://assets/fighters/yourchar/attack/frame3.png")
    frame3.hurtboxAreas = [idleHurtbox]
    attackAnim.add_child(frame3)

    # Register animation
    YOUR_ATTACK_ACTION_ID = createAction("Your Attack", attackAnim, movementAnim)
```

### Handling Proficiency Properties

```gdscript
# In relevant system file (e.g., guardHandler.gd)

func calculateGuardDamage(baseGuardDamage):
    var finalDamage = baseGuardDamage

    # Check for guard damage modifiers
    if playerState.proficiencyProperties.has(
        GLOBALS.ProficiencyPropertyID.GOOD_LARGE_DECREASE_TO_GUARD_DAMAGE_TAKEN
    ):
        finalDamage *= 0.70  # 30% reduction

    if playerState.proficiencyProperties.has(
        GLOBALS.ProficiencyPropertyID.BAD_LARGE_INCREASE_TO_GUARD_DAMAGE_TAKEN
    ):
        finalDamage *= 1.50  # 50% increase

    return finalDamage
```

---

## Glossary of Fighting Game Terms

- **Ripost**: Parry/counter move that deflects attacks
- **Tech**: Recovery option to avoid knockdown (floor/wall/ceiling)
- **Ability Cancel**: Cancel normal moves into special moves using meter
- **Push Block**: Defensive technique to push opponent away during block
- **Proration**: Damage scaling in combos (later hits do less damage)
- **Magic Series**: Combo system allowing light → medium → heavy chains
- **Reverse Beat**: Advanced combo technique allowing heavy → light chains
- **Frame Data**: Timing information (startup/active/recovery frames)
- **Hitbox**: Attack collision area
- **Hurtbox**: Vulnerable collision area
- **Stale Move**: Repeated moves do less damage
- **Chip Damage**: Damage dealt through block
- **Guard Break**: Breaking opponent's block meter
- **DI (Directional Influence)**: Control knockback direction during hitstun
- **Oki (Okizeme)**: Pressure applied on opponent's wakeup
- **Hitstun**: Stun state when hit, cannot act
- **Blockstun**: Stun state while blocking, limited actions

---

## Additional Resources

- **YouTube Channel**: https://www.youtube.com/@fieldtripfighters4647
- **Godot 3.1.2 Download**: https://www.mudlakebiodiversity.ca/ftf/Godot_v3.1.2-stable_win64.exe
- **Godot 3.1.2 Documentation**: https://docs.godotengine.org/en/3.1/
- **GDScript Reference**: https://docs.godotengine.org/en/3.1/getting_started/scripting/gdscript/gdscript_basics.html

---

## Notes for AI Assistants

### When Making Changes

1. **Read relevant files first**: Don't assume structure, verify with Read tool
2. **Understand inheritance**: Many classes extend PlayerController
3. **Preserve determinism**: Don't introduce randomness or variable timing
4. **Test character-specific**: A change might only affect one character
5. **Consider all 6 characters**: Changes to base classes affect everyone
6. **Check Globals.gd first**: Most constants and enums are centralized
7. **Use Godot editor when possible**: For scene modifications
8. **Respect frame timings**: Off-by-one frame errors break balance

### When Analyzing Code

1. **Files are large**: PlayerController.gd is 338KB - read in sections
2. **Signals are everywhere**: Trace signal connections for event flow
3. **Two-layer animations**: Visual (sprite) and physics (movement) are separate
4. **Proficiency system is complex**: 200+ proficiency properties affect gameplay
5. **Combat is intricate**: Many edge cases, state machines, frame-perfect timing
6. **Scene files are huge**: Don't try to parse 2MB .tscn files, use editor

### Common AI Assistant Tasks

- **Adding new attacks**: Modify ActionAnimationManager
- **Tweaking balance**: Adjust damage/frame data in attack definitions
- **Fixing bugs**: Often in PlayerController or specific character controllers
- **UI improvements**: Work in `interface/` directory
- **New characters**: Clone existing character, modify assets/logic
- **Stage creation**: Create new .tscn in `stages/`
- **Proficiency additions**: Add to Globals.gd enum, implement effects in systems

---

**Last Updated**: 2025-11-14
**For**: AI Assistants working on Field Trip Fighters codebase
**Version**: 0.53.1 (Godot 3.1.2)

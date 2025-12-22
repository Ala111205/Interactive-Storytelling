**🧬 Story Game**

    A browser-based interactive story game built with a fully custom JavaScript engine. The game is driven by dynamic scenes, branching choices, persistent player state, inventory,          flags,   and stats. Player decisions permanently affect the storyline’s direction and outcome.
    
    Designed to support multiple stories, non-linear progression, inventory-based choices, and stat-driven consequences, all without page reloads.
    
    This project isn’t just a story — it’s a scalable narrative engine.


**Live Demo:-** https://ala111205.github.io/Interactive-Storytelling/

**🚀 Core Features:-**

**🎭 Interactive Story System**

    Multi-story support (Story A / Story B and expandable)
    
    Scene-to-scene progression via structured storyGraph
    
    Branching storylines based on user choices
    
    Backtrack option (history stack)
    
    Dynamic scene loading without reload

**🎒 Inventory System**

    Item pickup system using ITEM_DATA
    
    Persistent inventory with count tracking
    
    Real-time UI sync
    
    Item effects linked to story logic
    
    Inventory opens on demand via modal

**📊 Player Stats**

    Health
    
    Energy
    
    Morale
    
    Stamina
    
    Experience (XP)
    
    Each stat can be:
    
    Increased / decreased via story actions
    
    Locked / required for special paths
    
    Used as conditions in choices

**🚩 Flag System**

    Permanent story flags (example: ancient_shard, ai_trusted, etc.)
    
    Alters dialogue, scenes, and available endings
    
    Stored in persistent state

**💾 Save System**

    LocalStorage-based persistence
    
    Auto-save after every change
    
    Keeps track of:
    
    Current story
    
    Current scene
    
    History
    
    Inventory
    
    Flags
    
    Stats

**🔊 Audio System**

    Looping BGM for selected stories
    
    Independent SFX for UI and choices
    
    Separate channel management to prevent overlap
    
    Smart mute and unlock handling

**🖱️ UI/UX**

    Smooth typewriter dialogue
    
    Responsive layout
    
    Choice rendering with animation
    
    Modal-based inventory view
    
    Back/Restart controls
    
    Minimal, sci-fi styled interface

**🧾 Tech Stack**

**Frontend:-**

    HTML5
    
    CSS3
    
    Vanilla JavaScript (ES Modules)

**Architecture:-**

    Event-Driven System (Event Bus)
    
    Single Source of Truth (State Manager)
    
    Modular system design

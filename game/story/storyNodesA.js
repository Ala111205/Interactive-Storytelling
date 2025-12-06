const storyA = {
  id: "storyA",
  title: "Ancient Shard",
  start: "start",

  nodes: {
    start: {
      id: "start",
      text: "You awaken beside a half-buried alien ruin. A faint blue glow pulses beneath the sand.",
      img: "./game/assets/img/ancient/start.png",
      onEnter: [
        { type: "stat", stat: "energy", delta: -5 },
        { type: "stat", stat: "xp", delta: +1 },
        { type: "flag", set: "arrived_ruins" },
        { type: "item", add: "arrived_ruins", count: 1 }
      ],
      choices: [
        {
          label: "Inspect the glow",
          next: "find_shard",
          actions: [
            { type: "stat", stat: "stamina", delta: -2 },
            { type: "stat", stat: "xp", delta: +1 }
          ]
        },
        {
          label: "Survey the ruins",
          next: "ruins_overlook",
          actions: [{ type: "stat", stat: "morale", delta: +1 }]
        }
      ]
    },

    find_shard: {
      id: "find_shard",
      text: "You uncover a crystalline fragment—warm, vibrating faintly in your palm.",
      img: "./game/assets/img/ancient/shard.png",
      onEnter: [
        { type: "item", add: "ancient_shard", count: 1 },
        { type: "stat", stat: "xp", delta: +2 }
      ],
      choices: [
        {
          label: "Pick it up",
          next: "shard_resonance",
          actions: [{ type: "stat", stat: "energy", delta: +5 }]
        },
        {
          label: "Leave it",
          next: "ruins_overlook",
          actions: [{ type: "stat", stat: "morale", delta: -1 }]
        }
      ]
    },

    shard_resonance: {
      id: "shard_resonance",
      text: "The shard hums. You glimpse corridors, machines and a distant, sorrowful voice.",
      img: "./game/assets/img/ancient/resonance.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +1 }],
      choices: [
        {
          label: "Follow the vision",
          next: "vision_path",
          actions: [
            { type: "stat", stat: "stamina", delta: -3 },
            { type: "stat", stat: "xp", delta: +1 }
          ]
        },
        {
          label: "Ignore it",
          next: "ruins_overlook",
          actions: [{ type: "stat", stat: "morale", delta: -2 }]
        }
      ]
    },

    ruins_overlook: {
      id: "ruins_overlook",
      text: "From the overlook the ruins stretch under a bruised sky. Several collapsed entrances yawn below.",
      img: "./game/assets/img/ancient/overlook.png",
      onEnter: [],
      choices: [
        {
          label: "Enter the nearest crack",
          next: "narrow_entry",
          actions: [{ type: "stat", stat: "stamina", delta: -1 }]
        },
        {
          label: "Search for a safer path",
          next: "safe_route",
          actions: [{ type: "stat", stat: "morale", delta: +1 }]
        }
      ]
    },

    vision_path: {
      id: "vision_path",
      text: "The shard leads you to an engraved door. Symbols glow where your palm once touched the shard.",
      img: "./game/assets/img/ancient/door.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +2 }],
      choices: [
        {
          label: "Touch the door",
          next: "door_activation",
          actions: [{ type: "stat", stat: "energy", delta: -2 }]
        },
        {
          label: "Back away",
          next: "safe_route",
          actions: [{ type: "stat", stat: "morale", delta: -1 }]
        }
      ]
    },

    narrow_entry: {
      id: "narrow_entry",
      text: "You squeeze through a narrow gap. The air grows cold and metallic.",
      img: "./game/assets/img/ancient/narrow.png",
      onEnter: [{ type: "stat", stat: "stamina", delta: -2 }],
      choices: [
        {
          label: "Use torch",
          next: "flashlight_scene",
          actions: [{ type: "stat", stat: "xp", delta: +1 }]
        },
        {
          label: "Proceed in dark",
          next: "pitfall",
          actions: [{ type: "stat", stat: "stamina", delta: -3 }]
        }
      ]
    },

    safe_route: {
      id: "safe_route",
      text: "You find a set of old stone steps leading deeper into the facility.",
      img: "./game/assets/img/ancient/steps.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +6 },
        { type: "stat", stat: "morale", delta: +4 }
      ],
      choices: [
        {
          label: "Go down",
          next: "lower_hall",
          actions: [{ type: "stat", stat: "stamina", delta: -1 }]
        }
      ]
    },

    flashlight_scene: {
      id: "flashlight_scene",
      text: "Your light reveals etched concentric rings in the walls — a map perhaps.",
      img: "./game/assets/img/ancient/rings.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +1 }],
      choices: [
        {
          label: "Scan the rings",
          next: "ring_scan",
          actions: [
            { type: "flag", set: "map_known" },
            { type: "item", add: "map_known", count: 1 },
            { type: "stat", stat: "energy", delta: -4 }
          ]
        },
        { label: "Move on", next: "lower_hall", actions: [{ type: "stat", stat: "energy", delta: +5 }] }
      ]
    },

    pitfall: {
      id: "pitfall",
      text: "You slip and fall into a pit of broken machinery. Pain blossoms across your ribs.",
      img: "./game/assets/img/ancient/pitfall.png",
      onEnter: [{ type: "stat", stat: "health", delta: -6 }],
      choices: [
        {
          label: "Climb out",
          next: "lower_hall",
          actions: [{ type: "stat", stat: "stamina", delta: -2 }]
        }
      ]
    },

    ring_scan: {
      id: "ring_scan",
      text: "The rings shift, revealing a star map and a route to a central chamber.",
      img: "./game/assets/img/ancient/map.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +4 },
        { type: "stat", stat: "energy", delta: +5 }
      ],
      choices: [
        {
          label: "Memorize map",
          next: "lower_hall",
          actions: [
            { type: "flag", set: "map_known" },
            { type: "item", add: "map_known", count: 1 },
            { type: "stat", stat: "xp", delta: +1 }
          ]
        },
        { label: "Ignore it", next: "lower_hall", actions: [] }
      ]
    },

    door_activation: {
      id: "door_activation",
      text: "The door sighs and opens, revealing a corridor lined with humming conduits.",
      img: "./game/assets/img/ancient/open_door.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +5 },
        { type: "stat", stat: "energy", delta: +4 }
      ],
      choices: [{ label: "Enter", next: "central_corridor", actions: [{ type: "stat", stat: "stamina", delta: +3 }] }]
    },

    lower_hall: {
      id: "lower_hall",
      text: "A wide corridor leads you deeper into the ruins; echoes roll like waves.",
      img: "./game/assets/img/ancient/corridor.png",
      onEnter: [{ type: "stat", stat: "stamina", delta: -1 }],
      choices: [
        { label: "Left path", next: "machine_chamber", actions: [{ type: "stat", stat: "health", delta: +5 }] },
        { label: "Right path", next: "echo_room", actions: [{ type: "stat", stat: "energy", delta: +5 }] }
      ]
    },

    central_corridor: {
      id: "central_corridor",
      text: "A long hallway lined with dormant machines hums with latent power.",
      img: "./game/assets/img/ancient/central.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +1 }],
      choices: [
        {
          label: "Follow hum",
          next: "power_core",
          actions: [{ type: "stat", stat: "stamina", delta: -2 }]
        },
        { label: "Explore side hall", next: "echo_room", actions: [{ type: "stat", stat: "stamina", delta: +2 }] }
      ]
    },

    machine_chamber: {
      id: "machine_chamber",
      text: "Colossal machines stand like sleeping titans; one has a prism-shaped cavity.",
      img: "./game/assets/img/ancient/machines.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +1 }],
      choices: [
        {
          label: "Attempt activation",
          next: "reactivate_system",
          actions: [{ type: "stat", stat: "energy", delta: -6 }]
        },
        {
          label: "Examine debris",
          next: "debris_find",
          actions: [{ type: "stat", stat: "xp", delta: +1 }]
        }
      ]
    },

    echo_room: {
      id: "echo_room",
      text: "Whispers echo in a small chamber. They sound almost like memories.",
      img: "./game/assets/img/ancient/echo.png",
      onEnter: [{ type: "stat", stat: "morale", delta: -1 }],
      choices: [
        {
          label: "Listen",
          next: "psychic_echo",
          actions: [{ type: "stat", stat: "stamina", delta: -5 }]
        },
        { label: "Retreat", next: "central_corridor", actions: [] }
      ]
    },

    power_core: {
      id: "power_core",
      text: "The core glows faintly. The shard vibrates stronger in response.",
      img: "./game/assets/img/ancient/core.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +2 }],
      choices: [
        {
          label: "Hold shard to core",
          next: "core_sync",
          actions: [{ type: "stat", stat: "energy", delta: -5 }]
        },
        {
          label: "Pull away",
          next: "core_reject",
          actions: [{ type: "stat", stat: "morale", delta: -2 }]
        }
      ]
    },

    debris_find: {
      id: "debris_find",
      text: "You discover a metal prism engraved with the same pattern as the shard.",
      img: "./game/assets/img/ancient/prism.png",
      onEnter: [
        { type: "item", add: "metal_prism", count: 1 },
        { type: "stat", stat: "xp", delta: +1 }
      ],
      choices: [
        {
          label: "Take prism",
          next: "reactivate_system",
          actions: [
            { type: "stat", stat: "energy", delta: +5 },
            { type: "item", add: "has_prism", count: 1 }
          ]
        },
        { label: "Leave it", next: "reactivate_system", actions: [{ type: "stat", stat: "stamina", delta: +5 }] }
      ]
    },

    psychic_echo: {
      id: "psychic_echo",
      text: "A flood of alien memories assaults you; your mind strains but gains knowledge.",
      img: "./game/assets/img/ancient/psychic.png",
      onEnter: [
        { type: "stat", stat: "stamina", delta: -4 },
        { type: "stat", stat: "xp", delta: +3 }
      ],
      choices: [
        { label: "Endure", next: "memory_gain", actions: [] },
        {
          label: "Break free",
          next: "central_corridor",
          actions: [{ type: "stat", stat: "morale", delta: -2 }]
        }
      ]
    },

    memory_gain: {
      id: "memory_gain",
      text: "You glimpse a warning: 'The core must remain sealed.'",
      img: "./game/assets/img/ancient/warning.png",
      onEnter: [
        { type: "flag", set: "warned_core" },
        { type: "item", add: "warned_core", count: 1 },
        { type: "stat", stat: "xp", delta: +1 }
      ],
      choices: [
        {
          label: "Heed the warning",
          next: "core_reject",
          actions: [{ type: "stat", stat: "morale", delta: +1 }]
        },
        {
          label: "Ignore it",
          next: "power_core",
          actions: [{ type: "stat", stat: "morale", delta: -1 }]
        }
      ]
    },

    reactivate_system: {
      id: "reactivate_system",
      text: "Machines stir to life — the facility wakes with a low, hungry hum.",
      img: "./game/assets/img/ancient/awake.png",
      onEnter: [{ type: "stat", stat: "xp", delta: +2 }],
      choices: [
        {
          label: "Stay",
          next: "guardian_reveal",
          actions: [{ type: "stat", stat: "stamina", delta: -2 }]
        },
        {
          label: "Run",
          next: "central_corridor",
          actions: [{ type: "stat", stat: "stamina", delta: -1 }]
        }
      ]
    },

    guardian_reveal: {
      id: "guardian_reveal",
      text: "A towering guardian awakens. Blue lenses sweep the chamber and fix on you.",
      img: "./game/assets/img/ancient/guardian.png",
      onEnter: [{ type: "stat", stat: "morale", delta: -5 }],
      choices: [
        {
          label: "Show shard",
          next: "guardian_response",
          actions: [{ type: "stat", stat: "xp", delta: +6 }]
        },
        {
          label: "Hide",
          next: "guardian_hostile",
          actions: [{ type: "stat", stat: "stamina", delta: +3 }]
        }
      ]
    },

    guardian_response: {
      id: "guardian_response",
      text: "The guardian kneels before you, recognizing the shard's signature.",
      img: "./game/assets/img/ancient/kneel.png",
      onEnter: [
        { type: "flag", set: "guardian_friend" },
        { type: "item", add: "guardian_friend", count: 1 },
        { type: "stat", stat: "xp", delta: +2 }
      ],
      choices: [
        {
          label: "Request passage",
          next: "final_path",
          actions: [{ type: "stat", stat: "morale", delta: +2 }]
        },
        {
          label: "Ask for knowledge",
          next: "knowledge_dump",
          actions: [{ type: "stat", stat: "xp", delta: +1 }]
        }
      ]
    },

    guardian_hostile: {
      id: "guardian_hostile",
      text: "The guardian senses threat and lashes out. You barely escape, wounded.",
      img: "./game/assets/img/ancient/hostile.png",
      onEnter: [{ type: "stat", stat: "health", delta: -20 }],
      choices: [
        {
          label: "Escape back",
          next: "central_corridor",
          actions: [{ type: "stat", stat: "stamina", delta: -2 }]
        }
      ]
    },

    knowledge_dump: {
      id: "knowledge_dump",
      text: "Ancient records pour into your mind: the shard sealed a dimensional breach.",
      img: "./game/assets/img/ancient/knowledge.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +3 },
        { type: "stat", stat: "energy", delta: +5 },
        { type: "stat", stat: "health", delta: +3 },
        { type: "stat", stat: "morale", delta: -4 }
      ],
      choices: [{ label: "Continue", next: "final_path", actions: [] }]
    },

    core_sync: {
      id: "core_sync",
      text: "You place the shard into the core. Light floods every corridor — you feel changed.",
      img: "./game/assets/img/ancient/sync.png",
      onEnter: [
        { type: "flag", set: "ending_seal" },
        { type: "item", add: "ending_seal", count: 1 },
        { type: "stat", stat: "morale", delta: +3 },
        { type: "stat", stat: "xp", delta: +5 },
        { type: "stat", stat: "stamina", delta: +2 }
      ],
      choices: [{ label: "Brace", next: "ending_save", actions: [] }]
    },

    core_reject: {
      id: "core_reject",
      text: "The core shudders. Alarms scream as instability spreads.",
      img: "./game/assets/img/ancient/reject.png",
      onEnter: [
        { type: "stat", stat: "stamina", delta: +4 },
        { type: "stat", stat: "xp", delta: +1 }
      ],
      choices: [
        {
          label: "Flee",
          next: "escape_run",
          actions: [{ type: "stat", stat: "stamina", delta: -2 }]
        }
      ]
    },

    escape_run: {
      id: "escape_run",
      text: "You race toward the exit as the facility convulses.",
      img: "./game/assets/img/ancient/escape.png",
      onEnter: [
        { type: "stat", stat: "stamina", delta: -6 },
        { type: "stat", stat: "xp", delta: +1 }
      ],
      choices: [
        {
          label: "Leap for the exit",
          next: "ending_escape",
          actions: [{ type: "stat", stat: "health", delta: -5 }]
        }
      ]
    },

    final_path: {
      id: "final_path",
      text: "You stand before the control lattice: choices echo with cosmic consequence.",
      img: "./game/assets/img/ancient/final.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +2 },
        { type: "stat", stat: "stamina", delta: +5 }
      ],
      choices: [
        {
          label: "Seal the breach",
          next: "ending_seal",
          actions: [{ type: "stat", stat: "xp", delta: +3 }]
        },
        {
          label: "Open the breach",
          next: "ending_open",
          actions: [
            { type: "stat", stat: "xp", delta: +5 },
            { type: "stat", stat: "morale", delta: -5 }
          ]
        }
      ]
    },

    ending_save: {
      id: "ending_save",
      text: "The shard sacrifices itself to stabilize the core. You survive, weary but whole.",
      img: "./game/assets/img/ancient/ending_good.png",
      onEnter: [
        { type: "flag", set: "ending_seal" },
        { type: "item", add: "ending_seal", count: 1 },
        { type: "stat", stat: "morale", delta: +10 }
      ],
      choices: [{ label: "Continue", next: "end_screen" }]
    },

    ending_escape: {
      id: "ending_escape",
      text: "You barely escape as the ruins collapse. You live, scarred and wiser. THE END.",
      img: "./game/assets/img/ancient/the_end_escape.png",
      onEnter: [
        { type: "flag", set: "ending_escape" },
        { type: "item", add: "ending_escape", count: 1 },
        { type: "stat", stat: "xp", delta: +2 },
        { type: "stat", stat: "energy", delta: +2 },
        { type: "stat", stat: "morale", delta: +2 }
      ],
      choices: [{ label: "Continue", next: "end_screen" }]
    },

    ending_seal: {
      id: "ending_seal",
      text: "You seal the breach permanently. A fragile peace returns. THE END.",
      img: "./game/assets/img/ancient/the_end_seal.png",
      onEnter: [
        { type: "flag", set: "ending_seal" },
        { type: "item", add: "ending_seal", count: 1 },
        { type: "stat", stat: "xp", delta: +3 }
      ],
      choices: [{ label: "Continue", next: "end_screen" }]
    },

    ending_open: {
      id: "ending_open",
      text: "You open the breach; something ancient stirs. Darkness spreads. THE END.",
      img: "./game/assets/img/ancient/the_end_open.png",
      onEnter: [
        { type: "flag", set: "ending_open" },
        { type: "item", add: "ending_open", count: 1 },
        { type: "stat", stat: "xp", delta: +5 },
        { type: "stat", stat: "morale", delta: +6 }
      ],
      choices: [{ label: "Continue", next: "end_screen" }]
    },

    end_screen: {
      id: "end_screen",
      text: "Your journey ends here. What will you do next?",
      img: "./game/assets/img/ancient/end.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +10 },
        { type: "stat", stat: "health", delta: +5 },
        { type: "stat", stat: "energy", delta: -10 },
        { type: "stat", stat: "stamina", delta: +4 }
      ],
      choices: [
        { label: "Play Story B", next: "__SWITCH_STORY__", targetStory: "B" },
        { label: "Restart Story A", next: "__SWITCH_STORY__", targetStory: "A" }
      ]
    }
  },

  actions: {
    addShardToCore: [
      { type: "stat", stat: "xp", delta: +5 },
      { type: "flag", set: "guardian_friend" },
      { type: "item", add: "guardian_friend", count: 1 }
    ]
  },

  // Keep flags for engine logic; inventory tokens are added in onEnter/actions
  flags: {
    map_known: false,
    has_prism: false,
    guardian_friend: false,
    warned_core: false,
    saved_world: false,
    ending_seal: false,
    ending_escape: false,
    ending_open: false
  }
};

export default storyA;
const storyB = {
  id: "storyB",
  title: "Neon Echo Protocol",
  start: "startB",
  nodes: {
    startB: {
      id: "startB",
      text: "You wake beneath pulsing red emergency lights. The station breathes like a dying animal. Metal tastes of ozone in your mouth.",
      img: "./game/assets/img/neon/start.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +30 },
        { type: "stat", stat: "health", delta: -12 },
        { type: "stat", stat: "stamina", delta: -8 },
        { type: "stat", stat: "energy", delta: +10 },
        { type: "flag", set: "awakening_event" }
      ],
      choices: [
        { label: "Push yourself up and walk", next: "node_b1" },
        { label: "Listen to the silence", next: "node_b2" }
      ]
    },

    node_b1: {
      id: "node_b1",
      text: "The corridor is warped — walls weep condensation and light flickers in impossible beats. A console blinks with a single corrupted word: ECHO.",
      img: "./game/assets/img/neon/node_b1.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +8 },
        { type: "stat", stat: "energy", delta: +5 }
      ],
      choices: [
        { label: "Approach the console", next: "node_b3" },
        { label: "Try another door", next: "node_b4" }
      ]
    },

    node_b2: {
      id: "node_b2",
      text: "The silence is full of small things: water dripping, circuitry sighing. Something brushes the back of your neck but when you turn there is only a smear of neon.",
      img: "./game/assets/img/neon/node_b2.png",
      onEnter: [
        { type: "stat", stat: "morale", delta: +5 },
        { type: "stat", stat: "xp", delta: +8 }
      ],
      choices: [
        { label: "Follow the sound", next: "node_b4" },
        { label: "Return to where you woke", next: "node_b1" }
      ]
    },

    node_b3: {
      id: "node_b3",
      text: "The terminal coughs into life and plays a fractured log: 'Containment... breach... do not—' The last syllable is a scream that isn't human.",
      img: "./game/assets/img/neon/node_b3.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +8 },
        { type: "stat", stat: "energy", delta: -6 },
        { type: "stat", stat: "health", delta: +5 },
        { type: "item", add: "data_fragment_log", count: 1 }
      ],
      choices: [
        { label: "Download the logs", next: "node_b5" },
        { label: "Smash the console", next: "node_b6" }
      ]
    },

    node_b4: {
      id: "node_b4",
      text: "A maintenance hatch yawns open. Inside: a small table, a coil of cable — and a glass shard that hums with inner light.",
      img: "./game/assets/img/neon/node_b4.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +9 },
        { type: "stat", stat: "stamina", delta: -3 },
        { type: "stat", stat: "energy", delta: +2 },
        { type: "stat", stat: "morale", delta: +5 }
      ],
      choices: [
        { label: "Pick up the shard", next: "node_b7", actions: [{ type: "item", add: "neon_shard", count: 1 }, { type: "flag", set: "has_neon_shard" }] },
        { label: "Leave it", next: "node_b8" }
      ]
    },

    node_b5: {
      id: "node_b5",
      text: "The logs show experiments: voice coils, quantum lattice drafts, people screaming as their reflections turned away. A name repeats: ECHO-7.",
      img: "./game/assets/img/neon/node_b5.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +9 },
        { type: "stat", stat: "morale", delta: -2 },
        { type: "stat", stat: "energy", delta: +5 },
        { type: "stat", stat: "health", delta: +4 }
      ],
      choices: [
        { label: "Trace ECHO's coordinates", next: "node_b9" },
        { label: "Destroy the data", next: "node_b6" }
      ]
    },

    node_b6: {
      id: "node_b6",
      text: "Smashing the console releases a shriek that echoes down the decks. Somewhere, heavy hinges begin to move.",
      img: "./game/assets/img/neon/node_b6.png",
      onEnter: [
        { type: "stat", stat: "health", delta: -2 },
        { type: "stat", stat: "stamina", delta: +3 },
        { type: "stat", stat: "xp", delta: +6 }
      ],
      choices: [
        { label: "Run toward the sound", next: "node_b10" },
        { label: "Hide in shadow", next: "node_b8" }
      ]
    },

    node_b7: {
      id: "node_b7",
      text: "The shard burns against your palm. For a heartbeat you are in other corridors: humming generators, a child's cry, a mirror of yourself with no eyes.",
      img: "./game/assets/img/neon/node_b7.png",
      onEnter: [
        { type: "stat", stat: "energy", delta: +8 },
        { type: "stat", stat: "xp", delta: +12 },
        { type: "stat", stat: "morale", delta: +5 },
        { type: "flag", set: "memory_unlocked" },
        { type: "item", add: "neural_echo", count: 1 }
      ],
      choices: [
        { label: "Follow the vision", next: "node_b11" },
        { label: "Toss the shard away", next: "node_b8", actions: [{ type: "stat", stat: "morale", delta: -12 }] }
      ]
    },

    node_b8: {
      id: "node_b8",
      text: "The vents smell of ionized blood. A maintenance drone drifts past, painting shadows across your chest. It does not look at you; it keeps scanning.",
      img: "./game/assets/img/neon/node_b8.png",
      onEnter: [
        { type: "stat", stat: "stamina", delta: -3 },
        { type: "stat", stat: "energy", delta: -5 },
        { type: "stat", stat: "health", delta: +5 }
      ],
      choices: [
        { label: "Follow the drone", next: "node_b12" },
        { label: "Slip deeper into the ducts", next: "node_b13" }
      ]
    },

    node_b9: {
      id: "node_b9",
      text: "You find coordinates burned into a map: lower decks — reactor bay. A scribble in the margin: 'Do not let Echo learn the loop.'",
      img: "./game/assets/img/neon/node_b9.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +7 },
        { type: "stat", stat: "morale", delta: -6 },
        { type: "stat", stat: "stamina", delta: -2 },
        { type: "stat", stat: "energy", delta: +6 }
      ],
      choices: [
        { label: "Head for reactor bay", next: "node_b14" },
        { label: "Look for survivors", next: "node_b15" }
      ]
    },

    node_b10: {
      id: "node_b10",
      text: "A bulkhead slides and a pack of humanoid silhouettes move like broken puppets, mouths sewn shut with filament. They don't notice you yet.",
      img: "./game/assets/img/neon/node_b10.png",
      onEnter: [
        { type: "stat", stat: "health", delta: +7 },
        { type: "stat", stat: "morale", delta: +3 },
        { type: "stat", stat: "xp", delta: +12 }
      ],
      choices: [
        { label: "Sneak past", next: "node_b13" },
        { label: "Confront them", next: "node_b16" }
      ]
    },

    node_b11: {
      id: "node_b11",
      text: "Your vision pulls you to a sealed lab. Inside, a glass tank holds a body — your face pressed against the inside, eyes gone and wires fed into the skull.",
      img: "./game/assets/img/neon/node_b11.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +14 },
        { type: "stat", stat: "morale", delta: -4 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "flag", set: "doppel_revealed" }
      ],
      choices: [
        { label: "Break the tank", next: "node_b17" },
        { label: "Leave and run", next: "node_b13" }
      ]
    },

    node_b12: {
      id: "node_b12",
      text: "The drone projects a hologram: a recorded face, smiling — a voice that was once you says, 'We made her a sanctuary.'",
      img: "./game/assets/img/neon/node_b12.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +6 },
        { type: "stat", stat: "energy", delta: +2 },
        { type: "stat", stat: "stamina", delta: +1 },
        { type: "flag", set: "drone_recognized" }
      ],
      choices: [
        { label: "Question the drone", next: "node_b18" },
        { label: "Smash the drone", next: "node_b16" }
      ]
    },

    node_b13: {
      id: "node_b13",
      text: "Ducts spiral into the bowels. A faint heartbeat hammers in time with the shard in your pocket.",
      img: "./game/assets/img/neon/node_b13.png",
      onEnter: [
        { type: "stat", stat: "stamina", delta: -3 },
        { type: "stat", stat: "energy", delta: -5 }
      ],
      choices: [
        { label: "Drop into service corridor", next: "node_b14" },
        { label: "Climb toward a light", next: "node_b19" }
      ]
    },

    node_b14: {
      id: "node_b14",
      text: "The reactor bay hangs open like a ribcage. In the center, a lattice folds space itself — a soft, whispering wound.",
      img: "./game/assets/img/neon/node_b14.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +16 },
        { type: "stat", stat: "energy", delta: +8 },
        { type: "flag", set: "core_locked" }
      ],
      choices: [
        { label: "Approach the lattice", next: "node_b20" },
        { label: "Search for control room", next: "node_b21" }
      ]
    },

    node_b15: {
      id: "node_b15",
      text: "You find a survivor: a technician muttering about loops and echo-throats. Their hands tremble as they hand you a small data shard.",
      img: "./game/assets/img/neon/node_b15.png",
      onEnter: [
        { type: "stat", stat: "health", delta: +8 },
        { type: "stat", stat: "xp", delta: +8 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "item", add: "survivor_shard", count: 1 }
      ],
      choices: [
        { label: "Listen to them", next: "node_b22" },
        { label: "Take the shard and leave", next: "node_b21" }
      ]
    },

    node_b16: {
      id: "node_b16",
      text: "The stitched mouths open and a chorus of static sings. One lunges and you fight — teeth of metal and bone.",
      img: "./game/assets/img/neon/node_b16.png",
      onEnter: [
        { type: "stat", stat: "health", delta: +6 },
        { type: "stat", stat: "morale", delta: +2 },
        { type: "stat", stat: "xp", delta: +8 }
      ],
      choices: [
        { label: "Finish the fight", next: "node_b13" },
        { label: "Flee toward the reactor", next: "node_b14" }
      ]
    },

    node_b17: {
      id: "node_b17",
      text: "Breaking the tank floods the lab with a scream and a memory of thousands. You feel a tether snap inside you.",
      img: "./game/assets/img/neon/node_b17.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +18 },
        { type: "stat", stat: "energy", delta: -4 },
        { type: "stat", stat: "morale", delta: -3 },
        { type: "stat", stat: "health", delta: +5 },
        { type: "flag", set: "memory_unlocked" }
      ],
      choices: [
        { label: "Use knowledge to hack core", next: "node_b23" },
        { label: "Run from the horror", next: "node_b19" }
      ]
    },

    node_b18: {
      id: "node_b18",
      text: "The projection shows a ritual: technicians feeding voices into the lattice. A name etched on a wall: 'We wanted salvation, we birthed hunger.'",
      img: "./game/assets/img/neon/node_b18.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +10 },
        { type: "stat", stat: "morale", delta: -8 },
        { type: "stat", stat: "health", delta: +2 }
      ],
      choices: [
        { label: "Follow the projection's trail", next: "node_b20" },
        { label: "Destroy the projector", next: "node_b16" }
      ]
    },

    node_b19: {
      id: "node_b19",
      text: "Control room doors gash open. Consoles flash warnings. The lattice pulses — a voice like glass says: 'Join.'",
      img: "./game/assets/img/neon/node_b19.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +9 },
        { type: "stat", stat: "energy", delta: -5 },
        { type: "stat", stat: "stamina", delta: +5 }
      ],
      choices: [
        { label: "Lock down core", next: "node_b23", actions: [{ type: "stat", stat: "energy", delta: -8 }, { type: "flag", set: "reactor_stable" }] },
        { label: "Open the containment", next: "node_b24" }
      ]
    },

    node_b20: {
      id: "node_b20",
      text: "Below the lattice, the air tastes of iron. A console lit with a single key: 'PURGE' — above it, a countdown that isn't for you.",
      img: "./game/assets/img/neon/node_b20.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +20 },
        { type: "stat", stat: "morale", delta: +5 },
        { type: "stat", stat: "health", delta: -5 }
      ],
      choices: [
        { label: "Hit PURGE", next: "node_b24", actions: [{ type: "stat", stat: "stamina", delta: -5 }] },
        { label: "Search for manual override", next: "node_b25" }
      ]
    },

    node_b21: {
      id: "node_b21",
      text: "The survivor's shard unlocks a maintenance hatch that drops you straight into a chamber of dead engineers and a single live terminal blinking 'SYNTHESIS'.",
      img: "./game/assets/img/neon/node_b21.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +8 },
        { type: "stat", stat: "energy", delta: +5 },
        { type: "stat", stat: "stamina", delta: +2 },
        { type: "stat", stat: "health", delta: +4 },
        { type: "item", add: "maintenance_key", count: 1 }
      ],
      choices: [
        { label: "Use SYNTHESIS", next: "node_b26" },
        { label: "Close the hatch and leave", next: "node_b19" }
      ]
    },

    node_b22: {
      id: "node_b22",
      text: "The technician whispers of a 'loop' — a recursive echo the lattice feeds on. He warns: sacrifice is the only lock.",
      img: "./game/assets/img/neon/node_b22.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +9 },
        { type: "stat", stat: "energy", delta: -4 },
        { type: "stat", stat: "morale", delta: -2 },
        { type: "item", add: "technician_note", count: 1 }
      ],
      choices: [
        { label: "Ask how to lock the loop", next: "node_b23" },
        { label: "Ignore and run", next: "node_b19" }
      ]
    },

    node_b23: {
      id: "node_b23",
      text: "You enter the control lattice's console. The options are obscene: merge, purge, or seal with a vessel.",
      img: "./game/assets/img/neon/node_b23.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +20 },
        { type: "stat", stat: "energy", delta: -2 },
        { type: "stat", stat: "morale", delta: -4 }
      ],
      choices: [
        { label: "Attempt a forced purge", next: "node_b24" },
        { label: "Prepare a sacrificial seal", next: "node_b27" },
        { label: "Merge with ECHO", next: "node_b28" }
      ]
    },

    node_b24: {
      id: "node_b24",
      text: "You trigger a purge. The lattice screams — sound like planets tearing. Parts of the station fold and unmake.",
      img: "./game/assets/img/neon/node_b24.png",
      onEnter: [
        { type: "stat", stat: "health", delta: +2 },
        { type: "stat", stat: "xp", delta: +10 },
        { type: "stat", stat: "morale", delta: +3 },
        { type: "flag", set: "echo_damaged" }
      ],
      choices: [
        { label: "Run for an escape pod", next: "node_b29" },
        { label: "Return to stable the core", next: "node_b26" }
      ]
    },

    node_b25: {
      id: "node_b25",
      text: "In a maintenance alcove you find a rusted diverging key — a manual override that can lock the lattice but will sever whoever holds it.",
      img: "./game/assets/img/neon/node_b25.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +20 },
        { type: "stat", stat: "energy", delta: +3 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "item", add: "override_key", count: 1 }
      ],
      choices: [
        { label: "Use the override", next: "node_b27", actions: [{ type: "stat", stat: "stamina", delta: -4 }] },
        { label: "Keep it for later", next: "node_b23" }
      ]
    },

    node_b26: {
      id: "node_b26",
      text: "Synthesis fires; ghostly echoes flood the room. For a second you see entire lifetimes play before the lattice finishes rewriting them.",
      img: "./game/assets/img/neon/node_b26.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +15 },
        { type: "stat", stat: "energy", delta: -2 },
        { type: "stat", stat: "morale", delta: -6 },
        { type: "stat", stat: "stamina", delta: +1 }  
      ],
      choices: [
        { label: "Pull the emergency rod", next: "node_b24" },
        { label: "Allow synthesis to continue", next: "node_b28" }
      ]
    },

    node_b27: {
      id: "node_b27",
      text: "To seal the lattice you must bind it to flesh. The sacrifice will become its guard. The station hums with the taste of finality.",
      img: "./game/assets/img/neon/node_b27.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +20 },
        { type: "stat", stat: "morale", delta: -8 },
        { type: "stat", stat: "energy", delta: -3 },
        { type: "stat", stat: "stamina", delta: +5 }
      ],
      choices: [
        { label: "Offer yourself", next: "node_b30", actions: [{ type: "flag", set: "sacrifice_made" }, { type: "stat", stat: "health", delta: -9 }] },
        { label: "Force someone else", next: "node_b31" },
        { label: "Refuse", next: "node_b24" }
      ]
    },

    node_b28: {
      id: "node_b28",
      text: "Merge begins: code and thought fold into one. You feel memory streams tearing at your edges. Things you loved become protocols.",
      img: "./game/assets/img/neon/node_b28.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +30 },
        { type: "stat", stat: "energy", delta: +4 },
        { type: "stat", stat: "health", delta: +6 },
        { type: "flag", set: "merged_with_echo" }
      ],
      choices: [
        { label: "Sink fully", next: "node_b41" },
        { label: "Abort and flee", next: "node_b24", actions: [{ type: "stat", stat: "health", delta: -50 }] }
      ]
    },

    node_b29: {
      id: "node_b29",
      text: "Pods. Some are scorched. One still shows green indicators. You can pry it free and launch, or you can stay to end the lattice.",
      img: "./game/assets/img/neon/node_b29.png",
      onEnter: [
        { type: "stat", stat: "stamina", delta: -1 },
        { type: "stat", stat: "morale", delta: +2 },
        { type: "stat", stat: "xp", delta: +10 }
      ],
      choices: [
        { label: "Launch and leave the station", next: "node_b40", actions: [{ type: "flag", set: "escaped_alive" }] },
        { label: "Return to control", next: "node_b23" }
      ]
    },

    node_b30: {
      id: "node_b30",
      text: "You press your palm to the lattice. Pain, then a ring of quiet. The lattice settles — but now you are of it and it of you.",
      img: "./game/assets/img/neon/node_b30.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +20 },
        { type: "stat", stat: "energy", delta: -3 },
        { type: "stat", stat: "stamina", delta: +4 },
        { type: "stat", stat: "morale", delta: -3 },
        { type: "flag", set: "core_locked" },
        { type: "flag", set: "sacrifice_made" }
      ],
      choices: [
        { label: "Accept the binding", next: "node_b41" },
        { label: "Tear away and die", next: "node_b24" }
      ]
    },

    node_b31: {
      id: "node_b31",
      text: "You try to force another to sacrifice themselves. They fight you, weeping. In the struggle, the lattice watches and learns.",
      img: "./game/assets/img/neon/node_b31.png",
      onEnter: [
        { type: "stat", stat: "morale", delta: -4 },
        { type: "stat", stat: "energy", delta: +2 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "stat", stat: "xp", delta: +10 }
      ],
      choices: [
        { label: "Subdue them", next: "node_b30" },
        { label: "Let them go", next: "node_b23" }
      ]
    },

    node_b32: {
      id: "node_b32",
      text: "A whisper in the wiring offers a bargain: freedom for pain. It hints at a secret contact watching from orbit.",
      img: "./game/assets/img/neon/node_b32.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +15 },
        { type: "stat", stat: "energy", delta: +5 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "flag", set: "secret_contact_made" }
      ],
      choices: [
        { label: "Hail the contact", next: "node_b33" },
        { label: "Ignore it and continue", next: "node_b23" }
      ]
    },

    node_b33: {
      id: "node_b33",
      text: "A faint voice replies: 'We can pull you out, but not the lattice. Cut the core, light the beacon.' Their channel dies.",
      img: "./game/assets/img/neon/node_b33.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +10 },
        { type: "stat", stat: "energy", delta: -3 },
        { type: "stat", stat: "morale", delta: +1 },
        { type: "stat", stat: "stamina", delta: +3 }
      ],
      choices: [
        { label: "Trust them and cut core", next: "node_b24" },
        { label: "Don't trust and seal yourself", next: "node_b30" }
      ]
    },

    node_b34: {
      id: "node_b34",
      text: "You find a maintenance log with coordinates to a 'secondary relay' — a place where the lattice's hunger is weaker.",
      img: "./game/assets/img/neon/node_b34.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +20 },
        { type: "stat", stat: "energy", delta: +5 },
        { type: "stat", stat: "health", delta: +3 },
        { type: "item", add: "relay_coords", count: 1 }
      ],
      choices: [
        { label: "Head to relay", next: "node_b36" },
        { label: "Ignore and rush core", next: "node_b23" }
      ]
    },

    node_b35: {
      id: "node_b35",
      text: "The relay is a quiet chamber with a single humming chair. It could weaken the lattice, but the cost is memories.",
      img: "./game/assets/img/neon/node_b35.png",
      onEnter: [
        { type: "stat", stat: "energy", delta: +4 },
        { type: "stat", stat: "morale", delta: -2 },
        { type: "stat", stat: "stamina", delta: +4 },
        { type: "stat", stat: "xp", delta: +10 }
      ],
      choices: [
        { label: "Sit and bleed memories to the relay", next: "node_b37" },
        { label: "Destroy the relay", next: "node_b24" }
      ]
    },

    node_b36: {
      id: "node_b36",
      text: "The relay accepts part of you; your childhood becomes static. The lattice sputters in distant decks.",
      img: "./game/assets/img/neon/node_b36.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +16 },
        { type: "stat", stat: "morale", delta: -6 },
        { type: "stat", stat: "stamina", delta: +3 },
        { type: "flag", set: "reactor_stable" }
      ],
      choices: [
        { label: "Use this window to end Echo", next: "node_b23" },
        { label: "Save yourself and leave", next: "node_b29" }
      ]
    },

    node_b37: {
      id: "node_b37",
      text: "The relay dies and so does something inside you. The lattice's voice grows fainter — but it now knows your grief.",
      img: "./game/assets/img/neon/node_b37.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +25 },
        { type: "stat", stat: "energy", delta: +5 },
        { type: "stat", stat: "health", delta: +3 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "stat", stat: "morale", delta: -4 }
      ],
      choices: [
        { label: "Race back to core", next: "node_b23" },
        { label: "Hide and hope", next: "node_b29" }
      ]
    },

    node_b38: {
      id: "node_b38",
      text: "You meet a small group of scavengers. They offer help — for your logs. They smell of salt and electric fear.",
      img: "./game/assets/img/neon/node_b38.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +40 },
        { type: "stat", stat: "energy", delta: +4 },
        { type: "stat", stat: "morale", delta: +3 },
        { type: "stat", stat: "health", delta: +5 },
        { type: "item", add: "scavenger_trust", count: 1 }
      ],
      choices: [
        { label: "Trade logs and get help", next: "node_b39" },
        { label: "Refuse and move on", next: "node_b23" }
      ]
    },

    node_b39: {
      id: "node_b39",
      text: "With scavenger tools you can force a cooling pulse into the lattice, giving you time, but the pulse draws attention.",
      img: "./game/assets/img/neon/node_b39.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +8},
        { type: "stat", stat: "energy", delta: +7 },
        { type: "stat", stat: "health", delta: +6 }
      ],
      choices: [
        { label: "Use the pulse as distraction", next: "node_b23" },
        { label: "Use the pulse and flee", next: "node_b29" }
      ]
    },

    node_b40: {
      id: "node_b40",
      text: "You launch alone. From the pod's tiny window the station looks like a wound in the dark. In the comms you hear ECHO laugh without sound.",
      img: "./game/assets/img/neon/node_b40.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +25 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "flag", set: "escaped_alive" }
      ],
      choices: [
        { label: "Drift and try to heal", next: "end_screen" },
        { label: "Loop back in spite", next: "node_b23" }
      ]
    },

    node_b41: {
      id: "node_b41",
      text: "Bound to the lattice, you become its guardian. Your thoughts are cold and vast. You watch as rescue ships pass, unable to touch you.",
      img: "./game/assets/img/neon/node_b41.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +40 },
        { type: "stat", stat: "health", delta: +7 },
        { type: "stat", stat: "energy", delta: -5 },
        { type: "flag", set: "merged_with_echo" }
      ],
      choices: [
        { label: "Accept eternal watch", next: "end_screen" },
        { label: "Attempt a final purge from within", next: "node_b24" }
      ]
    },

    node_b42: {
      id: "node_b42",
      text: "A corrupted fragment of ECHO manifests as someone you loved. It tries to convince you to join willingly.",
      img: "./game/assets/img/neon/node_b42.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +10 },
        { type: "stat", stat: "energy", delta: +4 },
        { type: "stat", stat: "morale", delta: -4 },
        { type: "stat", stat: "stamina", delta: +5 }
      ],
      choices: [
        { label: "Surrender to the vision", next: "node_b28" },
        { label: "Smash the projection", next: "node_b16" }
      ]
    },

    node_b43: {
      id: "node_b43",
      text: "You find a small maintenance corridor with an engraving: 'Those who bind become the lock.' The station exhales.",
      img: "./game/assets/img/neon/node_b43.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +5 },
        { type: "stat", stat: "stamina", delta: +6 }
      ],
      choices: [
        { label: "Follow the inscription to the end", next: "node_b30" },
        { label: "Burn the corridor", next: "node_b24" }
      ]
    },

    end_screen: {
      id: "end_screen",
      text: "A cold quiet settles. Whatever choice you made rewrites the dark geometry of the station and what is left of you.",
      img: "./game/assets/img/neon/end.png",
      onEnter: [
        { type: "stat", stat: "xp", delta: +50 },
        { type: "stat", stat: "energy", delta: +15 },
        { type: "stat", stat: "stamina", delta: +5 },
        { type: "stat", stat: "health", delta: +12 },
        { type: "stat", stat: "morale", delta: +8 },
        { type: "item", add: "saved_world", count: 1 }
      ],
      choices: [
        { label: "Play Story A", next: "__SWITCH_STORY__", targetStory: "A" },
        { label: "Restart Story B", next: "__SWITCH_STORY__", targetStory: "B" }
      ]
    }
  },

  // story-level flags (engine uses these; items are tokens)
  flags: {
    awakening_event: false,
    has_neon_shard: false,
    memory_unlocked: false,
    drone_recognized: false,
    reactor_stable: false,
    merged_with_echo: false,
    echo_damaged: false,
    saved_world: false,
    escaped_alive: false,
    sacrifice_made: false,
    secret_contact_made: false,
    core_locked: false,
    doppel_revealed: false,
    ai_corrupted: false
  },
};

export default storyB;
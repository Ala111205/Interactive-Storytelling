// Story data object. Each key is a scene node.
// Keep text concise; you can expand nodes as needed.

const story = {
  start: {
    title: "Wake",
    img: "assets/img/crash.jpg",
    text: "You wake into the wreck of the survey shuttle — alarms sputter and a red glow bleeds through the hull. Your comms are dead. Outside: a barren landscape of black glass and violet sky.",
    choices: [
      { text: "Exit the shuttle", next: "outside" },
      { text: "Search the cockpit", next: "cockpit" }
    ],
    sound: "assets/sound/alert.mp3"
  },

  cockpit: {
    img: "assets/img/cockpit.jpg",
    text: "Inside the cockpit you find a small, damaged drone and a flickering datapad. The datapad shows a map and a cryptic message: 'Do not wake them.'",
    choices: [
      { text: "Repair the drone", next: "repairDrone", effect: (s) => { s.checked = true; } },
      { text: "Ignore and leave", next: "outside" }
    ]
  },

  repairDrone: {
    img: "assets/img/drone.jpg",
    text: "The drone boots with a whine. It identifies as 'ARID-1' and offers to assist. It can carry one item and occasionally scan for danger.",
    choices: [
      { text: "Take drone & go outside", next: "outside", effect: (s) => { s.drone = true; s.inventory.push('ARID-1'); } }
    ]
  },

  outside: {
    img: "assets/img/landscape.jpg",
    text: (s) => {
      if (s.drone) return "ARID-1 hovers behind you, scanning. On the horizon: a monolith of black glass and moving lights.";
      return "You step onto a brittle plain. Wind slices your suit. Far away a monolith of black glass catches the light.";
    },
    choices: [
      { text: "Approach the monolith", next: "monolith" },
      { text: "Walk along the ridge", next: "ridge" }
    ]
  },

  ridge: {
    img: "assets/img/ridge.jpg",
    text: "Walking the ridge, you find footprints — human, but old. A crater below contains a neon-blue plant pulsating softly.",
    choices: [
      { text: "Take a sample", next: "sample", effect: (s) => { s.inventory.push('Biolume'); } },
      { text: "Leave it and continue", next: "monolith" }
    ]
  },

  sample: {
    img: "assets/img/biolume.jpg",
    text: "You pocket the plant. A warmth spreads through your suit and energy trickles into your systems (+10 Energy).",
    choices: [
      { text: "Proceed to monolith", next: "monolith", effect: (s) => { s.stats.energy = Math.min(100, s.stats.energy + 10); } }
    ]
  },

  monolith: {
    img: "assets/img/monolith.jpg",
    text: "The monolith has carvings that look like star charts. Embedded: a sphere of humming light.",
    choices: [
      { text: "Touch the sphere", next: "sphere" },
      { text: "Scan it with drone", next: "scanSphere", cond: (s) => s.drone }
    ]
  },

  scanSphere: {
    img: "assets/img/drone_scan.jpg",
    text: "ARID-1 reveals a faint signal — the sphere resonates with a long-range beacon. It may call something in.",
    choices: [
      { text: "Disable the sphere", next: "disableSphere", effect: (s) => { s.inventory.push('BeaconCore'); } },
      { text: "Touch the sphere anyway", next: "sphere" }
    ]
  },

  disableSphere: {
    img: "assets/img/core.jpg",
    text: "You pry the core loose. It thrums in your hand. This could be valuable or dangerous.",
    choices: [
      { text: "Store core and continue", next: "valley" },
      { text: "Use core to power suit", next: "powerSuit", effect: (s) => { s.stats.health = Math.min(100, s.stats.health + 15); } }
    ]
  },

  powerSuit: {
    img: "assets/img/powersuit.jpg",
    text: "Power redistributed. Systems optimized. You feel steadier (+15 Health).",
    choices: [
      { text: "Head to valley", next: "valley" }
    ]
  },

  sphere: {
    img: "assets/img/sphere.jpg",
    text: (s) => s.stats.morale > 60 ? "You touch and you remember a home you barely recall. The sphere shares a memory — a colony's fall." : "You touch and a stab of grief pierces you. The sphere projects a memory of silence.",
    choices: [
      { text: "Accept memory and move on", next: "valley", effect: (s) => { s.stats.morale = Math.max(0, s.stats.morale - 10); s.remember = true; } }
    ]
  },

  valley: {
    img: "assets/img/valley.jpg",
    text: "A ruined city sits in the valley. In the center you see structures like machines grown from stone.",
    choices: [
      { text: "Explore the ruins", next: "ruins" },
      { text: "Sneak toward the machines", next: "machines" }
    ]
  },

  ruins: {
    img: "assets/img/ruins.jpg",
    text: "Among the ruins you find a survivor's shelter with a charred journal and half-eaten rations.",
    choices: [
      { text: "Read the journal", next: "journal", effect: (s) => { s.inventory.push('Journal'); } },
      { text: "Take the rations", next: "rations", effect: (s) => { s.stats.energy = Math.min(100, s.stats.energy + 20); } }
    ]
  },

  journal: {
    img: "assets/img/journal.jpg",
    text: "The journal hints at a 'Watcher' that protects the eggs of something beneath the city.",
    choices: [
      { text: "Find the eggs", next: "eggs" },
      { text: "Ignore the warning", next: "machines" }
    ]
  },

  rations: {
    img: "assets/img/rations.jpg",
    text: "Calories restored. You feel less faint.",
    choices: [
      { text: "Head to machines", next: "machines" }
    ]
  },

  machines: {
    img: "assets/img/machines.jpg",
    text: "The machines hum with unreadable purpose. A mechanized sentinel stirs when you approach.",
    choices: [
      { text: "Fight the sentinel", next: "fightSentinel" },
      { text: "Use stealth and sneak past", next: "sneakPast", cond: (s) => s.stats.energy > 40 }
    ]
  },

  fightSentinel: {
    img: "assets/img/sentinel.jpg",
    text: "Without heavy weapons the sentinel rips you with mechanical claws. You survive, but badly injured (-30 Health).",
    choices: [
      { text: "Retreat", next: "valley", effect: (s) => { s.stats.health = Math.max(0, s.stats.health - 30); } }
    ]
  },

  sneakPast: {
    img: "assets/img/stealth.jpg",
    text: "You slip through vents as the sentinel reconfigures. There is a chamber below filled with warm light.",
    choices: [
      { text: "Descend to chamber", next: "chamber" }
    ]
  },

  chamber: {
    img: "assets/img/chamber.jpg",
    text: "The chamber reveals tens of eggs, each pulsing. A gentle hum asks for safeguarding, not theft.",
    choices: [
      { text: "Protect the eggs", next: "protectEggs", effect: (s) => { s.stats.morale += 15; } },
      { text: "Take an egg", next: "takeEgg", effect: (s) => { s.inventory.push('Egg'); s.stats.morale -= 25; } }
    ]
  },

  protectEggs: {
    img: "assets/img/protect.jpg",
    text: "A soft intelligence acknowledges you and gifts guidance: 'Find the Heart.'",
    choices: [
      { text: "Ask what the Heart is", next: "heartexplain" },
      { text: "Leave and search", next: "heartJourney" }
    ],
    effect: (s) => { s.ally = true; }
  },

  takeEgg: {
    img: "assets/img/egg.jpg",
    text: "You steal an egg. The chamber trembles — alarms blind you and something large awakens (Morality -25).",
    choices: [
      { text: "Run", next: "chase" }
    ]
  },

  chase: {
    img: "assets/img/chase.jpg",
    text: "The creature hunts you. Your suit is damaged (-20 Health).",
    choices: [
      { text: "Hide in ruins", next: "hideRuins" },
      { text: "Fight back", next: "fightCreature" }
    ],
    effect: (s) => { s.stats.health = Math.max(0, s.stats.health - 20); }
  },

  hideRuins: {
    img: "assets/img/hideruins.jpg",
    text: "You hide until the predator loses interest. You survive but the egg is lost.",
    choices: [
      { text: "Regain your breath", next: "regain" }
    ],
    effect: (s) => { s.inventory = s.inventory.filter(i => i !== 'Egg'); }
  },

  regain: {
    img: "assets/img/regain.jpg",
    text: "You patch yourself up. The world is quiet now.",
    choices: [
      { text: "Head toward the Heart", next: "heartJourney" }
    ]
  },

  heartexplain: {
    img: "assets/img/heart.jpg",
    text: "They explain: 'The Heart is a node under the city that keeps reality stitched. It is damaged.'",
    choices: [
      { text: "Go find it", next: "heartJourney" }
    ]
  },

  heartJourney: {
    img: "assets/img/journey.jpg",
    text: "You descend into deeper tunnels. Past echoes twist into memory-lanes; you remember flashes of your home colony.",
    choices: [
      { text: "Follow the memory-lane", next: "memory" },
      { text: "Move straight to the Heart", next: "heart" }
    ]
  },

  memory: {
    img: "assets/img/memory.jpg",
    text: "You experience a fragment of who you once were. You gain resolve (+10 Morale).",
    choices: [
      { text: "Continue to Heart", next: "heart", effect: (s) => { s.stats.morale = Math.min(100, s.stats.morale + 10); } }
    ]
  },

  heart: {
    img: "assets/img/core_chamber.jpg",
    text: "The Heart's chamber is cracked. Energy fields sputter. The Beacon core you took resonates with a matching socket.",
    choices: [
      { text: "Use Beacon core to stabilize Heart", next: "stabilize", cond: (s) => s.inventory.includes('BeaconCore') },
      { text: "Try repairing with biotech", next: "bioRepair", cond: (s) => s.inventory.includes('Biolume') },
      { text: "Force it with raw power", next: "forceHeart" }
    ]
  },

  stabilize: {
    img: "assets/img/stabilize.jpg",
    text: "The core locks in. Pulses of light heal the tunnels; the world hums with gratitude. You have earned a safe ending.",
    choices: [],
    end: true,
    effect: (s) => { s.stats.morale = 100; s.ending = 'peace'; }
  },

  bioRepair: {
    img: "assets/img/biorepair.jpg",
    text: "Biolume interacts with the Heart, slowly knitting it back. It's fragile but hopeful.",
    choices: [
      { text: "Continue repair", next: "stabilize", effect: (s) => { s.stats.morale += 20; } }
    ]
  },

  forceHeart: {
    img: "assets/img/force.jpg",
    text: "You push raw power at the Heart. It flares violently — a fragment tears away and escapes into the sky. The world fractures; you survive but the colony is lost.",
    choices: [],
    end: true,
    effect: (s) => { s.ending = 'sacrifice'; s.stats.health = Math.max(0, s.stats.health - 60); }
  },

  fightCreature: {
    img: "assets/img/fight.jpg",
    text: "You strike back using whatever you have. It's brutal; you win but barely. The creature's blood warps into glyphs that heal you (+20 Health).",
    choices: [
      { text: "Go to Heart", next: "heart", effect: (s) => { s.stats.health = Math.min(100, s.stats.health + 20); } }
    ]
  },

  eggs: {
    img: "assets/img/eggs.jpg",
    text: "If the eggs are safe, something good may rise. If disturbed, worse. Your choice will shape the ending.",
    choices: [
      { text: "Protect the eggs", next: "protectEggs" },
      { text: "Take an egg", next: "takeEgg" }
    ]
  },

  ending_bad: {
    img: "assets/img/end_bad.jpg",
    text: "You left with greed in your hands. The colony fades and your name is lost to the wind. (Bad Ending)",
    choices: [],
    end: true,
    effect: (s) => { s.ending = 'bad'; }
  },

  ending_good: {
    img: "assets/img/end_good.jpg",
    text: "The Heart beat is steady; new life begins. The survivors sing your name. (Good Ending)",
    choices: [],
    end: true,
    effect: (s) => { s.ending = 'good'; s.stats.morale = 100; }
  }
};

// You can append more nodes or vary text with functions (node.text = s => ...).
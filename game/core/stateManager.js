import { eventBus } from "./eventBus.js";
import { ITEM_DATA } from "../data/items.js";

/* ---------------------------------------
   CONFIG
--------------------------------------- */
const SAVE_KEY = "ARIDIA_STATE_v1";

const DEFAULT_STATS = Object.freeze({
  health: 50,
  energy: 50,
  morale: 50,
  stamina: 50,
  xp: 0
});

/* ---------------------------------------
   INTERNAL STATE (single source)
--------------------------------------- */
const _state = {
  currentStory: "A",
  currentScene: "start",
  inventory: [],        // [{ id, count }]
  flags: {},            // { flagName: true }
  history: [],          // visited scenes
  stats: { ...DEFAULT_STATS }
};

/* ---------------------------------------
   EXPORTED FLAGS
--------------------------------------- */
export const gameFlags = {
  isRestoring: false
};

/* ---------------------------------------
   UTIL
--------------------------------------- */
function deepClone(v) {
  return structuredClone(v);
}

function safePersist() {
  // don't persist while performing a restore/import
  if (gameFlags.isRestoring) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateManager.export()));
  } catch (e) {
    console.error("[stateManager] persist failed:", e);
  }
}

function emitAll() {
  eventBus.emit("story:change", _state.currentStory);
  eventBus.emit("scene:change", _state.currentScene);
  eventBus.emit("inv:refresh", stateManager.getInventory());
  eventBus.emit("stats:updatedAll", stateManager.getStats());
}

/* ---------------------------------------
   STATE MANAGER
--------------------------------------- */
export const stateManager = {
  /* ========== INIT (auto-restore if saved) ========== */
  init() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // import will set gameFlags.isRestoring to true while applying
        this.import(parsed);
        return;
      } catch (e) {
        console.warn("[stateManager] saved data corrupted — resetting to defaults", e);
        this.reset();
        return;
      }
    }
    // No saved data -> emit current defaults
    emitAll();
  },

  /* ========== PERSIST API (call elsewhere if you need immediate save) ========== */
  persist() {
    safePersist();
  },

  /* ========== RESET ========== */
  reset() {
    _state.currentStory = "A";
    _state.currentScene = "start";
    _state.inventory = [];
    _state.flags = {};
    _state.history = [];
    _state.stats = { ...DEFAULT_STATS };

    emitAll();
    safePersist();
  },

  /* ========== STORY / SCENE ========== */
  setStory(id) {
    if (!id || id === _state.currentStory) return;
    _state.currentStory = id;
    eventBus.emit("story:change", id);
    safePersist();
  },

  get currentStory() {
    return _state.currentStory;
  },

  setScene(id) {
    if (!id || id === _state.currentScene) return;

    if (_state.currentScene) {
      _state.history.push(_state.currentScene);
    }

    _state.currentScene = id;
    eventBus.emit("scene:change", id);
    safePersist();
  },

  get currentScene() {
    return _state.currentScene;
  },

  goBack() {
    const prev = _state.history.pop();
    if (prev) {
      _state.currentScene = prev;
      eventBus.emit("scene:change", prev);
      safePersist();
    }
    return prev || null;
  },

  /* ========== FLAGS ========== */
  setFlag(name) {
    if (!name) return;
    _state.flags[name] = true;
    eventBus.emit("flag:set", name);
    safePersist();
  },

  hasFlag(name) {
    return !!_state.flags[name];
  },

  clearFlag(name) {
    delete _state.flags[name];
    eventBus.emit("flag:removed", name);
    safePersist();
  },

  /* ========== INVENTORY ========== */
  addItem(id, count = 1) {
    if (!id || count <= 0) return;
    const item = _state.inventory.find(i => i.id === id);
    if (item) item.count += Number(count);
    else _state.inventory.push({ id, count: Number(count) });

    eventBus.emit("inv:refresh", this.getInventory());
    safePersist();
  },

  removeItem(id, count = 1) {
    const item = _state.inventory.find(i => i.id === id);
    if (!item) return;

    item.count -= Number(count);
    if (item.count <= 0) _state.inventory = _state.inventory.filter(i => i.id !== id);

    eventBus.emit("inv:refresh", this.getInventory());
    safePersist();
  },

  clearInventory() {
    _state.inventory = [];
    eventBus.emit("inv:refresh", []);
    safePersist();
  },

  hasItem(id) {
    return _state.inventory.some(i => i.id === id);
  },

  getInventory() {
    return _state.inventory.map(entry => {
      const data = ITEM_DATA?.[entry.id] || {};
      return {
        id: entry.id,
        name: data.name || entry.id,
        effect: data.effect || null,
        count: entry.count
      };
    });
  },

  /* ========== STATS (canonical storage & emit) ========== */
  setStat(key, value) {
    if (!(key in _state.stats)) return;
    _state.stats[key] = Number(value);
    eventBus.emit("stats:updatedAll", this.getStats());
    safePersist();
  },

  modifyStat(key, amount = 0) {
    if (!(key in _state.stats)) return;
    _state.stats[key] = Number(_state.stats[key] || 0) + Number(amount);
    eventBus.emit("stats:updatedAll", this.getStats());
    safePersist();
  },

  setStats(newStats = {}) {
    for (const k in newStats) {
      if (k in _state.stats) _state.stats[k] = Number(newStats[k]);
    }
    eventBus.emit("stats:updatedAll", this.getStats());
    safePersist();
  },

  getStats() {
    return deepClone(_state.stats);
  },

  getDefaultStats() {
    return deepClone(DEFAULT_STATS);
  },

  /* ========== EXPORT / IMPORT (for saveSystem) ========== */
  export() {
    return {
      currentStory: _state.currentStory,
      currentScene: _state.currentScene,
      inventory: deepClone(_state.inventory),
      flags: deepClone(_state.flags),
      history: deepClone(_state.history),
      stats: deepClone(_state.stats)
    };
  },

  import(data = {}) {
    // import may be called by saveSystem during a restore. Use restoring flag to avoid autosave loops.
    gameFlags.isRestoring = true;

    _state.currentStory = data.currentStory ?? "A";
    _state.currentScene = data.currentScene ?? "start";
    _state.inventory = Array.isArray(data.inventory) ? deepClone(data.inventory) : [];
    _state.flags = (data.flags && typeof data.flags === "object") ? deepClone(data.flags) : {};
    _state.history = Array.isArray(data.history) ? deepClone(data.history) : [];

    // If saved stats exist, use them; otherwise fallback to defaults
    if (data.stats && typeof data.stats === "object") {
      _state.stats = { ...DEFAULT_STATS, ...data.stats };
    } else {
      _state.stats = { ...DEFAULT_STATS };
    }

    emitAll();

    // Clear restoring and return.
    gameFlags.isRestoring = false;
  }
};

export default stateManager;
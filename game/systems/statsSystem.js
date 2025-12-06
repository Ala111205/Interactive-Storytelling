import { eventBus } from "../core/eventBus.js";
import stateManager from "../core/stateManager.js";

// Default starting stats
export const DEFAULT_STATS = {
  health: 50,
  energy: 50,
  morale: 50,
  stamina: 50,
  xp: 0
};

// Maximum allowed per stat
export const MAX_STATS = {
  health: 100,
  energy: 100,
  morale: 100,
  stamina: 100,
  xp: 1000
};

const statsSystem = {
  stats: structuredClone(DEFAULT_STATS),

  _pending: {},
  _flushScheduled: false,
  _initialized: false,
  _locked: false,

  init() {
    console.log("[STATS INIT] Before:", stateManager.getStats?.());

    if (this._initialized) return;
    this._initialized = true;

    // Sync from stateManager on start
    eventBus.emit("stats:updatedAll", stateManager.getStats());

    eventBus.on("stats:modify", ({ stat, amount } = {}) => {
      if (this._locked) return;
      if (!stat || typeof amount !== "number") return;
      this.queueModify(stat, amount);
    });

    eventBus.on("stats:set", ({ stat, value } = {}) => {
      if (this._locked) return;
      if (!stat || typeof value !== "number") return;
      this.set(stat, value);
    });

    eventBus.on("stats:get", (cb) => {
      if (typeof cb === "function") cb(this.getAll());
    });

    eventBus.on("stats:reset", () => {
      this.reset();
      stateManager.set("stats", this.getAll());
    });

    console.log("[statsSystem] Initialized (stateManager-driven");
  },

  lock() {
    this._locked = true;
  },

  unlock() {
    this._locked = false;
  },

  queueModify(stat, amount) {
    if (!this.stats.hasOwnProperty(stat)) return;

    this._pending[stat] = (this._pending[stat] || 0) + amount;

    if (!this._flushScheduled) {
      this._flushScheduled = true;
      requestAnimationFrame(() => this._flush());
    }
  },

  _flush() {
    this._flushScheduled = false;

    const pending = { ...this._pending };
    this._pending = {};

    Object.entries(pending).forEach(([stat, delta]) => {
      this._applyDelta(stat, delta);
    });

    stateManager.setStats(this.getAll());

    eventBus.emit("stats:updatedAll", this.getAll());
  },

  _applyDelta(stat, delta) {
    if (!this.stats.hasOwnProperty(stat)) return;

    const max = MAX_STATS[stat] ?? 999;
    const value = Math.min(Math.max(0, this.stats[stat] + delta), max);

    this.stats[stat] = value;
    eventBus.emit("stats:update", { stat, value });
  },

  set(stat, value) {
    if (!this.stats.hasOwnProperty(stat)) return;

    const max = MAX_STATS[stat] ?? 999;
    const v = Math.min(Math.max(0, Number(value) || 0), max);

    this.stats[stat] = v;

    eventBus.emit("stats:update", { stat, value: v });
    eventBus.emit("stats:updatedAll", this.getAll());
  },

  setAll(newStats = {}) {
    this._pending = {};
    this.stats = structuredClone(DEFAULT_STATS);

    Object.keys(this.stats).forEach(stat => {
      if (typeof newStats[stat] === "number") {
        const max = MAX_STATS[stat] ?? 999;
        this.stats[stat] = Math.min(Math.max(0, newStats[stat]), max);
      }
    });

    Object.entries(this.stats).forEach(([stat, value]) => {
      eventBus.emit("stats:update", { stat, value });
    });

    eventBus.emit("stats:updatedAll", this.getAll());
  },

  get(stat) {
    return this.stats[stat] ?? 0;
  },

  getAll() {
    return structuredClone(this.stats);
  },

  reset() {
    this._pending = {};
    this.stats = structuredClone(DEFAULT_STATS);

    // Force UI full sync
    Object.entries(this.stats).forEach(([stat, value]) => {
      eventBus.emit("stats:update", { stat, value });
    });

    eventBus.emit("stats:updatedAll", this.getAll());
  },

  clear() {
    this._pending = {};
    this._flushScheduled = false;
    this._initialized = false;
    this._locked = false;
    this.stats = structuredClone(DEFAULT_STATS);
  }
};

export default statsSystem;
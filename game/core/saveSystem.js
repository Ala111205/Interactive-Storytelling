import { eventBus } from "./eventBus.js";
import { stateManager } from "./stateManager.js";
import { storyLoader } from "../story/storyLoader.js";
import sceneManager from "./sceneManager.js";

const STORAGE_KEY = "aridia_manual_slots";
const SAVE_VERSION = 1;

const saveSystem = {
  slots: [null, null, null],
  _restoring: false,

  /* ================= INIT ================= */
  init({ freshStart = false } = {}) {
    if (freshStart) {
      localStorage.removeItem(STORAGE_KEY);
      this.slots = [null, null, null];
    } else {
      this._loadSlotsFromStorage();
    }

    // Manual only. NOTHING else listens to saves.
    eventBus.on("save:manual", (slot = 0) => this.save(slot));
  },

  /* ================= STORAGE ================= */
  _loadSlotsFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      this.slots = [null, null, null];
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 3) {
        this.slots = parsed;
      } else {
        this.slots = [null, null, null];
      }
    } catch {
      this.slots = [null, null, null];
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  _flushToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.slots));
  },

  /* ================= SNAPSHOT ================= */
  createSnapshot() {
    const story = stateManager.currentStory;
    const scene = stateManager.currentScene;

    const cleanState = {
      story,
      scene,
      stats: stateManager.getStats?.() || {},
      flags: stateManager.getFlags?.() || {},
      inventory: stateManager.getInventory?.() || []
    };

    return {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      story,
      storyName: story === "B" ? "Story B" : "Story A",
      scene,
      lastAction: `Reached ${scene}`,
      payload: btoa(JSON.stringify(cleanState))
    };
  },

  /* ================= SAVE ================= */
  save(slot = 0) {
    if (this._restoring) return;
    if (slot < 0 || slot > 2) return;

    const snapshot = this.createSnapshot();
    this.slots[slot] = snapshot;

    this._flushToStorage();

    eventBus.emit("save:updated", { slot, snapshot });
    console.log(`💾 MANUAL SAVE → SLOT ${slot + 1}`, snapshot);
  },

  /* ================= LOAD ================= */
  async load(slot = 0) {
    const data = this.slots[slot];

    if (!data || !data.payload) {
      console.error("❌ Empty slot", slot);
      return false;
    }

    let savedState;

    try {
      savedState = JSON.parse(atob(data.payload));
    } catch (err) {
      console.error("❌ Corrupt payload", err);
      return false;
    }

    this._restoring = true;
    eventBus.emit("save:restore:start");

    console.log("📥 RESTORING", savedState);

    // Ensure correct story is loaded first
    if (storyLoader.loadedId !== savedState.story) {
      await storyLoader.load(savedState.story);
    }

    // Restore state completely
    stateManager.setStory(savedState.story);
    stateManager.setScene(savedState.scene);

    stateManager.setStats(savedState.stats || {});
    stateManager.setFlag(savedState.flags || {});
    stateManager.getInventory(savedState.inventory || []);

    // Force real scene load
    await sceneManager.loadScene(savedState.scene, { silent: true });

    // Force UI refresh
    eventBus.emit("inv:refresh", stateManager.getInventory());
    eventBus.emit("stats:updatedAll", stateManager.getStats());

    this._restoring = false;
    eventBus.emit("save:restored", slot);

    console.log("✅ LOADED SLOT", slot + 1, "→", savedState.scene);

    return true;
  },

  /* ================= UI / API ================= */
  getSlots() {
    return this.slots.map((s) => {
      if (!s || s.version !== SAVE_VERSION) return null;

      return {
        story: s.story,
        storyName: s.storyName,
        scene: s.scene,
        lastAction: s.lastAction,
        timestamp: s.timestamp
      };
    });
  },

  clearSlot(slot = 0) {
    if (slot < 0 || slot > 2) return;

    this.slots[slot] = null;
    this._flushToStorage();

    eventBus.emit("save:cleared", slot);
  },

  clearAll() {
    this.slots = [null, null, null];
    localStorage.removeItem(STORAGE_KEY);

    eventBus.emit("save:cleared:all");
  },

  isRestoring() {
    return this._restoring;
  }
};

export default saveSystem;
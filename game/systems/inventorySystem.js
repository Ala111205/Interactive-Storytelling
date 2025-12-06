import { eventBus } from "../core/eventBus.js";
import { stateManager, gameFlags } from "../core/stateManager.js";

/**
 * - Single source-of-truth is stateManager
 * - Emits: inv:refresh (UI snapshot), inv:changed (for autosave), inv:added, inv:removed
 * - Respects gameFlags.isRestoring and saveSystem.isRestoring (if present)
 */

const inventorySystem = {
  _inited: false,
  // small debounce to collapse rapid add/remove bursts before autosave
  _changeTimer: null,
  _debounceMs: 120,

  init({ addDefaults = false } = {}) {
    if (this._inited) return;
    this._inited = true;

    // Action requests from story layer
    eventBus.on("inv:add-request", ({ id, count = 1 } = {}) => {
      this._handleAdd(id, count);
    });
    eventBus.on("inv:remove-request", ({ id, count = 1 } = {}) => {
      this._handleRemove(id, count);
    });

    // Public commands (external systems)
    eventBus.on("inventory:add", ({ id, count = 1 } = {}) => {
      this._handleAdd(id, count);
    });
    eventBus.on("inventory:remove", ({ id, count = 1 } = {}) => {
      this._handleRemove(id, count);
    });

    // Clear inventory (explicit)
    eventBus.on("inventory:clear", ({ silent = false } = {}) => {
      this.clear(silent);
    });

    // When state manager loads/resets, refresh UI from canonical state
    eventBus.on("state:load", () => {
      eventBus.emit("inv:refresh", stateManager.getInventory());
    });
    eventBus.on("state:reset", () => {
      eventBus.emit("inv:refresh", stateManager.getInventory());
    });

    // Support direct queries
    eventBus.on("inventory:get", (cb) => {
      if (typeof cb === "function") cb(stateManager.getInventory());
    });

    console.log("[InventorySystem] initialized (idempotent)");
  },

  // central change notifier (debounced for autosave)
  _notifyChange() {
    // Always emit refresh immediately so UI updates quick
    const snapshot = stateManager.getInventory();
    eventBus.emit("inv:refresh", snapshot);

    // Debounced "changed" for autosave (don't fire during restoring)
    if (gameFlags.isRestoring) return;
    if (typeof eventBus !== "undefined") {
      if (this._changeTimer) clearTimeout(this._changeTimer);
      this._changeTimer = setTimeout(() => {
        this._changeTimer = null;
        eventBus.emit("inv:changed", snapshot);
      }, this._debounceMs);
    }
  },

  _handleAdd(id, count = 1) {
    if (!id || typeof id !== "string") {
      console.warn("[InventorySystem] add: invalid id", id);
      return;
    }
    count = Math.max(0, Math.floor(Number(count) || 0));
    if (count === 0) return;

    // Prevent adds while restoring (prevents stale re-injection)
    if (gameFlags.isRestoring) {
      console.warn("[InventorySystem] add ignored while restoring:", id, count);
      return;
    }

    // Use canonical stateManager API
    if (typeof stateManager.addItem === "function") {
      stateManager.addItem(id, count);
    } else {
      // fallback: ensure internal structure exists
      if (!stateManager._state) stateManager._state = {};
      stateManager._state.inventory = stateManager._state.inventory || {};
      stateManager._state.inventory[id] = (stateManager._state.inventory[id] || 0) + count;
    }

    // Emit informative events
    const total = stateManager.getTotalInventoryCount?.() ?? (stateManager.getInventory().reduce((s, it) => s + (it.count || 0), 0));
    eventBus.emit("inv:added", { id, count, total });
    eventBus.emit("inv:add", { id, count }); // legacy

    // Notify UI and autosave (debounced)
    this._notifyChange();
  },

  _handleRemove(id, count = 1) {
    if (!id || typeof id !== "string") {
      console.warn("[InventorySystem] remove: invalid id", id);
      return;
    }
    count = Math.max(0, Math.floor(Number(count) || 0));
    if (count === 0) return;

    // Prevent removes while restoring
    if (gameFlags.isRestoring) {
      console.warn("[InventorySystem] remove ignored while restoring:", id, count);
      return;
    }

    let ok = false;
    if (typeof stateManager.removeItem === "function") {
      ok = stateManager.removeItem(id, count);
    } else {
      if (!stateManager._state) stateManager._state = {};
      stateManager._state.inventory = stateManager._state.inventory || {};
      const cur = stateManager._state.inventory[id] || 0;
      if (cur <= 0) ok = false;
      else {
        const remain = Math.max(0, cur - count);
        if (remain === 0) delete stateManager._state.inventory[id];
        else stateManager._state.inventory[id] = remain;
        ok = true;
      }
    }

    if (!ok) return;

    const total = stateManager.getTotalInventoryCount?.() ?? (stateManager.getInventory().reduce((s, it) => s + (it.count || 0), 0));
    eventBus.emit("inv:removed", { id, count, total });
    eventBus.emit("inv:remove", { id, count });

    // Notify UI and autosave
    this._notifyChange();
  },

  // programmatic API
  addItem(id, count = 1) {
    // convenient wrapper; respect restoring
    if (gameFlags.isRestoring) return;
    this._handleAdd(id, count);
  },
  removeItem(id, count = 1) { this._handleRemove(id, count); },

  getAll() {
    return stateManager.getInventory();
  },

  // Replace inventory fully (used by save restore or admin)
  replaceInventory(itemsArray = []) {

    if (typeof stateManager.replaceInventory === "function") {
      stateManager.replaceInventory(itemsArray);
    } else {
      // fallback: reconstruct stateManager._state.inventory
      if (!stateManager._state) stateManager._state = {};
      const map = {};
      if (Array.isArray(itemsArray)) {
        for (const it of itemsArray) {
          if (!it || !it.id) continue;
          map[it.id] = (map[it.id] || 0) + (it.count || 0);
        }
      } else if (typeof itemsArray === "object") {
        // assume map id->count
        Object.assign(map, itemsArray);
      }
      stateManager._state.inventory = map;
    }

    // Emit refresh but do not auto-save if restoring
    eventBus.emit("inv:refresh", stateManager.getInventory());
    if (!gameFlags.isRestoring) eventBus.emit("inv:changed", stateManager.getInventory());
  },

  // Clear inventory; silent true avoids emitting inv:changed (useful during restart)
  clear(silent = false) {
    if (typeof stateManager.replaceInventory === "function") {
      stateManager.replaceInventory([]);
    } else {
      if (!stateManager._state) stateManager._state = {};
      stateManager._state.inventory = {};
    }

    eventBus.emit("inv:refresh", stateManager.getInventory());
    if (!silent) {
      eventBus.emit("inv:clear");
      eventBus.emit("inv:changed", stateManager.getInventory());
    }
  }
};

export default inventorySystem;
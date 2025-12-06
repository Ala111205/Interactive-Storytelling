import statsSystem from "./statsSystem.js";
import { stateManager } from "../core/stateManager.js";
import saveSystem from "../core/saveSystem.js";
import { eventBus } from "../core/eventBus.js";

// robust: works regardless of whether stateManager exposes setStats/getStats

export async function applyChoiceStats(choice = {}) {
  if (!choice || !choice.stats) return;

  // emit modifications into statsSystem (batched)
  Object.entries(choice.stats).forEach(([stat, amount]) => {
    // prefer event-driven API (keeps statsSystem consistent)
    eventBus.emit("stats:modify", { stat, amount });
  });

  // wait a frame so statsSystem's requestAnimationFrame flush runs
  await new Promise(resolve => requestAnimationFrame(resolve));

  // read canonical stats from statsSystem
  const snapshot = (typeof statsSystem.getAll === "function") ? statsSystem.getAll() : {};

  // write into stateManager so save snapshots include stats
  if (typeof stateManager.setStats === "function") {
    stateManager.setStats(snapshot);
  } else if (typeof stateManager.setStats === "undefined" && stateManager) {
    // best-effort fallback — directly touch internal state if present
    if (stateManager._state) stateManager._state.stats = { ...snapshot };
    else stateManager.stats = { ...snapshot };
    // emit update for UI-consumers
    eventBus.emit("stats:updatedAll", snapshot);
  }

  // ensure UI sync (some components listen to this)
  eventBus.emit("stats:updatedAll", snapshot);

  // persist immediately (autosave or manual slot 0)
  if (typeof saveSystem.save === "function") {
    try { saveSystem.save(0); } catch (e) { try { saveSystem.autoSave?.(); } catch {} }
  } else {
    saveSystem.autoSave?.();
  }
}
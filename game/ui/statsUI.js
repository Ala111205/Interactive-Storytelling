import statsSystem, { MAX_STATS } from "../systems/statsSystem.js";
import { eventBus } from "../core/eventBus.js";

function updateStatBar(stat, value) {
  const bar = document.getElementById(`bar-${stat}`);
  if (!bar) {
    // helpful debug message once
    // console.warn("updateStatBar: missing DOM element for", stat);
    return;
  }
  const max = MAX_STATS[stat] ?? 100;
  const pct = (value / max) * 100;
  const clampedPct = Math.max(0, Math.min(100, pct));
  bar.style.width = clampedPct + "%";
}

function renderStats() {
  const all = statsSystem.getAll();
  for (const stat in all) updateStatBar(stat, all[stat]);
}

export function initStatsUI() {
  // Single-stat updates
  eventBus.on("stats:updated", ({ stat, value }) => updateStatBar(stat, value));
  // All stats update (e.g., reset)
  eventBus.on("stats:updatedAll", () => renderStats());
  // initial render from model
  renderStats();
}
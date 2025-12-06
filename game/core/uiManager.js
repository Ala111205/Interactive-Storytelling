// uiManager.js
import { eventBus } from "../core/eventBus.js";
import saveSystem from "../core/saveSystem.js";
import { stateManager } from "../core/stateManager.js";
import { MAX_STATS } from "../systems/statsSystem.js";

const DOM = {};

export const uiManager = {
  init,
  renderInventory,
  renderSaveSlots,
  updateStat,
  updateAllStats
};

// ==========================================================
// INIT
// ==========================================================
function init() {
  cacheElements();

  renderInventory(stateManager.getInventory());
  renderSaveSlots(saveSystem.getSlots());

  // Event hooks
  eventBus.on("inv:refresh", renderInventory);
  eventBus.on("stats:update", updateStat);
  eventBus.on("stats:updatedAll", updateAllStats);
  eventBus.on("save:slotsUpdated", renderSaveSlots);

  console.log("%c[UI] Ready", "color: cyan");
}

// ==========================================================
// CACHE ELEMENTS
// ==========================================================
function cacheElements() {
  DOM.invList   = document.getElementById("inventory-list");
  DOM.invCount  = document.getElementById("inv-count");
  DOM.saveSlots = document.getElementById("save-slots");
}

// ==========================================================
// INVENTORY RENDER
// ==========================================================
function renderInventory(items = []) {
  if (!DOM.invList || !DOM.invCount) return;

  DOM.invList.innerHTML = "";
  if (!items.length) {
    DOM.invList.textContent = "Inventory is empty.";
    DOM.invCount.textContent = "0";
    return;
  }

  items.forEach(item => {
    const el = document.createElement("div");
    el.className = "inventory-item";
    el.textContent = `${item.name} x${item.count}`;
    DOM.invList.appendChild(el);
  });

  DOM.invCount.textContent = items.reduce((sum, i) => sum + i.count, 0);
}

// ==========================================================
// SAVE SLOTS RENDER
// ==========================================================
function renderSaveSlots(slots = saveSystem.getSlots()) {
  if (!DOM.saveSlots) return;

  DOM.saveSlots.innerHTML = "";

  slots.forEach((slot, idx) => {
    const btn = document.createElement("button");
    btn.textContent = slot ? `Slot ${idx + 1} — ${slot.name}` : `Slot ${idx + 1} — Empty`;
    btn.addEventListener("click", async () => {
      if (!slot) return;
      await saveSystem.load(idx);
      eventBus.emit("inv:refresh", stateManager.getInventory());
      eventBus.emit("stats:updatedAll", stateManager.getStats());
    });
    DOM.saveSlots.appendChild(btn);
  });
}

// ==========================================================
// STATS UPDATE
// ==========================================================
function updateStat({ stat, value }) {
  const row = document.querySelector(`.stat-row[data-stat="${stat}"]`);
  if (!row) return;

  const bar = row.querySelector(".bar-fill");
  const num = row.querySelector(".stat-value");
  if (!bar || !num) return;

  const max = MAX_STATS[stat] || 100;
  const clamped = Math.min(Math.max(0, value), max);
  bar.style.width = (clamped / max) * 100 + "%";
  num.textContent = clamped;
}

function updateAllStats(allStats) {
  Object.entries(allStats).forEach(([stat, value]) =>
    updateStat({ stat, value })
  );
}

export { updateStat, updateAllStats };
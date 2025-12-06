import { engine } from "./game/core/engine.js";
import { sceneManager } from "./game/core/sceneManager.js";
import { stateManager } from "./game/core/stateManager.js";
import saveSystem from "./game/core/saveSystem.js";
import { audioManager } from "./game/core/audioManager.js";
import { unlockAudioOnFirstInput, queueUnlock } from "./tap-start.js";
import { eventBus } from "./game/core/eventBus.js";
import inventorySystem from "./game/systems/inventorySystem.js";
import { storyLoader } from "./game/story/storyLoader.js";
import dialogueSystem from "./game/systems/dialogueSystem.js";
import statsSystem from "./game/systems/statsSystem.js";
import { uiManager } from "./game/core/uiManager.js";

/* ---------------------------------------
   TIMESTAMP FORMATTER
--------------------------------------- */
function formatTimestamp(ms) {
  if (!ms) return "No timestamp";

  const date = new Date(ms);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${mins}`;
}

/* ---------------------------------------
   ACTION LOG
--------------------------------------- */
const logList = document.getElementById("log-list");

function addToActionLog(text) {
  if (!logList) return;
  const item = document.createElement("div");
  item.className = "log-item";
  item.textContent = text;
  logList.prepend(item);
}

/* ---------------------------------------
   AUDIO UNLOCK
--------------------------------------- */
unlockAudioOnFirstInput();

queueUnlock(() => {
  eventBus.emit("audio:unlocked");

  const current = stateManager.currentStory || "A";
  audioManager.playForStory(current);

  addToActionLog(`🔓 Audio unlocked for story ${current}`);
});

/* ---------------------------------------
   BOOT
--------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[MAIN] Booting...");

  await engine.init("A");

  inventorySystem.init();
  statsSystem.init();
  uiManager.init();

  saveSystem.init({
    onChange: renderSaveSlots
  });

  renderSaveSlots();
  setupUIEvents();

  addToActionLog("✅ Game Initialized");
});

/* ---------------------------------------
   UI EVENTS
--------------------------------------- */
function setupUIEvents() {

  // ---- helper: replace + return fresh button ----
  function resetBtn(id) {
    const oldBtn = document.getElementById(id);
    if (!oldBtn) return null;

    const newBtn = oldBtn.cloneNode(true);
    oldBtn.replaceWith(newBtn);
    return newBtn;
  }

  // ---- reset main buttons ----
  const btnInv     = resetBtn("btn-inv");
  const btnSave    = resetBtn("btn-save");
  const btnLoad    = resetBtn("btn-load");
  const btnBack    = resetBtn("btn-back");
  const btnRestart = resetBtn("btn-restart");
  const btnMusic   = resetBtn("btn-music");

  // ---- reset modal close buttons ----
  const closeInv   = resetBtn("close-inv");
  const closeSave  = resetBtn("close-save");
  const closeLoad  = resetBtn("close-load");

  const invModal  = document.getElementById("inventory-modal");
  const saveModal = document.getElementById("save-modal");
  const loadModal = document.getElementById("load-modal");

  if (btnMusic) btnMusic.textContent = "♪";

  // ==================== INVENTORY ====================
  btnInv?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    invModal.classList.toggle("hidden");
    eventBus.emit("inventory:get", renderInventory);
  });

  closeInv?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    invModal.classList.add("hidden");
  });

  // ==================== SAVE ====================
  btnSave?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    saveModal.classList.remove("hidden");
    renderSaveSlots();
  });

  closeSave?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    saveModal.classList.add("hidden");
  });

  // ==================== LOAD ====================
  btnLoad?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    loadModal.classList.remove("hidden");
    renderLoadSlots();
  });

  closeLoad?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    loadModal.classList.add("hidden");
  });

  // ==================== BACK ====================
  btnBack?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    sceneManager.goBack();
  });

  // ==================== MUSIC ====================
  btnMusic?.addEventListener("click", () => {
    audioManager.playSFX("sfxPick");
    audioManager.toggleMusic();
  });

  // ==================== RESTART ====================
  btnRestart?.addEventListener("click", async () => {
    audioManager.playSFX("sfxPick");
    const ok = confirm("Restart?");
    if (!ok) return;

    await restartGame();
  });

  // ==================== RESET ALL SLOTS ICON ====================
  const resetIcon = document.querySelector(".fa-arrow-rotate-right");

  if (resetIcon && !resetIcon.dataset.bound) {
    resetIcon.dataset.bound = "true";

    let isSpinning = false;

    resetIcon.addEventListener("click", async () => {
      const hasAnySave = saveSystem.slots.some(s => s !== null);

      if (!hasAnySave) {
        alert("Slots are already empty");
        return;
      }

      const ok = confirm("Clear ALL save slots?");
      if (!ok || isSpinning) return;

      isSpinning = true;

      gsap.to(resetIcon, {
        rotation: "+=360",
        scale: 1.15,
        duration: 0.6,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
        onComplete: async () => {
          gsap.to(resetIcon, { scale: 1, duration: 0.15 });

          await saveSystem.clearAll();
          await renderSaveSlots();

          isSpinning = false;
        }
      });
    });
  }

  // ==================== HOLD TO DELETE SLOT ====================

  let holdTimer = null;
  let isHolding = false;

  function startHold(e) {
    const slotEl = e.target.closest(".save-slot-btn, .slot-row");
    if (!slotEl) return;

    e.preventDefault();

    const slotIndex = Number(slotEl.dataset.slot ?? slotEl.dataset.index);
    if (isNaN(slotIndex)) return;

    isHolding = true;

    holdTimer = setTimeout(() => {
      if (!isHolding) return;

      if (!saveSystem.slots[slotIndex]) {
        alert("This slot is already empty");
        return;
      }

      const confirmDelete = confirm(`Clear Slot ${slotIndex + 1}?`);
      if (!confirmDelete) return;

      saveSystem.clearSlot(slotIndex);
      renderSaveSlots();

      isHolding = false;
    }, 800);
  }

  function cancelHold() {
    isHolding = false;

    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  // Remove old listeners first — then rebind once
  document.removeEventListener("pointerdown", startHold);
  document.removeEventListener("pointerup", cancelHold);
  document.removeEventListener("pointercancel", cancelHold);
  document.removeEventListener("pointerleave", cancelHold);

  document.addEventListener("pointerdown", startHold, { passive: false });
  document.addEventListener("pointerup", cancelHold);
  document.addEventListener("pointercancel", cancelHold);
  document.addEventListener("pointerleave", cancelHold);
  document.addEventListener("scroll", cancelHold);
}

/* ---------------------------------------
   INVENTORY RENDER
--------------------------------------- */
function renderInventory(items = []) {
  const container = document.getElementById("inventory-list");
  const countElem = document.getElementById("inv-count");

  if (!container || !countElem) return;

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `<p class="inv-empty">Inventory empty</p>`;
    countElem.textContent = "0";
    return;
  }

  let total = 0;

  items.forEach(item => {
    const count = Number(item.count) || 0;
    total += count;

    const div = document.createElement("div");
    div.className = "inventory-item";
    div.textContent = `${item.name || item.id} × ${count}`;

    container.appendChild(div);
  });

  countElem.textContent = total;
}

/* ---------------------------------------
   SAVE SLOTS (SAVE SCREEN)
--------------------------------------- */
export function renderSaveSlots() {
  const container = document.getElementById("save-slots");
  if (!container) return;

  const slots = saveSystem.getSlots();
  container.innerHTML = "";

  slots.forEach((slot, index) => {
    const btn = document.createElement("button");
    btn.className = "save-slot-btn";
    btn.dataset.slot = index;

    if (!slot) {
      btn.textContent = `Slot ${index + 1} — Empty`;
    } else {
      btn.innerHTML = `
        Slot ${index + 1}<br>
        ${slot.storyName}<br>
        ${slot.timestamp ? new Date(slot.timestamp).toLocaleString() : ""}
      `;
    }

    btn.onclick = () => {
      saveSystem.save(index);
      addToActionLog(`💾 Saved Slot ${index + 1} — ${stateManager.currentScene}`);
      renderSaveSlots();
    };

    container.appendChild(btn);
  });
}

/* ---------------------------------------
   LOAD SLOTS (LOAD SCREEN)
--------------------------------------- */
export function renderLoadSlots() {
  const container = document.getElementById("load-slots");
  const details = document.getElementById("slot-details");
  const detailStory = document.getElementById("detail-story");
  const detailAction = document.getElementById("detail-action");
  const loadBtn = document.getElementById("load-selected");

  if (!container) return;

  const slots = saveSystem.getSlots();
  container.innerHTML = "";
  details?.classList.add("hidden");
  if (loadBtn) loadBtn.onclick = null;

  slots.forEach((slot, index) => {
    const row = document.createElement("div");
    row.className = "slot-row";
    row.dataset.index = index;

    if (!slot) {
      row.innerHTML = `<span><b>Slot ${index + 1}</b> — Empty</span>`;
      container.appendChild(row);
      return;
    }

    row.innerHTML = `
      <b>Slot ${index + 1}</b>
      <span>${slot.storyName}</span>
      <span>${slot.timestamp ? new Date(slot.timestamp).toLocaleString() : ""}</span>
    `;

    row.onclick = () => {
      details?.classList.remove("hidden");
      if (detailStory) detailStory.textContent = `Story: ${slot.storyName}`;
      if (detailAction) detailAction.textContent = `Last Action: ${slot.lastAction}`;

      if (loadBtn) {
        loadBtn.onclick = async () => {
          const ok = await saveSystem.load(index);
          if (!ok) {
            console.error("❌ LOAD FAILED");
            return;
          }

          audioManager.playForStory(slot.story);
          addToActionLog(`📂 Loaded Slot ${index + 1} — ${slot.storyName}`);
          document.getElementById("load-modal")?.classList.add("hidden");
          console.log("✅ Slot loaded:", slot.scene);
        };
      }
    };

    container.appendChild(row);
  });
}

/* ---------------------------------------
   START STORY
--------------------------------------- */
document.querySelectorAll("[data-story]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const story = btn.dataset.story;

    await storyLoader.load(story);
    stateManager.setStory(story);

    audioManager.playForStory(story);

    addToActionLog(`🎮 Selected Story ${story}`);

    await loadInitialScene();
  });
});

/* ---------------------------------------
   INITIAL SCENE
--------------------------------------- */
export async function loadInitialScene() {
  const start =
    stateManager.currentScene ||
    storyLoader.graph?.start ||
    Object.keys(storyLoader.graph.nodes)[0];

  await sceneManager.loadScene(start);
}

/* ---------------------------------------
   RESTART
--------------------------------------- */
export async function restartGame() {
  console.log("[GAME] Restarting...");

  try { dialogueSystem.stop(); } catch {}
  try { audioManager.stopAll?.(); } catch {}

  stateManager.reset();
  inventorySystem.clear(true);

  statsSystem.lock();
  statsSystem.reset();
  statsSystem.unlock();

  saveSystem.slots = [null, null, null];
  localStorage.removeItem("aridia_save_slots_v2");

  const storyId = window.selectedStory || "A";
  await storyLoader.load(storyId);
  stateManager.setStory(storyId);

  const startScene = storyLoader.graph?.start || "start";
  await sceneManager.loadScene(startScene, {
    skipEnter: true,
    skipStats: true,
    skipInventory: true
  });

  eventBus.emit("inv:refresh", stateManager.getInventory());
  eventBus.emit("stats:updatedAll", statsSystem.getAll());

  audioManager.playForStory(storyId);

  renderSaveSlots();
  addToActionLog(`🔁 Restarted — Story ${storyId}`);

  console.log("[GAME] Restart complete");
}
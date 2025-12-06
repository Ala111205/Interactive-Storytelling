// ==========================================
// TAP / FIRST INPUT AUDIO UNLOCK
// ==========================================
import eventBus from "./game/core/eventBus.js";

let unlocked = false;
let queue = [];

export function unlockAudioOnFirstInput() {
  if (unlocked) return;

  const tapScreen = document.getElementById("tap-start");
  const tapText = document.querySelector("#tap-start .tap-text");
  const gameUI = document.getElementById("game");

  async function handler() {
    if (unlocked) return;
    unlocked = true;

    // Show game UI
    if (gameUI) gameUI.style.display = "block";

    // Unlock all audio elements
    document.querySelectorAll("audio").forEach(a => {
      try {
        a.play();
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });

    // Run queued functions
    queue.forEach(fn => fn());
    queue = [];

    // Remove tap overlay
    if (tapScreen) tapScreen.remove();

    // Notify systems
    eventBus.emit("audio:unlocked");

    // Clean listeners
    if (tapText) tapText.removeEventListener("click", handler);
    window.removeEventListener("keydown", handler);
    window.removeEventListener("pointerdown", handler);
  }

  // ONLY text click
  if (tapText) {
    tapText.addEventListener("click", handler);
  }

  // Backup for keyboard or anywhere else
  window.addEventListener("pointerdown", handler, { once: true });
  window.addEventListener("keydown", handler, { once: true });
}

// Queue functions to run after unlock
export function queueUnlock(fn) {
  if (unlocked) fn();
  else queue.push(fn);
}
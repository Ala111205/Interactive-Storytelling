import { stateManager } from "./stateManager.js";

export const inputManager = {
  init() {
    window.addEventListener("keydown", this.onKeyDown);
  },

  onKeyDown(e) {
    switch (e.key) {
      case "Escape":
        // Toggle inventory
        document.getElementById("inventory-modal").classList.toggle("hidden");
        break;
      case "ArrowLeft":
        stateManager.goBack();
        break;
      case "r":
        if (confirm("Restart story?")) stateManager.reset();
        break;
      case "m":
        const bgm = document.getElementById("bgm");
        if (bgm.paused) bgm.play();
        else { bgm.pause(); bgm.currentTime = 0; }
        break;
    }
  }
};
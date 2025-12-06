import { Transitions } from "./transitions.js";
import { Animations } from "./animations.js";

export const UIComponents = {

  // ======================================================
  // Create a standard game button
  // ======================================================
  button(label, onClick, options = {}) {
    const btn = document.createElement("button");
    btn.className = "game-btn";

    btn.textContent = label;

    if (options.id) btn.id = options.id;
    if (options.disabled) btn.disabled = true;

    btn.addEventListener("click", () => {
      if (!btn.disabled) onClick();
    });

    return btn;
  },

  // ======================================================
  // Choice button (story options)
  // ======================================================
  choice(text, callback) {
    const btn = document.createElement("div");
    btn.className = "choice-btn";
    btn.textContent = text;

    btn.addEventListener("click", () => {
      Animations.press(btn);
      callback();
    });

    return btn;
  },

  // ======================================================
  // Create a popup/overlay box
  // ======================================================
  overlay(message, onClose = null) {
    const box = document.createElement("div");
    box.className = "overlay-box";

    const msg = document.createElement("div");
    msg.className = "overlay-message";
    msg.textContent = message;

    const closeBtn = this.button("OK", () => {
      Transitions.fadeOut(box, 200, () => {
        box.remove();
        if (onClose) onClose();
      });
    });

    box.appendChild(msg);
    box.appendChild(closeBtn);

    document.body.appendChild(box);
    Transitions.fadeIn(box, 200);

    return box;
  },

  // ======================================================
  // Loading spinner (useful for storyLoader)
  // ======================================================
  loadingSpinner() {
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";

    // simple animation class
    Animations.rotate(spinner);

    return spinner;
  },

  // ======================================================
  // Typing text container for dialogueSystem
  // ======================================================
  dialogueBox() {
    const box = document.createElement("div");
    box.className = "dialogue-box";

    const text = document.createElement("div");
    text.className = "dialogue-text";

    box.appendChild(text);
    return { box, text };
  }
};
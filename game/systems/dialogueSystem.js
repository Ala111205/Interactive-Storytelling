import { eventBus } from "../core/eventBus.js";

const dialogueSystem = {
  typingSpeed: 30,
  isTyping: false,
  timeout: null,
  currentText: "",
  currentIndex: 0,

  init() {
    // Listen for external triggers
    eventBus.on("dialogue:show", text => this.startTyping(text));

    eventBus.on("dialogue:skip", () => this.skip());
  },

  startTyping(text) {
    const box = document.getElementById("scene-text");
    if (!box) return;

    this.stop();
    this.currentText = text;
    this.currentIndex = 0;
    box.textContent = "";
    this.isTyping = true;

    this.loop(box);
  },

  loop(box) {
    if (this.currentIndex >= this.currentText.length) {
      this.finish(box);
      return;
    }

    box.textContent += this.currentText[this.currentIndex++];
    this.timeout = setTimeout(() => this.loop(box), this.typingSpeed);
  },

  finish(box) {
    this.stop();
    box.textContent = this.currentText;
    eventBus.emit("dialogue:finished");
  },

  stop() {
    clearTimeout(this.timeout);
    this.isTyping = false;
  },

  skip() {
    const box = document.getElementById("scene-text");
    if (!this.isTyping) return;
    this.finish(box);
  },

  /**
  * Reset the dialogue system to show the first line of a scene
  * @param {string} firstLine - the first dialogue line of the scene
  */

  clear() {
    this.stop();
    this.currentText = "";
    this.currentIndex = 0;

    const box = document.getElementById("scene-text");
    if (box) box.textContent = ""; // empty while scene loader repopulates
    this.isTyping = false;
  }
};

export default dialogueSystem;
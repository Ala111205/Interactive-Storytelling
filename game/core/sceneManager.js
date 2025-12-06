import { eventBus } from "./eventBus.js";
import { stateManager } from "./stateManager.js";
import { storyLoader } from "../story/storyLoader.js";
import { storyActions } from "../story/storyActions.js";
import choiceSystem from "../systems/choiceSystem.js";
import dialogueSystem from "../systems/dialogueSystem.js";

export const sceneManager = {
  current: null,
  currentId: null,
  history: [],
  _loading: false,
  _blocked: false, // to prevent accidental re-entrancy

  init() {
    // external navigation events
    eventBus.on("story:goToNode", (id, opts = {}) => this.loadScene(id, opts));
    eventBus.on("scene:back", (opts = {}) => this.goBack(opts));
    choiceSystem.init();
    dialogueSystem.init();
  },

  getScene(id) {
    return storyLoader.graph?.nodes?.[id] || null;
  },

  /**
   * loadScene(id, options)
   * options:
   *   skipEnter: don't run node.onEnter actions (true for back/restart/load)
   *   skipStats: passed to storyActions to prevent stat changes
   *   skipInventory: passed to storyActions to prevent inventory changes
   */
  async loadScene(id, options = {}) {
    if (!storyLoader.graph) {
      console.error("[SceneManager] Story graph not loaded!");
      return null;
    }

    if (!id) {
      console.error("[SceneManager] loadScene called with falsy id");
      return null;
    }

    // Prevent concurrent loads
    if (this._loading || this._blocked) {
      console.warn("[SceneManager] Ignoring concurrent scene load:", id);
      return null;
    }
    this._loading = true;

    const node = this.getScene(id);
    if (!node) {
      console.error(`[SceneManager] Scene '${id}' not found in story '${storyLoader.loadedId}'`);
      this._loading = false;
      return null;
    }

    // Push current to history only when moving forward to a different node
    if (this.currentId && this.currentId !== id) {
      this.history.push(this.currentId);
    }

    this.current = node;
    this.currentId = id;
    stateManager.setScene(id);

    // safe DOM references
    const sceneBox = document.getElementById("scene-text");
    const choicesBox = document.getElementById("choices");
    if (!sceneBox || !choicesBox) {
      console.error("[SceneManager] Missing #scene-text or #choices in DOM");
      this._loading = false;
      return null;
    }

    // Clear previous content
    sceneBox.textContent = "";
    choicesBox.innerHTML = "";

    // display text
    if (node.text) {
      dialogueSystem.startTyping(node.text);
    }

    // render choices
    if (node.choices?.length) choiceSystem.render(node, choicesBox);

    // run enter actions UNLESS skipEnter
    if (!options.skipEnter && node.onEnter) {
      await storyActions.run(node.onEnter, {
        skipStats: !!options.skipStats,
        skipInventory: !!options.skipInventory
      });
    }

    const imgBox = document.getElementById("scene-image");

    if (imgBox && node.img) {
      imgBox.onerror = () => {
        console.error("[SceneManager] Image failed to load:", node.img);
        imgBox.classList.add("hidden");
      };

      imgBox.src = node.img;
      imgBox.classList.remove("hidden");
    }

    this._loading = false;
    return node;
  },

  // safer goBack: loads previous node
  async goBack(options = {}) {
    if (!this.history.length) return null;

    if (this._loading || this._blocked) {
      console.warn("[SceneManager] goBack blocked due to loading/blocked state");
      return null;
    }

    // Pop previous scene id
    const prev = this.history.pop();
    if (!prev) return null;

    // Use skip defaults to true to prevent re-applying onEnter effects
    const safeOpts = {
      skipEnter: true,
      skipStats: true,
      skipInventory: true,
      ...(options || {})
    };

    return this.loadScene(prev, safeOpts);
  },

  // direct choice -> index based (keeps old API)
  async choose(index) {
    if (!this.current) return null;
    const choice = this.current.choices?.[index];
    if (!choice) return null;

    if (choice.actions) {
      // run choice actions normally (no skipping)
      await storyActions.run(choice.actions, {});
    }

    if (choice.next) {
      return this.loadScene(choice.next);
    }
    return null;
  }
};

export default sceneManager;
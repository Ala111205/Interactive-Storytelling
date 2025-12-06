import { eventBus } from "./eventBus.js";
import { stateManager } from "./stateManager.js";
import { storyLoader } from "../story/storyLoader.js";
import { storyActions } from "../story/storyActions.js";
import choiceSystem from "../systems/choiceSystem.js";
import dialogueSystem from "../systems/dialogueSystem.js";

export const sceneManager = {
  current: null,
  currentId: null,

  _loading: false,
  _blocked: false,

/* -----------------------------------------------------
   INIT
----------------------------------------------------- */
  init() {
    eventBus.on("story:goToNode", (id, opts = {}) => this.loadScene(id, opts));
    eventBus.on("scene:back", (opts = {}) => this.goBack(opts));

    choiceSystem.init();
    dialogueSystem.init();

    // Restore scene from state after refresh
    const saved = stateManager.currentScene;
    if (saved) {
      this.loadScene(saved, { skipEnter: true });
    }
  },

/* -----------------------------------------------------
   HELPERS
----------------------------------------------------- */
  getScene(id) {
    return storyLoader.graph?.nodes?.[id] || null;
  },

  get stateHistory() {
    return stateManager.export().history || [];
  },

/* -----------------------------------------------------
   LOAD SCENE
----------------------------------------------------- */
  async loadScene(id, options = {}) {
    if (!storyLoader.graph) {
      console.error("[SceneManager] Story not loaded");
      return null;
    }

    if (!id) {
      console.error("[SceneManager] Empty scene id");
      return null;
    }

    if (this._loading || this._blocked) {
      console.warn("[SceneManager] Ignored load:", id);
      return null;
    }

    this._loading = true;

    const node = this.getScene(id);
    if (!node) {
      console.error(`[SceneManager] Scene "${id}" not found`);
      this._loading = false;
      return null;
    }

    const current = this.currentId;

    // Push to STATE history – NOT local
    if (current && current !== id) {
      stateManager.getHistory?.().push?.(current);
    }

    this.current = node;
    this.currentId = id;
    stateManager.setScene(id);

    const sceneBox   = document.getElementById("scene-text");
    const choicesBox = document.getElementById("choices");
    const imgBox     = document.getElementById("scene-image");

    if (!sceneBox || !choicesBox) {
      console.error("[SceneManager] Missing UI container");
      this._loading = false;
      return null;
    }

    sceneBox.textContent = "";
    choicesBox.innerHTML = "";

    if (node.text) {
      dialogueSystem.startTyping(node.text);
    }

    if (node.choices?.length) {
      choiceSystem.render(node, choicesBox);
    }

    if (!options.skipEnter && node.onEnter) {
      await storyActions.run(node.onEnter, {
        skipStats: !!options.skipStats,
        skipInventory: !!options.skipInventory
      });
    }

    if (imgBox) {
      if (node.img) {
        imgBox.onerror = () => {
          console.error("[SceneManager] Image load failed:", node.img);
          imgBox.classList.add("hidden");
        };
        imgBox.src = node.img;
        imgBox.classList.remove("hidden");
      } else {
        imgBox.classList.add("hidden");
      }
    }

    this._loading = false;
    return node;
  },

/* -----------------------------------------------------
   BACK
----------------------------------------------------- */
  async goBack(options = {}) {
    const history = stateManager.export().history || [];

    if (!history.length) {
      console.warn("[SceneManager] HISTORY: []");
      return null;
    }

    if (this._loading || this._blocked) {
      console.warn("[SceneManager] Back blocked");
      return null;
    }

    const prev = history.pop();
    if (!prev) return null;

    const safeOpts = {
      skipEnter: true,
      skipStats: true,
      skipInventory: true,
      ...(options || {})
    };

    return this.loadScene(prev, safeOpts);
  },

/* -----------------------------------------------------
   DIRECT CHOICE
----------------------------------------------------- */
  async choose(index) {
    if (!this.current) return null;

    const choice = this.current.choices?.[index];
    if (!choice) return null;

    if (choice.actions) {
      await storyActions.run(choice.actions, {});
    }

    if (choice.next) {
      return this.loadScene(choice.next);
    }

    return null;
  }
};

export default sceneManager;
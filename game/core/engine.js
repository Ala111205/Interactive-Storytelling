import { eventBus } from "./eventBus.js";
import stateManager from "./stateManager.js";
import saveSystem from "./saveSystem.js";

import { uiManager } from "./uiManager.js";
import { sceneManager } from "./sceneManager.js";
import { storyLoader } from "../story/storyLoader.js";
import { inputManager } from "./inputManager.js";

import dialogueSystem from "../systems/dialogueSystem.js";
import choiceSystem from "../systems/choiceSystem.js";
import statsSystem from "../systems/statsSystem.js";
import inventorySystem from "../systems/inventorySystem.js";

export const engine = {
  initialized: false,
  currentStory: null,

  async init(defaultStory = "A", beforeFirstScene = null) {
    if (this.initialized) return;
    this.initialized = true;

    console.log("%c[ENGINE] BOOTING...", "color: orange");

    /* ------------------------------------
       SAVE + STATE INIT
    ------------------------------------ */
    saveSystem?.init?.();
    stateManager.init();

    this.currentStory = stateManager.currentStory || defaultStory;

    /* ------------------------------------
       LOAD STORY
    ------------------------------------ */
    await storyLoader.load(this.currentStory);

    /* ------------------------------------
       INIT SYSTEMS (ONE TIME ONLY)
    ------------------------------------ */
    uiManager?.init?.();
    dialogueSystem?.init?.();
    choiceSystem?.init?.();
    inputManager?.init?.();
    statsSystem?.init?.();
    inventorySystem?.init?.({ addDefaults: false });
    sceneManager?.init?.();

    if (typeof beforeFirstScene === "function") {
      beforeFirstScene();
    }

    /* ------------------------------------
       FORCE STATE → SYSTEM SYNC
       stateManager = source of truth ONLY
    ------------------------------------ */
    const stats = stateManager.getStats();
    const inventory = stateManager.getInventory();

    statsSystem?.setAll?.(stats);
    inventorySystem?.set?.(inventory);

    /* ------------------------------------
       FIND START SCENE
    ------------------------------------ */
    const startScene =
      stateManager.currentScene ||
      storyLoader.graph?.start ||
      Object.keys(storyLoader.graph?.nodes || {})[0];

    if (!startScene) {
      throw new Error("[ENGINE] No start scene found");
    }

    /* ------------------------------------
       LOAD SCENE
    ------------------------------------ */
    await sceneManager.loadScene(startScene, { skipEnter: true });

    const node = storyLoader.graph?.nodes?.[startScene];
    if (node?.text) {
      dialogueSystem?.startTyping?.(node.text);
    }

    /* ------------------------------------
       FORCE UI SYNC
    ------------------------------------ */
    eventBus.emit("inv:refresh", stateManager.getInventory());
    eventBus.emit("stats:updatedAll", stateManager.getStats());
    eventBus.emit("story:change", stateManager.currentStory);
    eventBus.emit("scene:change", startScene);

    /* ------------------------------------
       AUTOSAVE HOOKS
    ------------------------------------ */
    const autoSave = () => saveSystem?.autoSave?.();

    eventBus.on("scene:change", autoSave);
    eventBus.on("inv:refresh", autoSave);
    eventBus.on("stats:updatedAll", autoSave);
    eventBus.on("flag:set", autoSave);
    eventBus.on("flag:removed", autoSave);

    // ——— AUDIO REFRESH BASED ON STORY ———
    eventBus.emit("story:change", stateManager.currentStory);
    eventBus.emit("audio:refresh");

    eventBus.emit("engine:ready");

    console.log("%c[ENGINE] READY", "color: lightgreen");
    console.log("[ENGINE] FINAL STATE:", stateManager.export());
  },

  /* ------------------------------------
     HARD NEW GAME
  ------------------------------------ */
  async newGame() {
    console.log("%c[ENGINE] NEW GAME", "color: red");

    stateManager.reset();

    statsSystem?.reset?.();
    inventorySystem?.clear?.(true);

    await storyLoader.load(stateManager.currentStory || "A");

    const startScene =
      storyLoader.graph?.start ||
      Object.keys(storyLoader.graph?.nodes || {})[0];

    stateManager.setScene(startScene);

    await sceneManager.loadScene(startScene, { skipEnter: true });

    const node = storyLoader.graph?.nodes?.[startScene];
    if (node?.text) {
      dialogueSystem?.startTyping?.(node.text);
    }

    eventBus.emit("inv:refresh", stateManager.getInventory());
    eventBus.emit("stats:updatedAll", stateManager.getStats());
  },

  restart() {
    return this.newGame();
  }
};

export default engine;
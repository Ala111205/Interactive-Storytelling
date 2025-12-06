// systems/choiceSystem.js
import { eventBus } from "../core/eventBus.js";
import { storyActions } from "../story/storyActions.js";
import { sceneManager } from "../core/sceneManager.js";
import { stateManager } from "../core/stateManager.js";
import { storyLoader } from "../story/storyLoader.js";
import { applyChoiceStats } from "./choiceStatsHandler.js";

const sfxPick = typeof document !== "undefined" ? document.getElementById("sfx-pick") : null;

const choiceSystem = {
  init() {
    eventBus.on("choice:select", (choiceId) => (choiceId)); // placeholder
  },

  async executeChoice(choiceId) {
    const node = sceneManager.current;
    if (!node) return console.error("choiceSystem.executeChoice: no current node");

    const choice = (node.choices || []).find(c => c.id === choiceId || c.next === choiceId);
    if (!choice) return console.error("choiceSystem: choice not found:", choiceId);

    // Apply stats & persist (this waits a frame internally)
    await applyChoiceStats(choice);

    // Run choice actions (they may rely on updated stats)
    if (choice.actions) storyActions.run(choice.actions);

    // Story switch
    if (choice.next === "__SWITCH_STORY__" && choice.targetStory) {
      await this.switchStory(choice.targetStory);
      return;
    }

    // Normal navigation
    if (choice.next) {
      await sceneManager.loadScene(choice.next);
    }
  },

  async switchStory(storyId) {
    if (!storyId) return console.error("choiceSystem: missing storyId in switchStory");

    await storyLoader.load(storyId);
    stateManager.setStory(storyId);

    const startNode = storyLoader.graph.start;
    if (!startNode) return console.error(`choiceSystem: start node missing in story '${storyId}'`);

    await sceneManager.loadScene(startNode);
  },

  showChoices(node) {
    if (!node) return;
    const choices = node.choices || [];
    eventBus.emit("choices:update", choices);
  },

  render(node, container) {
    if (!node) return console.error("choiceSystem.render: node missing");
    if (!container) return console.error("choiceSystem.render: container missing");

    container.innerHTML = "";
    const choices = node.choices || [];

    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.label || "???";

      btn.onclick = async () => {
        sfxPick?.play?.().catch(() => {});
        // use the centralized handler which persists stats
        await applyChoiceStats(choice);

        // actions & navigation (same logic as executeChoice)
        if (choice.actions) storyActions.run(choice.actions);

        if (choice.next === "__SWITCH_STORY__") {
          if (!choice.targetStory) return console.error("choiceSystem: missing targetStory");
          await storyLoader.load(choice.targetStory);
          stateManager.setStory(choice.targetStory);
          const startNode = storyLoader.graph.start;
          await sceneManager.loadScene(startNode);
          return;
        }

        if (choice.next) {
          const nextNode = storyLoader.graph?.nodes?.[choice.next];
          if (!nextNode) return console.error(`choiceSystem: next node '${choice.next}' missing`);
          await sceneManager.loadScene(choice.next);
        }
      };

      container.appendChild(btn);
    });
  }
};

export default choiceSystem;
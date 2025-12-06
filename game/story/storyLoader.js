import storyNodesA from "./storyNodesA.js"; 
import storyNodesB from "./storyNodesB.js";
import { eventBus } from "../core/eventBus.js";

export const storyLoader = {
  loadedId: null,
  graph: null,

  async load(which = "A") {
    // Prevent unnecessary reload
    if (this.loadedId === which) return this.graph?.start;

    this.loadedId = which;

    console.log(`%c[STORY] Loading story: ${which}`, "color: cyan");

    // Select story
    const story =
      which === "A" ? storyNodesA :
      which === "B" ? storyNodesB :
      null;

    if (!story) throw new Error("Unknown story id: " + which);

    // Construct graph
    this.graph = {
      start: story.start,
      nodes: { ...story.nodes },
      actions: { ...story.actions },
      flags: { ...story.flags }
    };

    this.validateLinks();

    eventBus.emit("story:loaded", which);

    // AUDIO HOOKS — FIXED AND CLEAN
    if (which === "A") {
      eventBus.emit("audio:playBGM");
    }

    if (which === "B") {
      eventBus.emit("audio:playSFX", "sfxSelect");
    }

    console.log(`%c[STORY] Loaded: ${which}`, "color:#00ffaa");

    return this.graph.start;
  },

  getNode(id) {
    return this.graph.nodes[id];
  },

  getAction(id) {
    return this.graph.actions[id];
  },

  getFlag(id) {
    return this.graph.flags[id];
  },

  validateLinks() {
    const nodes = this.graph.nodes;
    const broken = [];

    for (const id in nodes) {
      const node = nodes[id];
      if (!node.choices) continue;

      node.choices.forEach((c, i) => {
        const isSwitch = c.next === "__SWITCH_STORY__";
        const isRestart = c.next === "__RESTART__";
        const exists = nodes[c.next];

        if (!isSwitch && !isRestart && !exists) {
          broken.push({
            node: id,
            choiceIndex: i,
            missingNext: c.next
          });
        }
      });
    }

    if (broken.length) {
      console.log("%c[STORY] Missing or invalid links:", "color:red");
      console.table(broken);
    } else {
      console.log("%c[STORY] All links OK", "color:green");
    }
  }
};

export default storyLoader;
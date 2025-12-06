// ===============================================
//  Global Story Flag Definitions
// ===============================================
export const storyFlags = {

  // All possible flags (metadata only)
  list: {
    visitedStart: {
      desc: "Player has visited the starting area.",
      type: "story"
    },

    hasKey: {
      desc: "Player has obtained the old iron key.",
      type: "inventory"
    },

    metGuardian: {
      desc: "Player spoke with the Guardian NPC.",
      type: "npc"
    },

    unlockedGate: {
      desc: "Gate puzzle solved, path unlocked.",
      type: "progress"
    },

    defeatedBeast: {
      desc: "Boss-level creature has been defeated.",
      type: "combat"
    },

    trueEnding: {
      desc: "Player achieved the True Ending.",
      type: "ending"
    }
  },

  // Retrieve description text
  describe(flagName) {
    return this.list[flagName]?.desc ?? "Unknown flag";
  },

  // Return all flags belonging to a category
  filterByType(type) {
    return Object.keys(this.list).filter(
      key => this.list[key].type === type
    );
  }
};
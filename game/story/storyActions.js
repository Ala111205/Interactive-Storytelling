import { eventBus } from "../core/eventBus.js";

export const storyActions = {

  // Run array of actions with optional skip-controls
  async run(actions = [], opts = {}) {
    if (!Array.isArray(actions)) return;

    for (const act of actions) {
      const ok = await this.execute(act, opts);
      if (ok === false) break; // stop sequence if needed
    }
  },

  async execute(action, opts = {}) {
    if (!action || typeof action !== "object") return;

    switch (action.type) {

      // ======================
      //    STATS (with skip)
      // ======================
      case "stat":
        if (opts.skipStats) return; // prevent stat changes on BACK / RESTART

        if (typeof action.stat === "string" && typeof action.delta === "number") {
          eventBus.emit("stats:modify", {
            stat: action.stat,
            amount: action.delta
          });
        } else {
          console.error("[Action ERROR] Bad stat action:", action);
        }
        break;

      // ======================
      //    FLAG
      // ======================
      case "flag":
        if (action.set) eventBus.emit("flag:set", action.set);
        if (action.clear) eventBus.emit("flag:clear", action.clear);
        break;

      // ======================
      //    INVENTORY (with skip)
      // ======================
      case "item":
        if (opts.skipInventory) return; // prevent inventory on BACK / RESTART

        if (action.add) {
          eventBus.emit("inv:add-request", {
            id: action.add,
            count: action.count ?? 1
          });
        } else if (action.remove) {
          eventBus.emit("inv:remove-request", {
            id: action.remove,
            count: action.count ?? 1
          });
        } else {
          console.error("[Action ERROR] Bad item action:", action);
        }
        break;

      // ======================
      //    SCENE GOTO
      // ======================
      case "scene":
        if (action.goto) eventBus.emit("scene:goto", action.goto);
        break;

      // ======================
      //    REQUIRE (loader handles)
      // ======================
      case "require":
        return true; // do nothing here; gating happens outside
        break;

      default:
        console.warn("Unknown story action:", action);
    }
  }
};
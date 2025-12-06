export const eventBus = {
  _listeners: Object.create(null),

  on(event, fn) {
    if (typeof fn !== "function") {
      throw new Error(`[eventBus] Listener for "${event}" is not a function`);
    }

    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }

    this._listeners[event].push(fn);
  },

  off(event, fn) {
    if (!this._listeners[event]) return;

    this._listeners[event] = this._listeners[event].filter(
      listener => listener !== fn
    );
  },

  emit(event, ...args) {
    const list = this._listeners[event];
    if (!list || list.length === 0) return;

    // clone to avoid mutation during loop
    list.slice().forEach(listener => {
      try {
        listener(...args);
      } catch (e) {
        console.error(`[eventBus] Error in "${event}" handler:`, e);
      }
    });
  },

  clear(event) {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = Object.create(null);
    }
  }
};

export default eventBus;
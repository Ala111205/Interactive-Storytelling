export const Layout = {
  baseWidth: 1280,
  baseHeight: 720,
  scale: 1,

  // ======================================================
  // Initialize layout once DOM is ready
  // ======================================================
  init() {
    this.updateScale();
    window.addEventListener("resize", () => this.updateScale());
  },

  // ======================================================
  // Calculate and apply game scaling
  // Keeps the UI perfectly centered
  // ======================================================
  updateScale() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scaleX = w / this.baseWidth;
    const scaleY = h / this.baseHeight;

    // Maintain aspect ratio
    this.scale = Math.min(scaleX, scaleY);

    const root = document.documentElement;
    root.style.setProperty("--game-scale", this.scale);
  },

  // ======================================================
  // Utility for positioning UI components
  // ======================================================
  centerElement(el) {
    if (!el) return;

    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "50%";
    el.style.transform = "translate(-50%, -50%) scale(var(--game-scale))";
    el.style.transformOrigin = "top left";
  },

  // ======================================================
  // Utility for applying scale to any element
  // ======================================================
  applyScale(el) {
    if (!el) return;
    el.style.transform = `scale(${this.scale})`;
    el.style.transformOrigin = "top left";
  },

  // ======================================================
  // Adjustable padding that scales properly
  // ======================================================
  scaledPadding(baseValue) {
    return baseValue * this.scale;
  }
};
export const Animations = {
  // ====================================
  // Typing Animation (for dialogue text)
  // ====================================
  async typeText(el, text, speed = 25) {
    if (!el) return;
    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      await new Promise(r => setTimeout(r, speed));
    }
  },

  // ====================================
  // Shake animation (error, wrong choice)
  // ====================================
  shake(el, intensity = 8, duration = 300) {
    if (!el) return;

    el.style.transition = `transform ${duration}ms ease`;
    el.style.transform = `translateX(${intensity}px)`;

    setTimeout(() => {
      el.style.transform = `translateX(${-intensity}px)`;
      setTimeout(() => {
        el.style.transform = "translateX(0)";
      }, duration / 2);
    }, duration / 2);
  },

  // ==========================
  // Pulse animation (buttons)
  // ==========================
  pulse(el, scale = 1.1, duration = 200) {
    if (!el) return;

    el.style.transition = `transform ${duration}ms ease`;
    el.style.transform = `scale(${scale})`;

    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, duration);
  },

  // ====================================
  // Glow effect (highlight selected choice)
  // ====================================
  glow(el, color = "rgba(255,255,150,0.8)", duration = 400) {
    if (!el) return;
    el.style.transition = `box-shadow ${duration}ms ease`;
    el.style.boxShadow = `0 0 12px ${color}`;
    setTimeout(() => {
      el.style.boxShadow = "none";
    }, duration);
  },

  // ====================================
  // Smooth number animation (stats)
  // ====================================
  animateNumber(el, from, to, duration = 400) {
    if (!el) return;

    const start = performance.now();
    const step = (currentTime) => {
      const progress = Math.min((currentTime - start) / duration, 1);
      const value = Math.floor(from + (to - from) * progress);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};
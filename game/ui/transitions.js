export const Transitions = {
  fadeIn(el, duration = 300) {
    if (!el) return;
    el.style.opacity = 0;
    el.style.transition = `opacity ${duration}ms ease-out`;
    requestAnimationFrame(() => {
      el.style.opacity = 1;
    });
  },

  fadeOut(el, duration = 300) {
    return new Promise(resolve => {
      if (!el) return resolve();
      el.style.opacity = 1;
      el.style.transition = `opacity ${duration}ms ease-in`;
      requestAnimationFrame(() => {
        el.style.opacity = 0;
      });
      setTimeout(resolve, duration);
    });
  },

  slideIn(el, direction = "up", distance = 40, duration = 300) {
    if (!el) return;
    let axis = direction === "up" || direction === "down" ? "Y" : "X";
    let sign = (direction === "up" || direction === "left") ? 1 : -1;

    el.style.opacity = 0;
    el.style.transform = `translate${axis}(${sign * distance}px)`;
    el.style.transition = `all ${duration}ms ease`;

    requestAnimationFrame(() => {
      el.style.opacity = 1;
      el.style.transform = `translate${axis}(0px)`;
    });
  },

  slideOut(el, direction = "down", distance = 40, duration = 300) {
    return new Promise(resolve => {
      if (!el) return resolve();

      let axis = direction === "up" || direction === "down" ? "Y" : "X";
      let sign = (direction === "up" || direction === "left") ? 1 : -1;

      el.style.opacity = 1;
      el.style.transition = `all ${duration}ms ease`;

      requestAnimationFrame(() => {
        el.style.opacity = 0;
        el.style.transform = `translate${axis}(${sign * distance}px)`;
      });

      setTimeout(resolve, duration);
    });
  },

  scaleIn(el, duration = 300) {
    if (!el) return;
    el.style.opacity = 0;
    el.style.transform = "scale(0.9)";
    el.style.transition = `all ${duration}ms ease`;

    requestAnimationFrame(() => {
      el.style.opacity = 1;
      el.style.transform = "scale(1)";
    });
  },

  scaleOut(el, duration = 250) {
    return new Promise(resolve => {
      if (!el) return resolve();

      el.style.opacity = 1;
      el.style.transform = "scale(1)";
      el.style.transition = `all ${duration}ms ease`;

      requestAnimationFrame(() => {
        el.style.opacity = 0;
        el.style.transform = "scale(0.9)";
      });

      setTimeout(resolve, duration);
    });
  }
};
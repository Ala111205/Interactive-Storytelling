export const animationSystem = {
  fadeIn(element, duration = 500) {
    element.style.opacity = 0;
    element.style.display = "block";
    let start = null;

    const animate = timestamp => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      if (progress < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  },

  fadeOut(element, duration = 500) {
    element.style.opacity = 1;
    let start = null;

    const animate = timestamp => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = 1 - Math.min(progress / duration, 1);
      if (progress < duration) requestAnimationFrame(animate);
      else element.style.display = "none";
    };
    requestAnimationFrame(animate);
  }
};
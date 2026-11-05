(() => {
  'use strict';
  const section = document.querySelector('#bags');
  if (!section) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const images = [...section.querySelectorAll('[data-slide] .product-image')];
  let transition = null;
  let generation = 0;
  const stop = () => {
    generation++;
    transition?.cancel();
    transition = null;
  };
  section.addEventListener('bags:change', async event => {
    stop();
    const {index, previousIndex} = event.detail || {};
    // The first bag arrives through the lookbook bridge without a second reveal.
    if (previousIndex < 0 || preference.matches || document.hidden) return;
    const host = images[index], image = host?.querySelector('img');
    if (!host || !image || typeof host.animate !== 'function') return;
    const currentGeneration = generation;
    try { if (!image.complete && image.decode) await image.decode(); } catch { return; }
    if (generation !== currentGeneration || Number(section.dataset.activeBag) !== index || !image.naturalWidth) return;
    transition = host.animate([
      {clipPath:'inset(0 49.7% 0 49.7%)',opacity:.55},
      {clipPath:'inset(0 0% 0 0%)',opacity:1}
    ],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
    transition.onfinish = () => { transition = null; };
  });
  preference.addEventListener('change',stop);
  document.addEventListener('visibilitychange',() => { if (document.hidden) stop(); });
})();

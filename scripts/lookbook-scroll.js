(() => {
  'use strict';
  const section = document.querySelector('[data-lookbook-scroll]');
  const stage = section?.querySelector('.lookbook-scroll-stage');
  const frames = section?.querySelector('.lookbook-scroll-frames');
  const cuts = section ? [...section.querySelectorAll('[data-lookbook-cut]')] : [];
  const bags = document.querySelector('#bags');
  const target = bags?.querySelector('.product-image-melissa');
  const targetImage = target?.querySelector('img');
  const productTrack = bags?.querySelector('[data-carousel-track]');
  if (!stage || !frames || !cuts.length || !target || !targetImage) return;
  const caption = section.querySelector('.lookbook-scroll-caption');
  const count = section.querySelector('[data-lookbook-count]');
  const images = cuts.map((cut) => cut.querySelector('img'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const suitableHeight = window.matchMedia('(min-height: 480px)');
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const mix = (from, to, amount) => from + (to - from) * amount;
  const ease = (value) => value * value * (3 - 2 * value);
  const cutDuration = 145, reelDuration = Math.max(1900, images.length * cutDuration + 350);
  const ready = new WeakSet(), failed = new WeakSet();
  let enabled = false, near = true, warmed = false, started = false, frame = 0;
  let width = 0, height = 0, elapsed = 0, previousTime = 0, active = -1;
  let initialMaskHeight = 0, finalMaskHeight = 0;
  const bridge = document.createElement('div');
  bridge.className = 'lookbook-bag-bridge';
  bridge.dataset.lookbookBridge = '';
  bridge.setAttribute('aria-hidden', 'true');
  bridge.hidden = true;
  const bridgeImage = document.createElement('img');
  bridgeImage.alt = '';
  bridge.append(bridgeImage);
  document.body.append(bridge);

  const clearBridge = () => {
    bridge.hidden = true;
    target.classList.remove('is-lookbook-bag-hidden');
  };
  const usable = (image) => ready.has(image) || (image.complete && image.naturalWidth > 0);
  const prepare = async (image) => {
    image.loading = 'eager';
    try {
      if (image.decode) await image.decode();
      else if (!image.complete) await new Promise((resolve,reject) => {
        image.addEventListener('load',resolve,{once:true});
        image.addEventListener('error',reject,{once:true});
      });
      if (!image.naturalWidth) throw new Error('Image unavailable');
      ready.add(image);
    } catch { failed.add(image); }
    schedule();
  };
  const warmImages = () => {
    if (warmed) return;
    warmed = true;
    bridgeImage.src = targetImage.currentSrc || targetImage.src;
    [...images,targetImage,bridgeImage].forEach(prepare);
  };
  const copyBagCrop = () => {
    const style = getComputedStyle(targetImage);
    const targetWidth = target.clientWidth || 1, targetHeight = target.clientHeight || 1;
    bridgeImage.style.cssText = `left:${targetImage.offsetLeft / targetWidth * 100}%;top:${targetImage.offsetTop / targetHeight * 100}%;width:${targetImage.offsetWidth / targetWidth * 100}%;height:${targetImage.offsetHeight / targetHeight * 100}%;object-fit:${style.objectFit};object-position:${style.objectPosition};`;
  };
  const renderBridge = (maskHeight, stageRect, bagRect) => {
    if (elapsed < images.length * cutDuration || !usable(bridgeImage)) { clearBridge(); return; }
    const destination = target.getBoundingClientRect();
    const handoff = clamp((height - bagRect.top) / (height * .8));
    if (handoff >= 1 || (handoff > 0 && productTrack?.scrollLeft > 1)) { clearBridge(); return; }
    const maskWidth = maskHeight * 2 / 3;
    const origin = {left:stageRect.left + (width - maskWidth) / 2, top:Math.max(0,stageRect.top) + (height - maskHeight) / 2};
    // Before handoff this is exactly the reel's 2:3 mask and center. Then its
    // live destination is projected to the landing scroll position.
    const landingTop = destination.top - bagRect.top + height * .2;
    const amount = ease(handoff);
    bridge.style.cssText = `left:${mix(origin.left,destination.left,amount)}px;top:${mix(origin.top,landingTop,amount)}px;width:${mix(maskWidth,destination.width,amount)}px;height:${mix(maskHeight,destination.height,amount)}px;`;
    bridge.hidden = false;
    target.classList.add('is-lookbook-bag-hidden');
  };
  const render = (stageRect, bagRect) => {
    const amount = 1 - Math.pow(1 - clamp(elapsed / reelDuration),3);
    const maskHeight = mix(initialMaskHeight,finalMaskHeight,amount);
    frames.style.transform = `translate3d(-50%,-50%,0) scale(${maskHeight / initialMaskHeight})`;
    let next = Math.min(images.length - 1,Math.floor(elapsed / cutDuration));
    if (elapsed >= images.length * cutDuration && usable(bridgeImage)) next = images.length;
    if (next < images.length && !usable(images[next])) {
      const available = images.findIndex(usable);
      next = active >= 0 && active < images.length && usable(images[active]) ? active : Math.max(0,available);
    }
    if (next !== active) {
      cuts.forEach((cut,index) => cut.classList.toggle('is-active',index === next));
      active = next;
      if (count && next < images.length) count.textContent = `${String(next + 1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;
    }
    const fadeStart = images.length * cutDuration - 120;
    if (caption) caption.style.opacity = String(1 - ease(clamp((elapsed - fadeStart) / 120)));
    section.dataset.lookbookState = elapsed >= reelDuration ? 'bag' : started ? 'playing' : 'waiting';
    section.dataset.lookbookElapsed = String(Math.round(elapsed));
    renderBridge(maskHeight,stageRect,bagRect);
  };
  const tick = (time) => {
    frame = 0;
    if (!enabled || document.hidden) { previousTime = 0; return; }
    const stageRect = stage.getBoundingClientRect();
    const bagRect = bags.getBoundingClientRect();
    const visible = stageRect.bottom > 0 && stageRect.top < height;
    // Re-arm only after returning fully above the sequence. Reverse handoff
    // preserves the settled bag rather than replaying the editorial cuts.
    if (stageRect.top >= height && started) { elapsed = 0; started = false; }
    if (bagRect.top <= height * 1.08) { elapsed = reelDuration; started = true; }
    const prepared = images.every((image) => ready.has(image) || failed.has(image));
    if (!started && stageRect.top <= height * .08 && stageRect.bottom >= height * .92 && prepared && usable(bridgeImage)) started = true;
    const playing = started && elapsed < reelDuration && visible;
    if (playing) elapsed = Math.min(reelDuration,elapsed + (previousTime ? Math.min(50,time - previousTime) : 0));
    previousTime = playing ? time : 0;
    render(stageRect,bagRect);
    if (playing && elapsed < reelDuration) frame = requestAnimationFrame(tick);
    else previousTime = 0;
  };
  const schedule = () => {
    if (enabled && near && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  };
  const measure = () => {
    if (!enabled) return;
    width = stage.clientWidth;
    height = stage.clientHeight;
    const mobile = width <= 767;
    initialMaskHeight = Math.min(height * .82,width * (mobile ? .90 : .54) * 1.5);
    finalMaskHeight = Math.min(height * (mobile ? .44 : .50),width * (mobile ? .52 : .32) * 1.5);
    frames.style.width = `${initialMaskHeight * 2 / 3}px`;
    frames.style.height = `${initialMaskHeight}px`;
    copyBagCrop();
    schedule();
  };
  const configure = () => {
    cancelAnimationFrame(frame);
    frame = previousTime = 0;
    clearBridge();
    enabled = suitableHeight.matches && !motion.matches;
    section.classList.toggle('is-scroll-sequence',enabled);
    if (enabled) measure();
    else {
      frames.removeAttribute('style');
      caption?.removeAttribute('style');
      cuts.forEach((cut) => cut.classList.remove('is-active'));
      active = -1;
    }
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) { warmImages(); measure(); schedule(); }
      else { cancelAnimationFrame(frame); frame = previousTime = 0; clearBridge(); }
    },{rootMargin:'150% 0px'});
    observer.observe(section);
  } else warmImages();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  window.addEventListener('pageshow',measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
  productTrack?.addEventListener('scroll',schedule,{passive:true});
  motion.addEventListener('change',configure);
  suitableHeight.addEventListener('change',configure);
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = previousTime = 0; clearBridge(); }
    else { measure(); schedule(); }
  });
  configure();
})();

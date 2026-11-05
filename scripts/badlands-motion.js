(() => {
  'use strict';
  const root = document.querySelector('[data-badlands-motion]');
  const stage = root?.querySelector('[data-badlands-stage]');
  const track = root?.querySelector('[data-carousel-track]');
  const slides = root ? [...root.querySelectorAll('[data-slide]')] : [];
  if (!stage || !track || slides.length !== 3) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const originalLabel = track.getAttribute('aria-label');
  const dots = [...root.querySelectorAll('[data-carousel-dot]')];
  const holds = [.10,.50,.90], duration = 640, swapAt = .42;
  const clamp = value => Math.max(0,Math.min(1,value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const set = (key,value) => root.style.setProperty(key,String(value));
  const indexAt = value => value < .30 ? 0 : value < .70 ? 1 : 2;
  const models = slides.map(slide => ({
    image:slide.querySelector('.badlands-image img'),
    cta:slide.querySelector('.badlands-cta'),
  }));
  let enabled = false, near = true, mobile = false, warmed = false, measured = false;
  let frame = 0, measureFrame = 0, height = 0, width = 0, range = 1, progress = 0;
  let active = -1, requested = 0, transition = null, wasInView = false;

  const meta = document.createElement('div');
  meta.className = 'badlands-stage badlands-fixed-meta';
  meta.setAttribute('aria-hidden','true');
  meta.inert = true;
  for (const selector of ['.badlands-season','.badlands-label']) {
    const clone = slides[0].querySelector(selector).cloneNode(true);
    [clone,...clone.querySelectorAll('*')].forEach(node => {
      node.removeAttribute('id'); node.removeAttribute('data-node-id');
    });
    meta.append(clone);
  }
  const shutter = document.createElement('div');
  shutter.className = 'badlands-shutter';
  shutter.append(document.createElement('span'),document.createElement('span'));
  meta.append(shutter);
  stage.append(meta);

  const select = index => {
    const next = Math.max(0,Math.min(slides.length - 1,index));
    slides.forEach((slide,i) => {
      if (i !== next && slide.contains(document.activeElement)) track.focus({preventScroll:true});
      slide.inert = i !== next;
      slide.setAttribute('aria-hidden',String(i !== next));
      slide.classList.toggle('is-badlands-current',i === next);
    });
    active = next;
    root.dataset.badlandsActive = String(active);
    dots.forEach((dot,i) => {
      dot.classList.toggle('is-active',i === active);
      if (i === active) dot.setAttribute('aria-current','true');
      else dot.removeAttribute('aria-current');
    });
  };
  const content = (first,second,copy) => {
    set('--title-first-opacity',first); set('--title-second-opacity',second);
    set('--title-first-y',`${(1 - first) * 6}px`);
    set('--title-second-y',`${(1 - second) * 9}px`);
    set('--copy-opacity',copy); set('--copy-y',`${(1 - copy) * 5}px`);
    models.forEach(({cta},index) => {
      const unavailable = index !== active || Boolean(transition) || copy < .98;
      if (unavailable && cta === document.activeElement) track.focus({preventScroll:true});
      cta.inert = unavailable;
    });
  };
  const exposeActive = () => {
    slides.forEach((slide,index) => { slide.style.visibility = index === active ? 'visible' : 'hidden'; });
  };
  const rest = index => {
    transition = null;
    select(index); exposeActive();
    set('--shutter-closed',0); content(1,1,1);
    root.classList.remove('is-badlands-transitioning');
    root.dataset.badlandsFlight = '0';
  };
  const tick = time => {
    frame = 0;
    if (!enabled) {
      requested = Math.round(track.scrollLeft / Math.max(1,track.clientWidth));
      select(requested);
      return;
    }
    const bounds = root.getBoundingClientRect();
    if (!measureFrame) wasInView = bounds.top < innerHeight && bounds.bottom > 0;
    progress = clamp(-bounds.top / range);
    requested = indexAt(progress);
    root.dataset.badlandsProgress = progress.toFixed(4);
    if (document.hidden || !near) { rest(requested); return; }
    if (!transition && requested !== active) {
      transition = {from:active,to:requested,start:time};
      root.classList.add('is-badlands-transitioning');
    }
    if (!transition) return;
    const t = clamp((time - transition.start) / duration);
    // Coalesce quick navigation while the frame is closing.
    if (t < swapAt) transition.to = requested;
    if (t >= swapAt && !transition.swapped) {
      transition.swapped = true;
      select(transition.to); exposeActive();
      // Always paint a closed frame, even when a slow frame skips the blackout.
      transition.start = time - duration * swapAt;
      set('--shutter-closed',1); content(0,0,0);
      root.dataset.badlandsFlight = String(swapAt);
      frame = requestAnimationFrame(tick);
      return;
    }
    exposeActive();
    // One photograph is displayed throughout; its replacement happens in blackout.
    const closed = t < .38 ? smooth(t / .38) : t < .46 ? 1 : 1 - smooth((t - .46) / .46);
    set('--shutter-closed',closed);
    if (t < swapAt) {
      content(1 - smooth(t / .28),1 - smooth(t / .24),1 - smooth(t / .20));
    } else {
      content(smooth((t - .58) / .32),smooth((t - .64) / .32),smooth((t - .76) / .24));
    }
    root.dataset.badlandsFlight = t.toFixed(4);
    if (t >= 1) rest(active);
    if (transition || requested !== active) frame = requestAnimationFrame(tick);
  };
  const schedule = () => {
    if (!document.hidden && (!enabled || near) && !frame) frame = requestAnimationFrame(tick);
  };
  const measure = () => {
    measureFrame = 0;
    const before = root.getBoundingClientRect();
    const inView = before.top < innerHeight && before.bottom > 0;
    const keepInView = inView || wasInView || root.contains(document.activeElement);
    const selected = Math.max(0,requested);
    const wasEnabled = enabled;
    mobile = innerWidth <= 767;
    enabled = !preference.matches && innerHeight >= (mobile ? 720 : 600);
    root.classList.toggle('is-badlands-motion',enabled);
    track.setAttribute('aria-label',enabled ? 'BADLANDS 캠페인. 세로 스크롤 또는 좌우 방향키로 탐색' : originalLabel);
    if (enabled) {
      const nextHeight = stage.clientHeight, nextWidth = stage.clientWidth;
      const layoutChanged = !wasEnabled || height !== nextHeight || width !== nextWidth;
      height = nextHeight; width = nextWidth; range = height * 2.8;
      set('--badlands-height',`${height + range}px`);
      set('--badlands-fit',mobile ? 1 : Math.min(width / 1920,height / 1080));
      root.dataset.badlandsRange = String(range);
      root.dataset.badlandsStops = JSON.stringify(holds);
      if (measured && layoutChanged && keepInView) {
        progress = holds[selected];
        window.scrollTo({top:scrollY + root.getBoundingClientRect().top + progress * range,behavior:'instant'});
      } else progress = clamp(-root.getBoundingClientRect().top / range);
      track.scrollLeft = 0;
      if (!measured || layoutChanged) {
        cancelAnimationFrame(frame); frame = 0;
        requested = indexAt(progress); rest(requested);
      }
      schedule();
    } else {
      cancelAnimationFrame(frame); frame = 0; transition = null;
      root.style.removeProperty('--badlands-height');
      root.classList.remove('is-badlands-transitioning');
      slides.forEach((slide,index) => {
        slide.style.visibility = ''; models[index].cta.inert = false;
      });
      if (wasEnabled) {
        track.scrollLeft = selected * track.clientWidth;
        if (keepInView) window.scrollTo({top:scrollY + root.getBoundingClientRect().top,behavior:'instant'});
      }
      requested = Math.round(track.scrollLeft / Math.max(1,track.clientWidth));
      select(requested);
    }
    const after = root.getBoundingClientRect();
    wasInView = after.top < innerHeight && after.bottom > 0;
    measured = true;
  };
  const requestMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure); };
  const goTo = index => {
    requested = Math.max(0,Math.min(slides.length - 1,index));
    if (enabled) {
      window.scrollTo({top:scrollY + root.getBoundingClientRect().top + holds[requested] * range,behavior:'instant'});
      schedule();
    } else track.scrollTo({left:requested * track.clientWidth,behavior:preference.matches ? 'instant' : 'smooth'});
  };
  dots.forEach(dot => dot.addEventListener('click',() => goTo(Number(dot.dataset.carouselDot))));
  root.addEventListener('badlands:navigate',event => { if (Number.isInteger(event.detail?.index)) goTo(event.detail.index); });
  root.addEventListener('keydown',event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    if (!(event.target instanceof Element) || event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    const targets = {ArrowLeft:requested - 1,ArrowRight:requested + 1,Home:0,End:slides.length - 1};
    if (!(event.key in targets)) return;
    event.preventDefault(); goTo(targets[event.key]);
  });
  track.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('scroll',() => {
    if (!measureFrame) {
      const bounds = root.getBoundingClientRect();
      wasInView = bounds.top < innerHeight && bounds.bottom > 0;
    }
    schedule();
  },{passive:true});
  window.addEventListener('resize',requestMeasure,{passive:true});
  window.addEventListener('pageshow',requestMeasure);
  preference.addEventListener('change',requestMeasure);
  document.fonts?.ready.then(requestMeasure);
  if ('ResizeObserver' in window) new ResizeObserver(requestMeasure).observe(stage);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {
    near = entry.isIntersecting;
    if (near) {
      if (!warmed) {
        warmed = true;
        models.forEach(({image}) => { image.loading = 'eager'; image.decode?.().catch(() => {}); });
      }
      requestMeasure(); schedule();
    } else {
      cancelAnimationFrame(frame); frame = 0;
      if (!measureFrame) wasInView = false;
      if (enabled) rest(indexAt(clamp(-root.getBoundingClientRect().top / range)));
    }
  },{rootMargin:'100% 0px'}).observe(root);
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) {
      cancelAnimationFrame(frame); frame = 0;
      if (enabled) rest(indexAt(clamp(-root.getBoundingClientRect().top / range)));
    } else requestMeasure();
  });
  measure();
})();

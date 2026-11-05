(() => {
  'use strict';
  const section = document.querySelector('[data-bags-scroll]');
  const stage = section?.querySelector('[data-bags-stage]');
  const track = section?.querySelector('[data-carousel-track]');
  const slides = section ? [...section.querySelectorAll('[data-slide]')] : [];
  if (!stage || !track || !slides.length) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const suitableHeight = window.matchMedia('(min-height: 600px)');
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  const originalTrackLabel = track.getAttribute('aria-label');
  let enabled = false, near = true, active = -1, frame = 0, measureFrame = 0;
  let viewport = 0, width = 0, runway = 0;
  let entries = [], warmed = false;

  const updateActive = (index,source) => {
    const destination = clamp(index,0,slides.length - 1);
    if (destination === active) return;
    const old = active;
    active = destination;
    slides.forEach((slide,i) => {
      const inactive = i !== active;
      if (inactive && slide.contains(document.activeElement)) track.focus({preventScroll:true});
      slide.inert = inactive;
      slide.setAttribute('aria-hidden',String(inactive));
      slide.classList.toggle('is-bag-active',!inactive);
    });
    section.dataset.activeBag = String(active);
    if (active !== old) section.dispatchEvent(new CustomEvent('bags:change',{bubbles:true,detail:{index:active,previousIndex:old,source}}));
  };
  const render = (source = 'scroll') => {
    frame = 0;
    if (!enabled) {
      updateActive(Math.round(track.scrollLeft / Math.max(1,track.clientWidth)),source);
      return;
    }
    const top = section.getBoundingClientRect().top;
    const travel = clamp(-top,0,runway);
    let position = 0;
    entries.forEach((entry,index) => { if (travel >= entry) position = index; });
    if (track.scrollLeft) track.scrollLeft = 0;
    if (track.scrollTop) track.scrollTop = 0;
    if (top <= viewport * .3) section.classList.add('is-bags-entered');
    else if (top >= viewport) section.classList.remove('is-bags-entered');
    section.dataset.bagsPosition = String(position);
    section.dataset.bagsTravel = String(Math.round(travel));
    updateActive(Math.round(position),source);
  };
  const schedule = () => {
    if (!document.hidden && (!enabled || near) && !frame) frame = requestAnimationFrame(() => render());
  };
  const measure = () => {
    measureFrame = 0;
    const eligible = !motion.matches && suitableHeight.matches;
    let fits = false;
    section.classList.toggle('is-vertical-bags',eligible);
    if (eligible) {
      section.classList.add('is-measuring-bags');
      track.style.height = 'auto';
      viewport = stage.clientHeight;
      width = track.clientWidth;
      const contentHeight = Math.max(viewport,...slides.map((slide) => slide.getBoundingClientRect().height));
      fits = width >= 768 || contentHeight <= viewport + 2;
      if (width >= 768) section.style.setProperty('--bags-art-scale',String(Math.min(width / 1920,viewport / 1080)));
      section.classList.remove('is-measuring-bags');
    }
    enabled = eligible && fits;
    section.classList.toggle('is-vertical-bags',enabled);
    track.setAttribute('aria-label',enabled ? '가방 컬렉션. 세로 스크롤 또는 좌우 방향키로 탐색' : originalTrackLabel);
    if (enabled) {
      const step = viewport * (width <= 767 ? .82 : .95);
      entries = slides.map((_,i) => Math.round(i * step));
      runway = (slides.length - 1) * step + viewport * .7;
      track.style.height = `${viewport}px`;
      section.style.setProperty('--bags-section-height',`${viewport + runway}px`);
      section.dataset.bagsRunway = String(Math.round(runway));
      section.dataset.bagsEntries = JSON.stringify(entries.map(Math.round));
      render('layout');
    } else {
      section.style.removeProperty('--bags-section-height');
      track.style.removeProperty('height');
      width = track.clientWidth;
      track.scrollLeft = Math.max(0,active) * width;
      render('layout');
    }
    section.dispatchEvent(new CustomEvent('bags:layout',{bubbles:true,detail:{enhanced:enabled}}));
  };
  const requestMeasure = () => {
    if (!measureFrame) measureFrame = requestAnimationFrame(measure);
  };
  const configure = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    measure();
  };
  const goTo = (index) => {
    const destination = clamp(index,0,slides.length - 1);
    const behavior = motion.matches ? 'instant' : 'smooth';
    if (enabled) {
      const top = window.scrollY + section.getBoundingClientRect().top + entries[destination];
      window.scrollTo({top,behavior});
    } else track.scrollTo({left:destination * track.clientWidth,behavior});
  };
  section.addEventListener('bags:navigate',(event) => {
    const index = Number(event.detail?.index);
    if (Number.isInteger(index)) goTo(index);
  });
  section.addEventListener('keydown',(event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    if (!(event.target instanceof Element) || event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    if (!section.contains(document.activeElement)) return;
    const destinations = {ArrowLeft:active - 1,ArrowRight:active + 1,Home:0,End:slides.length - 1};
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  });
  section.addEventListener('focusin',(event) => {
    if (!enabled || !(event.target instanceof Element)) return;
    const slide = event.target.closest('[data-slide]');
    const index = slides.indexOf(slide);
    if (index < 0) return;
    const rect = event.target.getBoundingClientRect();
    section.classList.add('is-bags-entered');
    if (rect.top >= 12 && rect.bottom <= viewport - 12) return;
    const top = window.scrollY + section.getBoundingClientRect().top + entries[index];
    window.scrollTo({top,behavior:'instant'});
  });
  track.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',requestMeasure,{passive:true});
  window.addEventListener('pageshow',requestMeasure);
  if ('ResizeObserver' in window) new ResizeObserver(requestMeasure).observe(stage);
  document.fonts?.ready.then(requestMeasure);
  motion.addEventListener('change',configure);
  suitableHeight.addEventListener('change',configure);
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else requestMeasure();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) {
        if (!warmed) {
          warmed = true;
          section.querySelectorAll('.product-image img').forEach((image) => { image.loading = 'eager'; image.decode?.().catch(() => {}); });
        }
        schedule();
      }
    },{rootMargin:'150% 0px'}).observe(section);
  }
  configure();
})();

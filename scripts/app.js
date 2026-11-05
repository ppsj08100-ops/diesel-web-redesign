const heroScaleFrame = document.querySelector('.hero');
if (heroScaleFrame?.querySelector('[data-hero-stage]')) {
  let heroScaleLastValue = '';
  const updateHeroStageScale = () => {
    const heroScaleNextValue = String(heroScaleFrame.getBoundingClientRect().width / 1920);
    if (heroScaleNextValue === heroScaleLastValue) return;
    document.documentElement.style.setProperty('--hero-scale', heroScaleNextValue);
    heroScaleLastValue = heroScaleNextValue;
  };
  updateHeroStageScale();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHeroStageScale).observe(heroScaleFrame);
  } else {
    window.addEventListener('resize', updateHeroStageScale, { passive: true });
  }
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => (motionPreference.matches ? 'instant' : 'smooth');

const manifesto = document.querySelector('.manifesto');
const manifestoStage = manifesto?.querySelector('.manifesto-stage');
const manifestoTitle = manifesto?.querySelector('.manifesto-title');
const philosophy = document.querySelector('.philosophy');

if (manifestoStage && manifestoTitle && philosophy && 'IntersectionObserver' in window) {
  const desktopStory = window.matchMedia('(min-width: 768px) and (min-height: 600px)');
  const philosophyParts = [...philosophy.querySelectorAll('[data-story-reveal]')];
  let revealObserver = null;
  let visibilityObserver = null;
  let scrollFrame = 0;
  let inView = false;
  let enabled = false;
  let stageHeight = 0;
  let holdDistance = 0;

  const updateExit = () => {
    scrollFrame = 0;
    if (!enabled || !desktopStory.matches) return;
    const top = manifesto.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (-top - holdDistance * .45) / Math.max(1, holdDistance * .85)));
    const eased = progress * progress * (3 - 2 * progress);
    manifesto.style.setProperty('--manifesto-opacity', String(1 - eased));
    manifesto.style.setProperty('--manifesto-exit-y', `${-Math.min(80, stageHeight * .08) * eased}px`);
  };

  const scheduleExit = () => {
    if (enabled && desktopStory.matches && inView && !scrollFrame) {
      scrollFrame = requestAnimationFrame(updateExit);
    }
  };

  const measureStory = () => {
    stageHeight = manifestoStage.offsetHeight;
    holdDistance = Math.max(1, manifesto.offsetHeight - stageHeight);
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    updateExit();
  };

  const revealPhilosophy = () => {
    philosophyParts.forEach((part) => {
      part.classList.add('is-visible');
      revealObserver?.unobserve(part);
    });
  };

  const configureStory = () => {
    revealObserver?.disconnect();
    visibilityObserver?.disconnect();
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    enabled = !motionPreference.matches;
    manifesto.classList.toggle('is-motion-ready', enabled);
    philosophy.classList.toggle('is-motion-ready', enabled);
    manifesto.style.removeProperty('--manifesto-opacity');
    manifesto.style.removeProperty('--manifesto-exit-y');
    if (!enabled) return;

    // Refreshes and hash links can start after the entrance has already passed.
    if (manifestoTitle.getBoundingClientRect().top < 0) manifesto.classList.add('is-entered');
    philosophyParts.forEach((part) => {
      if (part.getBoundingClientRect().top < 0) part.classList.add('is-visible');
    });

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target === manifestoTitle) manifesto.classList.add('is-entered');
        else entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    if (!manifesto.classList.contains('is-entered')) revealObserver.observe(manifestoTitle);
    philosophyParts.forEach((part) => {
      if (!part.classList.contains('is-visible')) revealObserver.observe(part);
    });

    visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) scheduleExit();
    });
    visibilityObserver.observe(manifesto);
    measureStory();
  };

  philosophy.addEventListener('focusin', revealPhilosophy);
  window.addEventListener('scroll', scheduleExit, { passive: true });
  window.addEventListener('resize', measureStory, { passive: true });
  window.addEventListener('pageshow', measureStory);
  desktopStory.addEventListener('change', configureStory);
  motionPreference.addEventListener('change', configureStory);
  configureStory();
}

document.querySelectorAll('[data-hero-video]').forEach((video) => {
  const toggle = video.closest('.hero')?.querySelector('[data-hero-video-toggle]');
  if (!toggle) return;
  const label = toggle.querySelector('[data-hero-video-label]');
  const symbol = toggle.querySelector('[data-hero-video-symbol]');
  let userPaused = motionPreference.matches;
  let visible = false;
  let failed = false;
  let playAttempt = 0;

  video.muted = true;
  video.defaultMuted = true;
  if (userPaused) video.autoplay = false;

  const updateToggle = () => {
    const paused = video.paused;
    toggle.hidden = failed;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? '히어로 영상 재생' : '히어로 영상 일시정지');
    if (label) label.textContent = paused ? 'PLAY' : 'PAUSE';
    if (symbol) symbol.textContent = paused ? '▶' : 'Ⅱ';
  };
  const showPoster = () => {
    if (failed) return;
    failed = true;
    playAttempt += 1;
    video.pause();
    video.removeAttribute('src');
    video.load();
    updateToggle();
  };
  const syncPlayback = () => {
    if (failed || userPaused || !visible || document.hidden) {
      playAttempt += 1;
      video.pause();
      updateToggle();
      return;
    }
    if (!video.paused) return;
    const attempt = ++playAttempt;
    const onRejected = (error) => {
      if (failed || attempt !== playAttempt || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        userPaused = true;
        video.pause();
        updateToggle();
      } else showPoster();
    };
    video.muted = true;
    try { video.play()?.catch(onRejected); } catch (error) { onRejected(error); }
  };

  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  video.addEventListener('error', showPoster);
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    syncPlayback();
  });
  motionPreference.addEventListener('change', (event) => {
    userPaused = event.matches;
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      syncPlayback();
    }).observe(video);
  } else {
    const measureVisibility = () => {
      const rect = video.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      syncPlayback();
    };
    window.addEventListener('scroll', measureVisibility, { passive: true });
    window.addEventListener('resize', measureVisibility, { passive: true });
    measureVisibility();
  }
  if (video.error) showPoster();
  else syncPlayback();
  updateToggle();
});

document.querySelectorAll('[data-collection]').forEach((collection) => {
  const gallery = collection.querySelector('[data-collection-gallery]');
  const strip = gallery?.querySelector('[data-collection-strip]');
  const toggle = collection.querySelector('[data-collection-toggle]');
  if (!gallery || !strip || !strip.children.length || !toggle) return;

  const photos = [...strip.querySelectorAll('.collection-photo')];
  photos.forEach((photo,index) => {
    photo.dataset.collectionItem = String(index);
    const button = document.createElement('button');
    button.className = 'split-cta collection-photo-cta';
    button.type = 'button';
    button.dataset.collectionOpen = String(index);
    button.setAttribute('aria-label',`${photo.querySelector('img')?.alt || '컬렉션 사진'} 자세히 보기`);
    const label = document.createElement('span');
    label.textContent = 'VIEW MORE';
    const circle = document.createElement('span');
    circle.className = 'cta-circle';
    circle.setAttribute('aria-hidden','true');
    const arrow = document.createElement('img');
    arrow.src = 'assets/imgArrowBack.svg';
    arrow.width = arrow.height = 18;arrow.alt = '';
    circle.append(arrow);button.append(label,circle);photo.append(button);
  });

  // A second strip makes both directions repeat without reversing or jumping back.
  const duplicate = strip.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.setAttribute('data-collection-copy','');
  [duplicate, ...duplicate.querySelectorAll('*')].forEach((element) => {
    element.removeAttribute('id');
    element.removeAttribute('data-node-id');
    element.removeAttribute('data-collection-strip');
  });
  duplicate.querySelectorAll('img').forEach((image) => { image.loading = 'eager';image.alt = ''; });
  duplicate.querySelectorAll('[data-collection-open]').forEach((button) => { button.tabIndex = -1; });
  gallery.append(duplicate);
  gallery.setAttribute('data-loop-ready', '');
  gallery.setAttribute('aria-live', 'off');

  const direction = collection.dataset.collectionDirection === 'right' ? -1 : 1;
  const collectionName = collection.id === 'women' ? '여성' : '남성';
  let cycle = 0;
  let position = gallery.scrollLeft;
  let lastWrittenPosition = null;
  let userPaused = motionPreference.matches;
  let visible = !('IntersectionObserver' in window);
  let hovered = false;
  let focused = false;
  let pointerDown = false;
  let manualUntil = 0;
  let resumeTimer = 0;
  let frame = 0;
  let lastTime = 0;

  // Measured SAKE/TABI pace at 1440 and 1920px; mobile uses their shorter cycles.
  const referenceSpeed = () => {
    const women = collection.id === 'women';
    if (innerWidth <= 767) return women ? 103.6 : 67.5;
    return women ? 43.17 + innerWidth * .042125 : 37 + innerWidth * .03704;
  };

  const wrap = (value) => ((value % cycle) + cycle) % cycle;
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  };
  const canPlay = () => cycle > 0 && visible && !document.hidden
    && !userPaused && !hovered && !focused && !pointerDown && !document.querySelector('dialog[open]');

  const animate = (time) => {
    frame = 0;
    if (!canPlay() || time < manualUntil) {
      syncPlayback();
      return;
    }
    const elapsed = lastTime ? Math.min(time - lastTime, 64) / 1000 : 0;
    lastTime = time;
    position = wrap(position + direction * referenceSpeed() * elapsed);
    lastWrittenPosition = position;
    gallery.scrollLeft = position;
    frame = requestAnimationFrame(animate);
  };

  function syncPlayback() {
    clearTimeout(resumeTimer);
    if (!canPlay()) {
      stop();
      return;
    }
    const delay = manualUntil - performance.now();
    if (delay > 0) {
      stop();
      resumeTimer = setTimeout(syncPlayback, delay);
      return;
    }
    if (!frame) {
      position = wrap(gallery.scrollLeft);
      lastTime = 0;
      frame = requestAnimationFrame(animate);
    }
  }

  const updateToggle = () => {
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', `${collectionName} 컬렉션 자동 넘김 ${userPaused ? '재생' : '일시정지'}`);
    const label = toggle.querySelector('[data-collection-toggle-label]');
    const symbol = toggle.querySelector('[data-collection-toggle-symbol]');
    if (label) label.textContent = userPaused ? 'PLAY' : 'PAUSE';
    if (symbol) symbol.textContent = userPaused ? '▶' : 'Ⅱ';
  };

  const pauseForInteraction = () => {
    manualUntil = performance.now() + 2000;
    position = gallery.scrollLeft;
    syncPlayback();
  };

  // Keep subpixel progress between frames; native scroll events also serve manual input.
  gallery.addEventListener('scroll', () => {
    if (lastWrittenPosition !== null && Math.abs(gallery.scrollLeft - lastWrittenPosition) < 1) return;
    lastWrittenPosition = null;
    pauseForInteraction();
  }, { passive: true });
  gallery.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
    hovered = Boolean(event.target.closest('[data-collection-open]'));
    syncPlayback();
  });
  gallery.addEventListener('pointerout', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovered = event.relatedTarget instanceof Element && gallery.contains(event.relatedTarget)
      && Boolean(event.relatedTarget.closest('[data-collection-open]'));
    syncPlayback();
  });
  // Repeated pictures remain clickable, without exposing duplicate Tab stops.
  gallery.addEventListener('mousedown',(event) => {
    if (event.target instanceof Element && event.target.closest('[data-collection-copy]')) event.preventDefault();
  });
  gallery.addEventListener('pointerdown', () => {
    pointerDown = true;
    // Touch can focus a tabindex region; resume after the gesture settles.
    focused = false;
    pauseForInteraction();
  }, { passive: true });
  const releasePointer = () => {
    if (!pointerDown) return;
    pointerDown = false;
    pauseForInteraction();
  };
  window.addEventListener('pointerup', releasePointer, { passive: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true });
  gallery.addEventListener('wheel', pauseForInteraction, { passive: true });
  gallery.addEventListener('focusin', (event) => {
    focused = event.target instanceof Element && event.target.matches(':focus-visible');
    syncPlayback();
  });
  gallery.addEventListener('focusout', (event) => {
    if (gallery.contains(event.relatedTarget)) return;
    focused = false;
    syncPlayback();
  });
  gallery.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    focused = true;
    pauseForInteraction();
    const photoButton = event.target instanceof Element ? event.target.closest('[data-collection-open]') : null;
    if (photoButton && !photoButton.closest('[data-collection-copy]')) {
      const index = Number(photoButton.dataset.collectionOpen);
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? photos.length - 1
        : Math.max(0,Math.min(photos.length - 1,index + (event.key === 'ArrowLeft' ? -1 : 1)));
      photos[nextIndex].querySelector('[data-collection-open]').focus();
      return;
    }
    const first = strip.firstElementChild;
    const second = first?.nextElementSibling;
    const step = second ? second.offsetLeft - first.offsetLeft : cycle;
    const last = strip.lastElementChild;
    let destination = gallery.scrollLeft + (event.key === 'ArrowLeft' ? -step : step);
    if (event.key === 'Home') destination = 0;
    if (event.key === 'End') destination = last.offsetLeft - first.offsetLeft;
    gallery.scrollTo({ left: Math.max(0, destination), behavior: scrollBehavior() });
  });
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    updateToggle();
    syncPlayback();
  });
  motionPreference.addEventListener('change', (event) => {
    if (event.matches) userPaused = true;
    updateToggle();
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  document.querySelectorAll('dialog').forEach((modal) => modal.addEventListener('close',syncPlayback));

  const measure = () => {
    const nextCycle = duplicate.offsetLeft - strip.offsetLeft;
    if (nextCycle <= 0) return;
    const progress = cycle ? wrap(position) / cycle : 0;
    cycle = nextCycle;
    position = progress * cycle;
    lastWrittenPosition = position;
    gallery.scrollLeft = position;
    collection.dataset.collectionSpeed = referenceSpeed().toFixed(2);
    syncPlayback();
  };
  let measureFrame = 0;
  const requestMeasure = () => {
    if (!measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0;measure(); });
  };
  if ('ResizeObserver' in window) new ResizeObserver(requestMeasure).observe(gallery);
  else window.addEventListener('resize', measure, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }).observe(gallery);
  }
  measure();
  updateToggle();
  toggle.hidden = false;
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  if (carousel.hasAttribute('data-bags-scroll') || carousel.hasAttribute('data-badlands-motion')) return;
  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
  if (!track || !slides.length) return;

  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const count = carousel.querySelector('[data-carousel-count]');
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  let current = 0;
  let requestedIndex = null;
  let scrollFrame = 0;
  let resizeFrame = 0;
  let settleTimer = 0;

  const updateControls = () => {
    const activeIndex = requestedIndex ?? current;
    if (previous) previous.disabled = activeIndex === 0;
    if (next) next.disabled = activeIndex === slides.length - 1;
    if (count) {
      const position = String(activeIndex + 1).padStart(2, '0');
      const total = String(slides.length).padStart(2, '0');
      const label = `${position} / ${total}`;
      if (count.textContent !== label) count.textContent = label;
    }
    dots.forEach((dot) => {
      const active = Number(dot.dataset.carouselDot) === activeIndex;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const readCurrentSlide = () => {
    const bounds = track.getBoundingClientRect();
    const center = bounds.left + track.clientLeft + track.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    slides.forEach((slide, index) => {
      const slideBounds = slide.getBoundingClientRect();
      const difference = Math.abs(slideBounds.left + slideBounds.width / 2 - center);
      if (difference < distance) {
        distance = difference;
        nearest = index;
      }
    });
    current = nearest;
    updateControls();
    return distance;
  };

  const finishScroll = () => {
    clearTimeout(settleTimer);
    requestedIndex = null;
    readCurrentSlide();
  };

  const scheduleSettle = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(finishScroll, 160);
  };

  const goTo = (index, behavior = scrollBehavior()) => {
    const destination = Math.max(0, Math.min(index, slides.length - 1));
    const bounds = track.getBoundingClientRect();
    const slideBounds = slides[destination].getBoundingClientRect();
    const center = bounds.left + track.clientLeft + track.clientWidth / 2;
    const left = track.scrollLeft + slideBounds.left + slideBounds.width / 2 - center;
    requestedIndex = destination;
    updateControls();
    track.scrollTo({
      left: Math.max(0, Math.min(left, track.scrollWidth - track.clientWidth)),
      behavior,
    });
    if (behavior === 'instant') finishScroll();
    else scheduleSettle();
  };

  previous?.addEventListener('click', () => goTo((requestedIndex ?? current) - 1));
  next?.addEventListener('click', () => goTo((requestedIndex ?? current) + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.carouselDot);
      if (Number.isInteger(index)) goTo(index);
    });
  });

  track.addEventListener('scroll', () => {
    scheduleSettle();
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      readCurrentSlide();
    });
  }, { passive: true });

  track.addEventListener('scrollend', () => {
    const distance = readCurrentSlide();
    if (requestedIndex === null || (current === requestedIndex && distance < 2)) finishScroll();
  });

  const beginManualScroll = () => {
    clearTimeout(settleTimer);
    requestedIndex = null;
    readCurrentSlide();
  };
  track.addEventListener('pointerdown', beginManualScroll, { passive: true });
  track.addEventListener('touchstart', beginManualScroll, { passive: true });
  track.addEventListener('wheel', beginManualScroll, { passive: true });

  carousel.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (document.querySelector('dialog[open]')) return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (!carousel.contains(document.activeElement)) return;

    const activeIndex = requestedIndex ?? current;
    const destinations = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: slides.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  });

  const preserveSlide = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => goTo(requestedIndex ?? current, 'instant'));
  };
  if ('ResizeObserver' in window) new ResizeObserver(preserveSlide).observe(track);
  else window.addEventListener('resize', preserveSlide, { passive: true });
  updateControls();
});

const dialog = document.querySelector('#detail-dialog');
const dialogContent = dialog?.querySelector('[data-dialog-content]');
const searchDialog = document.querySelector('#site-search');
let dialogOpener = null;

if (dialog instanceof HTMLDialogElement && dialogContent) {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const photo = event.target.closest('.collection-photo[data-collection-item]');
    const photoTrigger = event.target.closest('[data-collection-open]') || photo?.querySelector('[data-collection-open]');
    if (photoTrigger) {
      const collection = photoTrigger.closest('[data-collection]');
      const original = collection?.querySelector('[data-collection-strip]')?.children[Number(photoTrigger.dataset.collectionOpen)];
      const image = original?.querySelector('img');
      if (!image) return;
      event.preventDefault();
      if (searchDialog instanceof HTMLDialogElement && searchDialog.open) searchDialog.close();
      if (!dialog.open) {
        const repeated = Boolean(photoTrigger.closest('[data-collection-copy]'));
        dialogOpener = repeated ? collection.querySelector('[data-collection-gallery]') : photoTrigger;
        if (repeated) dialogOpener.focus({preventScroll:true});
      }
      const eyebrow = document.createElement('p');
      eyebrow.className = 'dialog-eyebrow';eyebrow.textContent = `DIESEL / ${collection.id.toUpperCase()}`;
      const heading = document.createElement('h2');
      heading.id = 'detail-title';heading.textContent = collection.id === 'women' ? 'Women' : 'Men';
      const fullImage = image.cloneNode(false);
      fullImage.removeAttribute('data-node-id');fullImage.loading = 'eager';fullImage.className = 'dialog-collection-image';
      const caption = document.createElement('p');
      caption.className = 'dialog-collection-caption';caption.textContent = image.alt;
      dialogContent.replaceChildren(eyebrow,heading,fullImage,caption);
      dialog.scrollTop = 0;
      if (!dialog.open) dialog.showModal();
      return;
    }
    const trigger = event.target.closest('[data-detail]');
    if (trigger) {
      const template = document.getElementById(`detail-${trigger.dataset.detail}`);
      if (!(template instanceof HTMLTemplateElement)) return;
      event.preventDefault();
      if (searchDialog instanceof HTMLDialogElement && searchDialog.open) searchDialog.close();
      if (!dialog.open) dialogOpener = trigger;
      dialogContent.replaceChildren(template.content.cloneNode(true));
      dialog.scrollTop = 0;
      if (!dialog.open) dialog.showModal();
      else dialog.querySelector('[data-dialog-close]')?.focus({ preventScroll: true });
      dialog.scrollTop = 0;
      return;
    }
    const closeButton = event.target.closest('[data-dialog-close]');
    if (closeButton && dialog.contains(closeButton)) dialog.close();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]') && dialogOpener?.isConnected) {
      dialogOpener.focus({ preventScroll: true });
    }
    dialogOpener = null;
  });
}

const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.getElementById('site-menu');
if (menuToggle && menu) {
  const mobileMenu = window.matchMedia('(max-width: 900px)');
  const setMenuOpen = (open) => {
    const visible = open && mobileMenu.matches;
    menu.hidden = !visible;
    menuToggle.setAttribute('aria-expanded', String(visible));
  };

  menuToggle.addEventListener('click', () => setMenuOpen(menu.hidden));
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a[href]')) setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden && !document.querySelector('dialog[open]')) {
      setMenuOpen(false);
      menuToggle.focus({ preventScroll: true });
    }
  });
  mobileMenu.addEventListener('change', () => {
    if (!mobileMenu.matches) setMenuOpen(false);
  });
  setMenuOpen(false);
}

if (searchDialog instanceof HTMLDialogElement) {
  const searchInput = searchDialog.querySelector('#site-search-input');
  const searchForm = searchDialog.querySelector('[data-site-search-form]');
  const searchStatus = searchDialog.querySelector('[data-search-status]');
  const resultsContainer = searchDialog.querySelector('[data-search-results]');
  const entries = [
    { title: 'BAGS', href: '#bags', description: '디젤 가방 컬렉션', keywords: 'bag bags 가방 백 핸드백', recommended: true },
    { title: 'COMMITMENT', href: '#commitment', description: 'Waste, Reworked. 소재와 환경을 향한 시선', keywords: 'commitment sustainability 지속가능 지속가능성 환경 소재 리사이클', recommended: true },
    { title: 'BADLANDS', href: '#badlands', description: 'FW26 캡슐 컬렉션과 데님 이야기', keywords: 'badlands fw26 denim capsule 배드랜즈 데님 캠페인 컬렉션', recommended: true },
    { title: 'FOOTAGE', href: '#commercial', description: '디젤의 패션 이미지와 룩북', keywords: 'footage commercial lookbook 사진 이미지 룩북 영상', recommended: true },
    { title: 'PRESS', href: '#media', description: '협업, 프래그런스, 프라이드와 패션 위크', keywords: 'press media news 미디어 프레스 소식 뉴스 캠페인 향수 프라이드', recommended: true },
    { title: 'MEN', href: '#men', description: '디젤 남성 컬렉션', keywords: 'men menswear 남성 남자 남성복 맨', recommended: true },
    { title: 'WOMEN', href: '#women', description: '디젤 여성 컬렉션', keywords: 'women womenswear 여성 여자 여성복 우먼', recommended: true },
    { title: 'PHILOSOPHY', href: '#philosophy', description: 'For Successful Living. 디젤의 브랜드 철학', keywords: 'philosophy brand manifesto 철학 브랜드 선언문 디젤 diesel' },
    { title: 'Melissa', href: '#bags', description: 'Diesel × Melissa 퀀텀 돔 백', keywords: 'melissa quantum dome bag 가방 멜리사 퀀텀 돔 백', productIndex: 0 },
    { title: '1DR DOME', href: '#bags', description: '경쾌하고 스포티한 아이콘의 새로운 해석', keywords: '1dr dome bag 가방 원디알 돔 백', productIndex: 1 },
    { title: 'D-Line Bag', href: '#bags', description: '오벌 D 버클과 디젤 데님의 토트백', keywords: 'd-line dline bag tote denim 가방 디라인 토트백 데님', productIndex: 2 },
  ];
  let visibleEntries = [];
  let searchOpener = null;
  const normalize = (value) => value.normalize('NFKC').toLowerCase().trim().replace(/[\s-]+/g, '');

  const renderResults = () => {
    if (!(searchInput instanceof HTMLInputElement) || !resultsContainer) return;
    const query = searchInput.value.trim();
    const normalizedQuery = normalize(query);
    visibleEntries = entries.filter((entry) => {
      if (!normalizedQuery) return entry.recommended;
      const source = `${entry.title} ${entry.description} ${entry.keywords}`.normalize('NFKC').toLowerCase();
      if (/^[a-z0-9\s-]+$/i.test(query)) {
        return normalize(entry.title).startsWith(normalizedQuery)
          || source.split(/[^\p{L}\p{N}]+/u).some((word) => word.startsWith(normalizedQuery));
      }
      return normalize(source).includes(normalizedQuery);
    });
    const fragment = document.createDocumentFragment();
    visibleEntries.forEach((entry) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = entry.href;
      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.textContent = entry.title;
      const description = document.createElement('span');
      description.className = 'search-result-description';
      description.textContent = entry.description;
      link.append(title, description);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        activateResult(entry);
      });
      fragment.append(link);
    });
    resultsContainer.replaceChildren(fragment);
    if (searchStatus) {
      searchStatus.textContent = normalizedQuery
        ? visibleEntries.length ? `검색 결과 ${visibleEntries.length}개` : '검색 결과가 없습니다. 다른 검색어를 입력해 주세요.'
        : '추천 섹션 7개';
    }
  };

  const activateResult = (entry) => {
    const target = document.querySelector(entry.href);
    if (!target) return;
    searchDialog.close();
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    if (Number.isInteger(entry.productIndex)) {
      const products = document.querySelector('[data-carousel="products"]');
      if (products?.matches('[data-bags-scroll]')) {
        products.dispatchEvent(new CustomEvent('bags:navigate', { detail: { index: entry.productIndex } }));
      } else products?.querySelector(`[data-carousel-dot="${entry.productIndex}"]`)?.click();
    }
  };

  document.querySelectorAll('[data-search-open]').forEach((button) => {
    button.addEventListener('click', () => {
      searchOpener = button;
      if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close();
      if (menu) menu.hidden = true;
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (searchInput instanceof HTMLInputElement) searchInput.value = '';
      renderResults();
      if (!searchDialog.open) searchDialog.showModal();
      searchDialog.scrollTop = 0;
      searchInput?.focus({ preventScroll: true });
    });
  });
  searchInput?.addEventListener('input', renderResults);
  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (visibleEntries.length) activateResult(visibleEntries[0]);
    else if (searchStatus) searchStatus.textContent = '검색 결과가 없습니다. 다른 검색어를 입력해 주세요.';
  });
  searchDialog.querySelector('[data-search-close]')?.addEventListener('click', () => searchDialog.close());
  searchDialog.addEventListener('click', (event) => {
    if (event.target !== searchDialog) return;
    const bounds = searchDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) searchDialog.close();
  });
  searchDialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]') && searchOpener?.isConnected) {
      searchOpener.focus({ preventScroll: true });
    }
    searchOpener = null;
  });
}

document.querySelectorAll('[data-back-top]').forEach((button) => {
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: scrollBehavior() }));
});

const revealElements = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}


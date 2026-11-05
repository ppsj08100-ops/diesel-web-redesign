(() => {
  'use strict';
  const root = document.querySelector('[data-footer-physics]');
  const canvas = root?.querySelector('[data-footer-canvas]');
  const source = root?.querySelector('[data-footer-fallback] [data-footer-badge]');
  if (!canvas || !source) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let context;
  try { context = canvas.getContext('2d', {alpha:true}); } catch { return; }
  if (!context) return;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.touchAction = 'pan-y';
  const STEP = 1000 / 60, MAX_ACTIVE_TIME = 16000;
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  let Matter = null, engine = null, bodies = [], sprite = null;
  let width = 0, height = 0, ratio = 1, near = false, visible = false;
  let started = false, settled = false, failed = false;
  let frame = 0, visibilityFrame = 0, resizeTimer = 0, generation = 0;
  let lastTime = 0, accumulator = 0, activeTime = 0, drawCount = 0;
  let physicsSteps = 0, preparation = null, preparationFrame = 0;
  let drag = null, dragTarget = null, pointerId = null, pointerSample = null, initialization = null;
  let brushCount = 0;
  let matterPromise = null, imagePromise = null, reducedApplied = false;
  const state = (value) => { root.dataset.footerPhysics = value; };
  state('static');
  root.dataset.footerCount = '0';
  root.dataset.footerFrames = '0';
  root.dataset.footerBrushes = '0';

  const loadMatter = () => {
    if (window.Matter?.Engine && window.Matter?.Bodies) return Promise.resolve(window.Matter);
    if (!matterPromise) matterPromise = new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src = new URL('assets/vendor/matter.min.js',document.baseURI).href;
      script.async = true;
      script.onload = () => window.Matter?.Engine ? resolve(window.Matter) : reject(new Error('Physics unavailable'));
      script.onerror = () => reject(new Error('Physics unavailable'));
      document.head.append(script);
    });
    return matterPromise;
  };
  const loadImage = () => {
    if (!imagePromise) imagePromise = new Promise((resolve,reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = async () => {
        try { await image.decode?.(); } catch {}
        if (image.naturalWidth && image.naturalHeight) resolve(image);
        else reject(new Error('Badge unavailable'));
      };
      image.onerror = () => reject(new Error('Badge unavailable'));
      image.src = source.currentSrc || source.getAttribute('src');
    });
    return imagePromise;
  };
  const cropFor = (image) => {
    const values = (root.dataset.footerCrop || '').trim().split(/[,\s]+/).map(Number);
    if (values.length !== 4 || !values.every(Number.isFinite) || values[2] <= 0 || values[3] <= 0) {
      return {x:0,y:0,width:image.naturalWidth,height:image.naturalHeight};
    }
    const x = clamp(values[0],0,image.naturalWidth - 1), y = clamp(values[1],0,image.naturalHeight - 1);
    return {x,y,width:clamp(values[2],1,image.naturalWidth - x),height:clamp(values[3],1,image.naturalHeight - y)};
  };
  const releaseDrag = (resume = true) => {
    const hadDrag = Boolean(drag);
    if (drag?.bodyB) {
      Matter.Body.setVelocity(drag.bodyB,{x:0,y:0});
      Matter.Body.setAngularVelocity(drag.bodyB,0);
    }
    if (drag && engine) Matter.Composite.remove(engine.world,drag);
    drag = null;
    dragTarget = pointerSample = null;
    if (pointerId !== null) {
      try { if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId); } catch {}
    }
    pointerId = null;
    canvas.style.cursor = '';
    if (hadDrag) activeTime = 0;
    if (resume) wake();
  };
  const stopFrames = () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(preparationFrame);
    preparationFrame = 0;
    frame = 0;
    lastTime = accumulator = 0;
    releaseDrag(false);
    bodies.forEach(body => { body.force.x = body.force.y = body.torque = 0; });
  };
  const reset = () => {
    generation++;
    stopFrames();
    cancelAnimationFrame(visibilityFrame);
    visibilityFrame = 0;
    if (preparation) { preparation.resolve(false); preparation = null; }
    if (engine) {
      Matter.Composite.clear(engine.world,false,true);
      Matter.Engine.clear(engine);
    }
    engine = null;
    bodies = [];
    sprite = null;
    started = settled = false;
    activeTime = drawCount = physicsSteps = brushCount = 0;
    root.classList.remove('is-footer-ready');
    root.dataset.footerCount = root.dataset.footerFrames = '0';
    root.dataset.footerPreparationSteps = root.dataset.footerPhysicsSteps = root.dataset.footerSleeping = '0';
    root.dataset.footerBrushes = '0';
    context.clearRect(0,0,canvas.width,canvas.height);
    state('static');
  };
  const enforceReducedMotion = () => {
    if (!preference.matches) { reducedApplied = false; return false; }
    // A frame or observer can see the new preference before its change event.
    // Reset there as well, so static always means the canvas is fully disabled.
    if (!reducedApplied) { reducedApplied = true; reset(); }
    state('static');
    return true;
  };
  const pause = () => {
    if (enforceReducedMotion()) return;
    stopFrames();
    if (engine || initialization) state('paused');
  };
  const draw = () => {
    if (enforceReducedMotion()) return;
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,canvas.width,canvas.height);
    context.setTransform(ratio,0,0,ratio,0,0);
    for (const body of bodies) {
      const badge = body.plugin.footerBadge;
      context.save();
      context.translate(body.position.x,body.position.y);
      context.rotate(body.angle);
      context.drawImage(sprite,-badge.width / 2,-badge.height / 2,badge.width,badge.height);
      context.restore();
    }
    root.dataset.footerFrames = String(++drawCount);
    root.dataset.footerPhysicsSteps = String(physicsSteps);
    root.dataset.footerSleeping = String(bodies.filter((body) => body.isSleeping).length);
    root.classList.add('is-footer-ready');
  };
  const settle = () => {
    if (enforceReducedMotion()) return;
    for (const body of bodies) {
      Matter.Body.setVelocity(body,{x:0,y:0});
      Matter.Body.setAngularVelocity(body,0);
      body.force.x = body.force.y = body.torque = 0;
      Matter.Sleeping.set(body,true);
    }
    settled = true;
    frame = 0;
    lastTime = accumulator = 0;
    draw();
    state('idle');
  };
  const advanceDrag = () => {
    if (!drag || !dragTarget) return;
    const dx = dragTarget.x - drag.pointA.x, dy = dragTarget.y - drag.pointA.y;
    const distance = Math.hypot(dx,dy);
    // Advance only on the fixed physics step: the weight is the same at 60/120Hz.
    const amount = distance ? Math.min(.22,6 / distance) : 0;
    drag.pointA.x += dx * amount;
    drag.pointA.y += dy * amount;
    const anchor = Matter.Vector.add(drag.bodyB.position,drag.pointB);
    const stretchX = drag.pointA.x - anchor.x, stretchY = drag.pointA.y - anchor.y;
    const stretch = Math.hypot(stretchX,stretchY);
    const limit = Math.min(28,drag.bodyB.plugin.footerBadge.width * .12);
    if (stretch > limit) {
      drag.pointA.x = anchor.x + stretchX * limit / stretch;
      drag.pointA.y = anchor.y + stretchY * limit / stretch;
    }
  };
  const limitMotion = () => {
    bodies.forEach(body => {
      if (body.isSleeping) return;
      const held = body === drag?.bodyB;
      const maximum = held ? 4.2 : 2.8;
      let x = body.velocity.x, y = Math.max(body.velocity.y,held ? -3.4 : -1.7);
      const speed = Math.hypot(x,y);
      if (speed > maximum) { x *= maximum / speed; y *= maximum / speed; }
      if (x !== body.velocity.x || y !== body.velocity.y) Matter.Body.setVelocity(body,{x,y});
      const angular = clamp(body.angularVelocity,held ? -.028 : -.016,held ? .028 : .016);
      if (angular !== body.angularVelocity) Matter.Body.setAngularVelocity(body,angular);
    });
  };
  const tick = (time) => {
    frame = 0;
    if (enforceReducedMotion()) return;
    if (!engine || !visible || document.hidden) { pause(); return; }
    const elapsed = lastTime ? Math.min(50,Math.max(0,time - lastTime)) : STEP;
    lastTime = time;
    accumulator += elapsed;
    let updates = 0;
    try {
      if (settled) {
        state('idle');
        return;
      }
      while (accumulator >= STEP && updates < 3) {
        advanceDrag();
        Matter.Engine.update(engine,STEP);
        limitMotion();
        physicsSteps++;
        accumulator -= STEP;
        activeTime = drag ? 0 : activeTime + STEP;
        updates++;
      }
      if (bodies.some((body) => !Number.isFinite(body.position.x + body.position.y + body.angle))) throw new Error('Physics unavailable');
      if (!drag && (bodies.every((body) => body.isSleeping) || activeTime >= MAX_ACTIVE_TIME)) { settle(); return; }
      if (updates) draw();
      frame = requestAnimationFrame(tick);
    } catch {
      failed = true;
      reset();
    }
  };
  const wake = () => {
    if (enforceReducedMotion()) return;
    if (!engine || !started || !visible || document.hidden) return;
    state(settled ? 'idle' : 'active');
    if (settled) return;
    if (!frame) { lastTime = accumulator = 0; frame = requestAnimationFrame(tick); }
  };
  const setup = (library,image) => {
    Matter = library;
    width = root.clientWidth;
    height = root.clientHeight;
    if (!width || !height) throw new Error('Footer unavailable');
    const mobile = width <= 767;
    ratio = Math.min(devicePixelRatio || 1,mobile ? 1.25 : 1.5,2200 / width);
    canvas.width = Math.max(1,Math.round(width * ratio));
    canvas.height = Math.max(1,Math.round(height * ratio));
    const crop = cropFor(image);
    const baseWidth = mobile ? clamp(width * .37,112,160) : clamp(width * .17,180,300);
    const baseHeight = baseWidth * crop.height / crop.width;
    sprite = document.createElement('canvas');
    sprite.width = Math.ceil(baseWidth * 1.15 * ratio);
    sprite.height = Math.max(1,Math.round(sprite.width * crop.height / crop.width));
    const spriteContext = sprite.getContext('2d');
    if (!spriteContext) throw new Error('Badge unavailable');
    spriteContext.drawImage(image,crop.x,crop.y,crop.width,crop.height,0,0,sprite.width,sprite.height);
    engine = Matter.Engine.create({enableSleeping:true,positionIterations:7,velocityIterations:6});
    const count = mobile ? 12 : 16;
    const wall = 100, ceiling = -height;
    const walls = [
      Matter.Bodies.rectangle(width / 2,height + wall / 2 - 6,width + wall * 2,wall,{isStatic:true}),
      Matter.Bodies.rectangle(-wall / 2,(height + ceiling) / 2,wall,height - ceiling + wall * 2,{isStatic:true}),
      Matter.Bodies.rectangle(width + wall / 2,(height + ceiling) / 2,wall,height - ceiling + wall * 2,{isStatic:true}),
      Matter.Bodies.rectangle(width / 2,ceiling - wall / 2,width + wall * 2,wall,{isStatic:true}),
    ];
    const random = Math.random;
    bodies = Array.from({length:count},() => {
      const size = .84 + random() * .22;
      const badgeWidth = baseWidth * size, badgeHeight = baseHeight * size;
      const x = badgeWidth * .55 + random() * Math.max(0,width - badgeWidth * 1.1);
      const y = height * (.10 + random() * .48);
      const vertices = Array.from({length:20},(_,point) => {
        const angle = point * Math.PI * 2 / 20;
        return {x:Math.cos(angle) * badgeWidth / 2,y:Math.sin(angle) * badgeHeight / 2};
      });
      const body = Matter.Bodies.fromVertices(x,y,[vertices],{label:'footer-badge',restitution:.015,friction:.45,frictionStatic:.7,frictionAir:.03,density:.0045,sleepThreshold:60});
      if (!body) throw new Error('Badge unavailable');
      body.plugin.footerBadge = {width:badgeWidth,height:badgeHeight};
      Matter.Body.setAngle(body,(random() - .5) * Math.PI * 1.8);
      Matter.Body.setAngularVelocity(body,(random() - .5) * .016);
      return body;
    });
    Matter.Composite.add(engine.world,[...walls,...bodies]);
    root.dataset.footerCount = String(count);
    root.dataset.footerMatter = Matter.version || '';
    state('preparing');
  };
  const queuePreparation = () => {
    if (enforceReducedMotion()) return;
    if (!preparation || preparationFrame || !near || document.hidden) return;
    state('preparing');
    preparationFrame = requestAnimationFrame(() => {
      preparationFrame = 0;
      if (enforceReducedMotion()) return;
      const job = preparation;
      if (!job || job.token !== generation || !engine) return;
      if (!near || document.hidden) return;
      const begin = performance.now();
      let batch = 0;
      try {
        while (job.steps < 960 && batch < 24 && performance.now() - begin < 5) {
          Matter.Engine.update(engine,STEP);
          job.steps++; physicsSteps++; batch++;
        }
        if (bodies.some((body) => !Number.isFinite(body.position.x + body.position.y + body.angle))) throw new Error('Physics unavailable');
        root.dataset.footerPreparationSteps = String(job.steps);
        if (job.steps >= 720 && (job.steps >= 960 || bodies.every((body) => body.isSleeping))) {
          preparation = null;
          for (const body of bodies) {
            // Keep the first painted pile entirely inside its canvas after solving.
            Matter.Body.setPosition(body,{x:clamp(body.position.x,1,width - 1),y:clamp(body.position.y,1,height - 7)});
          }
          started = true;
          settle();
          job.resolve(true);
        } else queuePreparation();
      } catch {
        failed = true;
        reset();
      }
    });
  };
  const prepareWorld = (token) => new Promise((resolve) => {
    preparation = {token,steps:0,resolve};
    queuePreparation();
  });
  const ensure = () => {
    if (enforceReducedMotion()) return;
    if (engine || initialization || failed || !near) return;
    const token = generation;
    state('preparing');
    initialization = Promise.all([loadMatter(),loadImage()]).then(async ([library,image]) => {
      if (enforceReducedMotion() || token !== generation || !near) return;
      setup(library,image);
      if (await prepareWorld(token) && token === generation) refreshVisibility();
    }).catch(() => {
      if (token === generation) { failed = true; reset(); }
    }).finally(() => {
      initialization = null;
      if (token !== generation && near && !preference.matches && !failed) ensure();
    });
  };
  const refreshVisibility = () => {
    visibilityFrame = 0;
    if (enforceReducedMotion()) return;
    const rect = root.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < innerHeight;
    if (near) ensure();
    if (!engine) return;
    if (preparation) { queuePreparation(); return; }
    if (visible && (started || rect.top < innerHeight * .8)) { started = true; wake(); }
    else pause();
  };
  const requestVisibility = () => {
    if ((near || engine) && !visibilityFrame) visibilityFrame = requestAnimationFrame(refreshVisibility);
  };
  const localPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {x:clamp((event.clientX - rect.left) * width / rect.width,0,width),y:clamp((event.clientY - rect.top) * height / rect.height,0,height - 6)};
  };
  const bodyAt = (point) => [...bodies].reverse().find((body) => Matter.Query.point([body],point).length);
  const brush = (body,point,dx,dy,time) => {
    const badge = body.plugin.footerBadge;
    if (time - (badge.lastBrush || 0) < 140 || Math.hypot(dx,dy) < 1.2) return;
    badge.lastBrush = time;
    Matter.Sleeping.set(body,false);
    // A tiny, bounded contact impulse; the pile itself resolves the rocking.
    const forceX = clamp(dx * .0013,-.006,.006) * body.mass;
    const forceY = clamp(dy * .000006,0,.00010) * body.mass;
    Matter.Body.applyForce(body,point,{x:forceX,y:forceY});
    settled = false;
    activeTime = 0;
    root.dataset.footerBrushes = String(++brushCount);
    wake();
  };
  canvas.addEventListener('pointerdown',(event) => {
    if (enforceReducedMotion()) return;
    if (event.pointerType !== 'mouse' || event.button !== 0 || !engine || !started) return;
    const point = localPoint(event);
    const body = bodyAt(point);
    if (!body) return;
    event.preventDefault();
    releaseDrag(false);
    bodies.splice(bodies.indexOf(body),1);
    bodies.push(body);
    Matter.Sleeping.set(body,false);
    settled = false;
    dragTarget = {...point};
    drag = Matter.Constraint.create({pointA:{...point},bodyB:body,pointB:{x:point.x - body.position.x,y:point.y - body.position.y},stiffness:.10,damping:.3,length:0});
    Matter.Composite.add(engine.world,drag);
    pointerId = event.pointerId;
    try { canvas.setPointerCapture(pointerId); } catch {}
    canvas.style.cursor = 'grabbing';
    wake();
  });
  canvas.addEventListener('pointermove',(event) => {
    if (enforceReducedMotion()) return;
    if (drag && event.pointerId === pointerId) { dragTarget = localPoint(event); return; }
    if (event.pointerType !== 'mouse' || event.buttons || !engine || !started || !visible || document.hidden) return;
    const point = localPoint(event), time = performance.now(), body = bodyAt(point);
    canvas.style.cursor = body ? 'grab' : '';
    if (body && pointerSample) {
      const factor = STEP / clamp(time - pointerSample.time,8,80);
      brush(body,point,(point.x - pointerSample.x) * factor,(point.y - pointerSample.y) * factor,time);
    }
    pointerSample = {...point,time};
  });
  canvas.addEventListener('pointerleave',() => { pointerSample = null; if (!drag) canvas.style.cursor = ''; });
  const finishPointer = (event) => { if (event.pointerId === pointerId) releaseDrag(); };
  canvas.addEventListener('pointerup',finishPointer);
  canvas.addEventListener('pointercancel',finishPointer);
  canvas.addEventListener('lostpointercapture',finishPointer);
  window.addEventListener('blur',() => releaseDrag(false));
  window.addEventListener('scroll',requestVisibility,{passive:true});
  const requestResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (enforceReducedMotion()) return;
      if (engine && Math.abs(root.clientWidth - width) < 1 && Math.abs(root.clientHeight - height) < 1) return;
      reset();
      if (!preference.matches) { ensure(); refreshVisibility(); }
    },140);
  };
  window.addEventListener('resize',requestResize,{passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(requestResize).observe(root);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { near = entry.isIntersecting; if (near) { ensure(); refreshVisibility(); } else pause(); },{rootMargin:'100% 0px'}).observe(root);
  } else { near = true; refreshVisibility(); }
  preference.addEventListener('change',() => {
    if (enforceReducedMotion()) return;
    reset();
    ensure(); refreshVisibility();
  });
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) pause(); else refreshVisibility();
  });
})();

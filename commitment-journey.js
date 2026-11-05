(() => {
  'use strict';
  const root=document.querySelector('[data-commitment-journey]');
  const viewport=root?.querySelector('[data-commitment-viewport]');
  const chapters=root ? [...root.querySelectorAll('[data-commitment-chapter]')] : [];
  if (!viewport || chapters.length!==3) return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const suitableHeight=window.matchMedia('(min-height: 520px)');
  const bags=document.querySelector('[data-bags-scroll]');
  const bagStage=bags?.querySelector('[data-bags-stage]');
  const finalBag=bags?.querySelector('.product-dline');
  const bagPhoto=finalBag?.querySelector('.product-image');
  const space=root.querySelector('.commitment-space');
  const words=chapters.map(chapter=>[...chapter.querySelectorAll('[data-journey-word]')]);
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const p=clamp(value);return p*p*(3-2*p);};
  let enabled=false,near=true,frame=0,measureFrame=0,previousTime=0;
  let height=0,range=1,gap=1800,progress=0,current=-1,mobile=false;
  let travel=0,entryDistance=0,entryDepth=0,entry=1,entryBag=null;
  let sourceReveal=null,entryReveal=null;
  const holds=[.08,.50,.91];
  const set=(element,name,value)=>element.style.setProperty(name,value);
  const stopEntryReveal=()=>{
    entryReveal?.cancel();
    sourceReveal=entryReveal=null;
  };
  const syncEntryReveal=visible=>{
    if (!visible) {stopEntryReveal();return;}
    const reveal=bagPhoto.getAnimations().find(animation=>animation.playState==='running' || animation.playState==='pending');
    if (reveal && reveal!==sourceReveal) {
      stopEntryReveal();
      sourceReveal=reveal;
      // A quick flick can cross the handoff before the product's slit has opened.
      // Keep the same reveal clock on both photographs, rather than jumping cuts.
      entryReveal=entryBag.firstElementChild.animate(reveal.effect.getKeyframes(),reveal.effect.getTiming());
      if (reveal.startTime!==null) entryReveal.startTime=reveal.startTime;
      else entryReveal.currentTime=reveal.currentTime || 0;
    } else if (sourceReveal?.playState==='idle') stopEntryReveal();
  };

  const render=()=>{
    progress=clamp((travel-entryDistance)/range);
    entry=entryDistance ? clamp(travel/entryDistance) : 1;
    const arrival=smooth(entry);
    const introOffset=-entryDepth*(1-arrival);
    let flight=0,from=0,position=0;
    if (progress>.18 && progress<.43) {from=0;flight=smooth((progress-.18)/.25);position=flight;}
    else if (progress>=.43 && progress<=.57) {from=1;position=1;}
    else if (progress>.57 && progress<.82) {from=1;flight=smooth((progress-.57)/.25);position=1+flight;}
    else if (progress>=.82) {from=2;position=2;}
    const pulse=Math.sin(flight*Math.PI);
    const direction=from===0 ? -1 : 1;
    set(root,'--camera-z',`${position*gap+introOffset}px`);
    set(root,'--camera-x',`${direction*pulse*height*(mobile ? .025 : .055)}px`);
    set(root,'--camera-y',`${-pulse*height*(mobile ? .008 : .014)}px`);
    set(root,'--camera-yaw',`${direction*pulse*(mobile ? .8 : 1.8)}deg`);
    set(root,'--camera-pitch',`${-pulse*(mobile ? .4 : .8)}deg`);
    const dominant=Math.round(position);
    chapters.forEach((chapter,index)=>{
      let opacity=0,note=0;
      if (flight>0) {
        if (index===from) {opacity=1-smooth((flight-.30)/.35);note=1-smooth(flight/.18);}
        else if (index===from+1) {opacity=smooth(flight/.22);note=smooth((flight-.78)/.22);}
      } else if (index===from) {opacity=1;note=1;}
      if (index===0 && entry<1) {
        opacity*=smooth((entry-.03)/.52);
        note*=smooth((entry-.68)/.32);
      }
      chapter.style.visibility=opacity>.001 ? 'visible' : 'hidden';
      chapter.inert=index!==dominant;
      chapter.setAttribute('aria-hidden',String(index!==dominant));
      chapter.classList.toggle('is-current-chapter',index===dominant);
      set(chapter,'--chapter-opacity',String(opacity));
      set(chapter,'--note-opacity',String(note));
      set(chapter,'--note-y',`${(1-note)*14}px`);
      const incoming=flight>0 && index===from+1;
      const tone=index===0 && entry<1 ? Math.round(100+132*arrival) : incoming ? Math.round(110+122*smooth(flight)) : 232;
      set(chapter,'--face-color',`rgb(${tone} ${tone} ${Math.max(0,tone-4)})`);
      set(chapter,'--light-x',`${entry<1 ? -280+entry*180 : progress*570-index*200-100}%`);
      set(chapter,'--light-opacity',String(.35+pulse*.55));
      words[index].forEach((word,wordIndex)=>{
        const front=wordIndex===0;
        const depth=mobile ? (front ? 32 : -24) : (front ? 90 : -65);
        set(word,'--word-z',`${depth}px`);
        set(word,'--word-yaw',`${(front ? -1 : 1)*(mobile ? .5 : 1.1)+direction*pulse*(front ? 1.5 : -1)}deg`);
        set(word,'--word-pitch',`${pulse*(front ? -.6 : .6)}deg`);
        set(word,'--cut-gap',`${pulse*(mobile ? .15 : .3)}%`);
        set(word,'--cut-x',`${direction*pulse*(front ? 3.6 : -3)}px`);
        set(word,'--cut-opacity',String(pulse*.28));
      });
    });
    if (dominant!==current) {
      current=dominant;
      root.dataset.journeyChapter=String(current);
    }
    root.dataset.journeyProgress=progress.toFixed(4);
    root.dataset.journeyFlight=flight.toFixed(4);
    if (entryDistance) {
      // The outgoing photograph shares the camera, but remains in front of the type.
      // Cancelling the initial camera offset preserves its exact product-frame size.
      const approach=smooth((entry-.08)/.72);
      set(root,'--entry-bag-z',`${-introOffset+height*.065*approach}px`);
      set(root,'--entry-bag-opacity',String(1-smooth((entry-.40)/.43)));
      set(root,'--entry-bag-brightness',String(1-.62*smooth(entry/.82)));
      set(root,'--entry-light-x',`${-280+entry*180}%`);
      set(root,'--entry-light-opacity',String(Math.sin(clamp(entry/.72)*Math.PI)*.18));
      entryBag.style.visibility=entry<.84 ? 'visible' : 'hidden';
      const visible=root.getBoundingClientRect().top<=.5;
      root.classList.toggle('is-bag-entry-visible',visible);
      syncEntryReveal(visible && entry<.84);
      const copy=1-smooth((travel+height*.35)/(height*.35));
      set(bags,'--bag-exit-copy-opacity',String(copy));
      const exiting=copy<.01 && finalBag.classList.contains('is-bag-active');
      if (exiting && finalBag.contains(document.activeElement)) bags.querySelector('[data-carousel-track]').focus({preventScroll:true});
      finalBag.inert=exiting || !finalBag.classList.contains('is-bag-active');
      root.dataset.bagEntry=entry.toFixed(4);
    }
  };
  const tick=time=>{
    frame=0;
    if (!enabled || document.hidden) {previousTime=0;return;}
    const desired=Math.max(-height,Math.min(range+entryDistance,-root.getBoundingClientRect().top));
    const elapsed=Math.min(50,previousTime ? time-previousTime : 16.67);
    previousTime=time;
    travel+=(desired-travel)*(1-Math.pow(.82,elapsed/16.67));
    if (Math.abs(travel-desired)<.05) travel=desired;
    render();
    if (near && travel!==desired) frame=requestAnimationFrame(tick);
    else previousTime=0;
  };
  const schedule=()=>{if (enabled && near && !document.hidden && !frame) frame=requestAnimationFrame(tick);};
  const measure=()=>{
    if (!enabled) return;
    height=viewport.clientHeight;
    mobile=viewport.clientWidth<=767;
    const perspective=Math.max(820,height*1.65);
    gap=perspective*1.45;
    const connected=Boolean(bagPhoto && bagStage && space && bags.classList.contains('is-vertical-bags'));
    root.classList.toggle('has-bag-entry',connected);
    bags?.classList.toggle('has-commitment-exit',connected);
    entryDistance=connected ? height*.95 : 0;
    entryDepth=connected ? perspective*.78 : 0;
    set(root,'--bag-entry-distance',`${entryDistance}px`);
    set(root,'--bag-entry-overlap',`${connected ? height : 0}px`);
    root.dataset.bagEntryDistance=String(entryDistance);
    range=Math.max(1,root.offsetHeight-height-entryDistance);
    if (connected) {
      if (!entryBag) {
        entryBag=document.createElement('div');
        entryBag.className='journey-entry-bag';
        entryBag.setAttribute('aria-hidden','true');
        entryBag.inert=true;
        const photo=bagPhoto.cloneNode(true);
        photo.className='product-image product-image-dline journey-entry-frame';
        photo.querySelectorAll('[data-node-id]').forEach(element=>element.removeAttribute('data-node-id'));
        photo.removeAttribute('data-node-id');
        const image=photo.querySelector('img');
        image.alt='';image.loading='eager';image.decoding='async';
        image.decode?.().catch(()=>{});
        entryBag.append(photo);
        space.append(entryBag);
      }
      const rect=bagPhoto.getBoundingClientRect();
      const stageRect=bagStage.getBoundingClientRect();
      const photo=entryBag.firstElementChild;
      Object.assign(photo.style,{left:`${rect.left-stageRect.left}px`,top:`${rect.top-stageRect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
    } else {
      stopEntryReveal();
      root.classList.remove('is-bag-entry-visible');
      bags?.style.removeProperty('--bag-exit-copy-opacity');
      if (finalBag) finalBag.inert=!finalBag.classList.contains('is-bag-active');
    }
    set(root,'--journey-perspective',`${perspective}px`);
    chapters.forEach((chapter,index)=>{
      const artHeight=index===2 ? 1285 : 1080;
      const fit=mobile ? 1 : Math.min(viewport.clientWidth/1920,height/artHeight)*.94;
      set(chapter,'--chapter-fit',String(fit));
      set(chapter,'--chapter-z',`${-index*gap}px`);
    });
    travel=Math.max(-height,Math.min(range+entryDistance,-root.getBoundingClientRect().top));
    render();
  };
  const configure=()=>{
    cancelAnimationFrame(measureFrame);measureFrame=0;
    cancelAnimationFrame(frame);frame=previousTime=0;
    enabled=!preference.matches && suitableHeight.matches;
    root.classList.toggle('is-commitment-journey',enabled);
    if (enabled) measure();
    else {
      stopEntryReveal();
      root.classList.remove('has-bag-entry','is-bag-entry-visible');
      bags?.classList.remove('has-commitment-exit');
      bags?.style.removeProperty('--bag-exit-copy-opacity');
      if (finalBag) finalBag.inert=!finalBag.classList.contains('is-bag-active');
      chapters.forEach(chapter=>{
        chapter.style.visibility='';chapter.inert=false;
        chapter.removeAttribute('aria-hidden');
        chapter.classList.remove('is-current-chapter');
      });
    }
  };
  const requestMeasure=()=>{
    if (!measureFrame) measureFrame=requestAnimationFrame(()=>{measureFrame=0;measure();});
  };
  root.addEventListener('focusin',event=>{
    if (!enabled || !(event.target instanceof Element)) return;
    const chapter=event.target.closest('[data-commitment-chapter]');
    const index=chapters.indexOf(chapter);
    if (index<0) return;
    const target=holds[index];
    const rect=root.getBoundingClientRect();
    if (Math.abs(progress-target)>.1) {
      window.scrollTo({top:scrollY+rect.top+entryDistance+target*range,behavior:'instant'});
      travel=entryDistance+target*range;
      render();
    }
  });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',requestMeasure,{passive:true});
  window.addEventListener('pageshow',requestMeasure);
  bags?.addEventListener('bags:layout',requestMeasure);
  if ('ResizeObserver' in window) new ResizeObserver(requestMeasure).observe(viewport);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{
    near=entry.isIntersecting;
    if (near) {measure();schedule();}
    else {cancelAnimationFrame(frame);frame=previousTime=0;}
  },{rootMargin:'50% 0px'}).observe(root);
  preference.addEventListener('change',configure);
  suitableHeight.addEventListener('change',configure);
  document.addEventListener('visibilitychange',()=>{
    if (document.hidden) {cancelAnimationFrame(frame);frame=previousTime=0;}
    else {measure();schedule();}
  });
  configure();
})();

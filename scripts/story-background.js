(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const vertexSource = 'attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}';
  const fragmentSource = `
    precision mediump float;
    uniform sampler2D uImage;
    uniform vec2 uCover;
    uniform float uTime, uProgress, uStrength, uFlip;
    varying vec2 vUv;
    void main(){
      float pulse=pow(max(0.,sin(uProgress*3.14159265)),1.2)*uStrength;
      float t=uTime*.72;
      vec2 flowA=vec2(
        sin(vUv.y*7.3-t)+.42*sin(vUv.x*10.1+vUv.y*5.6+t*.62),
        sin(vUv.x*6.8+t*.55)+.32*cos(vUv.y*9.2-vUv.x*4.1-t*.8)
      );
      vec2 flowB=vec2(
        sin(vUv.y*6.4+t*.7+2.2)+.36*cos((vUv.x-vUv.y)*8.7-t),
        cos(vUv.x*7.6-t*.6+1.4)+.28*sin(vUv.y*10.8+t*.5)
      );
      vec2 center=vUv-.5;
      vec2 bend=center*dot(center,center)*pulse*.025;
      vec2 uvA=(center+flowA*vec2(.028,.017)*pulse+bend)*uCover/1.06+.5;
      vec2 uvB=(center+flowB*vec2(.024,.015)*pulse-bend*.5)*uCover/1.06+.5;
      uvA.x=mix(uvA.x,1.-uvA.x,uFlip);
      uvB.x=mix(uvB.x,1.-uvB.x,uFlip);
      float edge=vUv.x*.72+vUv.y*.28+sin(vUv.y*6.2+t)*pulse*.06;
      float dissolve=smoothstep(edge-.12,edge+.12,uProgress*1.24-.12);
      gl_FragColor=mix(texture2D(uImage,uvA),texture2D(uImage,uvB),dissolve);
    }`;

  const createBackground = (host) => {
    const canvas = host.querySelector('canvas');
    if (!canvas || !host.dataset.storyImage) return null;
    canvas.setAttribute('aria-hidden', 'true');
    let gl, program, buffer, texture, uniforms, image;
    let loaded = false, failed = false, visible = false, frame = 0;
    let active = false, pending = false, transitioning = false;
    let progress = 1, phase = 0, transitionStart = 0;
    const allowed = () => visible && !failed && !reducedMotion.matches && !document.hidden;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      pending = transitioning = false;
      progress = 1;
      phase = 0;
      host.classList.remove('is-ready', 'is-rippling');
    };
    const fail = () => {
      failed = true;
      stop();
      if (gl && !gl.isContextLost()) {
        if (texture) gl.deleteTexture(texture);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
      }
      gl = null;
    };
    const initialize = () => {
      try {
        gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
        if (!gl) { fail(); return false; }
        const compile = (type, source) => {
          const shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            throw new Error('Background shader unavailable');
          }
          return shader;
        };
        const vertex = compile(gl.VERTEX_SHADER, vertexSource);
        let fragment;
        try { fragment = compile(gl.FRAGMENT_SHADER, fragmentSource); }
        catch (error) { gl.deleteShader(vertex); throw error; }
        program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Background program unavailable');
        gl.useProgram(program);
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        uniforms = Object.fromEntries(['uImage', 'uCover', 'uTime', 'uProgress', 'uStrength', 'uFlip'].map((name) => [name, gl.getUniformLocation(program, name)]));
        gl.uniform1i(uniforms.uImage, 0);
        gl.uniform1f(uniforms.uFlip, host.dataset.storyFlip === 'true' ? 1 : 0);
        if (gl.getError() !== gl.NO_ERROR) throw new Error('Background texture unavailable');
        return true;
      } catch { fail(); return false; }
    };
    const draw = () => {
      if (!gl || !allowed()) return false;
      try {
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return false;
        const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 767 ? 1.25 : 1.5, 1600 / width);
        const backingWidth = Math.max(1, Math.round(width * ratio));
        const backingHeight = Math.max(1, Math.round(height * ratio));
        if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
          canvas.width = backingWidth;
          canvas.height = backingHeight;
          gl.viewport(0, 0, backingWidth, backingHeight);
        }
        const aspect = width / height, imageAspect = image.naturalWidth / image.naturalHeight;
        gl.uniform2f(uniforms.uCover, Math.min(1, aspect / imageAspect), Math.min(1, imageAspect / aspect));
        gl.uniform1f(uniforms.uTime, phase);
        gl.uniform1f(uniforms.uProgress, progress);
        gl.uniform1f(uniforms.uStrength, window.innerWidth <= 767 ? .45 : 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (gl.isContextLost()) { fail(); return false; }
        host.classList.add('is-ready');
        return true;
      } catch { fail(); return false; }
    };
    const tick = (time) => {
      frame = 0;
      if (!allowed()) { stop(); return; }
      if (pending) {
        transitionStart = time;
        pending = false;
        transitioning = true;
      }
      if (transitioning) {
        // One entrance transition, followed by a long, quiet ease into stillness.
        const elapsed = Math.min(1, (time - transitionStart) / 2400);
        progress = 1 - Math.pow(1 - elapsed, 3);
        phase = (time - transitionStart) / 1000;
        if (elapsed === 1) transitioning = false;
      }
      host.classList.toggle('is-rippling', transitioning);
      if (draw() && transitioning) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!allowed() || frame) return;
      if (!image) {
        image = new Image();
        image.onload = () => {
          loaded = image.naturalWidth > 0 && image.naturalHeight > 0;
          if (loaded) wake(); else fail();
        };
        image.onerror = fail;
        image.src = host.dataset.storyImage;
      }
      if (!loaded || (!gl && !initialize())) return;
      frame = requestAnimationFrame(tick);
    };
    canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); fail(); });
    return {
      host,
      setVisible(value) { visible = value; if (allowed()) wake(); else stop(); },
      setActive(value) {
        if (active === value) return;
        active = value;
        if (active) {
          if (!transitioning && !pending) pending = true;
          wake();
        }
      },
      sync() { if (allowed()) { pending = active; wake(); } else stop(); },
      resize() { if (allowed() && gl && !frame) draw(); },
    };
  };

  const backgrounds = [...document.querySelectorAll('[data-story-background]')].map(createBackground).filter(Boolean);
  if (!backgrounds.length) return;
  let selectionFrame = 0;
  const selectSection = () => {
    selectionFrame = 0;
    const middle = window.innerHeight * .5;
    const positions = backgrounds.map((background) => ({ background, rect: background.host.getBoundingClientRect() }));
    const selected = positions.filter(({ rect }) => rect.top <= middle && rect.bottom > middle).at(-1)?.background;
    positions.forEach(({ background }) => background.setActive(background === selected));
  };
  const scheduleSelection = () => {
    if (!selectionFrame) selectionFrame = requestAnimationFrame(selectSection);
  };
  const refreshVisibility = () => backgrounds.forEach((background) => {
    const rect = background.host.getBoundingClientRect();
    background.setVisible(rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      backgrounds.find((background) => background.host === entry.target)?.setVisible(entry.isIntersecting);
      scheduleSelection();
    }));
    backgrounds.forEach((background) => observer.observe(background.host));
  } else refreshVisibility();
  window.addEventListener('scroll', () => {
    if (!('IntersectionObserver' in window)) refreshVisibility();
    scheduleSelection();
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!('IntersectionObserver' in window)) refreshVisibility();
    backgrounds.forEach((background) => background.resize());
    scheduleSelection();
  }, { passive: true });
  reducedMotion.addEventListener('change', () => {
    cancelAnimationFrame(selectionFrame);
    selectSection();
    backgrounds.forEach((background) => background.sync());
  });
  document.addEventListener('visibilitychange', () => backgrounds.forEach((background) => background.sync()));
  scheduleSelection();
})();

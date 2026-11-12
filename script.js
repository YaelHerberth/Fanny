// Animaciones de la página: GSAP (+ ScrollTrigger, SplitText) y Lenis para el scroll suave.
(function () {
  const hasGSAP = typeof window.gsap !== 'undefined';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.getElementById('intro');

  // Siempre empezar arriba (la intro tapa la página)
  // El navegador restaura la posición anterior al recargar (a veces después de cargar la página),
  // así que forzamos el inicio arriba varias veces mientras la carta sigue cerrada.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let opened = false;
  let lenis = null;
  function resetScroll() {
    window.scrollTo(0, 0);
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  }
  resetScroll();
  window.addEventListener('load', () => { if (!opened) resetScroll(); });
  window.addEventListener('pageshow', () => { if (!opened) resetScroll(); });
  document.body.classList.add('is-locked');

  // Si GSAP no cargó (sin internet, CDN caído...), la página sigue funcionando sin animaciones
  if (!hasGSAP) {
    const openPlain = () => {
      opened = true;
      resetScroll();
      intro.remove();
      document.body.classList.remove('is-locked');
    };
    intro.addEventListener('click', openPlain, { once: true });
    intro.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openPlain(); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  // ---------- Scroll suave (Lenis) ----------
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  // ---------- Barra de progreso ----------
  gsap.to('.progress span', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  });

  // ---------- Intro: abrir el sobre ----------
  function openEnvelope() {
    if (opened) return;
    opened = true;
    resetScroll();

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        resetScroll();
        intro.remove();
        document.body.classList.remove('is-locked');
        if (lenis) { lenis.start(); lenis.scrollTo(0, { immediate: true, force: true }); }
        ScrollTrigger.refresh();
      },
    });

    if (reduceMotion) {
      tl.to(intro, { autoAlpha: 0, duration: 0.4 });
      tl.add(heroIn, '<');
      return;
    }

    tl.to('.intro__hint', { autoAlpha: 0, duration: 0.3 })
      .to('.envelope__seal', { scale: 0, rotation: 90, duration: 0.4, ease: 'back.in(2)' }, '<')
      .to('.envelope__flap', { rotationX: 180, duration: 0.7 })
      .set('.envelope__flap', { zIndex: 1 })
      .to('.envelope__letter', { yPercent: -70, duration: 0.8, ease: 'power2.out' })
      .to('.envelope', { scale: 1.6, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, '+=0.25')
      .to(intro, { autoAlpha: 0, duration: 0.6 }, '-=0.4')
      .add(heroIn, '-=0.5');

    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 24);
  }

  intro.addEventListener('click', openEnvelope);
  intro.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
  intro.focus({ preventScroll: true });

  // Estado inicial del hero (oculto hasta abrir el sobre)
  gsap.set(['.eyebrow', '.hero__title', '.hero__text', '.scroll-hint'], { autoAlpha: 0 });

  function heroIn() {
    const tl = gsap.timeline();
    tl.to('.eyebrow', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' });

    if (window.SplitText && !reduceMotion) {
      const split = new SplitText('.hero__title', { type: 'words' });
      gsap.set('.hero__title', { autoAlpha: 1 });
      tl.from(split.words, { yPercent: 60, autoAlpha: 0, filter: 'blur(10px)', duration: 1.2, stagger: 0.15, ease: 'expo.out' }, '-=0.4');
    } else {
      tl.to('.hero__title', { autoAlpha: 1, duration: 0.8 });
    }

    tl.fromTo('.hero__text', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6')
      .to('.scroll-hint', { autoAlpha: 1, duration: 0.8 }, '-=0.3');

    startFloatingHearts();
    return tl;
  }

  // ---------- Corazones ----------
  const heartsContainer = document.getElementById('hearts-container');

  function startFloatingHearts() {
    if (reduceMotion) return;
    const count = window.innerWidth < 600 ? 14 : 22;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = '❤';
      heartsContainer.appendChild(heart);
      floatHeart(heart, true);
    }
  }

  function floatHeart(heart, firstTime) {
    const size = gsap.utils.random(10, 28);
    const startX = gsap.utils.random(0, window.innerWidth);
    gsap.set(heart, {
      x: startX,
      y: window.innerHeight + 40,
      fontSize: size,
      opacity: gsap.utils.random(0.15, 0.5),
      rotation: gsap.utils.random(-30, 30),
    });
    gsap.to(heart, {
      y: -60,
      x: startX + gsap.utils.random(-80, 80),
      rotation: gsap.utils.random(-60, 60),
      duration: gsap.utils.random(10, 20),
      delay: firstTime ? gsap.utils.random(0, 10) : 0,
      ease: 'none',
      onComplete: () => floatHeart(heart, false),
    });
  }

  function burstHearts(x, y, amount) {
    if (reduceMotion) return;
    for (let i = 0; i < amount; i++) {
      const h = document.createElement('span');
      h.className = 'burst-heart';
      h.textContent = gsap.utils.random(['❤', '💕', '💖', '❤']);
      document.body.appendChild(h);

      const angle = gsap.utils.random(0, Math.PI * 2);
      const dist = gsap.utils.random(60, 180);
      gsap.set(h, { left: x, top: y, xPercent: -50, yPercent: -50, fontSize: gsap.utils.random(14, 30), scale: 0 });
      gsap.timeline({ onComplete: () => h.remove() })
        .to(h, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 40,
          scale: 1,
          rotation: gsap.utils.random(-45, 45),
          duration: 0.9,
          ease: 'power3.out',
        })
        .to(h, { y: '+=60', autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, '-=0.3');
    }
  }

  // Lluvia de corazones donde se toque la pantalla
  document.addEventListener('pointerdown', (e) => {
    if (!opened || e.target.closest('button')) return;
    burstHearts(e.clientX, e.clientY, 8);
  });

  // ---------- Animaciones al hacer scroll ----------
  if (!reduceMotion) {
    // Tarjetas: suben y aparecen
    gsap.utils.toArray('.chapter .card').forEach((card) => {
      gsap.from(card, {
        y: 80,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });

    // Texto que se "enciende" palabra por palabra mientras se hace scroll
    if (window.SplitText) {
      gsap.utils.toArray('.reveal').forEach((p) => {
        const split = new SplitText(p, { type: 'words' });
        gsap.from(split.words, {
          opacity: 0.12,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 55%', scrub: true },
        });
      });
    }

    // Polaroids: caen girando y la foto tiene parallax dentro del marco
    gsap.utils.toArray('.polaroid').forEach((pol, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      gsap.from(pol, {
        y: 140,
        rotation: dir * 14,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: pol, start: 'top 90%', toggleActions: 'play none none reverse' },
      });

      const img = pol.querySelector('img');
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: pol, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // "Te Amo" gigante
    gsap.from('.big-love', {
      scale: 0.5,
      autoAlpha: 0,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.chapter--love', start: 'top 80%', end: 'top 20%', scrub: 1 },
    });
    gsap.to('.big-love', { scale: 1.06, duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });

    // Línea de tiempo: la línea se dibuja con el scroll
    const timeline = document.querySelector('.timeline');
    const line = document.createElement('span');
    line.className = 'timeline__line';
    timeline.prepend(line);
    gsap.from(line, {
      scaleY: 0,
      ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 60%', scrub: true },
    });

    gsap.from('.section-title', {
      y: 50, autoAlpha: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.section-title', start: 'top 85%' },
    });

    gsap.utils.toArray('.milestone').forEach((m) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: m, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      tl.from(m.querySelector('.milestone__dot'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
        .from(m.querySelector('.milestone__card'), { x: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .from(m.querySelectorAll('.counter__unit'), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, '-=0.4');
    });

    gsap.from('.finale__btn', {
      scale: 0.6, autoAlpha: 0, duration: 0.9, ease: 'back.out(2)',
      scrollTrigger: { trigger: '.finale', start: 'top 75%' },
    });
  } else {
    const timeline = document.querySelector('.timeline');
    const line = document.createElement('span');
    line.className = 'timeline__line';
    timeline.prepend(line);
  }

  // ---------- Sorpresa final ----------
  const btn = document.querySelector('.finale__btn');
  const msg = document.querySelector('.finale__msg');
  btn.addEventListener('click', () => {
    const r = btn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 40);
    gsap.to(btn, {
      scale: 0, autoAlpha: 0, duration: 0.4, ease: 'back.in(2)',
      onComplete: () => {
        btn.remove();
        msg.hidden = false;
        gsap.from(msg, { scale: 0.4, autoAlpha: 0, filter: 'blur(12px)', duration: 1.2, ease: 'expo.out' });
        ScrollTrigger.refresh();
      },
    });
  }, { once: true });

  // ---------- Recalcular posiciones cuando cargan fuentes e imágenes ----------
  const refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
  const scheduleRefresh = () => refresh.restart(true);
  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', scheduleRefresh, { once: true });
  });
  if (document.fonts) document.fonts.ready.then(scheduleRefresh);
  window.addEventListener('load', scheduleRefresh);
})();

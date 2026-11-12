// Contadores de la línea de tiempo.
// Cada <li class="milestone"> tiene su fecha en data-fecha (formato AAAA-MM-DDTHH:MM:SS).
(function () {
  const UNIDADES = [
    { key: 'dias', label: 'Días' },
    { key: 'horas', label: 'Horas' },
    { key: 'minutos', label: 'Minutos' },
    { key: 'segundos', label: 'Segundos' },
  ];

  const formatoFecha = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const contadores = [...document.querySelectorAll('.milestone')].map((el) => {
    const inicio = new Date(el.dataset.fecha);
    el.querySelector('.milestone__date').textContent = formatoFecha.format(inicio);

    const counter = el.querySelector('.counter');
    const spans = {};
    UNIDADES.forEach(({ key, label }) => {
      const box = document.createElement('div');
      box.className = 'counter__unit';
      box.innerHTML = `<span class="counter__value">00</span><span class="counter__label">${label}</span>`;
      counter.appendChild(box);
      spans[key] = box.querySelector('.counter__value');
    });

    return { inicio: inicio.getTime(), spans };
  });

  function calcular(diferencia) {
    const s = Math.max(0, Math.floor(diferencia / 1000));
    return {
      dias: String(Math.floor(s / 86400)),
      horas: String(Math.floor((s % 86400) / 3600)).padStart(2, '0'),
      minutos: String(Math.floor((s % 3600) / 60)).padStart(2, '0'),
      segundos: String(s % 60).padStart(2, '0'),
    };
  }

  function actualizar() {
    const ahora = Date.now();
    contadores.forEach(({ inicio, spans }) => {
      const valores = calcular(ahora - inicio);
      Object.entries(valores).forEach(([key, valor]) => {
        const span = spans[key];
        if (span.textContent === valor) return;
        span.textContent = valor;
        // Pequeño "flip" cuando cambia el número
        if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo(span, { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
        }
      });
    });
  }

  actualizar();
  setInterval(actualizar, 1000);
})();

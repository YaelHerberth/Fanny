// Generar corazones animados
function createHearts() {
    const container = document.getElementById('hearts-container');
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        // Agregar delay mínimo de 2s para que no se vean precargados
        heart.style.animationDelay = (Math.random() * 10 + 2) + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        container.appendChild(heart);
    }
}

// Efecto parallax y fade out
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.parallax-section');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    sections.forEach((section, index) => {
        const content = section.querySelector('.content');
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // Parallax: mover el contenido hacia arriba más lento
        const parallaxOffset = (scrollY - sectionTop) * 0.5;
        content.style.transform = `translateY(${parallaxOffset}px)`;

        // Fade out: calcular opacidad basada en la posición
        const fadeStart = sectionTop - windowHeight;
        const fadeEnd = sectionTop + sectionHeight;
        let opacity = 1;

        if (scrollY > fadeStart && scrollY < fadeEnd) {
            const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
            opacity = 1 - Math.abs(progress - 0.5) * 2; // Máxima opacidad en el centro
        } else if (scrollY >= fadeEnd) {
            opacity = 0;
        }

        content.style.opacity = opacity;
    });
});

// Generar corazones cuando la página carga completamente
window.addEventListener('load', createHearts);
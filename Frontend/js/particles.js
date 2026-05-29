// ===== Particle System =====

export function initParticles(containerId = 'hero-particles', count = 30) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
    `;
    
    container.appendChild(particle);
}

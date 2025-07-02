/**
 * Particle Background System
 * Features: Interactive particle effects, canvas animation, responsive design
 */

class ParticleBackground {
    constructor(canvasId = 'particle-canvas') {
        this.canvasId = canvasId;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.config = {
            particleCount: 100,
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.1, max: 0.5 },
            colors: ['#64ffda', '#00c8ff', '#b14aed', '#ffffff'],
            connections: {
                distance: 120,
                opacity: 0.3
            },
            mouse: {
                repel: true,
                radius: 150,
                strength: 3
            }
        };
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }

    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvasId;
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;

        // Add to hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Mobile touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.animate();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust particle count based on screen size
        const baseCount = 100;
        const area = this.canvas.width * this.canvas.height;
        const referenceArea = 1920 * 1080;
        this.config.particleCount = Math.floor(baseCount * (area / referenceArea));
        this.config.particleCount = Math.max(30, Math.min(150, this.config.particleCount));
        
        // Recreate particles if count changed
        if (this.particles.length !== this.config.particleCount) {
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.config));
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.update();
        this.draw();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    update() {
        this.particles.forEach(particle => {
            particle.update(this.mouse);
        });
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.drawConnections();

        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );

                if (distance < this.config.connections.distance) {
                    const opacity = (1 - distance / this.config.connections.distance) * 
                                   this.config.connections.opacity;
                    
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.reset();
        this.originalVx = this.vx;
        this.originalVy = this.vy;
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min;
        this.vy = (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min;
        this.size = Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min;
        this.color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.5;
        this.pulse = Math.random() * Math.PI * 2;
    }

    update(mouse) {
        // Mouse interaction
        if (this.config.mouse.repel) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.mouse.radius) {
                const force = (this.config.mouse.radius - distance) / this.config.mouse.radius;
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;

                this.vx += forceDirectionX * force * this.config.mouse.strength;
                this.vy += forceDirectionY * force * this.config.mouse.strength;
            }
        }

        // Apply velocity damping to return to original speed
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Restore original velocity gradually
        this.vx += (this.originalVx - this.vx) * 0.01;
        this.vy += (this.originalVy - this.vy) * 0.01;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;

        // Update pulse for size variation
        this.pulse += 0.02;
    }

    draw(ctx) {
        const currentSize = this.size + Math.sin(this.pulse) * 0.5;
        const currentOpacity = this.opacity + Math.sin(this.pulse) * 0.1;

        ctx.save();
        ctx.globalAlpha = currentOpacity;
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, currentSize * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Enhanced Particle Effects for specific sections
class SectionParticles {
    constructor() {
        this.effects = new Map();
        this.init();
    }

    init() {
        this.setupSkillsParticles();
        this.setupProjectsParticles();
        this.setupContactParticles();
    }

    setupSkillsParticles() {
        const skillsSection = document.querySelector('#skills');
        if (!skillsSection) return;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.3;
        `;
        
        skillsSection.style.position = 'relative';
        skillsSection.appendChild(canvas);
        
        this.effects.set('skills', new CodeParticles(canvas));
    }

    setupProjectsParticles() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.createCardParticles(card);
            });
        });
    }

    setupContactParticles() {
        const contactSection = document.querySelector('#contact');
        if (!contactSection) return;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.2;
        `;
        
        contactSection.style.position = 'relative';
        contactSection.appendChild(canvas);
        
        this.effects.set('contact', new FloatingIcons(canvas));
    }

    createCardParticles(card) {
        const rect = card.getBoundingClientRect();
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                animation: sparkle 1s ease-out forwards;
            `;
            
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
}

// Code-themed particles for skills section
class CodeParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.symbols = ['{}', '()', '[]', '<>', '/>', '&&', '||', '++', '--', '=>', '!=', '=='];
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        const count = 20;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
                opacity: Math.random() * 0.5 + 0.2,
                size: Math.random() * 10 + 8
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.draw();
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#64ffda';
            this.ctx.font = `${particle.size}px 'Roboto Mono', monospace`;
            this.ctx.fillText(particle.symbol, particle.x, particle.y);
            this.ctx.restore();
        });
    }
}

// Floating icons for contact section
class FloatingIcons {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.icons = ['@', '📧', '💻', '🌐', '📱', '⚡'];
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        const count = 15;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)],
                opacity: Math.random() * 0.4 + 0.2,
                size: Math.random() * 8 + 12,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.draw();
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.font = `${particle.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.icon, 0, 0);
            this.ctx.restore();
        });
    }
}

// Sparkle animation styles
const sparkleStyles = `
@keyframes sparkle {
    0% {
        opacity: 1;
        transform: scale(0) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1.5) rotate(180deg);
    }
    100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
    }
}
`;

// Initialize particle systems
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle styles
    if (!document.getElementById('sparkle-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'sparkle-styles';
        styleSheet.textContent = sparkleStyles;
        document.head.appendChild(styleSheet);
    }

    // Initialize main particle background
    window.particleBackground = new ParticleBackground();
    
    // Initialize section-specific particles
    window.sectionParticles = new SectionParticles();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleBackground, SectionParticles };
}

/**
 * Advanced Animation System
 * Features: GSAP animations, parallax effects, entrance animations, micro-interactions
 */

class AnimationController {
    constructor() {
        this.isGSAPLoaded = false;
        this.parallaxElements = [];
        this.entranceElements = [];
        this.microInteractions = [];
        this.init();
    }

    async init() {
        await this.loadGSAP();
        this.setupEntranceAnimations();
        this.setupParallaxEffects();
        this.setupMicroInteractions();
        this.setupScrollTriggers();
        this.setupPageTransitions();
    }

    async loadGSAP() {
        return new Promise((resolve) => {
            if (window.gsap) {
                this.isGSAPLoaded = true;
                resolve();
                return;
            }

            // Load GSAP
            const gsapScript = document.createElement('script');
            gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            gsapScript.onload = () => {
                // Load ScrollTrigger plugin
                const scrollTriggerScript = document.createElement('script');
                scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                scrollTriggerScript.onload = () => {
                    gsap.registerPlugin(ScrollTrigger);
                    this.isGSAPLoaded = true;
                    resolve();
                };
                document.head.appendChild(scrollTriggerScript);
            };
            document.head.appendChild(gsapScript);
        });
    }

    setupEntranceAnimations() {
        if (!this.isGSAPLoaded) return;

        // Hero section animations
        this.animateHeroSection();
        
        // Section entrance animations
        this.animateSections();
        
        // Card entrance animations
        this.animateCards();
        
        // Timeline animations
        this.animateTimeline();
    }

    animateHeroSection() {
        const timeline = gsap.timeline();
        
        // Initial state
        gsap.set(['.hero-greeting', '.hero-name', '.hero-tagline', '.hero-description', '.hero-buttons'], {
            opacity: 0,
            y: 50
        });
        
        gsap.set('.hero-image-container', {
            opacity: 0,
            scale: 0.8,
            rotation: -5
        });

        // Animation sequence
        timeline
            .to('.hero-greeting', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            })
            .to('.hero-name', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.3")
            .to('.hero-tagline', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5")
            .to('.hero-description', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to('.hero-buttons', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.3")
            .to('.hero-image-container', {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.8");

        // Floating animation for hero image
        gsap.to('.hero-image-container', {
            y: -15,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    animateSections() {
        document.querySelectorAll('section').forEach((section, index) => {
            gsap.fromTo(section.querySelector('.section-title'), {
                opacity: 0,
                y: 50,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    animateCards() {
        // Project cards
        gsap.fromTo('.project-card', {
            opacity: 0,
            y: 60,
            scale: 0.8
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.projects-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        // Skill cards
        gsap.fromTo('.skill-category', {
            opacity: 0,
            y: 40,
            rotationY: 45
        }, {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.skills-container',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }

    animateTimeline() {
        gsap.fromTo('.timeline-item', {
            opacity: 0,
            x: (index) => index % 2 === 0 ? -100 : 100,
            scale: 0.8
        }, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            stagger: 0.3,
            scrollTrigger: {
                trigger: '.timeline',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }

    setupParallaxEffects() {
        if (!this.isGSAPLoaded) return;

        // Background parallax
        gsap.to('.hero', {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: '.hero',
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Hero image parallax
        gsap.to('.hero-image-container', {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: '.hero',
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

        // Section backgrounds parallax
        document.querySelectorAll('section').forEach((section, index) => {
            if (index % 2 === 0) {
                gsap.to(section, {
                    yPercent: -20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2
                    }
                });
            }
        });
    }

    setupMicroInteractions() {
        this.setupButtonAnimations();
        this.setupCardHoverEffects();
        this.setupFormAnimations();
        this.setupNavigationEffects();
    }

    setupButtonAnimations() {
        document.querySelectorAll('.cta-button, .submit-btn, .project-action-btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Ripple effect
                this.createRipple(button);
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            button.addEventListener('click', (e) => {
                this.createClickEffect(e.target);
            });
        });
    }

    createRipple(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        element.appendChild(ripple);

        gsap.fromTo(ripple, {
            scale: 0,
            opacity: 0.6
        }, {
            scale: 4,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }

    createClickEffect(element) {
        gsap.to(element, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
    }

    setupCardHoverEffects() {
        document.querySelectorAll('.project-card, .skill-category, .cert-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    rotationY: 2,
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Tilt effect based on mouse position
                this.setupCardTilt(card);
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });
    }

    setupCardTilt(card) {
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) / rect.width;
            const deltaY = (e.clientY - centerY) / rect.height;

            gsap.to(card, {
                rotationY: deltaX * 10,
                rotationX: -deltaY * 10,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', () => {
            card.removeEventListener('mousemove', handleMouseMove);
        });
    }

    setupFormAnimations() {
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    scale: 1.02,
                    borderColor: 'var(--accent)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            input.addEventListener('blur', () => {
                gsap.to(input, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupNavigationEffects() {
        // Header scroll animation
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            toggleClass: {className: "scrolled", targets: "header"}
        });

        // Navigation link hover effects
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    color: 'var(--accent)',
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    color: 'var(--text)',
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupScrollTriggers() {
        // Skill bar animations
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const width = bar.getAttribute('data-width');
            gsap.fromTo(bar, {
                width: '0%'
            }, {
                width: width + '%',
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Counter animations
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            gsap.fromTo(counter, {
                innerHTML: 0
            }, {
                innerHTML: target,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: counter,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                onUpdate: function() {
                    counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                }
            });
        });
    }

    setupPageTransitions() {
        // Page load animation
        gsap.fromTo('body', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        });

        // Smooth scroll to sections
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });
    }

    // Utility methods
    staggerElements(elements, animation, staggerTime = 0.1) {
        gsap.fromTo(elements, animation.from, {
            ...animation.to,
            stagger: staggerTime
        });
    }

    createMagneticEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(element, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
}

// Animation styles
const animationStyles = `
/* Ripple Effect */
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
}

/* Enhanced hover states */
.project-card,
.skill-category,
.cert-card {
    transform-style: preserve-3d;
    perspective: 1000px;
}

/* Smooth transitions for all interactive elements */
.cta-button,
.submit-btn,
.project-action-btn,
.nav-links a,
.form-control {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states with animations */
.form-control:focus {
    transform: scale(1.02);
    box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.3);
}

/* Enhanced loading states */
.loading {
    position: relative;
    overflow: hidden;
}

.loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
    );
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

/* Magnetic effect for special elements */
.magnetic {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Parallax container */
.parallax-container {
    transform-style: preserve-3d;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
`;

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    if (!document.getElementById('animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'animation-styles';
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
    }

    // Initialize animation controller
    window.animationController = new AnimationController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}

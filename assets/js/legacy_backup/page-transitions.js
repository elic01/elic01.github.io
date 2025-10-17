/**
 * Page Transition & Enhanced Scroll Effects
 * Features: Page transitions, smooth scroll, scroll indicators, advanced entrance effects
 */

class PageTransitionController {
    constructor() {
        this.isGSAPLoaded = false;
        this.scrollIndicator = null;
        this.isTransitioning = false;
        this.currentSection = 'home';
        this.init();
    }

    async init() {
        await this.waitForGSAP();
        this.createScrollIndicator();
        this.setupSmoothScroll();
        this.setupPageTransitions();
        this.setupScrollEffects();
        this.setupSectionTransitions();
        this.initializePage();
    }

    async waitForGSAP() {
        return new Promise((resolve) => {
            if (window.gsap && window.ScrollTrigger) {
                this.isGSAPLoaded = true;
                resolve();
                return;
            }

            const checkGSAP = () => {
                if (window.gsap && window.ScrollTrigger) {
                    this.isGSAPLoaded = true;
                    resolve();
                } else {
                    setTimeout(checkGSAP, 100);
                }
            };
            checkGSAP();
        });
    }

    createScrollIndicator() {
        // Create scroll progress indicator
        this.scrollIndicator = document.createElement('div');
        this.scrollIndicator.className = 'scroll-progress-indicator';
        this.scrollIndicator.innerHTML = `
            <div class="scroll-progress-bar"></div>
            <div class="scroll-percentage">0%</div>
        `;
        document.body.appendChild(this.scrollIndicator);

        this.updateScrollProgress();
        window.addEventListener('scroll', () => this.updateScrollProgress());
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        
        const progressBar = this.scrollIndicator.querySelector('.scroll-progress-bar');
        const percentageText = this.scrollIndicator.querySelector('.scroll-percentage');
        
        if (progressBar && percentageText) {
            progressBar.style.width = `${scrollPercentage}%`;
            percentageText.textContent = `${Math.round(scrollPercentage)}%`;
        }
    }

    setupSmoothScroll() {
        if (!this.isGSAPLoaded) return;

        // Enhanced smooth scroll with GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Add scroll-triggered animations for reveal effects
        this.setupScrollRevealAnimations();
    }

    smoothScrollTo(target) {
        if (!this.isGSAPLoaded) return;

        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: targetPosition,
                autoKill: false
            },
            ease: "power2.inOut",
            onComplete: () => {
                this.currentSection = target.id;
                this.updateActiveNavigation();
            }
        });
    }

    setupPageTransitions() {
        // Page load transition
        this.pageLoadTransition();

        // Section change transitions
        this.setupSectionChangeDetection();
    }

    pageLoadTransition() {
        if (!this.isGSAPLoaded) return;

        const timeline = gsap.timeline();

        // Create overlay for page transition
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo">EC</div>
                <div class="transition-text">Loading Portfolio...</div>
                <div class="transition-loader">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Animate page load
        timeline
            .set(overlay, { zIndex: 10000 })
            .to('.loader-bar', {
                width: '100%',
                duration: 1.5,
                ease: "power2.inOut"
            })
            .to('.transition-content', {
                opacity: 0,
                y: -50,
                duration: 0.8,
                ease: "power2.in"
            })
            .to(overlay, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    overlay.remove();
                    this.revealPageContent();
                }
            });
    }

    revealPageContent() {
        if (!this.isGSAPLoaded) return;

        const timeline = gsap.timeline();

        // Reveal main content with staggered animations
        timeline
            .from('header', {
                y: -100,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            })
            .from('.hero-content > *', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            }, "-=0.5")
            .from('.hero-image-container', {
                scale: 0.8,
                opacity: 0,
                rotation: 5,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.8");
    }

    setupScrollRevealAnimations() {
        if (!this.isGSAPLoaded) return;

        // Text reveal animations
        document.querySelectorAll('.section-title').forEach(title => {
            gsap.fromTo(title, {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Card animations with advanced effects
        document.querySelectorAll('.project-card, .skill-category, .cert-card').forEach((card, index) => {
            gsap.fromTo(card, {
                y: 100,
                opacity: 0,
                rotationY: 45,
                scale: 0.8
            }, {
                y: 0,
                opacity: 1,
                rotationY: 0,
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                delay: (index % 3) * 0.1
            });
        });

        // Timeline items with alternating animations
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            const isOdd = index % 2 === 0;
            gsap.fromTo(item, {
                x: isOdd ? -100 : 100,
                opacity: 0,
                rotation: isOdd ? -5 : 5
            }, {
                x: 0,
                opacity: 1,
                rotation: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.2
            });
        });
    }

    setupSectionChangeDetection() {
        if (!this.isGSAPLoaded) return;

        // Create observers for section changes
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => this.handleSectionEnter(section),
                onLeave: () => this.handleSectionLeave(section),
                onEnterBack: () => this.handleSectionEnter(section),
                onLeaveBack: () => this.handleSectionLeave(section)
            });
        });
    }

    handleSectionEnter(section) {
        this.currentSection = section.id;
        this.updateActiveNavigation();
        this.triggerSectionEnterAnimation(section);
    }

    handleSectionLeave(section) {
        this.triggerSectionLeaveAnimation(section);
    }

    triggerSectionEnterAnimation(section) {
        if (!this.isGSAPLoaded) return;

        // Add glow effect to current section
        gsap.to(section, {
            boxShadow: '0 0 50px rgba(100, 255, 218, 0.1)',
            duration: 0.5,
            ease: "power2.out"
        });

        // Trigger specific animations based on section
        switch (section.id) {
            case 'skills':
                this.animateSkillBars();
                break;
            case 'projects':
                this.animateProjectStats();
                break;
            case 'contact':
                this.animateContactElements();
                break;
        }
    }

    triggerSectionLeaveAnimation(section) {
        if (!this.isGSAPLoaded) return;

        gsap.to(section, {
            boxShadow: '0 0 0px rgba(100, 255, 218, 0)',
            duration: 0.5,
            ease: "power2.out"
        });
    }

    animateSkillBars() {
        if (!this.isGSAPLoaded) return;

        document.querySelectorAll('.skill-progress').forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            gsap.fromTo(bar, {
                width: '0%'
            }, {
                width: width + '%',
                duration: 1.5,
                ease: "power2.out",
                delay: index * 0.1
            });
        });
    }

    animateProjectStats() {
        if (!this.isGSAPLoaded) return;

        // Animate any numeric values or counters
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            gsap.fromTo(counter, {
                innerHTML: 0
            }, {
                innerHTML: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: function() {
                    counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                }
            });
        });
    }

    animateContactElements() {
        if (!this.isGSAPLoaded) return;

        gsap.fromTo('.contact-links li', {
            x: -50,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

    updateActiveNavigation() {
        // Update active navigation item
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupScrollEffects() {
        if (!this.isGSAPLoaded) return;

        // Parallax effects for background elements
        gsap.utils.toArray('.parallax-bg').forEach(bg => {
            gsap.to(bg, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: bg,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Scale effect on scroll for hero image
        gsap.to('.hero-image-container', {
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: '.hero',
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

        // Text animations on scroll
        gsap.utils.toArray('.animate-on-scroll').forEach(element => {
            gsap.fromTo(element, {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    setupSectionTransitions() {
        if (!this.isGSAPLoaded) return;

        // Add magnetic cursor effect for interactive elements
        this.setupMagneticEffects();
        
        // Setup hover animations for cards
        this.setupAdvancedHoverEffects();
    }

    setupMagneticEffects() {
        document.querySelectorAll('.cta-button, .project-card, .theme-toggle').forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

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
        });
    }

    setupAdvancedHoverEffects() {
        // Advanced hover effects for project cards
        document.querySelectorAll('.project-card').forEach(card => {
            const image = card.querySelector('.project-image img');
            const title = card.querySelector('.project-title');
            
            card.addEventListener('mouseenter', () => {
                if (image) {
                    gsap.to(image, {
                        scale: 1.1,
                        filter: 'brightness(1.2)',
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
                
                if (title) {
                    gsap.to(title, {
                        color: 'var(--accent)',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (image) {
                    gsap.to(image, {
                        scale: 1,
                        filter: 'brightness(1)',
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
                
                if (title) {
                    gsap.to(title, {
                        color: 'var(--text)',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    initializePage() {
        // Initialize any additional page-specific animations
        this.setupCustomCursor();
        this.setupScrollToTop();
    }

    setupCustomCursor() {
        // Custom cursor effects
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        // Cursor interactions
        document.querySelectorAll('a, button, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });

            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    setupScrollToTop() {
        // Scroll to top button
        const scrollToTop = document.createElement('div');
        scrollToTop.className = 'scroll-to-top';
        scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollToTop);

        scrollToTop.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: 0 },
                ease: "power2.inOut"
            });
        });

        // Show/hide scroll to top button
        ScrollTrigger.create({
            start: "top -200",
            end: 99999,
            toggleClass: { className: "visible", targets: scrollToTop }
        });
    }
}

// Styles for page transitions and effects
const pageTransitionStyles = `
/* Page transition overlay */
.page-transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.transition-content {
    text-align: center;
    max-width: 300px;
}

.transition-logo {
    font-size: 3rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 1rem;
    font-family: 'Roboto Mono', monospace;
}

.transition-text {
    color: var(--text);
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.transition-loader {
    width: 200px;
    height: 4px;
    background: rgba(100, 255, 218, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
}

.loader-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--accent), var(--neon-blue));
    border-radius: 2px;
}

/* Scroll progress indicator */
.scroll-progress-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    z-index: 9999;
}

.scroll-progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--accent), var(--neon-blue));
    transition: width 0.1s ease;
}

.scroll-percentage {
    position: absolute;
    right: 10px;
    top: 10px;
    color: var(--accent);
    font-size: 0.8rem;
    font-family: 'Roboto Mono', monospace;
}

/* Custom cursor */
.custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
}

.custom-cursor.cursor-hover {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0.5;
}

/* Scroll to top button */
.scroll-to-top {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 50px;
    height: 50px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100;
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
}

.scroll-to-top:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(100, 255, 218, 0.3);
}

.scroll-to-top i {
    color: var(--primary);
    font-size: 1.2rem;
}

/* Enhanced navigation active state */
.nav-links a.active {
    color: var(--accent);
    position: relative;
}

.nav-links a.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { width: 0; }
    to { width: 100%; }
}

/* Section glow effects */
section {
    transition: box-shadow 0.5s ease;
}

/* Parallax backgrounds */
.parallax-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    z-index: -1;
}

/* Advanced hover states */
.project-card,
.skill-category {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .custom-cursor {
        display: none;
    }
    
    .scroll-to-top {
        bottom: 1rem;
        left: 1rem;
        width: 45px;
        height: 45px;
    }
    
    .transition-logo {
        font-size: 2rem;
    }
    
    .scroll-percentage {
        display: none;
    }
}

/* Reduce motion support */
@media (prefers-reduced-motion: reduce) {
    .custom-cursor,
    .scroll-progress-indicator {
        display: none;
    }
    
    * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
    }
}
`;

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add page transition styles
    if (!document.getElementById('page-transition-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'page-transition-styles';
        styleSheet.textContent = pageTransitionStyles;
        document.head.appendChild(styleSheet);
    }

    // Initialize page transition controller
    window.pageTransitionController = new PageTransitionController();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTransitionController;
}

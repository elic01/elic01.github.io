/**
 * Enhanced Portfolio Features
 * Advanced animations, interactions, and visual effects
 */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
            delay: 50
        });
    }

    // Initialize all features
    initTypingEffect();
    initCounterAnimation();
    initScrollProgress();
    initProjectFilters();
    initImageParallax();
    initCursorEffect();
    initSmoothReveal();
});

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement || typeof Typed === 'undefined') return;

    new Typed('.typing-text', {
        strings: [
            'Building Innovative Solutions',
            'Developing Web Applications',
            'Exploring Cybersecurity',
            'Creating Tech Impact',
            'IT Intern @ CIMAS Health Group'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function initScrollProgress() {
    // Create progress bar if it doesn't exist
    if (!document.querySelector('.scroll-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }

    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// ============================================
// PROJECT FILTERS
// ============================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    // Add filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category')?.split(' ') || [];

                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('show');
                    }, index * 100);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ============================================
// IMAGE PARALLAX EFFECT
// ============================================
function initImageParallax() {
    const parallaxImages = document.querySelectorAll('[data-parallax]');
    if (parallaxImages.length === 0) return;

    window.addEventListener('scroll', () => {
        parallaxImages.forEach(image => {
            const speed = image.getAttribute('data-parallax') || 0.5;
            const yPos = -(window.pageYOffset * speed);
            image.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// ============================================
// CUSTOM CURSOR EFFECT
// ============================================
function initCursorEffect() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor movement
    function animate() {
        // Cursor
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Cursor effects on hover
    const hoverElements = document.querySelectorAll('a, button, .cta-button, .project-card, .skill-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

// ============================================
// SMOOTH SCROLL REVEAL
// ============================================
function initSmoothReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
function animateSkillBarsOnce() {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                const skillBars = document.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                        bar.style.opacity = '1';
                    }, index * 100);
                });
                animated = true;
                observer.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
}

// Call skill bars animation
animateSkillBarsOnce();

// ============================================
// FLOATING ELEMENTS ANIMATION
// ============================================
function initFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating');
    if (floatingElements.length === 0) return;

    floatingElements.forEach((el, index) => {
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        el.style.animationDelay = `${randomDelay}s`;
        el.style.animationDuration = `${randomDuration}s`;
    });
}

initFloatingAnimation();

// ============================================
// TILT EFFECT FOR CARDS
// ============================================
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.project-card, .skill-category');
    if (tiltCards.length === 0) return;

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

initTiltEffect();

// ============================================
// SMOOTH SCROLL TO TOP
// ============================================
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

initScrollToTop();

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="loader"></div>
            <p>Loading Portfolio...</p>
        </div>
    `;
    document.body.prepend(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

initPreloader();

// ============================================
// EXPORT FOR TESTING
// ============================================
if (typeof window !== 'undefined') {
    window.EnhancedFeatures = {
        initTypingEffect,
        initCounterAnimation,
        initScrollProgress,
        initProjectFilters,
        initImageParallax,
        initCursorEffect,
        initSmoothReveal
    };
}

/**
 * Testimonials Slider Component
 * Features: Swipe/touch support + keyboard navigation
 */

class TestimonialsSlider {
    constructor() {
        this.slider = null;
        this.slides = [];
        this.currentSlide = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        this.init();
    }

    init() {
        this.createTestimonialsSection();
        this.bindEvents();
        this.startAutoplay();
        this.setupIntersectionObserver();
    }

    createTestimonialsSection() {
        // Find a good location to insert testimonials (after experience section)
        const experienceSection = document.querySelector('#experience');
        if (!experienceSection) return;

        // Create testimonials section
        const testimonialsSection = document.createElement('section');
        testimonialsSection.id = 'testimonials';
        testimonialsSection.className = 'testimonials';
        testimonialsSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">What People Say</h2>
                <div class="testimonials-slider-container">
                    <div class="testimonials-slider">
                        <div class="testimonials-track">
                            ${this.generateTestimonialSlides()}
                        </div>
                    </div>
                    <div class="slider-controls">
                        <button class="slider-btn slider-prev" aria-label="Previous testimonial">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="slider-indicators"></div>
                        <button class="slider-btn slider-next" aria-label="Next testimonial">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="slider-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
                <div class="testimonials-navigation-hint">
                    <p><i class="fas fa-keyboard"></i> Use arrow keys, swipe, or click to navigate</p>
                </div>
            </div>
        `;

        // Insert after experience section
        experienceSection.parentNode.insertBefore(testimonialsSection, experienceSection.nextSibling);

        // Initialize slider elements
        this.slider = document.querySelector('.testimonials-slider');
        this.track = document.querySelector('.testimonials-track');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.indicators = document.querySelector('.slider-indicators');
        this.progressBar = document.querySelector('.progress-bar');

        this.setupIndicators();
        this.updateSlider();
    }

    generateTestimonialSlides() {
        const testimonials = [
            {
                quote: "Emmanuel is an exceptional developer with a keen eye for detail. His leadership in environmental initiatives while maintaining excellent academic performance is truly inspiring.",
                author: "Mr. Mudawarima",
                position: "Senior Lecturer, HIT",
                avatar: "https://ui-avatars.com/api/?name=Sarah+Mukamuri&background=64ffda&color=0a192f&size=80"
            },
            {
                quote: "Working with Emmanuel on our group project was a fantastic experience. His technical skills combined with his ability to bring the team together made all the difference.",
                author: "Lonah P Muregwi",
                position: "Classmate & Project Partner",
                avatar: "https://ui-avatars.com/api/?name=Michael+Tendai&background=b14aed&color=ffffff&size=80"
            },
            {
                quote: "Emmanuel's dedication to environmental conservation through the Eco and Wildlife Club is remarkable. He brings the same passion to everything he does.",
                author: "Mr. Nyamande",
                position: "Advisor, HIT Eco Club",
                avatar: "https://ui-avatars.com/api/?name=Janet+Gwisai&background=00c8ff&color=ffffff&size=80"
            },
            {
                quote: "As a peer educator in UNESCO O3 Plus, Emmanuel has shown exceptional communication skills and the ability to engage diverse audiences effectively.",
                author: "Mrs. Caroline",
                position: "UNESCO O3 Plus Coordinator",
                avatar: "https://ui-avatars.com/api/?name=David+Chirombe&background=ffaa00&color=0a192f&size=80"
            },
            {
                quote: "Emmanuel's portfolio website showcases not just technical competence, but also creative thinking and attention to user experience. Very impressive work!",
                author: "Othniel Makumbe",
                position: "UI/UX Designer",
                avatar: "https://ui-avatars.com/api/?name=Lisa+Chang&background=64ffda&color=0a192f&size=80"
            }
        ];

        return testimonials.map((testimonial, index) => `
            <div class="testimonial-slide" data-slide="${index}">
                <div class="testimonial-content">
                    <div class="quote-icon">
                        <i class="fas fa-quote-left"></i>
                    </div>
                    <blockquote class="testimonial-quote">
                        "${testimonial.quote}"
                    </blockquote>
                    <div class="testimonial-author">
                        <div class="author-avatar">
                            <img src="${testimonial.avatar}" alt="${testimonial.author}" loading="lazy">
                        </div>
                        <div class="author-info">
                            <h4 class="author-name">${testimonial.author}</h4>
                            <p class="author-position">${testimonial.position}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupIndicators() {
        this.indicators.innerHTML = '';
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(indicator);
        });
    }

    updateSlider() {
        if (this.isAnimating) return;

        // Update track position
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        const indicators = this.indicators.querySelectorAll('.slider-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
        this.progressBar.style.width = `${progress}%`;

        // Add slide animation classes
        this.slides.forEach((slide, index) => {
            slide.classList.remove('slide-active', 'slide-prev', 'slide-next');
            
            if (index === this.currentSlide) {
                slide.classList.add('slide-active');
            } else if (index < this.currentSlide) {
                slide.classList.add('slide-prev');
            } else {
                slide.classList.add('slide-next');
            }
        });
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
        this.resetAutoplay();
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = this.currentSlide === 0 
            ? this.slides.length - 1 
            : this.currentSlide - 1;
        this.updateSlider();
        this.resetAutoplay();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateSlider();
        this.resetAutoplay();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.stopAutoplay();
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
        
        // Prevent vertical scrolling during horizontal swipe
        if (Math.abs(this.touchEndX - this.touchStartX) > 10) {
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > this.minSwipeDistance) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            this.startAutoplay();
        }
    }

    handleKeyDown(e) {
        if (!this.isSliderInView()) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    }

    isSliderInView() {
        const slider = document.querySelector('#testimonials');
        if (!slider) return false;

        const rect = slider.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('testimonials-animate');
                }
            });
        }, { threshold: 0.2 });

        const testimonialsSection = document.querySelector('#testimonials');
        if (testimonialsSection) {
            observer.observe(testimonialsSection);
        }
    }

    bindEvents() {
        // Wait for DOM elements to be available
        setTimeout(() => {
            // Navigation buttons
            const prevBtn = document.querySelector('.slider-prev');
            const nextBtn = document.querySelector('.slider-next');
            
            if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

            // Touch events
            if (this.slider) {
                this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
                this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
                this.slider.addEventListener('touchend', () => this.handleTouchEnd());
            }

            // Mouse events for desktop drag
            let isDragging = false;
            let startX = 0;
            
            if (this.slider) {
                this.slider.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    this.slider.style.cursor = 'grabbing';
                    this.stopAutoplay();
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                });

                document.addEventListener('mouseup', (e) => {
                    if (!isDragging) return;
                    
                    isDragging = false;
                    this.slider.style.cursor = 'grab';
                    
                    const endX = e.clientX;
                    const diff = startX - endX;
                    
                    if (Math.abs(diff) > this.minSwipeDistance) {
                        if (diff > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    } else {
                        this.startAutoplay();
                    }
                });
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));

            // Pause autoplay on hover
            if (this.slider) {
                this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
                this.slider.addEventListener('mouseleave', () => this.startAutoplay());
            }

            // Visibility change handling
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopAutoplay();
                } else {
                    this.startAutoplay();
                }
            });
        }, 100);
    }
}

// CSS Styles for Testimonials Slider
const testimonialsSliderStyles = `
/* Testimonials Section */
.testimonials {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    position: relative;
    overflow: hidden;
}

.testimonials::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 70%, rgba(100, 255, 218, 0.1), transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(177, 74, 237, 0.1), transparent 50%);
    pointer-events: none;
}

.testimonials-slider-container {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
}

.testimonials.testimonials-animate .testimonials-slider-container {
    opacity: 1;
    transform: translateY(0);
}

.testimonials-slider {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    cursor: grab;
    user-select: none;
}

.testimonials-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.testimonial-slide {
    flex: 0 0 100%;
    padding: 0 1rem;
    opacity: 0.7;
    transform: scale(0.95);
    transition: all 0.5s ease;
}

.testimonial-slide.slide-active {
    opacity: 1;
    transform: scale(1);
}

.testimonial-content {
    background: var(--secondary);
    border-radius: 12px;
    padding: 3rem 2rem;
    position: relative;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(100, 255, 218, 0.1);
    transition: all 0.3s ease;
}

.testimonial-content:hover {
    border-color: rgba(100, 255, 218, 0.3);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
}

.quote-icon {
    position: absolute;
    top: -10px;
    left: 2rem;
    background: var(--accent);
    color: var(--primary);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.4);
}

.testimonial-quote {
    font-size: 1.2rem;
    line-height: 1.6;
    color: var(--text);
    margin: 0 0 2rem 0;
    font-style: italic;
    position: relative;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.author-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--accent);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
}

.author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.author-info {
    flex: 1;
}

.author-name {
    color: var(--text);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
}

.author-position {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
}

/* Slider Controls */
.slider-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0 1rem 0;
}

.slider-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(100, 255, 218, 0.3);
    color: var(--accent);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.slider-btn:hover {
    background: rgba(100, 255, 218, 0.2);
    border-color: var(--accent);
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
}

.slider-btn:active {
    transform: scale(0.95);
}

.slider-indicators {
    display: flex;
    gap: 0.5rem;
}

.slider-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
}

.slider-indicator.active {
    background: var(--accent);
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
}

.slider-indicator:hover:not(.active) {
    background: rgba(255, 255, 255, 0.5);
}

/* Progress Bar */
.slider-progress {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--neon-blue));
    border-radius: 2px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
}

/* Navigation Hint */
.testimonials-navigation-hint {
    text-align: center;
    margin-top: 1rem;
}

.testimonials-navigation-hint p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    opacity: 0.7;
}

.testimonials-navigation-hint i {
    color: var(--accent);
    margin-right: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .testimonial-content {
        padding: 2rem 1.5rem;
    }
    
    .testimonial-quote {
        font-size: 1rem;
    }
    
    .testimonials-navigation-hint p {
        font-size: 0.8rem;
    }
    
    .slider-controls {
        gap: 1rem;
    }
    
    .slider-btn {
        width: 40px;
        height: 40px;
    }
}

@media (max-width: 480px) {
    .testimonial-slide {
        padding: 0 0.5rem;
    }
    
    .testimonial-content {
        padding: 1.5rem 1rem;
    }
    
    .testimonial-author {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
    
    .author-avatar {
        width: 50px;
        height: 50px;
    }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .testimonials-track,
    .testimonial-slide,
    .testimonial-content,
    .slider-btn,
    .progress-bar {
        transition: none !important;
    }
}

/* Focus styles for accessibility */
.slider-btn:focus,
.slider-indicator:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* Loading state */
.testimonials-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: var(--text-secondary);
}

.testimonials-loading::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid var(--secondary);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    animation: testimonials-loading-spin 1s linear infinite;
    margin-left: 1rem;
}

@keyframes testimonials-loading-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Initialize Testimonials Slider
document.addEventListener('DOMContentLoaded', () => {
    // Add styles to document
    if (!document.getElementById('testimonials-slider-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'testimonials-slider-styles';
        styleSheet.textContent = testimonialsSliderStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Initialize testimonials slider with delay to ensure DOM is ready
    setTimeout(() => {
        new TestimonialsSlider();
    }, 500);
});

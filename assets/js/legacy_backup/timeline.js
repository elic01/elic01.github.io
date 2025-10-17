/**
 * Interactive Timeline Component
 * Features: Horizontal/Vertical scroll-snap + IntersectionObserver animations
 */

class InteractiveTimeline {
    constructor() {
        this.timeline = document.querySelector('.timeline');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.isHorizontal = window.innerWidth > 768;
        this.init();
    }

    init() {
        this.setupScrollSnap();
        this.setupIntersectionObserver();
        this.setupResponsiveToggle();
        this.bindEvents();
    }

    setupScrollSnap() {
        if (this.isHorizontal) {
            this.timeline.classList.add('timeline-horizontal');
            this.setupHorizontalScroll();
        } else {
            this.timeline.classList.add('timeline-vertical');
        }
    }

    setupHorizontalScroll() {
        // Create horizontal scroll container
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'timeline-scroll-container';
        
        const track = document.createElement('div');
        track.className = 'timeline-track';
        
        this.timelineItems.forEach((item, index) => {
            const timelineCard = this.createTimelineCard(item, index);
            track.appendChild(timelineCard);
        });
        
        scrollContainer.appendChild(track);
        this.timeline.innerHTML = '';
        this.timeline.appendChild(scrollContainer);
    }

    createTimelineCard(originalItem, index) {
        const card = document.createElement('div');
        card.className = 'timeline-card';
        card.style.setProperty('--index', index);
        
        const date = originalItem.querySelector('.timeline-date')?.textContent || '';
        const title = originalItem.querySelector('.timeline-title')?.textContent || '';
        const company = originalItem.querySelector('.timeline-company')?.textContent || '';
        const description = originalItem.querySelector('.timeline-description')?.textContent || '';
        
        // Determine card type based on role
        let cardType = 'leadership';
        if (company.toLowerCase().includes('fuel') || company.toLowerCase().includes('city')) {
            cardType = 'work';
        } else if (company.toLowerCase().includes('club') || company.toLowerCase().includes('media')) {
            cardType = 'club';
        } else if (company.toLowerCase().includes('microsoft') || company.toLowerCase().includes('google') || company.toLowerCase().includes('gdg')) {
            cardType = 'tech';
        } else if (company.toLowerCase().includes('unesco') || company.toLowerCase().includes('friendship') || company.toLowerCase().includes('rotaract')) {
            cardType = 'volunteer';
        }
        
        card.innerHTML = `
            <div class="timeline-card-inner timeline-card-${cardType}">
                <div class="timeline-card-header">
                    <div class="timeline-card-date">${date}</div>
                    <div class="timeline-card-dot timeline-dot-${cardType}"></div>
                </div>
                <div class="timeline-card-content">
                    <h3 class="timeline-card-title">${title}</h3>
                    <div class="timeline-card-company">${company}</div>
                    <p class="timeline-card-description">${description}</p>
                </div>
            </div>
        `;
        
        return card;
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateItem(entry.target);
                }
            });
        }, observerOptions);

        // Observe timeline cards or items
        const elementsToObserve = this.isHorizontal 
            ? document.querySelectorAll('.timeline-card')
            : this.timelineItems;
            
        elementsToObserve.forEach(item => {
            this.observer.observe(item);
        });
    }

    animateItem(item) {
        item.classList.add('timeline-animate-in');
        
        // Stagger child animations
        const children = item.querySelectorAll('.timeline-card-date, .timeline-card-title, .timeline-card-company, .timeline-card-description');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-slide-up');
            }, index * 100);
        });
    }

    setupResponsiveToggle() {
        window.addEventListener('resize', () => {
            const wasHorizontal = this.isHorizontal;
            this.isHorizontal = window.innerWidth > 768;
            
            if (wasHorizontal !== this.isHorizontal) {
                this.observer.disconnect();
                this.init();
            }
        });
    }

    bindEvents() {
        // Keyboard navigation for horizontal timeline
        if (this.isHorizontal) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    this.handleKeyboardNav(e);
                }
            });
        }

        // Touch/wheel navigation
        const container = document.querySelector('.timeline-scroll-container');
        if (container) {
            this.setupSmoothScroll(container);
        }
    }

    handleKeyboardNav(e) {
        const container = document.querySelector('.timeline-scroll-container');
        if (!container) return;

        const scrollAmount = 300;
        if (e.key === 'ArrowLeft') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    setupSmoothScroll(container) {
        let isScrolling = false;
        
        container.addEventListener('wheel', (e) => {
            if (this.isHorizontal && !isScrolling) {
                e.preventDefault();
                isScrolling = true;
                
                const scrollAmount = e.deltaY > 0 ? 300 : -300;
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        }, { passive: false });
    }
}

// CSS Styles for Timeline Component
const timelineStyles = `
/* Timeline Horizontal Layout */
.timeline-horizontal {
    position: relative;
    max-width: 100%;
    margin: 2rem 0;
}

.timeline-horizontal::before {
    display: none;
}

.timeline-scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    scrollbar-color: var(--accent) var(--secondary);
    padding: 2rem 0;
}

.timeline-scroll-container::-webkit-scrollbar {
    height: 8px;
}

.timeline-scroll-container::-webkit-scrollbar-track {
    background: var(--secondary);
    border-radius: 4px;
}

.timeline-scroll-container::-webkit-scrollbar-thumb {
    background: var(--accent);
    border-radius: 4px;
}

.timeline-track {
    display: flex;
    gap: 2rem;
    padding: 1rem;
    position: relative;
}

.timeline-track::before {
    content: '';
    position: absolute;
    top: 3rem;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--neon-blue), var(--neon-purple));
    z-index: 0;
}

.timeline-card {
    flex: 0 0 350px;
    scroll-snap-align: center;
    position: relative;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.timeline-card.timeline-animate-in {
    opacity: 1;
    transform: translateY(0);
}

.timeline-card-inner {
    background: var(--secondary);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(100, 255, 218, 0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.timeline-card:hover .timeline-card-inner {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(100, 255, 218, 0.3);
}

.timeline-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    position: relative;
}

.timeline-card-date {
    font-family: 'Roboto Mono', monospace;
    color: var(--accent);
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.4s ease;
}

.timeline-card-date.animate-slide-up {
    opacity: 1;
    transform: translateX(0);
}

.timeline-card-dot {
    width: 16px;
    height: 16px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.6);
    position: relative;
    z-index: 1;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 0 20px rgba(100, 255, 218, 0.6);
    }
    50% {
        box-shadow: 0 0 30px rgba(100, 255, 218, 0.9);
    }
}

.timeline-card-content {
    flex: 1;
}

.timeline-card-title {
    font-size: 1.3rem;
    color: var(--text);
    margin-bottom: 0.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease 0.1s;
}

.timeline-card-title.animate-slide-up {
    opacity: 1;
    transform: translateY(0);
}

.timeline-card-company {
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: 1rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease 0.2s;
}

.timeline-card-company.animate-slide-up {
    opacity: 1;
    transform: translateY(0);
}

.timeline-card-description {
    color: var(--text-secondary);
    line-height: 1.6;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease 0.3s;
}

.timeline-card-description.animate-slide-up {
    opacity: 1;
    transform: translateY(0);
}

/* Vertical Timeline Enhancements */
.timeline-vertical .timeline-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.timeline-vertical .timeline-item.timeline-animate-in {
    opacity: 1;
    transform: translateY(0);
}

.timeline-vertical .timeline-item:nth-child(odd) {
    transform: translateX(-30px);
}

.timeline-vertical .timeline-item:nth-child(even) {
    transform: translateX(30px);
}

.timeline-vertical .timeline-item.timeline-animate-in:nth-child(odd),
.timeline-vertical .timeline-item.timeline-animate-in:nth-child(even) {
    transform: translateX(0);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .timeline-card {
        flex: 0 0 280px;
    }
    
    .timeline-card-inner {
        padding: 1rem;
    }
    
    .timeline-card-title {
        font-size: 1.1rem;
    }
}

/* Navigation Hints */
.timeline-nav-hint {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 1rem;
    opacity: 0.7;
}

.timeline-nav-hint i {
    color: var(--accent);
    margin: 0 0.5rem;
}

/* Timeline Card Types */
.timeline-card-leadership {
    border-left: 4px solid var(--accent);
}

.timeline-card-work {
    border-left: 4px solid var(--warning);
}

.timeline-card-club {
    border-left: 4px solid var(--neon-blue);
}

.timeline-card-tech {
    border-left: 4px solid var(--neon-purple);
}

.timeline-card-volunteer {
    border-left: 4px solid var(--success);
}

.timeline-dot-leadership {
    background: var(--accent);
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.6);
}

.timeline-dot-work {
    background: var(--warning);
    box-shadow: 0 0 20px rgba(255, 170, 0, 0.6);
}

.timeline-dot-club {
    background: var(--neon-blue);
    box-shadow: 0 0 20px rgba(0, 200, 255, 0.6);
}

.timeline-dot-tech {
    background: var(--neon-purple);
    box-shadow: 0 0 20px rgba(177, 74, 237, 0.6);
}

.timeline-dot-volunteer {
    background: var(--success);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
}

/* Timeline Card Hover Effects by Type */
.timeline-card-leadership:hover .timeline-card-inner {
    border-color: rgba(100, 255, 218, 0.5);
    box-shadow: 0 15px 40px rgba(100, 255, 218, 0.2);
}

.timeline-card-work:hover .timeline-card-inner {
    border-color: rgba(255, 170, 0, 0.5);
    box-shadow: 0 15px 40px rgba(255, 170, 0, 0.2);
}

.timeline-card-club:hover .timeline-card-inner {
    border-color: rgba(0, 200, 255, 0.5);
    box-shadow: 0 15px 40px rgba(0, 200, 255, 0.2);
}

.timeline-card-tech:hover .timeline-card-inner {
    border-color: rgba(177, 74, 237, 0.5);
    box-shadow: 0 15px 40px rgba(177, 74, 237, 0.2);
}

.timeline-card-volunteer:hover .timeline-card-inner {
    border-color: rgba(0, 255, 136, 0.5);
    box-shadow: 0 15px 40px rgba(0, 255, 136, 0.2);
}

/* Timeline Legend */
.timeline-legend {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.timeline-legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.timeline-legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: block;
}

.legend-leadership .timeline-legend-dot {
    background: var(--accent);
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.4);
}

.legend-work .timeline-legend-dot {
    background: var(--warning);
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.4);
}

.legend-club .timeline-legend-dot {
    background: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 200, 255, 0.4);
}

.legend-tech .timeline-legend-dot {
    background: var(--neon-purple);
    box-shadow: 0 0 10px rgba(177, 74, 237, 0.4);
}

.legend-volunteer .timeline-legend-dot {
    background: var(--success);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
}
`;

// Initialize Timeline Component
document.addEventListener('DOMContentLoaded', () => {
    // Add styles to document
    if (!document.getElementById('timeline-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'timeline-styles';
        styleSheet.textContent = timelineStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add timeline legend
    const experienceSection = document.querySelector('#experience .container');
    if (experienceSection && !document.querySelector('.timeline-legend')) {
        const legend = document.createElement('div');
        legend.className = 'timeline-legend';
        legend.innerHTML = `
            <div class="timeline-legend-item legend-leadership">
                <span class="timeline-legend-dot"></span>
                <span>Leadership</span>
            </div>
            <div class="timeline-legend-item legend-work">
                <span class="timeline-legend-dot"></span>
                <span>Work Experience</span>
            </div>
            <div class="timeline-legend-item legend-club">
                <span class="timeline-legend-dot"></span>
                <span>Clubs & Media</span>
            </div>
            <div class="timeline-legend-item legend-tech">
                <span class="timeline-legend-dot"></span>
                <span>Tech Communities</span>
            </div>
            <div class="timeline-legend-item legend-volunteer">
                <span class="timeline-legend-dot"></span>
                <span>Volunteer Work</span>
            </div>
        `;
        
        const timeline = experienceSection.querySelector('.timeline');
        experienceSection.insertBefore(legend, timeline);
    }
    
    // Initialize timeline
    new InteractiveTimeline();
    
    // Add navigation hint
    const timelineSection = document.querySelector('#experience .timeline');
    if (timelineSection && window.innerWidth > 768 && !document.querySelector('.timeline-nav-hint')) {
        const hint = document.createElement('div');
        hint.className = 'timeline-nav-hint';
        hint.innerHTML = '<i class="fas fa-arrow-left"></i> Use arrow keys or scroll to navigate <i class="fas fa-arrow-right"></i>';
        timelineSection.parentNode.appendChild(hint);
    }
});

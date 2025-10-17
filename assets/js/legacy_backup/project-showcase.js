/**
 * Project Showcase Component
 * Features: Modal/Gallery with carousel and inline video support
 */

class ProjectShowcase {
    constructor() {
        this.projects = [];
        this.currentProjectIndex = 0;
        this.currentMediaIndex = 0;
        this.modal = null;
        this.carousel = null;
        this.init();
    }

    init() {
        this.createModal();
        this.setupProjectCards();
        this.bindEvents();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'project-modal';
        this.modal.innerHTML = `
            <div class="project-modal-overlay">
                <div class="project-modal-container">
                    <button class="project-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="project-modal-content">
                        <div class="project-modal-header">
                            <h2 class="project-modal-title"></h2>
                            <div class="project-modal-meta">
                                <span class="project-modal-date"></span>
                                <div class="project-modal-tech"></div>
                            </div>
                        </div>
                        <div class="project-modal-body">
                            <div class="project-media-carousel">
                                <div class="carousel-container">
                                    <div class="carousel-track"></div>
                                    <button class="carousel-btn carousel-prev">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <button class="carousel-btn carousel-next">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div class="carousel-indicators"></div>
                            </div>
                            <div class="project-modal-description"></div>
                            <div class="project-modal-details">
                                <div class="project-features">
                                    <h4>Key Features</h4>
                                    <ul class="features-list"></ul>
                                </div>
                                <div class="project-challenges">
                                    <h4>Challenges & Solutions</h4>
                                    <p class="challenges-text"></p>
                                </div>
                            </div>
                            <div class="project-modal-actions">
                                <a href="#" class="project-action-btn live-demo" target="_blank">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>
                                <a href="#" class="project-action-btn view-code" target="_blank">
                                    <i class="fab fa-github"></i> View Code
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const project = this.extractProjectData(card);
            this.projects.push(project);
            
            // Add click handler to open modal
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    this.openModal(index);
                }
            });
            
            // Add hover effects
            this.addCardHoverEffects(card);
        });
    }

    extractProjectData(card) {
        const title = card.querySelector('.project-title')?.textContent || '';
        const description = card.querySelector('.project-description')?.textContent || '';
        const image = card.querySelector('.project-image img')?.src || '';
        const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
        const demoLink = card.querySelector('a[title="Live Demo"]')?.href || '#';
        const codeLink = card.querySelector('a[title="View Code"]')?.href || '#';
        
        return {
            title,
            description,
            image,
            techTags,
            demoLink,
            codeLink,
            media: [
                { type: 'image', url: image, caption: `${title} - Main View` },
                // Add more media items as needed
            ],
            features: this.generateFeatures(title),
            challenges: this.generateChallenges(title),
            date: '2024'
        };
    }

    generateFeatures(title) {
        const featureMap = {
            'UniConnect': [
                'Role-based user authentication system',
                'Real-time database management with Firestore',
                'Responsive user interface with Tailwind CSS',
                'Scalable frontend built with Next.js',
                'Team collaboration with Git version control'
            ],
            'Portfolio Website': [
                'Responsive design for desktop and mobile',
                'Clean UI/UX with modern design elements',
                'GitHub Pages deployment integration',
                'Interactive animations and components',
                'SEO optimized structure'
            ],
            'Zim Osaka Expo Website': [
                'Fully responsive and mobile-friendly design',
                'Real-time weather integration with Weather API',
                'Dynamic content display using Gemini AI API',
                'Accessibility and SEO optimization',
                'Performance enhanced user experience'
            ]
        };
        return featureMap[title] || ['Feature 1', 'Feature 2', 'Feature 3'];
    }

    generateChallenges(title) {
        const challengeMap = {
            'UniConnect': 'The main challenges included implementing secure role-based authentication and ensuring seamless real-time data synchronization. These were solved by leveraging Firebase\'s robust authentication system and optimizing Firestore queries for performance while maintaining data consistency across multiple users.',
            'Portfolio Website': 'Ensuring optimal performance across all devices while maintaining rich visual effects was challenging. This was addressed through careful CSS optimization, efficient JavaScript loading strategies, and implementing responsive design best practices with thorough cross-browser testing.',
            'Zim Osaka Expo Website': 'Integrating multiple APIs (Gemini AI and Weather API) while maintaining fast loading times and ensuring accessibility compliance were key challenges. These were overcome through efficient API design, proper error handling, image optimization, and implementing progressive enhancement techniques.'
        };
        return challengeMap[title] || 'Various technical challenges were overcome through innovative solutions and careful planning.';
    }

    addCardHoverEffects(card) {
        const image = card.querySelector('.project-image img');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
    }

    openModal(projectIndex) {
        this.currentProjectIndex = projectIndex;
        this.currentMediaIndex = 0;
        const project = this.projects[projectIndex];
        
        this.populateModal(project);
        this.setupCarousel(project.media);
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    populateModal(project) {
        const title = this.modal.querySelector('.project-modal-title');
        const date = this.modal.querySelector('.project-modal-date');
        const tech = this.modal.querySelector('.project-modal-tech');
        const description = this.modal.querySelector('.project-modal-description');
        const featuresList = this.modal.querySelector('.features-list');
        const challengesText = this.modal.querySelector('.challenges-text');
        const liveDemo = this.modal.querySelector('.live-demo');
        const viewCode = this.modal.querySelector('.view-code');
        
        title.textContent = project.title;
        date.textContent = project.date;
        description.textContent = project.description;
        challengesText.textContent = project.challenges;
        
        tech.innerHTML = project.techTags.map(tag => 
            `<span class="tech-tag">${tag}</span>`
        ).join('');
        
        featuresList.innerHTML = project.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
        
        liveDemo.href = project.demoLink;
        viewCode.href = project.codeLink;
    }

    setupCarousel(media) {
        const track = this.modal.querySelector('.carousel-track');
        const indicators = this.modal.querySelector('.carousel-indicators');
        
        track.innerHTML = '';
        indicators.innerHTML = '';
        
        media.forEach((item, index) => {
            // Create carousel slide
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            if (item.type === 'image') {
                slide.innerHTML = `
                    <img src="${item.url}" alt="${item.caption}">
                    <div class="slide-caption">${item.caption}</div>
                `;
            } else if (item.type === 'video') {
                slide.innerHTML = `
                    <video controls poster="${item.poster || ''}">
                        <source src="${item.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="slide-caption">${item.caption}</div>
                `;
            }
            
            track.appendChild(slide);
            
            // Create indicator
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });
        
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentMediaIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const track = this.modal.querySelector('.carousel-track');
        const indicators = this.modal.querySelectorAll('.carousel-indicator');
        
        track.style.transform = `translateX(-${this.currentMediaIndex * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentMediaIndex);
        });
    }

    nextSlide() {
        const project = this.projects[this.currentProjectIndex];
        this.currentMediaIndex = (this.currentMediaIndex + 1) % project.media.length;
        this.updateCarousel();
    }

    prevSlide() {
        const project = this.projects[this.currentProjectIndex];
        this.currentMediaIndex = this.currentMediaIndex === 0 
            ? project.media.length - 1 
            : this.currentMediaIndex - 1;
        this.updateCarousel();
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    bindEvents() {
        // Close modal events
        this.modal.querySelector('.project-modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modal.querySelector('.project-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
        
        // Carousel navigation
        this.modal.querySelector('.carousel-next').addEventListener('click', () => {
            this.nextSlide();
        });
        
        this.modal.querySelector('.carousel-prev').addEventListener('click', () => {
            this.prevSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.prevSlide();
                        break;
                    case 'ArrowRight':
                        this.nextSlide();
                        break;
                }
            }
        });
    }
}

// CSS Styles for Project Showcase
const projectShowcaseStyles = `
/* Project Modal Styles */
.project-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--z-modal);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.project-modal.active {
    opacity: 1;
    visibility: visible;
}

.project-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.project-modal-container {
    background: var(--secondary);
    border-radius: 12px;
    max-width: 1000px;
    max-height: 90vh;
    width: 100%;
    position: relative;
    overflow-y: auto;
    border: 1px solid rgba(100, 255, 218, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    transform: scale(0.9) translateY(20px);
    transition: all 0.3s ease;
}

.project-modal.active .project-modal-container {
    transform: scale(1) translateY(0);
}

.project-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: var(--text);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
}

.project-modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: var(--accent);
}

.project-modal-content {
    padding: 2rem;
}

.project-modal-header {
    margin-bottom: 2rem;
}

.project-modal-title {
    font-size: 2rem;
    color: var(--text);
    margin-bottom: 1rem;
}

.project-modal-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.project-modal-date {
    color: var(--accent);
    font-family: 'Roboto Mono', monospace;
    font-size: 0.9rem;
}

.project-modal-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

/* Carousel Styles */
.project-media-carousel {
    margin-bottom: 2rem;
}

.carousel-container {
    position: relative;
    background: var(--primary);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.carousel-track {
    display: flex;
    transition: transform 0.3s ease;
}

.carousel-slide {
    flex: 0 0 100%;
    position: relative;
}

.carousel-slide img,
.carousel-slide video {
    width: 100%;
    height: 400px;
    object-fit: cover;
    display: block;
}

.slide-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
    padding: 1rem;
    font-size: 0.9rem;
}

.carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2;
}

.carousel-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    color: var(--accent);
}

.carousel-prev {
    left: 1rem;
}

.carousel-next {
    right: 1rem;
}

.carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.carousel-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
}

.carousel-indicator.active {
    background: var(--accent);
}

.carousel-indicator:hover {
    background: rgba(255, 255, 255, 0.6);
}

/* Modal Content */
.project-modal-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.project-modal-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.project-features h4,
.project-challenges h4 {
    color: var(--accent);
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.features-list {
    list-style: none;
}

.features-list li {
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    position: relative;
    padding-left: 1.5rem;
}

.features-list li::before {
    content: '✓';
    color: var(--accent);
    position: absolute;
    left: 0;
    font-weight: bold;
}

.challenges-text {
    color: var(--text-secondary);
    line-height: 1.6;
}

.project-modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.project-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;
}

.project-action-btn:hover {
    background: var(--accent);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
}

/* Enhanced Project Cards */
.project-card {
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(100, 255, 218, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
}

.project-card:hover::before {
    opacity: 1;
}

.project-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

body.modal-open {
    overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
    .project-modal-overlay {
        padding: 1rem;
    }
    
    .project-modal-content {
        padding: 1rem;
    }
    
    .project-modal-title {
        font-size: 1.5rem;
    }
    
    .project-modal-details {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .carousel-slide img,
    .carousel-slide video {
        height: 250px;
    }
    
    .project-modal-actions {
        flex-direction: column;
    }
}
`;

// Initialize Project Showcase
document.addEventListener('DOMContentLoaded', () => {
    // Add styles to document
    if (!document.getElementById('project-showcase-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'project-showcase-styles';
        styleSheet.textContent = projectShowcaseStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Initialize project showcase
    new ProjectShowcase();
});

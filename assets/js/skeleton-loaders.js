/**
 * Skeleton Loader System
 * Features: Animated loading states, progressive loading, smooth transitions
 */

class SkeletonLoader {
    constructor() {
        this.loadingStates = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.addSkeletonStyles();
        this.setupProgressiveLoading();
        this.setupImageLoading();
        this.setupContentLoading();
    }

    addSkeletonStyles() {
        const styles = `
        /* Skeleton Loading Animations */
        .skeleton {
            background: linear-gradient(90deg, 
                var(--secondary) 25%, 
                rgba(255, 255, 255, 0.1) 50%, 
                var(--secondary) 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
        }

        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Skeleton Shapes */
        .skeleton-text {
            height: 1em;
            margin-bottom: 0.5rem;
        }

        .skeleton-text.title {
            height: 2em;
            width: 60%;
        }

        .skeleton-text.subtitle {
            height: 1.5em;
            width: 40%;
        }

        .skeleton-text.paragraph {
            height: 1em;
            width: 90%;
        }

        .skeleton-text.short {
            width: 30%;
        }

        .skeleton-text.medium {
            width: 50%;
        }

        .skeleton-text.long {
            width: 80%;
        }

        .skeleton-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }

        .skeleton-image {
            width: 100%;
            height: 200px;
            border-radius: 8px;
        }

        .skeleton-card {
            padding: 1rem;
            border-radius: 12px;
            background: var(--secondary);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .skeleton-button {
            height: 44px;
            width: 120px;
            border-radius: 6px;
        }

        /* Progressive Loading States */
        .loading-container {
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .loading-container.loaded {
            opacity: 1;
        }

        .fade-in {
            animation: fadeIn 0.6s ease forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Enhanced loading states for specific components */
        .skeleton-project-card {
            background: var(--secondary);
            border-radius: 12px;
            padding: 0;
            overflow: hidden;
            height: 400px;
        }

        .skeleton-skill-bar {
            height: 8px;
            border-radius: 4px;
            margin-top: 0.5rem;
        }

        .skeleton-timeline-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            margin-bottom: 2rem;
        }

        .skeleton-nav-link {
            height: 20px;
            width: 80px;
            border-radius: 4px;
        }

        /* Pulse animation for interactive elements */
        .skeleton-pulse {
            animation: skeleton-pulse 2s infinite;
        }

        @keyframes skeleton-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }

        /* Loading overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .loading-overlay.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(100, 255, 218, 0.3);
            border-top: 3px solid var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            color: var(--text);
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .loading-progress {
            width: 200px;
            height: 4px;
            background: rgba(100, 255, 218, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }

        .loading-progress-bar {
            height: 100%;
            background: var(--accent);
            width: 0%;
            transition: width 0.3s ease;
            animation: loading-glow 1.5s ease-in-out infinite alternate;
        }

        @keyframes loading-glow {
            from { box-shadow: 0 0 5px var(--accent); }
            to { box-shadow: 0 0 20px var(--accent); }
        }
        `;

        if (!document.getElementById('skeleton-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'skeleton-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    createPageLoader() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading Portfolio...</div>
            <div class="loading-progress">
                <div class="loading-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    createSkeletonCard(type = 'default') {
        const card = document.createElement('div');
        card.className = 'skeleton-card';

        switch (type) {
            case 'project':
                card.innerHTML = `
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton skeleton-text title"></div>
                    <div class="skeleton skeleton-text paragraph"></div>
                    <div class="skeleton skeleton-text paragraph"></div>
                    <div class="skeleton skeleton-text short"></div>
                    <div style="display: flex; gap: 10px; margin-top: 1rem;">
                        <div class="skeleton skeleton-button"></div>
                        <div class="skeleton skeleton-button"></div>
                    </div>
                `;
                break;

            case 'skill':
                card.innerHTML = `
                    <div class="skeleton skeleton-text title"></div>
                    <div class="skeleton skeleton-text medium"></div>
                    <div class="skeleton skeleton-skill-bar"></div>
                    <div class="skeleton skeleton-text medium"></div>
                    <div class="skeleton skeleton-skill-bar"></div>
                    <div class="skeleton skeleton-text short"></div>
                    <div class="skeleton skeleton-skill-bar"></div>
                `;
                break;

            case 'timeline':
                card.innerHTML = `
                    <div class="skeleton-timeline-item">
                        <div class="skeleton skeleton-avatar"></div>
                        <div style="flex: 1;">
                            <div class="skeleton skeleton-text title"></div>
                            <div class="skeleton skeleton-text medium"></div>
                            <div class="skeleton skeleton-text long"></div>
                        </div>
                    </div>
                `;
                break;

            default:
                card.innerHTML = `
                    <div class="skeleton skeleton-text title"></div>
                    <div class="skeleton skeleton-text paragraph"></div>
                    <div class="skeleton skeleton-text paragraph"></div>
                    <div class="skeleton skeleton-text short"></div>
                `;
        }

        return card;
    }

    setupProgressiveLoading() {
        // Create and show page loader
        const pageLoader = this.createPageLoader();
        const progressBar = pageLoader.querySelector('.loading-progress-bar');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    pageLoader.classList.add('hidden');
                    setTimeout(() => {
                        if (pageLoader.parentNode) {
                            pageLoader.parentNode.removeChild(pageLoader);
                        }
                    }, 500);
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);

        // Load sections progressively
        this.loadSectionsProgressively();
    }

    loadSectionsProgressively() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            // Add loading container
            section.classList.add('loading-container');
            
            // Create intersection observer for each section
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.loadSectionContent(entry.target);
                        }, index * 200); // Stagger loading
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(section);
        });
    }

    loadSectionContent(section) {
        // Add loaded class for fade-in effect
        section.classList.add('loaded');
        
        // Load specific content based on section
        const sectionId = section.id;
        
        switch (sectionId) {
            case 'projects':
                this.loadProjectCards(section);
                break;
            case 'skills':
                this.loadSkillBars(section);
                break;
            case 'experience':
                this.loadTimelineItems(section);
                break;
            default:
                this.loadGenericContent(section);
        }
    }

    loadProjectCards(section) {
        const projectsGrid = section.querySelector('.projects-grid');
        if (!projectsGrid) return;

        const cards = projectsGrid.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 150);
        });
    }

    loadSkillBars(section) {
        const skillBars = section.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-width') + '%';
                bar.parentElement.parentElement.classList.add('fade-in');
            }, index * 100);
        });
    }

    loadTimelineItems(section) {
        const timelineItems = section.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 200);
        });
    }

    loadGenericContent(section) {
        const elements = section.querySelectorAll('*');
        elements.forEach((element, index) => {
            if (index % 3 === 0) { // Stagger every 3rd element
                setTimeout(() => {
                    element.classList.add('fade-in');
                }, index * 50);
            }
        });
    }

    setupImageLoading() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (img.complete) {
                this.handleImageLoad(img);
            } else {
                // Create skeleton placeholder
                const skeleton = this.createImageSkeleton(img);
                img.parentNode.insertBefore(skeleton, img);
                img.style.display = 'none';
                
                img.addEventListener('load', () => {
                    this.handleImageLoad(img, skeleton);
                });
                
                img.addEventListener('error', () => {
                    this.handleImageError(img, skeleton);
                });
            }
        });
    }

    createImageSkeleton(img) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-image';
        skeleton.style.width = img.width ? img.width + 'px' : '100%';
        skeleton.style.height = img.height ? img.height + 'px' : '200px';
        return skeleton;
    }

    handleImageLoad(img, skeleton = null) {
        if (skeleton) {
            img.style.display = 'block';
            img.classList.add('fade-in');
            setTimeout(() => {
                if (skeleton.parentNode) {
                    skeleton.parentNode.removeChild(skeleton);
                }
            }, 300);
        } else {
            img.classList.add('fade-in');
        }
    }

    handleImageError(img, skeleton) {
        // Replace with placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: var(--secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            border-radius: 8px;
        `;
        placeholder.innerHTML = '<i class="fas fa-image" style="font-size: 2rem;"></i>';
        
        if (skeleton) {
            skeleton.parentNode.replaceChild(placeholder, skeleton);
        }
        img.style.display = 'none';
    }

    setupContentLoading() {
        // Simulate API loading for dynamic content
        this.simulateAPILoading();
        
        // Setup lazy loading for heavy components
        this.setupLazyLoading();
    }

    simulateAPILoading() {
        // Simulate loading states for components that would fetch data
        const components = [
            { selector: '.chatbot-container', delay: 2000 },
            { selector: '.theme-toggle', delay: 1500 },
            { selector: '.social-links', delay: 1000 }
        ];

        components.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.transition = 'opacity 0.5s ease';
                    element.style.opacity = '1';
                }, delay);
            }
        });
    }

    setupLazyLoading() {
        // Lazy load heavy components
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const component = element.getAttribute('data-lazy');
                    
                    this.loadLazyComponent(element, component);
                    lazyObserver.unobserve(element);
                }
            });
        }, { threshold: 0.1 });

        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }

    loadLazyComponent(element, componentType) {
        // Show loading state
        const skeleton = this.createSkeletonCard(componentType);
        element.appendChild(skeleton);

        // Simulate component loading
        setTimeout(() => {
            skeleton.classList.add('fade-out');
            setTimeout(() => {
                if (skeleton.parentNode) {
                    skeleton.parentNode.removeChild(skeleton);
                }
                element.classList.add('loaded');
            }, 300);
        }, 1000);
    }

    // Utility methods
    showSkeleton(element, type = 'default') {
        const skeleton = this.createSkeletonCard(type);
        element.appendChild(skeleton);
        return skeleton;
    }

    hideSkeleton(skeleton) {
        if (skeleton && skeleton.parentNode) {
            skeleton.classList.add('fade-out');
            setTimeout(() => {
                if (skeleton.parentNode) {
                    skeleton.parentNode.removeChild(skeleton);
                }
            }, 300);
        }
    }

    createTextSkeleton(lines = 3, widths = ['80%', '60%', '90%']) {
        const container = document.createElement('div');
        widths.forEach(width => {
            const line = document.createElement('div');
            line.className = 'skeleton skeleton-text';
            line.style.width = width;
            container.appendChild(line);
        });
        return container;
    }

    // Global loading state management
    setGlobalLoading(isLoading) {
        if (isLoading) {
            document.body.classList.add('global-loading');
        } else {
            document.body.classList.remove('global-loading');
        }
    }
}

// Enhanced fade-out styles
const fadeOutStyles = `
.fade-out {
    animation: fadeOut 0.3s ease forwards;
}

@keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
}

.global-loading * {
    pointer-events: none;
}

.global-loading .loading-overlay {
    pointer-events: all;
}
`;

// Initialize skeleton loader system
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-out styles
    if (!document.getElementById('fadeout-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'fadeout-styles';
        styleSheet.textContent = fadeOutStyles;
        document.head.appendChild(styleSheet);
    }

    // Initialize skeleton loader
    window.skeletonLoader = new SkeletonLoader();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkeletonLoader;
}

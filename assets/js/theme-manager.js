/**
 * Advanced Theme Manager
 * Features:
 * - Dark/Light mode toggle
 * - System preference detection (prefers-color-scheme)
 * - localStorage persistence
 * - Smooth CSS transitions
 * - Theme state management
 */

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                // Primary Colors
                '--primary': '#ffffff',
                '--secondary': '#f8f9fa',
                '--tertiary': '#e9ecef',
                '--surface': '#ffffff',
                
                // Text Colors
                '--text': '#212529',
                '--text-secondary': '#495057',
                '--text-muted': '#6c757d',
                
                // Accent Colors (keep consistent)
                '--accent': '#0d6efd',
                '--accent-hover': '#0b5ed7',
                '--neon-blue': '#0d6efd',
                '--neon-purple': '#6f42c1',
                
                // Status Colors
                '--success': '#198754',
                '--warning': '#fd7e14',
                '--error': '#dc3545',
                
                // Shadows (lighter for light mode)
                '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                '--shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                '--shadow-glow': '0 0 20px rgb(13 110 253 / 0.3)',
            },
            dark: {
                // Primary Colors
                '--primary': '#0a192f',
                '--secondary': '#112240',
                '--tertiary': '#233554',
                '--surface': '#172a45',
                
                // Text Colors
                '--text': '#ccd6f6',
                '--text-secondary': '#8892b0',
                '--text-muted': '#5a6c7d',
                
                // Accent Colors
                '--accent': '#64ffda',
                '--accent-hover': '#4ad8c5',
                '--neon-blue': '#00c8ff',
                '--neon-purple': '#b14aed',
                
                // Status Colors
                '--success': '#00ff88',
                '--warning': '#ffaa00',
                '--error': '#ff4757',
                
                // Shadows (darker for dark mode)
                '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.2)',
                '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
                '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
                '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
                '--shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
                '--shadow-glow': '0 0 20px rgb(100 255 218 / 0.3)',
            }
        };
        
        this.currentTheme = this.getInitialTheme();
        this.themeToggle = null;
        this.themeIcon = null;
        
        this.init();
    }
    
    /**
     * Initialize the theme manager
     */
    init() {
        this.setupThemeToggle();
        this.applyTheme(this.currentTheme, false); // Don't animate on initial load
        this.setupSystemThemeListener();
        this.addTransitionStyles();
        
        // Add theme change event
        window.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail);
        });
    }
    
    /**
     * Get initial theme based on localStorage, system preference, or default
     */
    getInitialTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && this.themes[savedTheme]) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        
        // Default to dark theme
        return 'dark';
    }
    
    /**
     * Setup theme toggle button
     */
    setupThemeToggle() {
        this.themeToggle = document.querySelector('.theme-toggle');
        if (!this.themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }
        
        this.themeIcon = this.themeToggle.querySelector('i');
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Update icon based on current theme
        this.updateThemeIcon();
    }
    
    /**
     * Add CSS transitions for smooth theme changes
     */
    addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                /* Theme transition properties */
                --theme-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Elements that should transition smoothly during theme changes */
            *, *::before, *::after {
                transition: 
                    background-color var(--theme-transition),
                    color var(--theme-transition),
                    border-color var(--theme-transition),
                    box-shadow var(--theme-transition),
                    fill var(--theme-transition),
                    stroke var(--theme-transition);
            }
            
            /* Specific transitions for theme-sensitive elements */
            body {
                transition: background-color var(--theme-transition), color var(--theme-transition);
            }
            
            .project-card,
            .skill-category,
            .cert-card,
            .contact-form,
            header,
            footer {
                transition: 
                    background-color var(--theme-transition),
                    border-color var(--theme-transition),
                    box-shadow var(--theme-transition);
            }
            
            /* Theme toggle button animation */
            .theme-toggle {
                transition: transform 0.2s ease, box-shadow var(--theme-transition);
            }
            
            .theme-toggle:hover {
                transform: translateY(-2px) scale(1.05);
            }
            
            .theme-toggle i {
                transition: transform 0.3s ease, color var(--theme-transition);
            }
            
            /* Reduce motion for users who prefer it */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Apply theme to the document
     */
    applyTheme(themeName, animate = true) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }
        
        const root = document.documentElement;
        const theme = this.themes[themeName];
        
        // Temporarily disable transitions if not animating
        if (!animate) {
            root.style.setProperty('--theme-transition', 'none');
        }
        
        // Apply theme variables
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Re-enable transitions after a short delay
        if (!animate) {
            setTimeout(() => {
                root.style.removeProperty('--theme-transition');
            }, 50);
        }
        
        // Update data attribute for CSS targeting
        document.body.setAttribute('data-theme', themeName);
        
        // Update current theme
        this.currentTheme = themeName;
        
        // Save to localStorage
        localStorage.setItem('theme', themeName);
        
        // Update theme icon
        this.updateThemeIcon();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, themes: this.themes[themeName] }
        }));
        
        console.log(`Theme switched to: ${themeName}`);
    }
    
    /**
     * Toggle between themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme, true);
    }
    
    /**
     * Update theme toggle icon
     */
    updateThemeIcon() {
        if (!this.themeIcon) return;
        
        // Add rotation animation
        this.themeIcon.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            if (this.currentTheme === 'dark') {
                this.themeIcon.className = 'fas fa-sun';
                this.themeToggle.setAttribute('title', 'Switch to light mode');
            } else {
                this.themeIcon.className = 'fas fa-moon';
                this.themeToggle.setAttribute('title', 'Switch to dark mode');
            }
            
            // Reset rotation
            setTimeout(() => {
                this.themeIcon.style.transform = '';
            }, 150);
        }, 150);
    }
    
    /**
     * Listen for system theme changes
     */
    setupSystemThemeListener() {
        if (!window.matchMedia) return;
        
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        const handleSystemThemeChange = () => {
            // Only apply system theme if user hasn't manually set a preference
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                if (darkModeQuery.matches) {
                    this.applyTheme('dark');
                } else if (lightModeQuery.matches) {
                    this.applyTheme('light');
                }
            }
        };
        
        // Listen for changes
        darkModeQuery.addListener(handleSystemThemeChange);
        lightModeQuery.addListener(handleSystemThemeChange);
        
        // Modern syntax (for newer browsers)
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', handleSystemThemeChange);
            lightModeQuery.addEventListener('change', handleSystemThemeChange);
        }
    }
    
    /**
     * Handle theme change events from other components
     */
    handleThemeChange(detail) {
        // This can be used by other components to react to theme changes
        console.log('Theme changed:', detail);
    }
    
    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * Get theme colors
     */
    getThemeColors(themeName = this.currentTheme) {
        return this.themes[themeName] || this.themes[this.currentTheme];
    }
    
    /**
     * Add custom theme
     */
    addTheme(name, colors) {
        this.themes[name] = colors;
    }
    
    /**
     * Set theme programmatically
     */
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.applyTheme(themeName);
        }
    }
    
    /**
     * Reset to system preference
     */
    resetToSystemPreference() {
        localStorage.removeItem('theme');
        const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        this.applyTheme(systemTheme);
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

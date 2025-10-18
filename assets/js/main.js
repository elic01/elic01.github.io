/**
 * Optimized Portfolio Website - Main JavaScript
 * Emmanuel Leon Isheanesu Chinjekure
 * Consolidated, performant, and modern
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    emailJS: {
        serviceId: 'YOUR_SERVICE_ID', // Update with your EmailJS service ID
        templateId: 'YOUR_TEMPLATE_ID', // Update with your EmailJS template ID
        publicKey: 'YOUR_PUBLIC_KEY' // Update with your EmailJS public key
    },
    animations: {
        observerThreshold: 0.1,
        skillAnimationDelay: 100
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ============================================
// NAVIGATION MODULE
// ============================================
const Navigation = {
    header: null,
    mobileMenuBtn: null,
    navLinks: null,

    init() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },

    setupScrollEffect() {
        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.navLinks) return;

        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenuBtn.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
                this.mobileMenuBtn.classList.remove('active');
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.navLinks.classList.remove('active');
                this.mobileMenuBtn.classList.remove('active');
            }
        });
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ============================================
// THEME MODULE
// ============================================
const Theme = {
    toggle: null,
    icon: null,
    darkMode: true,

    init() {
        this.toggle = document.querySelector('.theme-toggle');
        this.icon = this.toggle?.querySelector('i');

        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.darkMode = savedTheme === 'dark';
            this.applyTheme();
        }

        this.setupToggle();
    },

    setupToggle() {
        if (!this.toggle) return;

        this.toggle.addEventListener('click', () => {
            this.darkMode = !this.darkMode;
            this.applyTheme();
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        });
    },

    applyTheme() {
        const root = document.documentElement;

        if (this.darkMode) {
            root.style.setProperty('--primary', '#0a192f');
            root.style.setProperty('--secondary', '#112240');
            root.style.setProperty('--text', '#ccd6f6');
            root.style.setProperty('--text-secondary', '#8892b0');
            if (this.icon) this.icon.className = 'fas fa-moon';
        } else {
            root.style.setProperty('--primary', '#f8f8f8');
            root.style.setProperty('--secondary', '#e6e6e6');
            root.style.setProperty('--text', '#333333');
            root.style.setProperty('--text-secondary', '#555555');
            if (this.icon) this.icon.className = 'fas fa-sun';
        }
    }
};

// ============================================
// SKILLS ANIMATION MODULE
// ============================================
const Skills = {
    animated: false,

    init() {
        this.setupObserver();
    },

    setupObserver() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateSkillBars();
                    this.animated = true;
                }
            });
        }, { threshold: CONFIG.animations.observerThreshold });

        observer.observe(skillsSection);
    },

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * CONFIG.animations.skillAnimationDelay);
        });
    }
};

// ============================================
// CONTACT FORM MODULE
// ============================================
const ContactForm = {
    form: null,
    submitBtn: null,
    emailJSLoaded: false,

    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('.submit-btn');
        this.loadEmailJS();
        this.setupFormValidation();
        this.setupSubmit();
    },

    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            if (window.emailjs) {
                this.emailJSLoaded = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(CONFIG.emailJS.publicKey);
                this.emailJSLoaded = true;
                resolve();
            };
            script.onerror = () => {
                console.warn('EmailJS failed to load. Form will use fallback.');
                reject();
            };
            document.head.appendChild(script);
        });
    },

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    },

    showError(field, message) {
        this.clearError(field);
        field.classList.add('error');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';

        field.parentElement.appendChild(errorDiv);
    },

    clearError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    },

    setupSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            const inputs = this.form.querySelectorAll('.form-control');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Disable button and show loading state
            const originalText = this.submitBtn.textContent;
            this.submitBtn.textContent = 'Sending...';
            this.submitBtn.disabled = true;

            try {
                if (this.emailJSLoaded) {
                    await this.sendEmailWithEmailJS();
                } else {
                    await this.sendEmailFallback();
                }

                this.showSuccess();
                this.form.reset();
            } catch (error) {
                this.showError(this.submitBtn.parentElement, 'Failed to send message. Please try again or email directly.');
                console.error('Form submission error:', error);
            } finally {
                this.submitBtn.textContent = originalText;
                this.submitBtn.disabled = false;
            }
        });
    },

    async sendEmailWithEmailJS() {
        const formData = {
            name: this.form.querySelector('#name').value,
            email: this.form.querySelector('#email').value,
            subject: this.form.querySelector('#subject').value,
            message: this.form.querySelector('#message').value
        };

        return emailjs.send(
            CONFIG.emailJS.serviceId,
            CONFIG.emailJS.templateId,
            formData
        );
    },

    async sendEmailFallback() {
        // Fallback: Open email client with pre-filled data
        const name = this.form.querySelector('#name').value;
        const email = this.form.querySelector('#email').value;
        const subject = this.form.querySelector('#subject').value;
        const message = this.form.querySelector('#message').value;

        const mailtoLink = `mailto:emmanuelisheanesu2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

        window.location.href = mailtoLink;

        // Simulate success after a delay
        return new Promise(resolve => setTimeout(resolve, 1000));
    },

    showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = 'Thank you! Your message has been sent successfully.';
        successDiv.style.cssText = `
            background: rgba(100, 255, 218, 0.1);
            border: 1px solid var(--accent);
            color: var(--accent);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        `;

        this.form.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 5000);
    }
};

// ============================================
// CHATBOT MODULE
// ============================================
const Chatbot = {
    button: null,
    panel: null,
    closeBtn: null,
    messages: null,
    input: null,
    sendBtn: null,

    init() {
        this.button = document.querySelector('.chatbot-button');
        this.panel = document.querySelector('.chatbot-panel');
        this.closeBtn = document.querySelector('.chatbot-close');
        this.messages = document.querySelector('.chatbot-messages');
        this.input = document.querySelector('.chatbot-input input');
        this.sendBtn = document.querySelector('.chatbot-input button');

        if (!this.button || !this.panel) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        this.button.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },

    open() {
        this.panel.classList.add('active');
        this.button.style.display = 'none';
        this.input.focus();
    },

    close() {
        this.panel.classList.remove('active');
        this.button.style.display = 'flex';
    },

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Simulate bot thinking
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    },

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = text;

        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    },

    getBotResponse(message) {
        const msg = message.toLowerCase();

        const responses = {
            greetings: [
                "Hi! I'm here to help you learn about Emmanuel. Ask me about his work at CIMAS, projects, or tech stack!",
                "Hello! Want to know about Emmanuel's experience, skills, or how to get in touch? Just ask!"
            ],
            projects: [
                "Emmanuel's key projects:\n\n1. UniConnect - Student feedback system (Next.js, TypeScript, Firebase)\n2. Portfolio Website - You're on it! (HTML, CSS, JS with terminal theme)\n3. Zim Osaka Expo 2025 - Event website (Gemini API, Weather API)\n\nAll available on his GitHub!"
            ],
            uniconnect: [
                "UniConnect is a full-stack student platform built with Next.js, TypeScript, and Firebase. It features role-based authentication and streamlines university feedback processes. First time using Next.js App Router - the Firebase security rules were challenging but worth it!"
            ],
            contact: [
                "📧 Email: emmanuelisheanesu2004@gmail.com\n📱 Phone: +263 78 854 7017\n🌍 Location: Harare, Zimbabwe\n\nYou can also use the contact form below to send a message directly!"
            ],
            skills: [
                "Emmanuel's tech stack:\n\n💻 Languages: JavaScript, Python, Java, C#, HTML/CSS\n⚛️ Frontend: React, Next.js, Tailwind CSS\n🔧 Backend: Node.js, Firebase, MySQL\n🐧 Systems: Linux, Bash scripting\n🛡️ Learning: Cybersecurity, network security\n\nCurrently applying these skills in enterprise healthcare IT at CIMAS!"
            ],
            experience: [
                "Current Role:\n🏥 IT Intern @ CIMAS Health Group (Aug 2025 - Aug 2026)\n- Enterprise IT systems & healthcare tech\n- Network management & digital transformation\n\nLeadership:\n🌿 President @ HIT Eco & Wildlife Club\n💻 Microsoft Learn Student Ambassador\n👥 Google Developer Communities member\n\nView the Experience section for full details!"
            ],
            cimas: [
                "Emmanuel is an IT Intern at CIMAS Health Group, Zimbabwe's leading medical aid society. He works with:\n\n• Enterprise IT infrastructure\n• Healthcare technology systems\n• Network management\n• Digital transformation projects\n\nGaining hands-on experience with real-world IT solutions in healthcare!"
            ],
            education: [
                "🎓 B.Tech Honours in Information Technology\n🏫 Harare Institute of Technology (HIT)\n📅 Expected graduation: August 2027\n\nFocus areas: Software development, web technologies, and cybersecurity fundamentals."
            ],
            github: [
                "Check out Emmanuel's work on GitHub: github.com/elic01\n\nYou'll find all his projects including UniConnect, this portfolio, and more!"
            ],
            linkedin: [
                "Connect with Emmanuel on LinkedIn: linkedin.com/in/emmanuel-l-i-chinjekure\n\nGreat for professional networking and staying updated with his journey!"
            ],
            hire: [
                "Emmanuel is open to:\n✅ Internship opportunities\n✅ Freelance projects\n✅ Collaborations\n✅ Tech discussions\n\nReach out via email: emmanuelisheanesu2004@gmail.com"
            ],
            thanks: ["You're welcome! Feel free to ask anything else about Emmanuel's work, skills, or experience! 😊"]
        };

        // Greetings
        if (msg.match(/\b(hello|hi|hey|greet|good\s?(morning|afternoon|evening))\b/)) {
            return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        }
        // Specific projects
        else if (msg.match(/\b(uniconnect|uni\s?connect|student.*platform)\b/)) {
            return responses.uniconnect[0];
        }
        // CIMAS
        else if (msg.match(/\b(cimas|health\s?group|medical|healthcare)\b/)) {
            return responses.cimas[0];
        }
        // Projects
        else if (msg.match(/\b(project|portfolio|work|built|create|develop)\b/)) {
            return responses.projects[0];
        }
        // Contact
        else if (msg.match(/\b(contact|reach|email|phone|message|connect)\b/)) {
            return responses.contact[0];
        }
        // Skills/Tech
        else if (msg.match(/\b(skill|technology|tech|stack|language|framework|tool|can\s?you|know)\b/)) {
            return responses.skills[0];
        }
        // Experience
        else if (msg.match(/\b(experience|job|position|role|work|intern|career)\b/)) {
            return responses.experience[0];
        }
        // Education
        else if (msg.match(/\b(education|study|university|college|hit|degree|student)\b/)) {
            return responses.education[0];
        }
        // GitHub
        else if (msg.match(/\b(github|git|repo|code|source)\b/)) {
            return responses.github[0];
        }
        // LinkedIn
        else if (msg.match(/\b(linkedin|linked\s?in|professional|network)\b/)) {
            return responses.linkedin[0];
        }
        // Hiring/Opportunities
        else if (msg.match(/\b(hire|hiring|available|opportunity|freelance|collaboration)\b/)) {
            return responses.hire[0];
        }
        // Thanks
        else if (msg.match(/\b(thank|thanks|appreciate)\b/)) {
            return responses.thanks[0];
        }
        // Default
        else {
            return "I can help with:\n\n💼 Experience at CIMAS\n🚀 Projects & portfolio\n💻 Technical skills\n🎓 Education\n📧 Contact information\n\nWhat would you like to know?";
        }
    }
};

// ============================================
// LAZY LOADING MODULE
// ============================================
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
};

// ============================================
// SECTION ANIMATIONS MODULE
// ============================================
const SectionAnimations = {
    init() {
        const sections = document.querySelectorAll('section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });
    }
};

// ============================================
// SCROLL TO TOP
// ============================================
const ScrollToTop = {
    init() {
        const scrollBtn = document.getElementById('scroll-top');
        if (!scrollBtn) return;

        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// ============================================
// PERFORMANCE MONITORING
// ============================================
const Performance = {
    init() {
        // Log page load time
        window.addEventListener('load', () => {
            if (window.performance) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            }
        });
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initialized - Optimized version');

    // Initialize all modules
    Navigation.init();
    Theme.init();
    Skills.init();
    ContactForm.init();
    Chatbot.init();
    LazyLoad.init();
    SectionAnimations.init();
    ScrollToTop.init();
    Performance.init();
});

// Export modules for testing/debugging
if (typeof window !== 'undefined') {
    window.Portfolio = {
        Navigation,
        Theme,
        Skills,
        ContactForm,
        Chatbot,
        LazyLoad,
        Utils
    };
}

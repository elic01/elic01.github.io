
        // Header Scroll Effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Skill bar animation
        function animateSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }

        // Animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('skills')) {
                        animateSkillBars();
                    }
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Theme Toggle
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        let darkMode = true; // Default is dark mode

        themeToggle.addEventListener('click', () => {
            darkMode = !darkMode;
            if (darkMode) {
                document.documentElement.style.setProperty('--primary', '#0a192f');
                document.documentElement.style.setProperty('--secondary', '#112240');
                document.documentElement.style.setProperty('--text', '#ccd6f6');
                document.documentElement.style.setProperty('--text-secondary', '#8892b0');
                themeIcon.className = 'fas fa-moon';
            } else {
                document.documentElement.style.setProperty('--primary', '#f8f8f8');
                document.documentElement.style.setProperty('--secondary', '#e6e6e6');
                document.documentElement.style.setProperty('--text', '#333333');
                document.documentElement.style.setProperty('--text-secondary', '#555555');
                themeIcon.className = 'fas fa-sun';
            }
        });

        // Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        // Chatbot Functionality
        const chatbotButton = document.querySelector('.chatbot-button');
        const chatbotPanel = document.querySelector('.chatbot-panel');
        const chatbotClose = document.querySelector('.chatbot-close');
        const chatbotMessages = document.querySelector('.chatbot-messages');
        const chatbotInput = document.querySelector('.chatbot-input input');
        const chatbotSendBtn = document.querySelector('.chatbot-input button');

        chatbotButton.addEventListener('click', () => {
            chatbotPanel.style.display = 'flex';
            chatbotButton.style.display = 'none';
        });

        chatbotClose.addEventListener('click', () => {
            chatbotPanel.style.display = 'none';
            chatbotButton.style.display = 'flex';
        });

        function sendMessage() {
            const message = chatbotInput.value.trim();
            if (message !== '') {
                // Add user message
                const userMessageElement = document.createElement('div');
                userMessageElement.classList.add('message', 'user-message');
                userMessageElement.textContent = message;
                chatbotMessages.appendChild(userMessageElement);
                
                // Clear input
                chatbotInput.value = '';
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                
                // Simulate bot response after a short delay
                setTimeout(() => {
                    const botResponse = getBotResponse(message);
                    const botMessageElement = document.createElement('div');
                    botMessageElement.classList.add('message', 'bot-message');
                    botMessageElement.textContent = botResponse;
                    chatbotMessages.appendChild(botMessageElement);
                    
                    // Scroll to bottom
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1000);
            }
        }

        chatbotSendBtn.addEventListener('click', sendMessage);
        
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function getBotResponse(message) {
            message = message.toLowerCase();
            
            if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
                return "Hello there! How can I assist you today?";
            } else if (message.includes('project') || message.includes('work')) {
                return "Emmanuel has worked on several exciting projects! Check out the Projects section to learn more about them.";
            } else if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
                return "You can contact Emmanuel via email at emmanuel@example.com or through the contact form on this website.";
            } else if (message.includes('skill') || message.includes('technology') || message.includes('tech stack')) {
                return "Emmanuel is skilled in Python, Java, C#, HTML, CSS, JavaScript, and more. The Skills section has a detailed breakdown.";
            } else if (message.includes('experience') || message.includes('job') || message.includes('work history')) {
                return "Emmanuel has experience in software development and has held leadership positions in various organizations. See the Experience section for details.";
            } else if (message.includes('education') || message.includes('study') || message.includes('degree')) {
                return "Emmanuel is pursuing a degree in Information Technology with a focus on software development.";
            } else if (message.includes('thank')) {
                return "You're welcome! Feel free to ask if you have any other questions.";
            } else {
                return "I'm not sure I understand. Could you rephrase your question? You can ask about Emmanuel's projects, skills, experience, or how to contact him.";
            }
        }

        // Initialize animations
        window.addEventListener('load', function() {
            // Animate skill bars if skills section is in viewport on load
            const skillsSection = document.querySelector('.skills');
            const rect = skillsSection.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
            
            if (isVisible) {
                animateSkillBars();
            }
        });
    
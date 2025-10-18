/**
 * Matrix Rain Background Effect
 * Authentic terminal/hacker aesthetic
 * Mobile-optimized
 */

(function() {
    'use strict';

    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Recalculate columns on resize
        updateColumns();
    }

    // Matrix characters - mix of code symbols and binary
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = isMobile ? 12 : 14;
    let columns;
    let drops;

    function updateColumns() {
        columns = Math.floor(canvas.width / fontSize);
        // Reduce columns on mobile for performance
        if (isMobile) {
            columns = Math.floor(columns / 2);
        }
        drops = Array(columns).fill(1);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Matrix green text
        ctx.fillStyle = '#39ff14';
        ctx.font = `${fontSize}px "Fira Code", monospace`;

        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = chars[Math.floor(Math.random() * chars.length)];

            // Draw character (adjust x position for mobile)
            const xPos = isMobile ? i * fontSize * 2 : i * fontSize;
            ctx.fillText(char, xPos, drops[i] * fontSize);

            // Reset drop to top randomly or when it reaches bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Increment y coordinate
            drops[i]++;
        }
    }

    // Start animation with longer interval on mobile for better performance
    const animationInterval = isMobile ? 50 : 35;

    // Don't run on very small screens (portrait phones)
    if (window.innerWidth > 480) {
        setInterval(draw, animationInterval);
    }
})();

/**
 * Matrix Rain Background Effect
 * Authentic terminal/hacker aesthetic
 */

(function() {
    'use strict';

    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - mix of code symbols and binary
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to hold y-position for each column
    const drops = Array(columns).fill(1);

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

            // Draw character
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            // Reset drop to top randomly or when it reaches bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Increment y coordinate
            drops[i]++;
        }
    }

    // Start animation
    setInterval(draw, 35);
})();

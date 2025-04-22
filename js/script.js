/**
 * Hexward Consulting - Main JavaScript File
 * Author: Hexward Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load components
    loadComponents().then(() => {
        // Initialize all components
        initMobileMenu();
        initSmoothScroll();
        initFormValidation();
        initScrollAnimation();
        setActiveNavItem();
        setCurrentYear();
        initThemeToggle();
    });
});

/**
 * Mobile Menu Toggle
 * This function will be used when implementing a mobile hamburger menu
 */
function initMobileMenu() {
    // This is a placeholder for future mobile menu implementation
    // When adding a hamburger menu, this function will handle the toggle functionality
    console.log('Mobile menu ready for implementation');
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightField(field, true);
                } else {
                    highlightField(field, false);
                }
            });

            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    highlightField(emailField, true);
                }
            }

            if (isValid) {
                // In a real implementation, this would submit the form data via AJAX
                // For now, we'll just show a success message
                showFormMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showFormMessage('Please fill in all required fields correctly.', 'error');
            }
        });
    }
}

/**
 * Highlight form field with error
 */
function highlightField(field, isError) {
    if (isError) {
        field.classList.add('error');
        field.classList.remove('success');
    } else {
        field.classList.remove('error');
        field.classList.add('success');
    }
}

/**
 * Show form submission message
 */
function showFormMessage(message, type) {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Remove any existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Insert after the form
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

/**
 * Scroll Animation for Elements
 * Simplified to be less flashy and more developer-friendly
 */
function initScrollAnimation() {
    // For a developer-focused site, we're removing animations
    // This function is kept for compatibility but doesn't add animations
    console.log('Scroll animations disabled for developer-focused design');

    // Simply make all elements visible without animations
    const elements = document.querySelectorAll('.feature, .service-item, .team-member, .testimonial, .value');
    elements.forEach(element => {
        element.classList.add('visible');
    });
}

/**
 * Add CSS for animations and form validation
 * This adds the necessary CSS for the JavaScript functionality
 */
(function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Developer-friendly styles */
        .visible {
            display: block;
        }

        /* Blinking cursor effect */
        .blink {
            animation: blink-animation 1s steps(2, start) infinite;
            display: inline-block;
        }

        @keyframes blink-animation {
            to {
                visibility: hidden;
            }
        }

        /* Code-like elements */
        pre, code {
            font-family: 'Source Code Pro', monospace;
            background-color: var(--code-bg);
            color: var(--code-color);
            border-radius: 2px;
            padding: 2px 4px;
            font-size: 0.9em;
        }

        pre {
            padding: 1rem;
            overflow-x: auto;
            border-left: 3px solid var(--secondary-color);
        }

        .comment {
            color: var(--text-light);
            font-family: 'Source Code Pro', monospace;
            font-style: italic;
        }

        /* Form validation styles - simplified */
        .error {
            border-color: #f57f17 !important;
            background-color: rgba(245, 127, 23, 0.05) !important;
        }

        .success {
            border-color: #2e7d32 !important;
        }

        .form-message {
            padding: 8px 12px;
            margin-top: 12px;
            border-radius: 2px;
            font-family: 'Source Code Pro', monospace;
            font-size: 0.9rem;
        }

        .form-message.success {
            background-color: rgba(46, 125, 50, 0.1);
            color: #2e7d32;
            border: 1px solid #2e7d32;
        }

        .form-message.error {
            background-color: rgba(245, 127, 23, 0.1);
            color: #f57f17;
            border: 1px solid #f57f17;
        }
    `;
    document.head.appendChild(styleElement);
})();

/**
 * Load Header and Footer Components
 */
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('includes/header.html');
        const headerHtml = await headerResponse.text();
        const headerPlaceholder = document.createElement('div');
        headerPlaceholder.innerHTML = headerHtml;
        document.body.insertBefore(headerPlaceholder.firstElementChild, document.body.firstChild);

        // Load footer
        const footerResponse = await fetch('includes/footer.html');
        const footerHtml = await footerResponse.text();
        const footerPlaceholder = document.createElement('div');
        footerPlaceholder.innerHTML = footerHtml;
        document.body.insertBefore(footerPlaceholder.firstElementChild, document.querySelector('script[src="js/script.js"]'));

        return Promise.resolve();
    } catch (error) {
        console.error('Error loading components:', error);
        return Promise.reject(error);
    }
}

/**
 * Set Active Navigation Item
 */
function setActiveNavItem() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active class based on current page
    if (currentPage === 'index.html' || currentPage === '') {
        document.getElementById('nav-home').classList.add('active');
    } else if (currentPage === 'about.html') {
        document.getElementById('nav-about').classList.add('active');
    } else if (currentPage === 'services.html') {
        document.getElementById('nav-services').classList.add('active');
    } else if (currentPage === 'contact.html') {
        document.getElementById('nav-contact').classList.add('active');
    }
}

/**
 * Set Current Year in Footer
 */
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize Theme Toggle
 * Handles dark/light mode switching with hacker-style animation
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Determine theme: saved preference or OS-level
    let savedTheme;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {
        savedTheme = null;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        updateToggleIcon(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle dark mode class
            const isDarkMode = body.classList.toggle('dark-mode');

            // Save preference to localStorage
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

            // Update toggle icon
            updateToggleIcon(isDarkMode);

            // Play hacker-style animation
            playHackerAnimation();
        });
    }

    // Update toggle icon based on current theme
    function updateToggleIcon(isDarkMode) {
        const icon = themeToggle.querySelector('i');
        if (isDarkMode) {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-lightbulb';
        }
    }

    // Hacker-style animation during theme transition
    function playHackerAnimation() {
        // Create overlay for the animation
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);

        // Create glitch text element
        const glitchText = document.createElement('div');
        glitchText.className = 'glitch-text';
        glitchText.innerHTML = '<span data-text="PULLING CODE...">PULLING CODE...</span>';
        overlay.appendChild(glitchText);

        // Create matrix code element
        const matrixCode = document.createElement('div');
        matrixCode.className = 'matrix-code';
        overlay.appendChild(matrixCode);

        // Generate more random matrix characters for a denser code effect
        for (let i = 0; i < 80; i++) {
            const char = document.createElement('span');
            char.textContent = getRandomChar();
            char.style.left = `${Math.random() * 100}%`;
            char.style.animationDuration = `${Math.random() * 2 + 1}s`;
            char.style.animationDelay = `${Math.random() * 0.5}s`;

            // Vary the size and opacity for more dynamic effect
            char.style.fontSize = `${Math.random() * 0.5 + 0.8}rem`;
            char.style.opacity = `${Math.random() * 0.5 + 0.5}`;

            matrixCode.appendChild(char);
        }

        // Show animation
        setTimeout(() => {
            overlay.classList.add('active');

            // Add "THEME SWITCHED" text after a delay
            setTimeout(() => {
                glitchText.innerHTML = '<span data-text="complete!!!">complete.</span>';
            }, 1000);

            // Remove overlay after animation completes
            setTimeout(() => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 500);
            }, 2000);
        }, 10);
    }

    // Helper function to generate random matrix-like characters for dark mode
    function getRandomChar() {
        // Use a mix of programming-related characters for dark mode
        // Including: hexadecimal digits, brackets, operators, and common programming symbols
        const chars = '0123456789ABCDEFabcdef{}[]()<>+-*/=&|!~;:,.?_$#@%^\\\'"`';

        // Add some code-like keywords and fragments with low probability
        const codeFragments = ['var', 'let', 'const', 'if', 'else', 'for', 'while', 'function', 'return', 'true', 'false', 'null', 'undefined'];

        // 90% chance to return a single character, 10% chance to return a code fragment
        if (Math.random() < 0.9) {
            return chars.charAt(Math.floor(Math.random() * chars.length));
        } else {
            return codeFragments[Math.floor(Math.random() * codeFragments.length)].charAt(Math.floor(Math.random() * 3));
        }
    }
}

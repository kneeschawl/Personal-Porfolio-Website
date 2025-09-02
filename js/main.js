// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const themeToggle = document.querySelector('.theme-toggle');
const sections = document.querySelectorAll('section');
const typingText = document.querySelector('.typing-text');
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

// Particle Animation Setup
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const particles = [];
const numParticles = 25;
const codeChars = ['{', '}', '(', ')', '<', '>', ';', '=', '&&', '||', '0', '1', 'if', 'else', '=>', '//', '[', ']', 'while', 'return', 'i', '</>', ];

// Aesthetic color palette
const colors = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream
    '#D4A5A5', // Dusty Rose
    '#9B59B6', // Purple
    '#3498DB'  // Blue
];

for (let i = 0; i < numParticles; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        char: codeChars[Math.floor(Math.random() * codeChars.length)],
        fontSize: Math.random() * 10 + 12,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

let mouse = { x: null, y: null };

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    particles.forEach((p) => {
        ctx.font = `${p.fontSize}px monospace`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);

        // Move normally
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // If mouse is close, push particle
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - dist) / 100;
                const pushX = Math.cos(angle) * force * 3;
                const pushY = Math.sin(angle) * force * 3;

                p.vx -= pushX * 0.05;
                p.vy -= pushY * 0.05;
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

// Handle window resize for particles
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

// Typing Effect
function typeText(text, element, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Active section highlighting with improved performance
let ticking = false;
function highlightActiveSection() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollPosition = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            ticking = false;
        });

        ticking = true;
    }
}

// Navbar background change on scroll with blur effect
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'var(--background-color)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
}
// Hamburger Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Dark mode toggle with smooth transition
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDarkMode);
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Form submission handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    
    try {
        // Show loading state
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Send to PHP backend
        const response = await fetch('process.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitButton.style.backgroundColor = '#10B981';
            this.reset();
            
            // Reset button after 2 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.backgroundColor = '';
                submitButton.disabled = false;
            }, 2000);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to send message. Please try again.');
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Function to initialize and display the map
function initMap() {
    // Location coordinates (latitude, longitude) of the office or business
    const location = { lat: 40.748817, lng: -73.985428 }; // Example: New York (Empire State Building)

    // Create a map centered at the location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14, // Zoom level for the map
        center: location,
    });

    // Place a marker on the map at the location
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Our Office Location",
    });
}

// Intersection Observer for fade-in animations with improved performance
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Unobserve after animation is complete
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in animation to sections with staggered delay
sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(section);
});

// Event Listeners with debouncing for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        highlightActiveSection();
        handleNavbarScroll();
    });
});

themeToggle.addEventListener('click', toggleDarkMode);

// Image Loading Handler
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// Initialize
window.addEventListener('load', () => {
    typeText('Nischal Gyawali', typingText, 100);
    checkDarkModePreference();
    handleNavbarScroll();
    animateParticles();
    handleImageLoading();
}); 

// Prevent right-click on images
document.querySelectorAll('.no-right-click').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});


// ReWear - Modern Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReWear modern enhanced version initialized!');

    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1200,
        easing: 'ease-in-out-cubic',
        once: true,
        mirror: false,
        offset: 100
    });

    // Initialize Swiper
    const itemsSwiper = new Swiper('.items-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
        effect: 'slide',
        speed: 800,
    });

    // Navigation scroll effect
    const navbar = document.getElementById('mainNavbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Counter Animation for Stats
    function animateCounter(element, target, duration = 2500) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Animate stats when they come into view
    const statNumbers = document.querySelectorAll('[data-count]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // 3D Fashion Showcase Animation
    const showcaseItems = document.querySelectorAll('.showcase-item');
    showcaseItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 2}s`;
        
        // Add hover effect with 3D transform
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(15deg) rotateX(10deg)';
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
            this.style.zIndex = '1';
        });
    });

    // Feature cards hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Step cards hover effects
    document.querySelectorAll('.step-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });

    // Item cards hover effects with 3D
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
        });
    });

    // Impact cards animation
    document.querySelectorAll('.impact-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Modal Functionality
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    // Password toggle functionality for modals
    function setupPasswordToggle(toggleBtn, inputField) {
        if (!toggleBtn || !inputField) return;
        
        toggleBtn.addEventListener('click', function() {
            const type = inputField.type === 'password' ? 'text' : 'password';
            inputField.type = type;
            
            const icon = toggleBtn.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // Setup password toggles
    setupPasswordToggle(document.getElementById('loginPasswordToggle'), document.getElementById('loginPassword'));
    setupPasswordToggle(document.getElementById('signupPasswordToggle'), document.getElementById('signupPassword'));
    setupPasswordToggle(document.getElementById('confirmPasswordToggle'), document.getElementById('confirmPassword'));

    // Enhanced form validation
    const validators = {
        firstName: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/
        },
        lastName: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/
        },
        signupEmail: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        loginEmail: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        signupPassword: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        },
        loginPassword: {
            required: true
        },
        confirmPassword: {
            required: true,
            match: 'signupPassword'
        }
    };

    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        const field = document.getElementById(fieldName);
        
        if (!field || !validator) return true;
        
        // Clear previous states
        field.classList.remove('is-valid', 'is-invalid');

        // Required validation
        if (validator.required && !value.trim()) {
            field.classList.add('is-invalid');
            return false;
        }

        // Skip further validation if not required and empty
        if (!validator.required && !value.trim()) {
            return true;
        }

        // Min length validation
        if (validator.minLength && value.length < validator.minLength) {
            field.classList.add('is-invalid');
            return false;
        }

        // Max length validation
        if (validator.maxLength && value.length > validator.maxLength) {
            field.classList.add('is-invalid');
            return false;
        }

        // Pattern validation
        if (validator.pattern && !validator.pattern.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }

        // Match validation
        if (validator.match) {
            const matchField = document.getElementById(validator.match);
            if (value !== matchField.value) {
                field.classList.add('is-invalid');
                return false;
            }
        }

        // Success state
        field.classList.add('is-valid');
        return true;
    }

    // Real-time form validation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function() {
            const fieldName = this.id;
            const value = this.value;
            validateField(fieldName, value);
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validate fields
            let isValid = true;
            if (!validateField('loginEmail', email)) isValid = false;
            if (!validateField('loginPassword', password)) isValid = false;

            if (!isValid) {
                showToast('Please fix the errors in the form', 'error');
                return;
            }

            // Simulate login with loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...';
            submitBtn.disabled = true;

            showToast('Signing you in...', 'info');
            
            setTimeout(() => {
                showToast('Welcome back! Redirecting to dashboard...', 'success');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(loginModal);
                    modal.hide();
                }, 2000);
            }, 2000);
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Validate fields
            let isValid = true;
            if (!validateField('firstName', firstName)) isValid = false;
            if (!validateField('lastName', lastName)) isValid = false;
            if (!validateField('signupEmail', email)) isValid = false;
            if (!validateField('signupPassword', password)) isValid = false;
            if (!validateField('confirmPassword', confirmPassword)) isValid = false;

            if (!agreeTerms) {
                showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
                isValid = false;
            }

            if (!isValid) {
                showToast('Please fix the errors in the form', 'error');
                return;
            }

            // Simulate signup with loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
            submitBtn.disabled = true;

            showToast('Creating your account...', 'info');
            
            setTimeout(() => {
                showToast('Account created successfully! Welcome to ReWear!', 'success');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(signupModal);
                    modal.hide();
                }, 2000);
            }, 2000);
        });
    }

    // Google OAuth buttons
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        if (btn.textContent.includes('Google')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showToast('Google OAuth integration coming soon!', 'info');
            });
        }
    });

    // Enhanced Toast notification system
    window.showToast = function(message, type = 'info', duration = 5000) {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    type === 'warning' ? 'fas fa-exclamation-triangle' :
                    'fas fa-info-circle';
        
        const bgColor = type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                       type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                       type === 'warning' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                       'linear-gradient(135deg, #3b82f6, #2563eb)';
        
        toast.innerHTML = `
            <div class="toast-header" style="background: ${bgColor}">
                <i class="${icon} me-2"></i>
                <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, duration);
    };

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    // Enhanced item card interactions
    document.querySelectorAll('.item-card .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const itemName = this.closest('.item-card').querySelector('.item-title').textContent;
            
            if (this.textContent.includes('View Details')) {
                showToast(`Viewing details for ${itemName}`, 'info');
            } else if (this.textContent.includes('Swap')) {
                showToast(`Swap request sent for ${itemName}`, 'success');
            } else if (this.textContent.includes('Redeem')) {
                showToast(`Redeeming ${itemName} with points`, 'info');
            }
        });
    });

    // Social media links
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.includes('facebook') ? 'Facebook' :
                           this.querySelector('i').className.includes('twitter') ? 'Twitter' :
                           this.querySelector('i').className.includes('instagram') ? 'Instagram' :
                           this.querySelector('i').className.includes('linkedin') ? 'LinkedIn' : 'Social Media';
            showToast(`${platform} link coming soon!`, 'info');
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Mobile menu toggle with animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
            
            // Animate navbar items
            const navItems = navbarCollapse.querySelectorAll('.nav-item');
            navItems.forEach((item, index) => {
                if (navbarCollapse.classList.contains('show')) {
                    item.style.animation = `slideInDown 0.3s ease forwards ${index * 0.1}s`;
                } else {
                    item.style.animation = 'none';
                }
            });
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }

    // Add CSS for enhanced animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .navbar {
            transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .item-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .item-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .item-card:hover .item-overlay {
            opacity: 1;
        }
        
        .item-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .form-control.is-valid {
            border-color: var(--success-color);
            background-color: rgba(16, 185, 129, 0.05);
        }
        
        .form-control.is-invalid {
            border-color: var(--danger-color);
            background-color: rgba(239, 68, 68, 0.05);
        }
        
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .toast {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-xl);
            border: none;
            margin-bottom: 1rem;
            min-width: 300px;
            transition: all 0.3s ease;
        }
        
        .toast.show {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .showcase-item {
            transition: all 0.3s ease;
        }
        
        .step-card {
            transition: all 0.3s ease;
        }
        
        .btn {
            transition: all 0.3s ease;
        }
        
        .feature-card {
            transition: all 0.3s ease;
        }
        
        .impact-card {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Scroll-based animations can go here
    }, 16);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Accessibility improvements
    document.addEventListener('keydown', function(e) {
        // Skip to main content
        if (e.key === 'Tab' && e.target === document.body) {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
            if (mainContent) {
                mainContent.focus();
            }
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modalInstance = bootstrap.Modal.getInstance(openModal);
                modalInstance.hide();
            }
        }
    });

    // Add focus indicators for keyboard navigation
    document.querySelectorAll('a, button, input, textarea, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Initialize tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Particle animation for hero section
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 6s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        const heroParticles = document.querySelector('.hero-particles');
        if (heroParticles) {
            heroParticles.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 6000);
        }
    }

    // Create particles periodically
    setInterval(createParticle, 2000);

    // Add particle animation CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) scale(0);
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    console.log('ReWear modern enhanced with dynamic interactions, 3D effects, and advanced animations!');
}); 
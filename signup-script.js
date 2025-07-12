// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const signupForm = document.getElementById('signupForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');
    const toastContainer = document.getElementById('toastContainer');

    // Password Toggle Functionality
    function setupPasswordToggle(toggleBtn, inputField) {
        toggleBtn.addEventListener('click', function() {
            const type = inputField.type === 'password' ? 'text' : 'password';
            inputField.type = type;
            
            const icon = toggleBtn.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            
            // Add animation
            toggleBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                toggleBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }

    setupPasswordToggle(passwordToggle, passwordInput);
    setupPasswordToggle(confirmPasswordToggle, confirmPasswordInput);

    // Form Validation
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
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        },
        confirmPassword: {
            required: true,
            match: 'password'
        },
        location: {
            required: false,
            maxLength: 100
        }
    };

    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        const field = document.getElementById(fieldName);
        const feedback = field.parentNode.querySelector('.form-feedback');
        
        // Clear previous states
        field.classList.remove('is-valid', 'is-invalid');
        feedback.textContent = '';
        feedback.className = 'form-feedback';

        // Required validation
        if (validator.required && !value.trim()) {
            showFieldError(field, feedback, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }

        // Skip further validation if not required and empty
        if (!validator.required && !value.trim()) {
            return true;
        }

        // Min length validation
        if (validator.minLength && value.length < validator.minLength) {
            showFieldError(field, feedback, `Minimum ${validator.minLength} characters required`);
            return false;
        }

        // Max length validation
        if (validator.maxLength && value.length > validator.maxLength) {
            showFieldError(field, feedback, `Maximum ${validator.maxLength} characters allowed`);
            return false;
        }

        // Pattern validation
        if (validator.pattern && !validator.pattern.test(value)) {
            let message = 'Invalid format';
            if (fieldName === 'email') message = 'Please enter a valid email address';
            if (fieldName === 'password') message = 'Password must contain uppercase, lowercase, number, and special character';
            if (fieldName === 'firstName' || fieldName === 'lastName') message = 'Only letters and spaces allowed';
            showFieldError(field, feedback, message);
            return false;
        }

        // Match validation
        if (validator.match) {
            const matchField = document.getElementById(validator.match);
            if (value !== matchField.value) {
                showFieldError(field, feedback, 'Passwords do not match');
                return false;
            }
        }

        // Success state
        showFieldSuccess(field, feedback);
        return true;
    }

    function showFieldError(field, feedback, message) {
        field.classList.add('is-invalid');
        feedback.textContent = message;
        feedback.className = 'form-feedback error';
        
        // Add shake animation
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);
    }

    function showFieldSuccess(field, feedback) {
        field.classList.add('is-valid');
        feedback.textContent = '✓ Valid';
        feedback.className = 'form-feedback success';
    }

    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => {
                validateField(fieldName, field.value);
            });
            
            field.addEventListener('input', () => {
                // Clear error state on input
                if (field.classList.contains('is-invalid')) {
                    field.classList.remove('is-invalid');
                    const feedback = field.parentNode.querySelector('.form-feedback');
                    feedback.textContent = '';
                    feedback.className = 'form-feedback';
                }
            });
        }
    });

    // Form Submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        Object.keys(validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !validateField(fieldName, field.value)) {
                isValid = false;
            }
        });

        // Check terms agreement
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            showToast('Please agree to the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }

        if (!isValid) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading state
        signupBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            signupBtn.classList.remove('loading');
            
            // Success simulation
            showToast('Account created successfully! Welcome to ReWear!', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 2000);
    });

    // Toast Notification System
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';
        
        toast.innerHTML = `
            <div class="toast-header">
                <i class="${icon} me-2"></i>
                <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            signupForm.dispatchEvent(new Event('submit'));
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            signupForm.reset();
            // Clear validation states
            document.querySelectorAll('.form-control').forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
                const feedback = field.parentNode.querySelector('.form-feedback');
                if (feedback) {
                    feedback.textContent = '';
                    feedback.className = 'form-feedback';
                }
            });
        }
    });

    // Social Login Buttons
    document.querySelectorAll('.social-buttons .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.textContent.trim();
            showToast(`${provider} login coming soon!`, 'info');
        });
    });

    // Floating Elements Animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        
        // Add hover effect
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(15deg)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Stats Cards Animation
    const statCards = document.querySelectorAll('.stat-card');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    statCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Feature Items Animation
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 1000 + (index * 200));
    });

    // Form Focus Effects
    document.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .form-group.focused .form-label {
            color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .form-group.focused .form-label i {
            transform: scale(1.1);
        }
        
        .form-label i {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Initialize tooltips for better UX
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    console.log('ReWear Signup Page initialized successfully!');
}); 
// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all login components
    initLoginForm();
    initPasswordToggle();
    initSocialButtons();
    initFormValidation();
    initAnimations();
    initToastSystem();
});

// Login Form Handler
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// Handle Login Process
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate form
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Show loading state
    setLoginLoading(true);
    
    try {
        // Simulate API call
        await simulateLoginAPI(email, password, rememberMe);
        
        // Success
        showToast('Login successful! Redirecting...', 'success');
        
        // Store user data (in real app, this would be from API response)
        if (rememberMe) {
            localStorage.setItem('userEmail', email);
        }
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        }, 1500);
        
    } catch (error) {
        // Error handling
        showToast(error.message || 'Login failed. Please try again.', 'error');
        setLoginLoading(false);
    }
}

// Form Validation
function validateLoginForm(email, password) {
    let isValid = true;
    
    // Email validation
    if (!email || !isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    // Password validation
    if (!password || password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearFieldError('password');
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.form-feedback');
    
    field.classList.remove('is-valid');
    field.classList.add('is-invalid', 'shake');
    feedback.classList.remove('valid');
    feedback.classList.add('invalid');
    feedback.textContent = message;
    
    // Remove shake animation after it completes
    setTimeout(() => {
        field.classList.remove('shake');
    }, 500);
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.form-feedback');
    
    field.classList.remove('is-invalid');
    field.classList.add('is-valid', 'success');
    feedback.classList.remove('invalid');
    feedback.classList.add('valid');
    feedback.textContent = '✓ Valid';
    
    // Remove success animation after it completes
    setTimeout(() => {
        field.classList.remove('success');
    }, 500);
}

// Password Toggle
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.className = 'fas fa-eye-slash';
                this.classList.add('active');
            } else {
                icon.className = 'fas fa-eye';
                this.classList.remove('active');
            }
        });
    }
}

// Social Login Buttons
function initSocialButtons() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('google');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('facebook');
        });
    }
}

// Handle Social Login
function handleSocialLogin(provider) {
    showToast(`Connecting to ${provider}...`, 'info');
    
    // Simulate social login
    setTimeout(() => {
        showToast(`${provider} login successful!`, 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

// Form Validation with Real-time Feedback
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Email validation on input
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = this.value;
            if (email && !isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
            } else if (email && isValidEmail(email)) {
                clearFieldError('email');
            } else {
                clearFieldValidation('email');
            }
        });
        
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            if (email && !isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
            }
        });
    }
    
    // Password validation on input
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            if (password && password.length < 6) {
                showFieldError('password', 'Password must be at least 6 characters');
            } else if (password && password.length >= 6) {
                clearFieldError('password');
            } else {
                clearFieldValidation('password');
            }
        });
        
        passwordInput.addEventListener('blur', function() {
            const password = this.value;
            if (password && password.length < 6) {
                showFieldError('password', 'Password must be at least 6 characters');
            }
        });
    }
}

// Clear field validation
function clearFieldValidation(fieldId) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.form-feedback');
    
    field.classList.remove('is-valid', 'is-invalid');
    feedback.classList.remove('valid', 'invalid');
    feedback.textContent = '';
}

// Set Login Loading State
function setLoginLoading(loading) {
    const loginBtn = document.getElementById('loginBtn');
    
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Simulate Login API Call
function simulateLoginAPI(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate different scenarios
            if (email === 'demo@rewear.com' && password === 'password123') {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        email: email,
                        name: 'Demo User',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                    }
                });
            } else if (email === 'error@example.com') {
                reject(new Error('Invalid credentials'));
            } else {
                // For demo purposes, accept any valid email/password combination
                if (isValidEmail(email) && password.length >= 6) {
                    resolve({
                        success: true,
                        user: {
                            id: Math.floor(Math.random() * 1000),
                            email: email,
                            name: email.split('@')[0],
                            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                        }
                    });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }
        }, 1500); // Simulate 1.5 second delay
    });
}

// Toast Notification System
function initToastSystem() {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

// Show Toast Message
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// Animations
function initAnimations() {
    // Animate form elements on page load
    const formElements = document.querySelectorAll('.form-group, .social-login, .login-footer');
    
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Animate floating shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.opacity = '0';
        shape.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            shape.style.transition = 'all 0.8s ease';
            shape.style.opacity = '1';
            shape.style.transform = 'scale(1) rotate(0deg)';
        }, 500 + (index * 200));
    });
    
    // Animate stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            stat.style.transition = 'all 0.6s ease';
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 1000 + (index * 200));
    });
}

// Auto-fill demo credentials
function fillDemoCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'demo@rewear.com';
        passwordInput.value = 'password123';
        
        // Trigger validation
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            clearAllValidation();
        }
    }
    
    // F1 to fill demo credentials
    if (e.key === 'F1') {
        e.preventDefault();
        fillDemoCredentials();
    }
});

// Clear all validation
function clearAllValidation() {
    const fields = ['email', 'password'];
    fields.forEach(fieldId => {
        clearFieldValidation(fieldId);
    });
}

// Check for saved email
function checkSavedEmail() {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = savedEmail;
            const rememberMe = document.getElementById('rememberMe');
            if (rememberMe) {
                rememberMe.checked = true;
            }
        }
    }
}

// Initialize saved email check
checkSavedEmail();

// Form focus effects
document.addEventListener('focusin', function(e) {
    if (e.target.classList.contains('form-control')) {
        e.target.parentNode.classList.add('focused');
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.classList.contains('form-control')) {
        e.target.parentNode.classList.remove('focused');
    }
});

// Prevent form submission on Enter in textareas (if any)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA') {
        e.stopPropagation();
    }
});

// Export functions for global access
window.LoginPage = {
    showToast,
    fillDemoCredentials,
    validateLoginForm,
    handleLogin
};

// Demo mode indicator
if (window.location.search.includes('demo=true')) {
    showToast('Demo mode activated! Use demo@rewear.com / password123', 'info');
    setTimeout(() => {
        fillDemoCredentials();
    }, 1000);
} 
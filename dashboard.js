// ReWear Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize Chart.js
    initializeMonthlyChart();
    
    // Initialize dashboard functionality
    initializeDashboard();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize swap filters
    initializeSwapFilters();
    
    // Initialize interactive elements
    initializeInteractiveElements();
});

// Initialize Monthly Chart
function initializeMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Swaps Completed',
            data: [12, 19, 15, 25, 22, 30],
            backgroundColor: 'rgba(5, 150, 105, 0.2)',
            borderColor: 'rgba(5, 150, 105, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }, {
            label: 'Points Earned',
            data: [800, 1200, 1000, 1800, 1600, 2200],
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: monthlyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

// Initialize Dashboard
function initializeDashboard() {
    // Animate stat numbers
    animateStatNumbers();
    
    // Initialize real-time updates
    initializeRealTimeUpdates();
    
    // Initialize notifications
    initializeNotifications();
}

// Animate Stat Numbers
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent.replace(/,/g, ''));
                animateNumber(target, 0, finalValue, 2000);
                observer.unobserve(target);
            }
        });
    });

    statNumbers.forEach(stat => observer.observe(stat));
}

// Animate Number Function
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    const change = end - start;

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (change * easeOut);
        
        element.textContent = Math.floor(currentValue).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Initialize Real-time Updates
function initializeRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateRandomStat();
    }, 30000);
}

// Update Random Stat
function updateRandomStat() {
    const stats = [
        { selector: '.stat-card-dashboard:nth-child(1) .stat-number', change: Math.floor(Math.random() * 50) + 10 },
        { selector: '.stat-card-dashboard:nth-child(2) .stat-number', change: Math.floor(Math.random() * 3) + 1 },
        { selector: '.stat-card-dashboard:nth-child(3) .stat-number', change: Math.floor(Math.random() * 2) },
        { selector: '.stat-card-dashboard:nth-child(4) .stat-number', change: (Math.random() * 5).toFixed(1) }
    ];

    const randomStat = stats[Math.floor(Math.random() * stats.length)];
    const element = document.querySelector(randomStat.selector);
    
    if (element) {
        const currentValue = parseFloat(element.textContent.replace(/,/g, ''));
        const newValue = currentValue + randomStat.change;
        
        // Animate the change
        animateNumber(element, currentValue, newValue, 1000);
        
        // Update the change indicator
        updateChangeIndicator(element.closest('.stat-card-dashboard'), randomStat.change);
    }
}

// Update Change Indicator
function updateChangeIndicator(statCard, change) {
    const changeElement = statCard.querySelector('.stat-change');
    if (changeElement) {
        changeElement.innerHTML = `<i class="fas fa-arrow-up"></i> +${change} this update`;
        changeElement.className = 'stat-change positive';
        
        // Reset after 5 seconds
        setTimeout(() => {
            changeElement.innerHTML = `<i class="fas fa-minus"></i> No change`;
            changeElement.className = 'stat-change neutral';
        }, 5000);
    }
}

// Initialize Form Handlers
function initializeFormHandlers() {
    // Upload Item Form
    const uploadForm = document.getElementById('uploadItemForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadItem);
    }

    // Edit Profile Form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleEditProfile);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle Upload Item
function handleUploadItem(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const itemData = {
        name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
        category: formData.get('category') || e.target.querySelector('select').value,
        condition: formData.get('condition') || e.target.querySelectorAll('select')[1].value,
        description: formData.get('description') || e.target.querySelector('textarea').value,
        points: formData.get('points') || e.target.querySelector('input[type="number"]').value
    };

    // Simulate API call
    showLoadingState(e.target);
    
    setTimeout(() => {
        hideLoadingState(e.target);
        showSuccessToast('Item uploaded successfully!');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadItemModal'));
        modal.hide();
        
        // Reset form
        e.target.reset();
        
        // Refresh items list (in real app, this would fetch new data)
        setTimeout(() => {
            location.reload();
        }, 1000);
    }, 2000);
}

// Handle Edit Profile
function handleEditProfile(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profileData = {
        name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
        email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
        location: formData.get('location') || e.target.querySelectorAll('input[type="text"]')[1].value,
        bio: formData.get('bio') || e.target.querySelector('textarea').value
    };

    // Simulate API call
    showLoadingState(e.target);
    
    setTimeout(() => {
        hideLoadingState(e.target);
        showSuccessToast('Profile updated successfully!');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();
        
        // Update profile display
        updateProfileDisplay(profileData);
    }, 1500);
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();
    
    showConfirmDialog('Are you sure you want to logout?', () => {
        showLoadingToast('Logging out...');
        
        setTimeout(() => {
            // Redirect to home page
            window.location.href = 'index.html';
        }, 1000);
    });
}

// Initialize Swap Filters
function initializeSwapFilters() {
    const filterButtons = document.querySelectorAll('.swap-filters .btn');
    const swapItems = document.querySelectorAll('.swap-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter swap items
            swapItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize Interactive Elements
function initializeInteractiveElements() {
    // Item action buttons
    initializeItemActions();
    
    // Swap action buttons
    initializeSwapActions();
    
    // Search functionality
    initializeSearch();
    
    // Tooltips
    initializeTooltips();
}

// Initialize Item Actions
function initializeItemActions() {
    const editButtons = document.querySelectorAll('.item-actions .btn-outline-primary');
    const removeButtons = document.querySelectorAll('.item-actions .btn-outline-danger');
    
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const itemCard = button.closest('.item-card-dashboard');
            const itemTitle = itemCard.querySelector('.item-title').textContent;
            showInfoToast(`Editing ${itemTitle}...`);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const itemCard = button.closest('.item-card-dashboard');
            const itemTitle = itemCard.querySelector('.item-title').textContent;
            
            showConfirmDialog(`Are you sure you want to remove "${itemTitle}"?`, () => {
                itemCard.style.opacity = '0.5';
                showLoadingToast('Removing item...');
                
                setTimeout(() => {
                    itemCard.remove();
                    showSuccessToast('Item removed successfully!');
                }, 1000);
            });
        });
    });
}

// Initialize Swap Actions
function initializeSwapActions() {
    const acceptButtons = document.querySelectorAll('.swap-actions .btn-success');
    const declineButtons = document.querySelectorAll('.swap-actions .btn-outline-danger');
    const messageButtons = document.querySelectorAll('.swap-actions .btn-outline-secondary');
    
    acceptButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const swapItem = button.closest('.swap-item');
            const swapId = swapItem.querySelector('.swap-id').textContent;
            
            showConfirmDialog('Accept this swap?', () => {
                swapItem.style.opacity = '0.5';
                showLoadingToast('Processing swap...');
                
                setTimeout(() => {
                    swapItem.querySelector('.swap-status').textContent = 'Completed';
                    swapItem.querySelector('.swap-status').className = 'swap-status completed';
                    swapItem.style.opacity = '1';
                    showSuccessToast('Swap accepted successfully!');
                }, 1500);
            });
        });
    });
    
    declineButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const swapItem = button.closest('.swap-item');
            const swapId = swapItem.querySelector('.swap-id').textContent;
            
            showConfirmDialog('Decline this swap?', () => {
                swapItem.style.opacity = '0.5';
                showLoadingToast('Declining swap...');
                
                setTimeout(() => {
                    swapItem.remove();
                    showSuccessToast('Swap declined successfully!');
                }, 1000);
            });
        });
    });
    
    messageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const swapItem = button.closest('.swap-item');
            const partnerName = swapItem.querySelector('.swap-partner span').textContent;
            showInfoToast(`Opening chat with ${partnerName}...`);
        });
    });
}

// Initialize Search
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.form-control[type="text"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search functionality here
            console.log('Searching for:', searchTerm);
        }, 300));
    });
}

// Initialize Tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize Notifications
function initializeNotifications() {
    // Check for new notifications every minute
    setInterval(() => {
        checkForNotifications();
    }, 60000);
}

// Check for Notifications
function checkForNotifications() {
    // Simulate checking for new notifications
    const hasNewNotifications = Math.random() > 0.7;
    
    if (hasNewNotifications) {
        showInfoToast('You have new swap requests!');
    }
}

// Utility Functions
function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    // Store original text for restoration
    submitBtn.setAttribute('data-original-text', originalText);
}

function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.getAttribute('data-original-text');
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
}

function updateProfileDisplay(profileData) {
    const profileName = document.querySelector('.profile-name');
    const profileDetails = document.querySelectorAll('.detail-value');
    
    if (profileName) profileName.textContent = profileData.name;
    
    // Update email in profile details
    if (profileDetails[0]) profileDetails[0].textContent = profileData.email;
    
    // Update location in profile details
    if (profileDetails[1]) profileDetails[1].textContent = profileData.location;
}

// Toast Notifications
function showSuccessToast(message) {
    showToast(message, 'success', 'fas fa-check-circle');
}

function showErrorToast(message) {
    showToast(message, 'danger', 'fas fa-exclamation-circle');
}

function showInfoToast(message) {
    showToast(message, 'info', 'fas fa-info-circle');
}

function showLoadingToast(message) {
    showToast(message, 'warning', 'fas fa-spinner fa-spin');
}

function showToast(message, type, icon) {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast show bg-${type} text-white`;
    toast.innerHTML = `
        <div class="toast-header bg-${type} text-white border-0">
            <i class="${icon} me-2"></i>
            <strong class="me-auto">ReWear</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Confirmation Dialog
function showConfirmDialog(message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'modal fade';
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Action</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary confirm-btn">Confirm</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    const modal = new bootstrap.Modal(dialog);
    modal.show();
    
    const confirmBtn = dialog.querySelector('.confirm-btn');
    confirmBtn.addEventListener('click', () => {
        modal.hide();
        onConfirm();
        
        // Remove modal from DOM after hiding
        dialog.addEventListener('hidden.bs.modal', () => {
            dialog.remove();
        });
    });
    
    // Remove modal from DOM if cancelled
    dialog.addEventListener('hidden.bs.modal', () => {
        dialog.remove();
    });
}

// Debounce Function
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

// Export functions for global access
window.dashboardUtils = {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showLoadingToast,
    showConfirmDialog
}; 
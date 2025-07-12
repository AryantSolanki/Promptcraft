// Dynamic Item Detail JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Load items from localStorage
    function getItemsFromStorage() {
        try {
            const storedItems = JSON.parse(localStorage.getItem('rewear_items') || '[]');
            const itemsDatabase = {};
            
            storedItems.forEach(item => {
                // Convert item format to match expected structure
                itemsDatabase[item.id] = {
                    id: item.id,
                    title: item.title,
                    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
                    condition: item.condition.charAt(0).toUpperCase() + item.condition.slice(1) + ' Condition',
                    points: item.price || 0,
                    description: item.description,
                    images: item.images || ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
                    specs: {
                        brand: item.tags ? item.tags.split(',')[0] : 'Brand',
                        size: item.size,
                        color: 'Various',
                        material: 'Mixed Materials',
                        condition: item.condition
                    },
                    uploader: item.uploader || {
                        name: 'Sarah Johnson',
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face',
                        level: 'Eco Warrior',
                        rating: 5.0,
                        reviews: 100
                    },
                    impact: {
                        co2: '2.0 kg',
                        water: '6,000L',
                        waste: '1.0 kg'
                    },
                    status: item.status || 'available'
                };
            });
            
            return itemsDatabase;
        } catch (error) {
            console.error('Error loading items from storage:', error);
            return {};
        }
    }

    const itemsDatabase = getItemsFromStorage();

    // Get item ID from URL parameters
    function getItemIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('item') || 'vintage-denim-jacket'; // Default fallback
    }

    // Load item data
    function loadItemData(itemId) {
        const item = itemsDatabase[itemId];
        if (!item) {
            showError('Item not found');
            return;
        }

        // Update page title
        document.title = `${item.title} - ReWear | Sustainable Fashion Exchange`;

        // Update breadcrumbs
        document.getElementById('itemNameBreadcrumb').textContent = item.title;
        document.getElementById('categoryLink').textContent = item.category;
        document.getElementById('categoryLink').href = `index.html#${item.category.toLowerCase()}`;

        // Update main content
        document.getElementById('itemTitle').textContent = item.title;
        document.getElementById('itemCategory').innerHTML = `<i class="fas fa-tshirt me-2"></i>${item.category}`;
        document.getElementById('itemCondition').innerHTML = `<i class="fas fa-star me-2"></i>${item.condition}`;
        document.getElementById('pointsValue').textContent = item.points;
        document.getElementById('itemDescription').textContent = item.description;

        // Update status badge
        const statusBadge = document.getElementById('statusBadge');
        if (item.status === 'available') {
            statusBadge.className = 'item-status-badge-modern available mb-3';
            statusBadge.innerHTML = '<i class="fas fa-check-circle me-2"></i>Available for Swap/Redemption';
        } else {
            statusBadge.className = 'item-status-badge-modern unavailable mb-3';
            statusBadge.innerHTML = '<i class="fas fa-times-circle me-2"></i>No Longer Available';
        }

        // Update uploader info
        document.getElementById('uploaderName').textContent = item.uploader.name;
        document.getElementById('uploaderLevel').textContent = item.uploader.level;
        document.getElementById('uploaderAvatar').src = item.uploader.avatar;
        document.getElementById('uploaderAvatar').alt = item.uploader.name;
        document.getElementById('modalUploaderName').textContent = item.uploader.name;

        // Update rating
        const ratingElement = document.getElementById('uploaderRating');
        const stars = ratingElement.querySelectorAll('i');
        const ratingText = ratingElement.querySelector('span');
        
        stars.forEach((star, index) => {
            if (index < Math.floor(item.uploader.rating)) {
                star.className = 'fas fa-star';
            } else if (index === Math.floor(item.uploader.rating) && item.uploader.rating % 1 > 0) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
        });
        ratingText.textContent = `${item.uploader.rating} (${item.uploader.reviews} reviews)`;

        // Update specifications
        const specsContainer = document.getElementById('itemSpecs');
        specsContainer.innerHTML = '';
        Object.entries(item.specs).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item-modern';
            specItem.innerHTML = `
                <span class="spec-label-modern">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span class="spec-value-modern">${value}</span>
            `;
            specsContainer.appendChild(specItem);
        });

        // Update impact data
        document.getElementById('co2Saved').textContent = item.impact.co2;
        document.getElementById('waterSaved').textContent = item.impact.water;
        document.getElementById('wasteDiverted').textContent = item.impact.waste;

        // Update modal points
        document.getElementById('modalPointsRequired').textContent = `${item.points} Points`;
        document.getElementById('modalPointsRemaining').textContent = `${2450 - item.points} Points`;

        // Show badge if exists
        if (item.badge) {
            document.getElementById('badgeText').textContent = item.badge;
            document.getElementById('itemBadge').style.display = 'block';
        } else {
            document.getElementById('itemBadge').style.display = 'none';
        }

        // Load images
        loadImages(item.images);

        // Load related items
        loadRelatedItems(itemId);

        // Load swap items
        loadSwapItems();

        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('itemContent').style.display = 'block';
    }

    // Load images and thumbnails
    function loadImages(images) {
        const mainImage = document.getElementById('mainImage');
        const thumbnailWrapper = document.getElementById('thumbnailWrapper');
        const lightboxGallery = document.getElementById('lightboxGallery');

        // Set main image
        mainImage.src = images[0];
        mainImage.alt = document.getElementById('itemTitle').textContent;

        // Clear existing thumbnails
        thumbnailWrapper.innerHTML = '';
        lightboxGallery.innerHTML = '';

        // Create thumbnails and lightbox links
        images.forEach((image, index) => {
            // Thumbnail
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="thumbnail-item-modern ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index})">
                    <img src="${image.replace('w=800&h=600', 'w=150&h=150')}" alt="View ${index + 1}">
                </div>
            `;
            thumbnailWrapper.appendChild(slide);

            // Lightbox link
            const lightboxLink = document.createElement('a');
            lightboxLink.href = image.replace('w=800&h=600', 'w=1200&h=900');
            lightboxLink.setAttribute('data-lightbox', 'item-gallery');
            lightboxLink.setAttribute('data-title', `${document.getElementById('itemTitle').textContent} - View ${index + 1}`);
            lightboxGallery.appendChild(lightboxLink);
        });

        // Initialize Swiper
        initializeThumbnailSwiper();
    }

    // Initialize thumbnail swiper
    function initializeThumbnailSwiper() {
        const thumbnailSwiper = new Swiper('.thumbnail-swiper-modern', {
            slidesPerView: 4,
            spaceBetween: 15,
            navigation: {
                nextEl: '.swiper-button-next-modern',
                prevEl: '.swiper-button-prev-modern',
            },
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 15
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 15
                }
            }
        });
    }

    // Load related items
    function loadRelatedItems(currentItemId) {
        const relatedContainer = document.getElementById('relatedItems');
        const currentItem = itemsDatabase[currentItemId];
        
        // Get related items (excluding current item)
        const relatedItems = Object.values(itemsDatabase)
            .filter(item => item.id !== currentItemId)
            .slice(0, 4);

        relatedContainer.innerHTML = '';

        relatedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'col-lg-3 col-md-6 mb-4';
            itemElement.innerHTML = `
                <div class="related-item-modern">
                    <div class="related-image-modern">
                        <img src="${item.images[0].replace('w=800&h=600', 'w=300&h=400')}" alt="${item.title}">
                        <div class="related-overlay-modern">
                            <button class="btn-modern btn-light-modern btn-sm" onclick="navigateToItem('${item.id}')">View Details</button>
                        </div>
                    </div>
                    <div class="related-content-modern">
                        <h5>${item.title}</h5>
                        <p class="related-points-modern">${item.points} Points</p>
                    </div>
                </div>
            `;
            relatedContainer.appendChild(itemElement);
        });
    }

    // Load swap items
    function loadSwapItems() {
        const swapContainer = document.getElementById('swapItemsContainer');
        const userItems = [
            {
                id: 1,
                title: 'Summer Dress',
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
                points: 350
            },
            {
                id: 2,
                title: 'Leather Bag',
                image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop',
                points: 520
            }
        ];

        swapContainer.innerHTML = '';

        userItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'swap-item-modern';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="swap-item-info-modern">
                    <h6>${item.title}</h6>
                    <p>${item.points} Points</p>
                </div>
                <input type="radio" name="swapItem" value="${item.id}">
            `;
            swapContainer.appendChild(itemElement);
        });
    }

    // Global functions
    window.changeMainImage = function(index) {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-item-modern');
        const currentItem = itemsDatabase[getItemIdFromURL()];
        
        if (currentItem && currentItem.images[index]) {
            // Add fade out effect
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = currentItem.images[index];
                mainImage.style.opacity = '1';
            }, 150);

            // Update active thumbnail
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }
    };

    window.openLightbox = function(index) {
        const lightboxLinks = document.querySelectorAll('#lightboxGallery a');
        if (lightboxLinks[index]) {
            lightboxLinks[index].click();
        }
    };

    window.navigateToItem = function(itemId) {
        window.location.href = `item-detail.html?item=${itemId}`;
    };

    // Error handling
    function showError(message) {
        const loadingState = document.getElementById('loadingState');
        loadingState.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                <h3 class="mt-3">${message}</h3>
                <button class="btn-modern btn-primary-modern mt-3" onclick="window.location.href='index.html'">
                    <i class="fas fa-home me-2"></i>Go Home
                </button>
            </div>
        `;
    }

    // Enhanced button interactions
    const modernButtons = document.querySelectorAll('.btn-modern');
    modernButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Glassmorphism effect for cards
    const glassCards = document.querySelectorAll('.item-gallery-modern, .item-info-modern, .uploader-card-modern, .impact-card-modern, .related-item-modern');
    
    glassCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
    });

    // Animated background effects
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });

    // Parallax effect for background gradients
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.bg-gradient-1, .bg-gradient-2, .bg-gradient-3');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Modal enhancements
    const modals = document.querySelectorAll('.glass-modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 10);
        });
    });

    // Swap item selection
    const swapItems = document.querySelectorAll('.swap-item-modern');
    swapItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            swapItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });

    // Points animation
    const pointsValue = document.querySelector('.points-value-modern');
    if (pointsValue) {
        const finalValue = parseInt(pointsValue.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const animatePoints = () => {
            if (currentValue < finalValue) {
                currentValue += increment;
                pointsValue.textContent = Math.floor(currentValue);
                requestAnimationFrame(animatePoints);
            } else {
                pointsValue.textContent = finalValue;
            }
        };
        
        // Start animation when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatePoints();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(pointsValue);
    }

    // Impact cards hover effects
    const impactCards = document.querySelectorAll('.impact-card-modern');
    impactCards.forEach(card => {
        const icon = card.querySelector('.impact-icon-modern');
        
        card.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Form validation and enhancement
    const formControls = document.querySelectorAll('.form-control-modern');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        control.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Success notifications
    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-gradient);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-medium);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Modal form submissions
    const swapRequestBtn = document.querySelector('#swapRequestModal .btn-primary-modern');
    if (swapRequestBtn) {
        swapRequestBtn.addEventListener('click', function() {
            const selectedItem = document.querySelector('.swap-item-modern.active');
            if (selectedItem) {
                showSuccessNotification('Swap request sent successfully!');
                bootstrap.Modal.getInstance(document.getElementById('swapRequestModal')).hide();
            } else {
                alert('Please select an item to swap');
            }
        });
    }

    const redeemBtn = document.querySelector('#redeemModal .btn-primary-modern');
    if (redeemBtn) {
        redeemBtn.addEventListener('click', function() {
            showSuccessNotification('Item redeemed successfully!');
            bootstrap.Modal.getInstance(document.getElementById('redeemModal')).hide();
        });
    }

    const messageBtn = document.querySelector('#messageModal .btn-primary-modern');
    if (messageBtn) {
        messageBtn.addEventListener('click', function() {
            showSuccessNotification('Message sent successfully!');
            bootstrap.Modal.getInstance(document.getElementById('messageModal')).hide();
        });
    }

    // Enhanced scroll effects
    let ticking = false;
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const navbar = document.getElementById('mainNavbar');
        
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Start loading the item data
    const itemId = getItemIdFromURL();
    loadItemData(itemId);

    console.log('Dynamic Item Detail page initialized successfully!');
}); 
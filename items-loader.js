// Items Loader - Dynamically loads items from localStorage and displays them
class ItemsLoader {
    constructor() {
        this.items = [];
        this.initializeItems();
        this.loadItemsFromStorage();
        this.updateItemsDisplay();
    }

    initializeItems() {
        // Default items if no items in localStorage
        const defaultItems = [
            {
                id: 'vintage-denim-jacket',
                title: 'Vintage Denim Jacket',
                description: 'Classic 90s style, perfect condition',
                category: 'outerwear',
                type: 'swap',
                size: 'M',
                condition: 'excellent',
                price: 450,
                currency: 'USD',
                images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'],
                uploader: {
                    name: 'Emma Wilson',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
                    level: 'Eco Warrior',
                    rating: 4.8
                },
                uploadedAt: '2024-01-15T10:30:00Z',
                status: 'active'
            },
            {
                id: 'summer-floral-dress',
                title: 'Summer Floral Dress',
                description: 'Light and breezy, size S',
                category: 'dresses',
                type: 'swap',
                size: 'S',
                condition: 'good',
                price: 320,
                currency: 'USD',
                images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'],
                uploader: {
                    name: 'Sarah Johnson',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
                    level: 'Eco Warrior',
                    rating: 5.0
                },
                uploadedAt: '2024-01-14T15:45:00Z',
                status: 'active'
            },
            {
                id: 'vintage-leather-bag',
                title: 'Vintage Leather Bag',
                description: 'Handcrafted, excellent quality',
                category: 'bags',
                type: 'sale',
                size: 'One Size',
                condition: 'excellent',
                price: 580,
                currency: 'USD',
                images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop'],
                uploader: {
                    name: 'Michael Chen',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                    level: 'Eco Champion',
                    rating: 4.9
                },
                uploadedAt: '2024-01-13T09:20:00Z',
                status: 'active'
            },
            {
                id: 'classic-white-sneakers',
                title: 'Classic White Sneakers',
                description: 'Barely worn, size US 9',
                category: 'shoes',
                type: 'swap',
                size: 'US 9',
                condition: 'like-new',
                price: 420,
                currency: 'USD',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'],
                uploader: {
                    name: 'Alex Rodriguez',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                    level: 'Eco Explorer',
                    rating: 4.7
                },
                uploadedAt: '2024-01-12T14:15:00Z',
                status: 'active'
            }
        ];

        // Initialize localStorage with default items if empty
        if (!localStorage.getItem('rewear_items')) {
            localStorage.setItem('rewear_items', JSON.stringify(defaultItems));
        }
    }

    loadItemsFromStorage() {
        try {
            const storedItems = JSON.parse(localStorage.getItem('rewear_items') || '[]');
            this.items = storedItems.filter(item => item.status === 'active');
        } catch (error) {
            console.error('Error loading items from storage:', error);
            this.items = [];
        }
    }

    updateItemsDisplay() {
        const swiperWrapper = document.querySelector('.items-swiper .swiper-wrapper');
        if (!swiperWrapper) return;

        // Clear existing items
        swiperWrapper.innerHTML = '';

        // Add items to the swiper
        this.items.forEach(item => {
            const slide = this.createItemSlide(item);
            swiperWrapper.appendChild(slide);
        });

        // Reinitialize Swiper if it exists
        if (window.itemsSwiper) {
            window.itemsSwiper.update();
        }
    }

    createItemSlide(item) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const pointsText = item.type === 'sale' ? `${item.price} ${item.currency}` : `${item.price} points`;
        
        slide.innerHTML = `
            <div class="item-card">
                <div class="item-image">
                    <img src="${item.images[0]}" alt="${item.title}">
                    <div class="item-badge">${this.getStatusBadge(item)}</div>
                    <div class="item-overlay">
                        <a href="item-detail.html?item=${item.id}" class="btn btn-primary btn-sm rounded-pill">Show More Details</a>
                    </div>
                </div>
                <div class="item-content">
                    <h5 class="item-title">${item.title}</h5>
                    <p class="item-description">${item.description}</p>
                    <div class="item-meta">
                        <span class="item-points">${pointsText}</span>
                        <div class="item-actions">
                            ${item.type === 'swap' ? '<button class="btn btn-outline-primary btn-sm rounded-pill">Swap</button>' : ''}
                            <button class="btn btn-outline-success btn-sm rounded-pill">Redeem</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return slide;
    }

    getStatusBadge(item) {
        switch (item.type) {
            case 'swap':
                return 'Available for Swap';
            case 'sale':
                return 'For Sale';
            case 'donation':
                return 'Free';
            default:
                return 'Available';
        }
    }

    // Method to add new item (called from add-item.js)
    addNewItem(item) {
        this.items.unshift(item); // Add to beginning
        this.updateItemsDisplay();
        
        // Show notification
        this.showNotification(`"${item.title}" has been added successfully!`, 'success');
    }

    // Method to remove item
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updateItemsDisplay();
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                <strong class="me-auto">ReWear</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(notification);
            
            const toast = new bootstrap.Toast(notification);
            toast.show();

            // Remove from DOM after hiding
            notification.addEventListener('hidden.bs.toast', () => {
                notification.remove();
            });
        }
    }

    // Get item by ID (for item detail page)
    getItemById(itemId) {
        return this.items.find(item => item.id === itemId);
    }

    // Get items by category
    getItemsByCategory(category) {
        return this.items.filter(item => item.category === category);
    }

    // Get items by type
    getItemsByType(type) {
        return this.items.filter(item => item.type === type);
    }

    // Search items
    searchItems(query) {
        const searchTerm = query.toLowerCase();
        return this.items.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.itemsLoader = new ItemsLoader();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemsLoader;
} 
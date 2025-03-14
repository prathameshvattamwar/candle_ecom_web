document.addEventListener('DOMContentLoaded', function() {
    // Initialization
    initScrollAnimation();
    initCustomCursor();
    initStickyHeader();
    initMobileNav();
    initCartSidebar();
    initProductsGrid();
    initTestimonialSlider();
    loadCartFromLocalStorage();
    
    // Register event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', filterProducts);
    });
    
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
    
    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', handleContactSubmit);
    });
});

// Product Data
const products = [
    {
        id: 1,
        name: "Vanilla Bean",
        category: "scented",
        price: 24.99,
        oldPrice: 29.99,
        image: "/api/placeholder/350/350",
        rating: 4.5,
        tag: "new",
        description: "A warm, comforting scent with notes of vanilla and caramel."
    },
    {
        id: 2,
        name: "Ocean Breeze",
        category: "scented",
        price: 22.99,
        oldPrice: null,
        image: "/api/placeholder/350/350",
        rating: 4.2,
        tag: null,
        description: "Fresh and invigorating with hints of sea salt and citrus."
    },
    {
        id: 3,
        name: "Autumn Spice",
        category: "seasonal",
        price: 19.99,
        oldPrice: 26.99,
        image: "/api/placeholder/350/350",
        rating: 4.8,
        tag: "sale",
        description: "A cozy blend of cinnamon, clove, and nutmeg."
    },
    {
        id: 4,
        name: "Geometric Marble",
        category: "decorative",
        price: 32.99,
        oldPrice: null,
        image: "/api/placeholder/350/350",
        rating: 4.6,
        tag: null,
        description: "Modern marble design with gold geometric accents."
    },
    {
        id: 5,
        name: "Lavender Fields",
        category: "scented",
        price: 21.99,
        oldPrice: null,
        image: "/api/placeholder/350/350",
        rating: 4.4,
        tag: null,
        description: "A calming blend of lavender and chamomile for relaxation."
    },
    {
        id: 6,
        name: "Winter Wonderland",
        category: "seasonal",
        price: 26.99,
        oldPrice: 34.99,
        image: "/api/placeholder/350/350",
        rating: 4.7,
        tag: "sale",
        description: "Notes of pine, cedar, and winter berries for the holiday season."
    },
    {
        id: 7,
        name: "Minimalist Concrete",
        category: "decorative",
        price: 29.99,
        oldPrice: null,
        image: "/api/placeholder/350/350",
        rating: 4.3,
        tag: "new",
        description: "Industrial-style concrete candle with a modern aesthetic."
    },
    {
        id: 8,
        name: "Summer Citrus",
        category: "seasonal",
        price: 23.99,
        oldPrice: null,
        image: "/api/placeholder/350/350",
        rating: 4.5,
        tag: null,
        description: "Bright and zesty with notes of lemon, lime, and orange."
    }
];

// Cart functionality
let cart = [];

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCartUI();
    saveCartToLocalStorage();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToLocalStorage();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCartToLocalStorage();
        }
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    saveCartToLocalStorage();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    // Update cart count
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn decrease-quantity">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity">+</button>
                            <span class="remove-item">Remove</span>
                        </div>
                    </div>
                </div>
            `;
            
            cartItems.innerHTML += cartItemHTML;
        });
        
        // Add event listeners to cart items
        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.cart-item').dataset.id);
                updateCartQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.cart-item').dataset.id);
                updateCartQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.cart-item').dataset.id);
                removeFromCart(id);
            });
        });
    }
    
    // Update total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// LocalStorage functionality
function saveCartToLocalStorage() {
    localStorage.setItem('luminaCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('luminaCart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Product filtering and display
function initProductsGrid() {
    const productsGrid = document.querySelector('.products-grid');
    
    if (!productsGrid) return;
    
    displayProducts('all');
}

function displayProducts(category) {
    const productsGrid = document.querySelector('.products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    filteredProducts.forEach(product => {
        const productHTML = `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    ${product.tag ? `<div class="product-tag tag-${product.tag}">${product.tag}</div>` : ''}
                    <img src="https://www.transparentpng.com/thumb/candles/laYWDi-candles-fire-candle-png-hd-photo-yellow.png" alt="${product.name}">
                    <div class="product-actions">
                        <button class="action-btn add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="action-btn">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <button class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productsGrid.innerHTML += productHTML;
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart, .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id || e.target.closest('[data-id]').dataset.id);
            addToCart(id);
        });
    });
}

function filterProducts(e) {
    const category = e.target.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    e.target.classList.add('active');
    
    // Display filtered products
    displayProducts(category);
}

function generateStarRating(rating) {
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// UI Notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already in CSS
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--white)';
    notification.style.borderLeft = '4px solid var(--primary-color)';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '9999';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease-in-out';
    
    // Style notification content
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.display = 'flex';
    notificationContent.style.alignItems = 'center';
    
    // Style icon
    const icon = notification.querySelector('i');
    icon.style.color = 'var(--primary-color)';
    icon.style.fontSize = '1.5rem';
    icon.style.marginRight = '10px';
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            // Remove from DOM after transition
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }, 10);
}

// Testimonial slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!testimonials.length) return;
    
    let currentIndex = 0;
    
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
            testimonial.style.display = 'none';
        }
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        testimonials[currentIndex].style.display = 'none';
        dots[currentIndex].classList.remove('active');
        
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        
        testimonials[currentIndex].style.display = 'block';
        dots[currentIndex].classList.add('active');
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        testimonials[currentIndex].style.display = 'none';
        dots[currentIndex].classList.remove('active');
        
        currentIndex = (currentIndex + 1) % testimonials.length;
        
        testimonials[currentIndex].style.display = 'block';
        dots[currentIndex].classList.add('active');
    });
    
    // Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex) {
                testimonials[currentIndex].style.display = 'none';
                dots[currentIndex].classList.remove('active');
                
                currentIndex = index;
                
                testimonials[currentIndex].style.display = 'block';
                dots[currentIndex].classList.add('active');
            }
        });
    });
    
    // Auto slide
    setInterval(() => {
        testimonials[currentIndex].style.display = 'none';
        dots[currentIndex].classList.remove('active');
        
        currentIndex = (currentIndex + 1) % testimonials.length;
        
        testimonials[currentIndex].style.display = 'block';
        dots[currentIndex].classList.add('active');
    }, 5000);
}

// Form handling
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate API call
    console.log(`Newsletter subscription: ${email}`);
    
    // Show notification
    showNotification('Thank you for subscribing!');
    
    // Clear form
    e.target.reset();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Simulate API call
    console.log('Contact form submitted');
    
    // Show notification
    showNotification('Your message has been sent!');
    
    // Clear form
    e.target.reset();
}

// Cart sidebar
function initCartSidebar() {
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const clearCartBtn = document.querySelector('.clear-cart');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            clearCart();
            showNotification('Cart cleared!');
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
            } else {
                // Simulate checkout process
                showNotification('Checkout process initiated!');
                // In a real app, you'd redirect to a checkout page
            }
        });
    }
    
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Mobile navigation
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
}

// Sticky header
function initStickyHeader() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Custom cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const mobileIndicator = document.querySelector('.mobile-indicator');
    
    if (!cursor) return;
    
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Change cursor size on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .product-card, .cart-icon, .menu-toggle');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.backgroundColor = 'rgba(245, 156, 76, 0.2)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'rgba(245, 156, 76, 0.3)';
            });
        });
        
        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    } else if (mobileIndicator) {
        // Setup mobile indicator for mobile devices
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            // Show indicator when scrolling down, hide when scrolling up
            if (scrollTop > lastScrollTop) {
                mobileIndicator.style.opacity = '0';
                mobileIndicator.style.pointerEvents = 'none';
            } else {
                mobileIndicator.style.opacity = '1';
                mobileIndicator.style.pointerEvents = 'auto';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
        
        // Hide mobile indicator after 3 seconds of no scrolling
        let scrollTimer;
        window.addEventListener('scroll', () => {
            mobileIndicator.style.opacity = '1';
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                mobileIndicator.style.opacity = '0';
            }, 3000);
        });
        
        // Make the mobile indicator functional
        mobileIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// GSAP Animations
function initScrollAnimation() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.from('.hero-content', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.candle-img', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    // Animated candle flame
    const flameAnimation = gsap.timeline({repeat: -1});
    
    flameAnimation.to('.flame', {
        height: '70px',
        duration: 2,
        ease: 'sine.inOut'
    })
    .to('.flame', {
        height: '50px',
        duration: 2,
        ease: 'sine.inOut'
    });
    
    // Products section animations
    gsap.from('.products .section-title, .products .section-subtitle', {
        scrollTrigger: {
            trigger: '.products',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
    
    gsap.from('.filter-btn', {
        scrollTrigger: {
            trigger: '.filter-tabs',
            start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
    });
    
    // Product cards animation
    ScrollTrigger.batch('.product-card', {
        start: 'top 85%',
        onEnter: batch => {
            gsap.from(batch, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        },
        once: true
    });
    
    // About section animations
    gsap.from('.about-content', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });
    
    // Parallax effect for about image
    gsap.to('.parallax-img', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: -50
    });
    
    // Crafting process section animations
    gsap.from('.crafting .section-title, .crafting .section-subtitle', {
        scrollTrigger: {
            trigger: '.crafting',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
    
    // Process steps animation
    gsap.from('.process-step', {
        scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 80%'
        },
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.3
    });
    
    // Animated step numbers
    gsap.from('.step-number', {
        scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 80%'
        },
        scale: 0,
        rotation: 180,
        duration: 0.8,
        stagger: 0.3,
        ease: 'back.out(1.7)'
    });
    
    // Testimonials section animations
    gsap.from('.testimonials .section-title', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8
    });
    
    gsap.from('.testimonial', {
        scrollTrigger: {
            trigger: '.testimonials-slider',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8
    });
    
    // Newsletter section animations
    gsap.from('.newsletter-content', {
        scrollTrigger: {
            trigger: '.newsletter',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8
    });
    
    // Contact section animations
    gsap.from('.contact .section-title', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8
    });
    
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-wrapper',
            start: 'top 80%'
        },
        x: -100,
        opacity: 0,
        duration: 0.8
    });
    
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-wrapper',
            start: 'top 80%'
        },
        x: 100,
        opacity: 0,
        duration: 0.8
    });
    
    // Footer animations
    gsap.from('.footer-content > *', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 90%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
    
    // Enhanced candle animation on scroll
    const candleTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    candleTl.to('.flame', {
        height: '120px',
        opacity: 0.7,
        ease: 'none'
    })
    .to('.candle-img', {
        y: -50,
        ease: 'none'
    }, 0);
    
    // Animated background gradient on scroll
    gsap.to('.hero', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        backgroundPosition: '0% 100%',
        ease: 'none'
    });
    
    // Reveal animations for sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        gsap.fromTo(
            section,
            {
                clipPath: 'inset(0 0 100% 0)'
            },
            {
                clipPath: 'inset(0 0 0% 0)',
                duration: 1.5,
                ease: 'power4.inOut',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    once: true
                }
            }
        );
    });
    
    // Products hover effect enhancement
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                duration: 0.3
            });
        });
    });
    
    // Button hover animations
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.2
            });
        });
    });
}
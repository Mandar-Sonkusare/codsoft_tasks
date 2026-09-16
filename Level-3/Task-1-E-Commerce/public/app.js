const API_URL = 'http://localhost:5002/api';

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;
let token = localStorage.getItem('token') || null;
let products = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthButton();
    loadProducts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('search-input').addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('category-filter').addEventListener('change', loadProducts);
    document.getElementById('sort-filter').addEventListener('change', loadProducts);
    document.getElementById('cart-btn').addEventListener('click', () => showPage('cart'));
    document.getElementById('auth-btn').addEventListener('click', handleAuthButtonClick);

    // Modal
    const modal = document.getElementById('auth-modal');
    document.querySelector('.close').addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + '-form').classList.add('active');
        });
    });
}

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Load Products
async function loadProducts() {
    try {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = '<div class="loading">Loading products...</div>';

        const category = document.getElementById('category-filter').value;
        const sort = document.getElementById('sort-filter').value;
        const search = document.getElementById('search-input').value;

        const params = new URLSearchParams();
        if (category !== 'all') params.append('category', category);
        if (sort) params.append('sort', sort);
        if (search) params.append('search', search);

        const response = await fetch(`${API_URL}/products?${params}`);
        products = await response.json();

        if (products.length === 0) {
            grid.innerHTML = '<div class="no-products">No products found</div>';
            return;
        }

        grid.innerHTML = '';
        products.forEach(product => {
            grid.appendChild(createProductCard(product));
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('products-grid').innerHTML = 
            '<div class="no-products">Error loading products. Make sure the server is running.</div>';
    }
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetail(product._id);

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">⭐ ${product.rating.toFixed(1)} (${product.reviews} reviews)</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn btn-primary btn-add-cart" onclick="event.stopPropagation(); addToCart('${product._id}')">
                Add to Cart
            </button>
        </div>
    `;

    return card;
}

// Show Product Detail
function showProductDetail(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const detailDiv = document.getElementById('product-detail');
    detailDiv.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}" class="product-detail-image">
        </div>
        <div class="product-detail-info">
            <div class="product-category">${product.category}</div>
            <h1>${product.name}</h1>
            <div class="product-rating">⭐ ${product.rating.toFixed(1)} (${product.reviews} reviews)</div>
            <div class="product-detail-price">$${product.price.toFixed(2)}</div>
            <div class="stock-info ${product.stock === 0 ? 'out-of-stock' : ''}">
                ${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>
            <div class="product-detail-description">${product.description}</div>
            ${product.stock > 0 ? `
                <div class="quantity-selector">
                    <button onclick="changeQuantity(-1)">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                    <button onclick="changeQuantity(1)">+</button>
                </div>
                <button class="btn btn-primary" onclick="addToCart('${product._id}', parseInt(document.getElementById('quantity').value))">
                    Add to Cart
                </button>
            ` : ''}
        </div>
    `;

    showPage('product');
}

function changeQuantity(delta) {
    const input = document.getElementById('quantity');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= 1 && newValue <= parseInt(input.max)) {
        input.value = newValue;
    }
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Show Cart
function showCartPage() {
    const content = document.getElementById('cart-content');

    if (cart.length === 0) {
        content.innerHTML = '<div class="cart-empty"><h3>Your cart is empty</h3><button class="btn btn-primary" onclick="showPage(\'home\')">Continue Shopping</button></div>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    content.innerHTML = `
        <div class="cart-items">
            ${cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div>
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div>
                        <p><strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>
                        <button class="btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <strong>$${total.toFixed(2)}</strong>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <strong>$10.00</strong>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <strong>$${(total + 10).toFixed(2)}</strong>
            </div>
            <button class="btn btn-primary" onclick="proceedToCheckout()">Proceed to Checkout</button>
        </div>
    `;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartPage();
}

// Proceed to Checkout
function proceedToCheckout() {
    if (!token) {
        alert('Please login to continue');
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10;

    document.getElementById('checkout-content').innerHTML = `
        <form class="checkout-form" onsubmit="handleCheckout(event)">
            <h3>Shipping Information</h3>
            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" required value="${user.name}">
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required value="${user.email}">
            </div>
            <div class="form-group">
                <label>Address *</label>
                <input type="text" name="address" required>
            </div>
            <div class="form-group">
                <label>City *</label>
                <input type="text" name="city" required>
            </div>
            <div class="form-group">
                <label>Postal Code *</label>
                <input type="text" name="postalCode" required>
            </div>
            <div class="form-group">
                <label>Country *</label>
                <input type="text" name="country" required>
            </div>
            <h3>Payment Method</h3>
            <div class="form-group">
                <p><strong>⚠️ DEMO MODE: This is a test payment</strong></p>
                <p>In a real application, this would integrate with a payment gateway like Stripe or PayPal.</p>
                <input type="hidden" name="paymentMethod" value="demo">
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <strong>$${total.toFixed(2)}</strong>
            </div>
            <button type="submit" class="btn btn-primary">Place Order (Demo)</button>
        </form>
    `;

    showPage('checkout');
}

// Handle Checkout
async function handleCheckout(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const shippingAddress = Object.fromEntries(formData);

    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10,
        shippingAddress,
        paymentMethod: 'demo'
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert('Order placed successfully! (Demo)');
            showPage('orders');
            loadOrders();
        } else {
            alert('Error placing order');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error placing order');
    }
}

// Load Orders
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await response.json();

        const content = document.getElementById('orders-content');
        if (orders.length === 0) {
            content.innerHTML = '<div class="cart-empty">No orders yet</div>';
            return;
        }

        content.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <strong>Order #${order._id.slice(-8)}</strong><br>
                        <small>${new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span class="order-status status-${order.orderStatus}">${order.orderStatus}</span>
                </div>
                <div>
                    <p><strong>Items:</strong> ${order.items.length}</p>
                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                    <p><strong>Payment:</strong> ${order.paymentStatus}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Auth
function handleAuthButtonClick() {
    if (user) {
        showPage('orders');
        loadOrders();
    } else {
        document.getElementById('auth-modal').style.display = 'block';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            updateAuthButton();
            document.getElementById('auth-modal').style.display = 'none';
            alert('Login successful!');
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            updateAuthButton();
            document.getElementById('auth-modal').style.display = 'none';
            alert('Registration successful!');
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering');
    }
}

function updateAuthButton() {
    const btn = document.getElementById('auth-btn');
    if (user) {
        btn.textContent = `👤 ${user.name}`;
    } else {
        btn.textContent = 'Login';
    }
}

// Page Navigation
function showPage(page) {
    document.querySelectorAll('#main-content > section').forEach(section => {
        section.style.display = 'none';
    });

    if (page === 'home') {
        document.getElementById('home-page').style.display = 'block';
        loadProducts();
    } else if (page === 'product') {
        document.getElementById('product-page').style.display = 'block';
    } else if (page === 'cart') {
        document.getElementById('cart-page').style.display = 'block';
        showCartPage();
    } else if (page === 'checkout') {
        document.getElementById('checkout-page').style.display = 'block';
    } else if (page === 'orders') {
        document.getElementById('orders-page').style.display = 'block';
    }
}

function handleSearch() {
    loadProducts();
}

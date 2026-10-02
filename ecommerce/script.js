// ---------- Products ----------
// To use real photos, add  image: "images/your-photo.jpg"  to a product.
const products = [
    { id: 1, name: "Classic Sneakers", category: "fashion", price: 18000, oldPrice: 30000, rating: 4, icon: "fa-shopping-bag" },
    { id: 2, name: "Leather Handbag", category: "fashion", price: 24500, oldPrice: 35000, rating: 5, icon: "fa-briefcase" },
    { id: 3, name: "Denim Jacket", category: "fashion", price: 15000, oldPrice: 20000, rating: 4, icon: "fa-user" },
    { id: 4, name: "Wireless Earbuds", category: "electronics", price: 12500, oldPrice: 20000, rating: 4, icon: "fa-headphones" },
    { id: 5, name: "Smart Watch", category: "electronics", price: 28000, oldPrice: 45000, rating: 5, icon: "fa-clock-o" },
    { id: 6, name: "Portable Speaker", category: "electronics", price: 16500, oldPrice: 22000, rating: 4, icon: "fa-volume-up" },
    { id: 7, name: "Table Lamp", category: "home", price: 9000, oldPrice: 12000, rating: 4, icon: "fa-lightbulb-o" },
    { id: 8, name: "Cozy Throw Blanket", category: "home", price: 7500, oldPrice: 10000, rating: 5, icon: "fa-bed" }
];

let cart = [];

// ---------- Helpers ----------
const naira = (n) => "₦" + n.toLocaleString("en-NG");
const discount = (p) => Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);

const grid = document.getElementById("product_grid");
const cartCount = document.getElementById("cart_count");
const cartItems = document.getElementById("cart_items");
const cartTotal = document.getElementById("cart_total");
const cartPanel = document.getElementById("cart_panel");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function stars(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
}

function visual(p) {
    return p.image
        ? `<img src="${p.image}" alt="${p.name}">`
        : `<i class="fa ${p.icon}"></i>`;
}

// ---------- Render products ----------
function renderProducts(category = "all") {
    const list = category === "all" ? products : products.filter(p => p.category === category);

    grid.innerHTML = list.map(p => `
        <article class="product">
            <div class="product_img">
                ${visual(p)}
                <span class="badge">-${discount(p)}%</span>
            </div>
            <div class="product_info">
                <h3>${p.name}</h3>
                <div class="stars" aria-label="${p.rating} out of 5 stars">${stars(p.rating)}</div>
                <div class="price">
                    <strong>${naira(p.price)}</strong>
                    <del>${naira(p.oldPrice)}</del>
                </div>
                <button class="add_btn" type="button" data-id="${p.id}">Add to Cart</button>
            </div>
        </article>
    `).join("");
}

// ---------- Filters ----------
document.getElementById("filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    document.querySelectorAll(".filter").forEach(f => f.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
});

// ---------- Cart ----------
grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".add_btn");
    if (!btn) return;
    addToCart(Number(btn.dataset.id));
});

function addToCart(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    updateCart();
    showToast("Added to cart");
}

function changeQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCart();
}

function updateCart() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCount.textContent = count;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart_empty">Your cart is empty.</p>';
        cartTotal.textContent = naira(0);
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(i => {
        const p = products.find(x => x.id === i.id);
        total += p.price * i.qty;
        return `
            <div class="cart_row">
                <div class="thumb">${visual(p)}</div>
                <div class="details">
                    <h4>${p.name}</h4>
                    <span>${naira(p.price)}</span>
                </div>
                <div class="qty">
                    <button type="button" data-id="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button>
                    <span>${i.qty}</span>
                    <button type="button" data-id="${p.id}" data-change="1" aria-label="Increase quantity">+</button>
                </div>
            </div>`;
    }).join("");
    cartTotal.textContent = naira(total);
}

cartItems.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-change]");
    if (!btn) return;
    changeQty(Number(btn.dataset.id), Number(btn.dataset.change));
});

// ---------- Open / close cart ----------
function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("cart_toggle").addEventListener("click", openCart);
document.getElementById("cart_close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
});

document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }
    cart = [];
    updateCart();
    closeCart();
    showToast("Order placed. Thank you!");
});

// ---------- Toast ----------
let toastTimer;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------- Countdown (sale ends 3 days after first visit) ----------
const SALE_DAYS = 3;
let saleEnd;

try {
    saleEnd = Number(localStorage.getItem("saleEnd"));
} catch (e) { }

if (!saleEnd || saleEnd < Date.now()) {
    saleEnd = Date.now() + SALE_DAYS * 24 * 60 * 60 * 1000;
    try { localStorage.setItem("saleEnd", saleEnd); } catch (e) { }
}

const pad = (n) => String(n).padStart(2, "0");

function tick() {
    const diff = Math.max(0, saleEnd - Date.now());
    document.getElementById("days").textContent = pad(Math.floor(diff / 86400000));
    document.getElementById("hours").textContent = pad(Math.floor((diff / 3600000) % 24));
    document.getElementById("minutes").textContent = pad(Math.floor((diff / 60000) % 60));
    document.getElementById("seconds").textContent = pad(Math.floor((diff / 1000) % 60));
}

tick();
setInterval(tick, 1000);

// ---------- Start ----------
renderProducts();
updateCart();
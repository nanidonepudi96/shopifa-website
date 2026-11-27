/* ==========================================================================
   SHOPIFYA — BEGINNER-FRIENDLY INTERACTIVE SCRIPT (script.js)
   Handles: Cart Drawer, Wishlist Heart Toggles, Product Search & Form Feedback
   Note: Frontend UI demo only — no real payment or order processing.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. State for Shopping Cart and Wishlist Count
  const cart = new Map();
  let wishlistCount = 0;

  const cartCountEl = document.getElementById('cart-count');
  const wishlistCountEl = document.getElementById('wishlist-count');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartTotalEl = document.getElementById('cart-total-price');
  const toastEl = document.getElementById('toast-msg');

  let toastTimer = null;

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  }

  // 2. Render Cart Drawer Items & Update Badge
  function renderCart() {
    let totalItems = 0;
    let totalPrice = 0;
    cartItemsList.innerHTML = '';

    if (cart.size === 0) {
      cartItemsList.innerHTML = '<p class="cart-empty">Your cart is empty. Click "Add to Cart" on any product!</p>';
    } else {
      cart.forEach((item, name) => {
        totalItems += item.qty;
        totalPrice += item.price * item.qty;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
          <div>
            <strong>${name}</strong>
            <div style="font-size:0.84rem;color:#64748b;">$${item.price} each</div>
          </div>
          <div class="cart-qty-btns">
            <button type="button" aria-label="Decrease quantity">-</button>
            <span>${item.qty}</span>
            <button type="button" aria-label="Increase quantity">+</button>
          </div>
        `;

        const [decBtn, incBtn] = row.querySelectorAll('button');
        decBtn.addEventListener('click', () => {
          item.qty -= 1;
          if (item.qty <= 0) cart.delete(name);
          renderCart();
        });
        incBtn.addEventListener('click', () => {
          item.qty += 1;
          renderCart();
        });

        cartItemsList.appendChild(row);
      });
    }

    cartCountEl.textContent = String(totalItems);
    cartTotalEl.textContent = `$${totalPrice}`;
  }

  // Add to Cart Buttons
  document.querySelectorAll('.add-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      const existing = cart.get(name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.set(name, { price, qty: 1 });
      }
      renderCart();
      showToast(`${name} added to your cart!`);
    });
  });

  // Cart Drawer Open / Close / Clear
  document.getElementById('cart-open-btn').addEventListener('click', () => {
    cartDrawer.hidden = false;
  });
  document.getElementById('cart-close-btn').addEventListener('click', () => {
    cartDrawer.hidden = true;
  });
  document.getElementById('cart-backdrop').addEventListener('click', () => {
    cartDrawer.hidden = true;
  });
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    cart.clear();
    renderCart();
    showToast('Shopping cart cleared.');
  });

  // 3. Wishlist Toggle Buttons
  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isSaved = btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      wishlistCount += isSaved ? 1 : -1;
      wishlistCountEl.textContent = String(Math.max(0, wishlistCount));
      showToast(isSaved ? 'Saved to your wishlist!' : 'Removed from wishlist.');
    });
  });

  // 4. Live Product Search Filter
  const searchPanel = document.getElementById('search-bar-panel');
  const searchInput = document.getElementById('product-search-input');
  const searchStatus = document.getElementById('search-status');
  const productCards = document.querySelectorAll('#featured-products-grid .product-card');

  document.getElementById('search-toggle-btn').addEventListener('click', () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) searchInput.focus();
  });

  function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    productCards.forEach((card) => {
      const title = (card.dataset.title || '').toLowerCase();
      const cat = (card.dataset.category || '').toLowerCase();
      const match = !query || title.includes(query) || cat.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visible += 1;
    });

    if (query) {
      searchStatus.hidden = false;
      searchStatus.textContent = `Showing ${visible} product(s) matching "${searchInput.value.trim()}"`;
    } else {
      searchStatus.hidden = true;
    }
  }

  searchInput.addEventListener('input', filterProducts);
  document.getElementById('clear-search-btn').addEventListener('click', () => {
    searchInput.value = '';
    filterProducts();
  });

  // 5. Newsletter & Contact Form Confirmation (UI Demo)
  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Welcome deals sent to your inbox (Demo).');
    e.target.reset();
  });

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message submitted! Support will reply shortly (Demo).');
    e.target.reset();
  });

  // 6. Close mobile nav drawer after clicking a link
  const navToggle = document.getElementById('nav-toggle');
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.checked = false;
    });
  });
});

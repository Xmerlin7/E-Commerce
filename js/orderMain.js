import { initCartBadge } from "./ui/cartBadge.js";
import { initUserIcon } from "./ui/userIcon.js";
import { initCartLinkGuard, requireAuth } from "./utils/authGuard.js";
import { clearLastOrder, loadLastOrder } from "./state/order.js";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso ?? "");
  }
}

function formatMoney(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
}

function renderOrder() {
  const container = document.getElementById("order-container");
  if (!container) return;

  const order = loadLastOrder();
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    container.innerHTML = `
      <div class="order">
        <h2>Order Shipped</h2>
        <p>No recent order found.</p>
        <a href="./product.html">Go to products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="order">
      <h2>Order Shipped</h2>
      <p>Your order has been shipped successfully.</p>

      <div class="order-meta">
        <p><strong>Order ID:</strong> ${order.id ?? "—"}</p>
        <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
      </div>

      <div class="order-items">
        ${order.items
          .map((item) => {
            const qty = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const line = qty * price;
            return `
              <div class="order-item">
                <div class="order-item-title">${item.title}</div>
                <div class="order-item-meta">
                  <span>Qty: ${qty}</span>
                  <span>Price: ${formatMoney(price)} $</span>
                  <span>Subtotal: ${formatMoney(line)} $</span>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="order-summary">
        <p><strong>Total:</strong> ${formatMoney(order.total)} $</p>
      </div>

      <a class="order-link" href="./product.html">Continue shopping</a>
    </div>
  `;

  // optional: clear so refresh doesn't keep showing old order
  clearLastOrder();
}

function init() {
  initCartBadge();
  initUserIcon();

  if (!requireAuth()) return;
  initCartLinkGuard();

  renderOrder();
}

init();

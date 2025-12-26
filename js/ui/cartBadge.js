import { getCart } from "../state/cart.js";

function countItems(cartItems) {
  return cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const items = getCart();
  badge.textContent = String(countItems(items));
}

export function initCartBadge() {
  updateCartBadge();

  window.addEventListener("cart:changed", (e) => {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const items = e?.detail?.items;
    if (Array.isArray(items)) {
      badge.textContent = String(countItems(items));
    } else {
      updateCartBadge();
    }
  });
}

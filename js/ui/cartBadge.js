import { getCart } from "../state/cart.js";
import { getCurrentUser } from "../state/auth.js";

function countItems(cartItems) {
  return cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function syncVisibility() {
  const badge = document.getElementById("cart-count");
  if (!badge) return null;

  const isAuthed = Boolean(getCurrentUser());
  badge.hidden = !isAuthed;
  badge.setAttribute("aria-hidden", String(!isAuthed));
  if (!isAuthed) badge.textContent = "";
  return badge;
}

export function updateCartBadge() {
  const badge = syncVisibility();
  if (!badge || badge.hidden) return;

  const items = getCart();
  badge.textContent = String(countItems(items));
}

export function initCartBadge() {
  updateCartBadge();

  window.addEventListener("cart:changed", (e) => {
    const badge = syncVisibility();
    if (!badge || badge.hidden) return;

    const items = e?.detail?.items;
    if (Array.isArray(items)) {
      badge.textContent = String(countItems(items));
    } else {
      updateCartBadge();
    }
  });

  window.addEventListener("auth:changed", () => {
    updateCartBadge();
  });
}

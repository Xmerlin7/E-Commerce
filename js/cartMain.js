import { renderCart } from "./ui/renderCart.js";
import { initCartBadge } from "./ui/cartBadge.js";
import { initUserIcon } from "./ui/userIcon.js";
import { initCartLinkGuard, requireAuth } from "./utils/authGuard.js";

function init() {
  initCartBadge();
  initUserIcon();

  // Guests must login before accessing cart
  if (!requireAuth()) return;

  initCartLinkGuard();
  renderCart();
}

init();

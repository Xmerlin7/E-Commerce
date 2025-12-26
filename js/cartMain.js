import { renderCart } from "./ui/renderCart.js";
import { initCartBadge } from "./ui/cartBadge.js";
import { initUserIcon } from "./ui/userIcon.js";

function init() {
  initCartBadge();
  initUserIcon();
  renderCart();
}

init();

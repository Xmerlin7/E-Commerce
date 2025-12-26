import { renderCart } from "./ui/renderCart.js";
import { initCartBadge } from "./ui/cartBadge.js";

function init() {
  initCartBadge();
  renderCart();
}

init();

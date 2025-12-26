import {
  clearCart,
  getCart,
  incrementCartItemQuantity,
  removeFromCart,
} from "../state/cart.js";
import { saveLastOrder } from "../state/order.js";

function calcTotal(cartItems) {
  return cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

export function renderCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;

  // Bind once: avoid stacking listeners on every re-render
  if (container.dataset.bound !== "1") {
    container.dataset.bound = "1";

    container.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const checkoutBtn = target.closest("#checkout");
      if (checkoutBtn) {
        const items = getCart();
        if (items.length === 0) return;

        const total = calcTotal(items);
        const order = {
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString(),
          items: items.map((x) => ({
            id: x.id,
            title: x.title,
            price: x.price,
            quantity: x.quantity,
          })),
          total,
        };

        saveLastOrder(order);
        clearCart();
        window.location.href = "./order.html";
        return;
      }

      const removeBtn = target.closest(".remove-item");
      if (removeBtn) {
        const id = removeBtn.getAttribute("data-id");
        removeFromCart(id);
        renderCart();
        return;
      }

      const qtyBtn = target.closest(".qty-btn");
      if (qtyBtn) {
        const id = qtyBtn.getAttribute("data-id");
        const action = qtyBtn.getAttribute("data-action");
        if (action === "increase") incrementCartItemQuantity(id, 1);
        if (action === "decrease") incrementCartItemQuantity(id, -1);
        renderCart();
      }
    });
  }

  const cartItems = getCart();
  const total = calcTotal(cartItems);

  if (cartItems.length === 0) {
    container.innerHTML = `
			<div class="cart">
				<h2>Cart</h2>
				<p>Your cart is empty.</p>
				<a href="./product.html">Go to products</a>
			</div>
		`;
    return;
  }

  container.innerHTML = `
		<div class="cart">
			<h2>Cart</h2>
			<div class="cart-actions">
				<button id="clear-cart" type="button">Clear cart</button>
        <button id="checkout" class="checkout-btn" type="button">Checkout</button>
			</div>

			<div class="cart-items">
				${cartItems
          .map(
            (item) => `
							<div class="cart-item" data-id="${item.id}">
								<img src="${item.image}" alt="${item.title}">
								<div class="cart-item-info">
									<h3>Name: ${item.title}</h3>
									<p>ID: ${item.id}</p>
									<p>Price: ${item.price} $</p>
									<div class="qty-controls" aria-label="Quantity controls">
										<button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}">-</button>
										<span class="qty-value">${item.quantity}</span>
										<button class="qty-btn" type="button" data-action="increase" data-id="${item.id}">+</button>
									</div>
								</div>
								<div class="cart-item-actions">
									<button class="remove-item" type="button" data-id="${item.id}">Remove</button>
								</div>
							</div>
						`
          )
          .join("")}
			</div>

			<div class="cart-summary">
				<p>Total: ${total.toFixed(2)} $</p>
			</div>
		</div>
	`;

  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
      renderCart();
    });
  }
}

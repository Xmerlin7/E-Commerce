import { clearCart, getCart, removeFromCart } from "../state/cart.js";

function calcTotal(cartItems) {
  return cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

export function renderCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;

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
									<p>Qty: ${item.quantity}</p>
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

  container.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      removeFromCart(id);
      renderCart();
    });
  });
}

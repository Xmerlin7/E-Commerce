const CART_KEY = "cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function getCart() {
  return readCart();
}

export function addToCart(product, quantity = 1) {
  const cart = readCart();
  const productId = Number(product?.id);
  if (!Number.isFinite(productId)) return;

  const qty = Number(quantity);
  const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += safeQty;
  } else {
    cart.push({
      id: productId,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: safeQty,
    });
  }

  writeCart(cart);
  return cart;
}

export function removeFromCart(id) {
  const productId = Number(id);
  const cart = readCart().filter((item) => item.id !== productId);
  writeCart(cart);
}

export function clearCart() {
  writeCart([]);
}

export function setCartItemQuantity(id, quantity) {
  const productId = Number(id);
  if (!Number.isFinite(productId)) return;

  const qty = Number(quantity);
  const safeQty = Number.isFinite(qty) ? Math.floor(qty) : 1;

  const cart = readCart();
  const idx = cart.findIndex((item) => item.id === productId);
  if (idx === -1) return;

  if (safeQty <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].quantity = safeQty;
  }

  writeCart(cart);
  return cart;
}

export function incrementCartItemQuantity(id, delta = 1) {
  const productId = Number(id);
  if (!Number.isFinite(productId)) return;

  const d = Number(delta);
  const safeDelta = Number.isFinite(d) ? Math.floor(d) : 1;

  const cart = readCart();
  const item = cart.find((x) => x.id === productId);
  if (!item) return;

  const nextQty = Number(item.quantity || 0) + safeDelta;
  return setCartItemQuantity(productId, nextQty);
}

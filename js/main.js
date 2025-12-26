import getProducts, { getProductById } from "./data/product.js";
import { renderProduct, renderProductDetails } from "./ui/renderProducts.js";
import { addToCart } from "./state/cart.js";
import { initCartBadge } from "./ui/cartBadge.js";

function bindAddToCart(container, productsById) {
  if (!container) return;

  container.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const button = target.closest(".add-to-cart");
    if (!button) return;

    const id = button.getAttribute("data-id");
    const productId = Number(id);
    const product = productsById.get(productId);
    if (!product) return;

    try {
      addToCart(product, 1);
      button.textContent = "Added";
      setTimeout(() => {
        if (button.textContent === "Added") button.textContent = "Add to cart";
      }, 800);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  });
}

async function init() {
  try {
    initCartBadge();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
      const product = await getProductById(productId);
      renderProductDetails(product);

      const container = document.getElementById("product-container");
      bindAddToCart(container, new Map([[Number(product.id), product]]));

      return;
    }

    const fullProductsData = await getProducts();
    renderProduct(fullProductsData);

    const container = document.getElementById("product-container");
    const productsById = new Map(
      fullProductsData.map((p) => [Number(p.id), p])
    );
    bindAddToCart(container, productsById);
  } catch (e) {
    console.error("Couldn't Render Products", e);
  }
}
init();

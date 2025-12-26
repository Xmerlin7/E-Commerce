import getProducts, { getProductById } from "./data/product.js";
import { renderProduct, renderProductDetails } from "./ui/renderProducts.js";
import { addToCart } from "./state/cart.js";
import { initCartBadge } from "./ui/cartBadge.js";
import { initUserIcon } from "./ui/userIcon.js";
import { initCartLinkGuard, requireAuth } from "./utils/authGuard.js";
import { initProductSlider } from "./ui/slider.js";

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

    if (!requireAuth()) return;

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
    initUserIcon();
    initCartLinkGuard();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
      const sliderHost = document.getElementById("product-slider");
      if (sliderHost) sliderHost.innerHTML = "";

      const product = await getProductById(productId);
      renderProductDetails(product);

      const container = document.getElementById("product-container");
      bindAddToCart(container, new Map([[Number(product.id), product]]));

      return;
    }

    const fullProductsData = await getProducts();

    initProductSlider({
      containerId: "product-slider",
      products: fullProductsData,
      take: 6,
      intervalMs: 3500,
    });

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

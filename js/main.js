import getProducts, { getProductById } from "./data/product.js";
import { renderProduct, renderProductDetails } from "./ui/renderProducts.js";
import { addToCart } from "./state/cart.js";

async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
      const product = await getProductById(productId);
      renderProductDetails(product);

      const addBtn = document.getElementById("add-to-cart");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          addToCart(product, 1);
        });
      }

      return;
    }

    const fullProductsData = await getProducts();
    renderProduct(fullProductsData);
  } catch (e) {
    console.error("Couldn't Render Products", e);
  }
}
init();

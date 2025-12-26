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
          try {
            const cart = addToCart(product, 1);
            addBtn.textContent = "Added to cart";
            addBtn.disabled = true;
            if (cart) console.log("Cart:", cart);

            // Make the result visible: go to cart page
            window.location.href = "./cart.html";
          } catch (err) {
            console.error("Add to cart failed:", err);
          }
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

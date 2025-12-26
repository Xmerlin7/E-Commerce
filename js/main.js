import getProducts from "./data/product.js";
import { renderProduct } from "./ui/renderProducts.js";

async function init() {
  try {
    const fullProductsData = await getProducts();
    renderProduct(fullProductsData);
  } catch (e) {
    console.error("Couldn't Render Products", e);
  }
}
init();

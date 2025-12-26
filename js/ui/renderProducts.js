export function renderProduct(products) {
  const container = document.getElementById("product-container");
  if (!container) return;

  container.innerHTML = products
    .map(
      (p) => `
        <div class="product">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>${p.price} $</p>
        </div>
      `
    )
    .join("");
}

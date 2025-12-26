export function renderProduct(products) {
  const container = document.getElementById("product-container");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
                <div class="product">
                    <a class="product-eye" href="./product.html?id=${product.id}" aria-label="View details">👁</a>
                    <img src="${product.image}" alt="${product.title}">
                    <h3>Name: ${product.title}</h3>
                    <p>ID: ${product.id}</p>
                    <p>Price: ${product.price} $</p>
                    <p>Category: ${product.category}</p>
                    <button class="add-to-cart" type="button" data-id="${product.id}">Add to cart</button>
                </div>
            `
    )
    .join("");
}

export function renderProductDetails(product) {
  const container = document.getElementById("product-container");
  if (!container) return;

  container.innerHTML = `
    <div class="product product-details">
      <img src="${product.image}" alt="${product.title}">
      <h2>Name: ${product.title}</h2>
      <p>ID: ${product.id}</p>
      <p>Price: ${product.price} $</p>
      <p>Category: ${product.category}</p>
      <p>${product.description ?? ""}</p>
      <button id="add-to-cart" class="add-to-cart" data-id="${
        product.id
      }" type="button">Add to cart</button>
    </div>
  `;
}

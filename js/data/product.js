export default async function getProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  return response.json();
}

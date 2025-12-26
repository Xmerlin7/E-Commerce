export default async function getProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  return response.json();
}
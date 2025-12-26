let fullProductData = []
fetch("https://fakestoreapi.com/products")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    fullProductData = data;
  })
  .catch((error) => {
    console.error("Error fetching data:", error); // Handle any errors
  });

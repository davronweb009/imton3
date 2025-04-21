const productList = document.getElementById("productList");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceSort = document.getElementById("priceSort");

let products = [];
let filteredProducts = [];

function renderProducts(data) {
  productList.innerHTML = "";
  if (data.length === 0) {
    productList.innerHTML = "<p>Hech qanday mahsulot topilmadi.</p>";
    return;
  }
  data.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Kategoriya: ${product.category}</p>
      <p>Narxi: ${product.price} $</p>
    `;
    productList.appendChild(div);
  });
}

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = priceSort.value;

  filteredProducts = products
    .filter(p => p.title.toLowerCase().includes(searchText))
    .filter(p => (category ? p.category === category : true));

  if (sort === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(filteredProducts);
}

function populateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// API orqali yuklash
window.addEventListener("load", () => {
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
      products = data;
      filteredProducts = [...products];
      loading.style.display = "none";
      renderProducts(products);
      populateCategories(products);
    })
    .catch(err => {
      loading.innerText = "Xatolik yuz berdi: " + err.message;
    });
});

// Event listeners
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
priceSort.addEventListener("change", applyFilters);

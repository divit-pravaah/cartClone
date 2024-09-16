const url = "https://fakestoreapi.com/products";
let cart = [];
const cartItems = document.querySelector("#cart-items");
const totalPriceElement = document.querySelector("#total-price");

document.querySelector("header").style.display = "none";

async function fetchProducts() {
  const response = await fetch(url);
  return await response.json();
}

async function updateProductDetails() {
  const products = await fetchProducts();
  products.slice(0, 16).forEach((product, index) => {
    document.querySelector(`#name${index + 1}`).innerText = product.title;
    document.querySelector(`#image${index + 1}`).src = product.image;
    document.querySelector(`#price${index + 1}`).innerText = `$${product.price}`;
  });
}

async function addToCart(id) {
  const products = await fetchProducts();
  const product = products[id - 1];
  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      id,
      name: product.title.slice(0, 30),
      price: product.price,
      productImg: product.image,
      quantity: 1
    });
    document.querySelector("header").style.display = "block";
  }

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = cart.map(item => `
    <li>
      <img src="${item.productImg}" alt="${item.name}">
      <span>${item.name}</span>
      <input id="qty${item.id}" type="number" value="${item.quantity}" min="1" oninput="inputQtyUpdate(${item.id})">
      <span>$${item.price}</span>
    </li>
  `).join('');
  
  updateCartTotal();
}

function checkOutCart() {
  cartItems.innerHTML = "";
  cart = [];
  document.querySelector("header").style.display = "none";
  updateCartTotal();
  alert("Checked Out");
}

function clearCart() {
  cartItems.innerHTML = "";
  cart = [];
  document.querySelector("header").style.display = "none";
  updateCartTotal();
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElement.innerText = `Total : $${parseFloat(total).toFixed(2)}`;
}

function inputQtyUpdate(id) {
  const quantity = parseInt(document.querySelector(`#qty${id}`).value, 10);
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    updateCartTotal();
  }
}

document.addEventListener("DOMContentLoaded", updateProductDetails);
document.querySelector("#checkOut").addEventListener("click", checkOutCart);
document.querySelector("#clearCart").addEventListener("click", clearCart);

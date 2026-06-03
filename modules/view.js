import * as model from "./model.js";
// import * as checkoutController from "./checkoutController.js";

export function renderProductGrid(products) {
  const container = document.querySelector(".product-grid");

  const html = products
    .map((p) => {
      // Builds the product card HTML
      return `
      <div class="product-card" data-id="${p.id}">

        <img src="${p.image}" alt="${p.name}" />

        <h3>${p.name}</h3>
        <p>€${p.price}</p>

      </div>
    `;
    })
    .join("");

  container.innerHTML = html;
}

export function renderCart(cart, products) {
  if (cart.length > 0) {
    renderLoadedCart(cart, products);
  } else {
    renderEmptyCart(cart, products);
  }
  return;
}

function renderLoadedCart(cart, products) {
  const container = document.querySelector(".cart-items");

  const html = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return `<div class="cart-item">
          <img src="${product.image}" class="product-image" />
          <div>
            <h4 class="product-name">${product.name}</h4>
            <p class="product-price">€${product.price.toFixed(2)}</p>

            <div class="qty-controls">
              <button class="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="increase" data-id="${item.id}">+</button>
              <button class="remove" data-id="${item.id}">×</button>
            </div>
          </div>
          <p>Sub Total: ${(item.quantity * product.price).toFixed(2)}</p>
        </div>
       
        `;
    })
    .join("");

  container.innerHTML = html;
}

function renderEmptyCart(cart, products) {
  if (model.state.cart.length < 1) {
    document.querySelector(".cart-total").style.display = "none";
    document.querySelector(".cart-items").textContent =
      `Your cart is Empty, Please add item(s)`;
    document.querySelector(".go-checkout").style.display = "none";
    // container.textContent = `Your cart is Empty`;
    // hideCheckout = "";
    // hideCartTotal.hidden = true;
    //   document.querySelector(".cart-page").textContent =
    //     `Your cart is Empty, Please add item(s)`;
  }
}

export function updateCartCount(cart) {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelector(".cart-count").textContent = count;
}

export function renderModal(product) {
  document.querySelector(".modal-img").src = product.image;
  document.querySelector(".modal-title").textContent = product.name;
  document.querySelector(".modal-desc").textContent = product.description;
  document.querySelector(".modal-price").textContent = `$ ${product.price}`;
  document.querySelector(".add-to-cart-modal").dataset.id = product.id;

  //Update favourite icon
  const isFav = model.state.favourites.includes(product.id);

  const heartIcon = isFav
    ? `<i class="fa-solid fa-heart fav-active"></i>`
    : `<i class="fa-regular fa-heart"></i>`;

  const favBtn = document.querySelector(".modal-fav-btn");
  favBtn.innerHTML = heartIcon;
  favBtn.dataset.id = product.id;
}

//Open and close modal
export function openModal() {
  document.querySelector(".modal-overlay").classList.add("open");
}

export function closeModal() {
  document.querySelector(".modal-overlay").classList.remove("open");
}

export function renderCheckout(cart, products) {
  const container = document.querySelector(".checkout-items");
  const productTotal = document.querySelector(".checkout-total");

  const html = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      console.log(product);
      console.log(item);
      return `
  <div class="checkout-item">
    <p>Product: ${product.name} <p>
    <p>Qty: ${item.quantity} <p>
    <p>Price: $ ${(product.price * item.quantity).toFixed(2)}<p>
    <p>Shipping fee: $ ${product.shipping.toFixed(2)}<p>
    </div>
  `;
    })
    .join("");

  container.innerHTML = html;

  const total = cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);
    return acc + (product.price * item.quantity + product.shipping);
  }, 0);

  productTotal.textContent = `Total: $ ${total.toFixed(2)}`;
}

export function showOrderSuccess() {
  const box = document.querySelector(".order-success");
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2000);
}

// function renderOrderSummary(cart, products) {
//   const container = document.querySelector(".order-items");
//   container.innerHTML = "";

//   model.state.cart.forEach((item) => {
//     const product = model.state.products.find((p) => p.id === item.id);
//     console.log(product);

//     container.insertAdjacentHTML(
//       "beforeend",
//       `
//       <div class="order-item">
//         <span>${product.name}</span>
//         <span>Qty: ${item.quantity}</span>
//         <span>€${product.price * item.quantity}</span>
//       </div>
//       `,
//     );
//   });

//   document.querySelector(".order-total").textContent =
//     "Total: $" + getCartTotal(model.state.cart, model.state.products);
// }

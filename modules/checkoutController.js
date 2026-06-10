import * as model from "./model.js";
import { getCartTotal } from "./model.js";

function loadCheckoutCart() {
  const saved = JSON.parse(localStorage.getItem("cart"));
  if (saved) model.state.cart = saved;
}

// function handleRenderOrderSummary(cart, products) {
//   renderOrderSummary(model.state.cart, model.state.products);
// }

function renderOrderSummary() {
  const container = document.querySelector(".order-items");
  if (!container) {
    console.error("order-items NOT FOUND in DOM");
    return;
  }
  container.innerHTML = "";

  model.state.cart.forEach((item) => {
    const product = model.state.products.find((p) => p.id === item.id);
    console.log(product);

    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="order-item">
        <span>${product.name}</span>
        <span>Qty: ${item.quantity}</span>
        <span>€${product.price * item.quantity}</span>
      </div>
      `,
    );
  });

  const subtotal = model.getCartTotal(model.state.cart, model.state.products);
  const shipping = model.state.shipping.fee;
  const total = subtotal + shipping;

  document.querySelector(".order-total").innerHTML = `
    Subtotal: $${subtotal}<br>
    Shipping: $${shipping}<br>
    <strong>Total: $${total}<Strong>
    `;
}

/*
function handlePlaceOrder() {
  const name = document.querySelector(".name").value;
  const address = document.querySelector(".address").value;
  const card = document.querySelector(".card-number").value;

  if (!name || !address || !card) {
    alert("Please fill all the required fields");
    return;
  }

  alert("Order palced successfully!");

  model.state.cart = [];
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
  */

async function handleStripePayment() {
  const items = model.state.cart.map((item) => {
    const product = model.state.products.find((p) => p.id === item.id);
    return {
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  items.push({
    name: `Shipping(${model.state.shipping.method})`,
    price: model.state.shipping.fee,
    quantity: 1,
  });

  const order = {
    items,
    total:
      model.getCartTotal(model.state.cart, model.state.products) +
      model.state.shipping.fee,
    date: new Date().toISOString(),
  };

  model.saveOrder(order);
  // model.clearCart();

  const res = await fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await res.json();
  localStorage.removeItem("cart");
  window.location.href = data.url;
}

// document
//   .querySelector(".place-order-btn")
//   .addEventListener("click", handleStripePayment);

async function initCheckout() {
  await model.loadProducts();
  loadCheckoutCart();
  renderOrderSummary();

  document.querySelectorAll("input[name='shipping']").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      model.updateShipping(e.target.value);
      renderOrderSummary();
    });
  });

  document
    .querySelector(".place-order-btn")
    .addEventListener("click", handleStripePayment);
}

initCheckout();
/////////////////////////////////////////////////////////////////

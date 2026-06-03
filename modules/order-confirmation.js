import * as model from "./model.js";

model.loadOrder(); //load last order from the localStorage

const itemBox = document.querySelector(".order-items");
const totalBox = document.querySelector(".order-total");

// 1. Load the order saved before redirecting to Stripe
const order = model.state.lastOrder;

// 2. Send the order to the backend database
if (order) {
  fetch("http://localhost:3000/save-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  })
    .then((res) => res.json())
    .then((data) => console.log("Order saved:", data))
    .catch((err) => console.error("Error saving order:", err));
}

if (order) {
  order.items.forEach((item) => {
    console.log(item);
    const div = document.createElement("div");
    div.innerHTML = `
    <span>${item.name}  ${item.quantity}</span>
    <span>$${item.price * item.quantity}</span>
    `;
    itemBox.appendChild(div);
  });

  totalBox.textContent = `Total: $${order.total}`;
}

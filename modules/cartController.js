import * as model from "./model.js";
import * as view from "./view.js";

async function cartInit() {
  await model.loadProducts();
  model.loadCart();

  view.renderCart(model.state.cart, model.state.products);
  updateCartTotal();
  setupCartEvents();
}

function updateCartTotal() {
  const total = model.getCartTotal(model.state.cart, model.state.products);
  document.querySelector(".cart-total").textContent =
    `Grand Total: €${total.toFixed(2)}`;
}

function setupCartEvents() {
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase")) {
      model.increaseQty(e.target.dataset.id);
      refresh();
    }

    if (e.target.classList.contains("decrease")) {
      model.decreaseQty(e.target.dataset.id);
      refresh();
    }

    if (e.target.classList.contains("remove")) {
      model.removeFromCart(e.target.dataset.id);
      refresh();
    }

    if (e.target.classList.contains("go-checkout")) {
      localStorage.setItem("cart", JSON.stringify(model.state.cart));
      window.location.href = "checkout.html";
    }
  });
}

function refresh() {
  view.renderCart(model.state.cart, model.state.products);
  updateCartTotal();
  model.saveCart();
}

cartInit();

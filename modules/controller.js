import * as model from "./model.js";
import * as view from "./view.js";
// import * as checkoutController from "./checkoutController.js";

function init() {
  model.loadProducts();

  // view.renderProductGrid(model.state.products);

  model.loadCart();
  updateProductGrid();
  updateCartUI();
}
init();

function updateCartUI() {
  // view.renderCart(model.state.cart, model.state.products);
  view.updateCartCount(model.state.cart);

  const total = model.getCartTotal(model.state.cart, model.state.products);
  console.log(total);

  // document.querySelector(".cart-total").textContent = `$ ${total.toFixed(2)}`;
}

function handleAddToCart(productId) {
  model.addToCart(productId);
  updateCartUI();
}

document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    handleAddToCart(e.target.dataset.id);
  }

  if (e.target.classList.contains("increase")) {
    model.increaseQty(e.target.dataset.id);
    updateCartUI();
  }

  if (e.target.classList.contains("decrease")) {
    model.decreaseQty(e.target.dataset.id);
    updateCartUI();
  }

  if (e.target.classList.contains("remove")) {
    model.removeFromCart(e.target.dataset.id);
    updateCartUI();
  }
});

document.querySelector(".cart-icon").addEventListener("click", () => {
  document.querySelector(".cart-sidebar").classList.add("open");
});

// document.body.addEventListener("click", (e) => {
//   if (!e.target.classList.contains("cart-icon")) {
//     document.querySelector(".cart-sidebar").classList.remove("open");
//   }
// });

/////////////Modal
document.body.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (card) {
    const id = card.dataset.id;
    handleOpenModal(id);
  }

  if (
    e.target.classList.contains("close-modal") ||
    e.target.classList.contains("modal-overlay")
  ) {
    view.closeModal();
  }

  if (e.target.classList.contains("add-to-cart-modal")) {
    handleAddToCart(e.target.dataset.id);
    view.closeModal();
  }
});

function handleOpenModal(productId) {
  const product = model.state.products.find((p) => p.id === productId);
  view.renderModal(product);
  view.openModal();
}

document.body.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".modal-fav-btn");
  if (!favBtn) return;

  const id = favBtn.dataset.id;

  // if (!id) console.error("No data-id found on the favorite button!");
  // return;

  model.toggleFavourite(id);

  // Re-render modal to update heart icon
  const updatedProduct = model.state.products.find((p) => p.id === id);
  // if (!updatedProduct)
  //   console.error(`Product with ID ${id} could not be found in the state.`);
  // return;

  view.renderModal(updatedProduct);
});

//Filters system
document.querySelector(".search").addEventListener("input", (e) => {
  model.updateFilter("search", e.target.value);
  updateProductGrid();
});

document.querySelector(".filter-category").addEventListener("change", (e) => {
  model.updateFilter("category", e.target.value);
  updateProductGrid();
});

document.querySelector(".filter-price").addEventListener("input", (e) => {
  model.updateFilter("maxPrice", Number(e.target.value));
  updateProductGrid();
  document.querySelector(".price-value").textContent = `$ ${e.target.value}`;
  updateProductGrid();
});

document.querySelector(".filter-rating").addEventListener("change", (e) => {
  model.updateFilter("rating", Number(e.target.value));
  updateProductGrid();
});

function updateProductGrid() {
  const filtered = model.getFilteredProducts();
  view.renderProductGrid(filtered);
}

// document.querySelector(".go-checkout").addEventListener("click", () => {
//   window.location.href = "checkout.html";
// });

document.querySelector(".cart-icon").addEventListener("click", () => {
  window.location.href = "cart.html";
});

export function favouritesPageController() {
  const container = document.getElementById("favourites-container");

  view.renderFavourites(
    container,
    model.state.products,
    model.state.favourites,
  );

  container.addEventListener("click", (e) => {
    if (e.target.closest(".remove-fav-btn")) {
      const id = Number(e.target.closest(".remove-fav-btn").dataset.id);

      model.toggleFavourite(id);
      initFavouritesPage(); // re-render
    }
  });
}

//Toggle Fav Controller
// document.querySelectorAll(".fav-btn").forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     const id = Number(e.target.closest(".fav-btn").dataset.id);
//     model.toggleFavourite(id);
//     renderProducts();
//   });
// });

///////////////////////////////////////////////////////
const revString = function (string) {
  return string.split("").reverse().join("");
};

const reverseHello = revString("Hello");
console.log(reverseHello);

//using for loop
function reverseString(str) {
  let reversed = "";
  for (let char of str) {
    reversed = char + reversed;
  }
  return reversed;
}

const revStr = reverseString("Hello");
console.log(revStr);

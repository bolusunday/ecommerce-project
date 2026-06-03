import * as model from "./model.js";
import * as view from "./view.js";

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

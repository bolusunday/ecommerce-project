import { products as productData } from "../data/products.js";

export const state = {
  products: [],
  cart: [],
  filters: {
    search: "",
    category: "all",
    maxPrice: 200,
    rating: 0,
  },
  shipping: {
    method: "Standard",
    fee: 5,
  },
  favourites: [],

  lastOrder: null,
};

export function updateFilter(type, value) {
  state.filters[type] = value;
}

export function getFilteredProducts() {
  return state.products
    .filter((p) =>
      p.name.toLowerCase().includes(state.filters.search.toLowerCase()),
    )
    .filter(
      (p) =>
        state.filters.category === "all" ||
        p.category === state.filters.category,
    )
    .filter((p) => p.price <= state.filters.maxPrice)
    .filter((p) => p.rating >= state.filters.rating);
}

export function loadProducts() {
  state.products = productData;
}

export function addToCart(productId) {
  const item = state.cart.find((i) => i.id === productId);

  if (item) {
    item.quantity++;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
}

export function increaseQty(id) {
  const item = state.cart.find((i) => i.id === id);
  item.quantity++;
  saveCart();
}

export function decreaseQty(id) {
  const item = state.cart.find((i) => i.id === id);
  console.log(item);
  if (item.quantity > 1) item.quantity--;
  else removeFromCart(id);
  saveCart();
}

export function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
}

/////////////Save and Load Cart

export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

export function loadCart() {
  const data = JSON.parse(localStorage.getItem("cart"));
  if (data) state.cart = data;
  console.log(data);
}

////////Cart Total//////////////////
export function getCartTotal(cart, products) {
  return cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);

    return acc + product.price * item.quantity;
  }, 0);
}

///update Shipping
export function updateShipping(method) {
  const fees = {
    standard: 5,
    express: 15,
    overnight: 25,
  };

  state.shipping.method = method;
  state.shipping.fee = fees[method];
}

//Add favourites
export function loadFavourites() {
  const saved = JSON.parse(localStorage.getItem("favourites"));
  if (saved) state.favourites = saved;
}

function saveFavourites() {
  localStorage.setItem("favourites", JSON.stringify(state.favourites));
}

export function toggleFavourite(productId) {
  const index = state.favourites.indexOf(productId);
  if (!productId) return;

  if (index === -1) {
    state.favourites.push(productId);
  } else {
    state.favourites.splice(index, 1);
  }
  localStorage.setItem("favourites", JSON.stringify(state.favourites));
}

//Order Confirmation
export function saveOrder(order) {
  state.lastOrder = order;
  localStorage.setItem("lastOrder", JSON.stringify(order));
}

export function loadOrder() {
  const saved = JSON.parse(localStorage.getItem("lastOrder"));
  if (saved) state.lastOrder = saved;
}

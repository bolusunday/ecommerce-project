const orderList = document.querySelector(".orders-list");

async function loadOrders() {
  try {
    const res = await fetch("http://localhost:3000/orders");
    const orders = await res.json();

    if (orders.length === 0) {
      ordersList.innerHTML = "<p>No orders found.</p>";
      return;
    }

    ordersList.innerHTML = orders
      .map((order) => {
        const items = JSON.parse(order.items);

        return `
      <div class="order-card">
            <div class="order-header">
              <span><strong>Order #${order.id}</strong></span>
              <span>${order.date}</span>
            </div>

            <div class="order-items">
              ${items
                .map((item) => `• Product ID: ${item.id} — Qty: ${item.qty}`)
                .join("<br>")}
            </div>

            <div class="order-total">
              Total: €${order.total}
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Failed to load orders:", error);
    ordersList.innerHTML = "<p>Error loading orders.</p>";
  }
}

loadOrders();

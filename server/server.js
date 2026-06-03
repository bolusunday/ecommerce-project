import express from "express";
import Stripe from "stripe";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // starts with sk_live_ or sk_test_

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: "http://localhost:5500/order-confirmation.html",
    cancel_url: "http://localhost:5500/checkout.html",
  });

  res.json({ url: session.url });
});

//The orders route for order history
app.get("/orders", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM orders ORDER BY id DESC");
    const orders = stmt.all();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

//DB
app.post("/save-order", (req, res) => {
  const { items, total, date } = req.body;

  const stmt = db.prepare(`
    INSERT INTO orders (items, total, date)
    VALUES (?, ?, ?)
  `);

  stmt.run(JSON.stringify(items), total, date);

  res.json({ message: "Order saved successfully" });
});

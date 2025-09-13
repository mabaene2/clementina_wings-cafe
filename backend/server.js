const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "database.json");

// --------------------
// Utility functions to read/write database
// --------------------
const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (error) {
    return { products: [], sales: [], stockTransactions: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// --------------------
// Product routes
// --------------------
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const db = readDB();

  // New product
  const newProduct = {
    id: Date.now(),
    ...req.body,
    quantity: req.body.quantity || 0, // default quantity
  };

  db.products.push(newProduct);
  writeDB(db);

  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const productId = parseInt(req.params.id);
  const index = db.products.findIndex((p) => p.id === productId);

  if (index === -1) return res.status(404).json({ error: "Product not found" });

  db.products[index] = { ...db.products[index], ...req.body };
  writeDB(db);

  res.json(db.products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const productId = parseInt(req.params.id);

  db.products = db.products.filter((p) => p.id !== productId);
  writeDB(db);

  res.json({ message: "Deleted successfully" });
});

// --------------------
// Stock management routes
// --------------------
app.get("/api/stock", (req, res) => {
  const db = readDB();
  res.json(db.stockTransactions);
});

app.post("/api/stock", (req, res) => {
  const { productId, change, reason } = req.body;

  if (!productId || typeof change !== "number") {
    return res.status(400).json({ error: "Invalid stock data" });
  }

  const db = readDB();
  const product = db.products.find((p) => p.id === parseInt(productId));

  if (!product) return res.status(404).json({ error: "Product not found" });

  // Update product quantity
  product.quantity += change;

  // Log stock transaction
  const stockTransaction = {
    id: Date.now(),
    productId: parseInt(productId),
    change,
    reason: reason || "manual adjustment",
    date: new Date().toISOString(),
  };

  db.stockTransactions.push(stockTransaction);

  // Save changes to database
  writeDB(db);

  res.status(201).json({ product, stockTransaction });
});

// --------------------
// Sales routes
// --------------------
app.get("/api/sales", (req, res) => {
  const db = readDB();
  res.json(db.sales);
});

app.post("/api/sales", (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid sale data" });
  }

  const db = readDB();
  const product = db.products.find((p) => p.id === parseInt(productId));

  if (!product) return res.status(404).json({ error: "Product not found" });

  if (product.quantity < quantity) {
    return res.status(400).json({ error: "Insufficient stock available" });
  }

  // Deduct stock
  product.quantity -= quantity;

  // Record sale
  const sale = {
    id: Date.now(),
    productId: parseInt(productId),
    quantity,
    date: new Date().toISOString(),
  };
  db.sales.push(sale);

  // Record stock transaction as a sale
  const stockTransaction = {
    id: Date.now() + 1,
    productId: parseInt(productId),
    change: -quantity,
    reason: "sale",
    date: new Date().toISOString(),
  };
  db.stockTransactions.push(stockTransaction);

  // Save changes
  writeDB(db);

  res.status(201).json({ sale, updatedProduct: product });
});

// --------------------
// Dashboard route
// --------------------
app.get("/api/dashboard", (req, res) => {
  const db = readDB();

  const totalProducts = db.products.length;
  const lowStockProducts = db.products.filter((p) => p.quantity <= 10).length;
  const totalSales = db.sales.reduce((sum, s) => {
    const product = db.products.find((p) => p.id === s.productId);
    return sum + (product ? product.price * s.quantity : 0);
  }, 0);

  res.json({ totalProducts, lowStockProducts, totalSales });
});

// --------------------
// Start server
// --------------------
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running and updating database on http://localhost:${PORT}`)
);

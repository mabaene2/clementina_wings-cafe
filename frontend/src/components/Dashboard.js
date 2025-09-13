import React, { useEffect, useState } from "react";

const Dashboard = ({ products }) => {
  const [stats, setStats] = useState({});

  const fetchDashboard = async () => {
    try {
      const res = await fetch("https://clementina-wings-cafe.onrender.com/api/dashboard");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setStats({});
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-container">

      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Stock Inventory System on the Left */}
        <span
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            color: "#333",
            backgroundColor: "#f4f4f4",
            padding: "6px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Stock Inventory System
        </span>

        {/* Dashboard Centered */}
        <h1
          className="dashboard-title"
          style={{
            fontSize: "2rem",
            flexGrow: 1,
            textAlign: "center",
            margin: 0,
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Top Dashboard Metrics */}
      <div className="dashboard-metrics">
        <div className="metric-card total-products">
          <h3>{stats.totalProducts || 0}</h3>
          <p>Total Products</p>
        </div>
        <div className="metric-card low-stock">
          <h3>{stats.lowStockProducts || 0}</h3>
          <p>Low Stock Items</p>
        </div>
        <div className="metric-card total-stock">
          <h3>M{stats.totalSales || 0}</h3>
          <p>Total Sales</p>
        </div>
      </div>

      {/* Product Menu Section */}
      <h2 className="menu-title" style={{ marginTop: "30px" }}>Product Menu</h2>
      <div
        className="dashboard-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 280px)", // exactly 2 rows
          gap: "20px",
          padding: "10px",
        }}
      >
        {products.slice(0, 6).map((product) => {
          const stockClass =
            product.quantity === 0
              ? "out-of-stock"
              : product.quantity <= 10
              ? "low-stock-alert"
              : "in-stock";

          return (
            <div
              key={product.id}
              className={`product-card ${stockClass}`}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Product Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    margin: "0 auto 10px auto",
                    borderRadius: "8px",
                  }}
                />
              )}

              {/* Product Info */}
              <div>
                <h3 style={{ fontSize: "1.1rem", margin: "5px 0" }}>
                  {product.name}
                </h3>
                <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                  Price: M{product.price}
                </p>
                <p style={{ margin: "5px 0" }}>Stock: {product.quantity}</p>
                <span
                  className="status"
                  style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    backgroundColor:
                      product.quantity === 0
                        ? "#ff6b6b"
                        : product.quantity <= 10
                        ? "#f7d794"
                        : "#6cc070",
                    color: "#000",
                    fontWeight: "500",
                  }}
                >
                  {product.quantity === 0
                    ? "Out of Stock"
                    : product.quantity <= 10
                    ? "Low Stock"
                    : "In Stock"}
                </span>
              </div>
            </div>
          );
        })}

        {/* Fill empty cards if fewer than 6 products */}
        {Array.from({ length: 6 - products.length }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            style={{
              border: "1px solid transparent",
              height: "280px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

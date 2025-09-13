import React, { useState } from "react";

const Sales = ({ products = [], sales = [], fetchProducts, fetchSales }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantitySold, setQuantitySold] = useState(0);

  const handleSale = async () => {
    if (!selectedProduct || quantitySold <= 0) return alert("Enter valid values");

    try {
      const res = await fetch("https://clementina-wings-cafe.onrender.com/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(selectedProduct),
          quantity: Number(quantitySold),
        }),
      });

      const result = await res.json();
      if (!res.ok) return alert(result.error);

      setSelectedProduct("");
      setQuantitySold(0);
      fetchProducts(); // update inventory/products
      fetchSales();    // refresh sales table
    } catch (err) {
      console.error(err);
      alert("Failed to record sale");
    }
  };

  return (
    <div className="sales-container">
      <h1>Sales</h1>

      <div className="sales-form">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>
          {(products || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantitySold}
          onChange={(e) => setQuantitySold(e.target.value)}
        />
        <button onClick={handleSale}>Record Sale</button>
      </div>

      <h3>Sales Records</h3>
      <table className="sales-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {(sales || []).map((s) => {
            const product = (products || []).find((p) => p.id === s.productId);
            return (
              <tr key={s.id}>
                <td>{product ? product.name : "Deleted"}</td>
                <td>{s.quantity}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;

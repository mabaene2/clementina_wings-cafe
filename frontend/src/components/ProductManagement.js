import React, { useState } from "react";

const ProductManagement = ({ products, fetchProducts }) => {
  const [form, setForm] = useState({ name: "", price: "", quantity: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  // Handle text & number inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input (convert image to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result }); // save base64 image
    };
    reader.readAsDataURL(file);
  };

  // Add or Update Product
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.quantity || !form.image) {
      return alert("Please fill out all fields and upload an image.");
    }

    try {
      const url = editingId
        ? `https://clementina-wings-cafe.onrender.com/api/products/${editingId}`
        : "https://clementina-wings-cafe.onrender.com/api/products";
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          quantity: Number(form.quantity),
          image: form.image, // save base64 image to backend
        }),
      });

      // Clear form and reset edit state
      setForm({ name: "", price: "", quantity: "", image: "" });
      setEditingId(null);

      // Refresh product table
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  // Load product into form for editing
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.image || "",
    });
    setEditingId(product.id);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await fetch(`https://clementina-wings-cafe.onrender.com/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      <h1>Product Management</h1>

      <form>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        {/* File input for adding or updating an image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="button" onClick={handleSubmit}>
          {editingId ? "Update" : "Add"} Product
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(products || []).map((p) => (
            <tr key={p.id}>
              <td>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    width="50"
                    height="50"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{p.name}</td>
              <td>M{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;

import React, { useState } from "react";

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
  const [form, setForm] = useState({
    name: editingProduct?.name || "",
    price: editingProduct?.price || "",
    quantity: editingProduct?.quantity || "",
    image: editingProduct?.image || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.quantity) {
      return alert("Please fill out all required fields.");
    }

    try {
      const url = editingProduct
        ? `https://clementina-wings-cafe.onrender.com/api/products/${editingProduct.id}`
        : "https://clementina-wings-cafe.onrender.com/api/products";
      const method = editingProduct ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          quantity: Number(form.quantity),
          image: form.image || "", // optional
        }),
      });

      setForm({ name: "", price: "", quantity: "", image: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  const handleCancel = () => {
    setForm({ name: "", price: "", quantity: "", image: "" });
    setEditingProduct(null);
  };

  return (
    <div>
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="button" onClick={handleSubmit}>
          {editingProduct ? "Update" : "Add"} Product
        </button>
        {editingProduct && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
    </div>
  );
};

export default ProductForm;

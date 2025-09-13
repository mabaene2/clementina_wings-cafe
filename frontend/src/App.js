import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Reporting from "./components/Reporting";
import "./App.css";


function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sales");
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSales([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard products={products} />} />
            <Route path="/products" element={<ProductManagement products={products} fetchProducts={fetchProducts} />} />
            <Route path="/inventory" element={<Inventory products={products} />} />
            <Route path="/sales" element={<Sales products={products} sales={sales} fetchProducts={fetchProducts} fetchSales={fetchSales} />} />
            <Route path="/reporting" element={<Reporting products={products} sales={sales} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

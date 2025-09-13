import React from 'react';

function Reporting({ products, sales }) {
  const totalSales = sales.reduce((sum, s) => {
    const product = products.find(p => p.id === s.productId);
    return sum + (product ? product.price * s.quantity : 0);
  }, 0);

  return (
    <div>
      <h1>Reporting</h1>

      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.quantity}</td></tr>)}
        </tbody>
      </table>

      <h2>Sales</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th><th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => {
            const product = products.find(p => p.id === s.productId);
            const amount = product ? product.price * s.quantity : 0;
            return <tr key={s.id}><td>{product ? product.name : 'Unknown'}</td><td>${amount}</td></tr>;
          })}
        </tbody>
      </table>

      <h3>Total Sales: M{totalSales}</h3>
    </div>
  );
}

export default Reporting;

import React from "react";

const Inventory = ({ products }) => (
  <div>
    <h1>Inventory</h1>
    <table>
      <thead>
        <tr>
          <th>Image</th><th>Name</th><th>Price</th><th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {(products || []).map(p => (
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
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Inventory;

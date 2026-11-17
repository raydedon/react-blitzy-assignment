import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../cart/cartContext";
import { formatPrice } from "../utils/formatPrice";

function CartPage() {
  const { state } = useCart();
  const [search, setSearch] = useState("");

  const cartItems = state.listOfProducts.filter((product) =>
    state.selectedProducts.includes(product.productId),
  );
  const total = cartItems.reduce((sum, product) => sum + product.price, 0);

  const needle = search.trim().toLowerCase();
  const visibleItems = needle
    ? cartItems.filter(
        (product) =>
          product.productName.toLowerCase().includes(needle) ||
          String(product.productId).includes(needle),
      )
    : cartItems;

  return (
    <section className="page">
      <h1>Cart</h1>
      <input
        type="search"
        className="search"
        placeholder="Search ..."
        aria-label="Search cart"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="data-table">
        <thead>
          <tr>
            <th className="col-productId">ProductId</th>
            <th className="col-productName">Product Name</th>
            <th className="col-price">Price</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.length > 0 ? (
            visibleItems.map((product) => (
              <tr key={product.productId}>
                <td className="col-productId">{product.productId}</td>
                <td className="col-productName">{product.productName}</td>
                <td className="col-price">{formatPrice(product.price)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="empty">
                {cartItems.length === 0 ? (
                  <>
                    Your cart is empty. <Link to="/">Browse products</Link>
                  </>
                ) : (
                  <>No cart items match “{search}”</>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="total">
        Total ({cartItems.length} {cartItems.length === 1 ? "item" : "items"}):{" "}
        <strong>{formatPrice(total)}</strong>
      </p>
    </section>
  );
}

export default CartPage;

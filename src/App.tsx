import { NavLink, Route, Routes } from "react-router";
import { useCart } from "./cart/cartContext";
import CartPage from "./pages/CartPage";
import ProductListPage from "./pages/ProductListPage";
import "./App.css";

function App() {
  const { state } = useCart();

  return (
    <>
      <nav className="nav">
        <NavLink to="/" end>
          Products
        </NavLink>
        <NavLink to="/cart">Cart ({state.selectedProducts.length})</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

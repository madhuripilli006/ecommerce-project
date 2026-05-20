import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function Navbar() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const linkClass = (path) =>
    `btn rounded-pill px-3 ${
      location.pathname === path
        ? "btn-light nav-active"
        : "btn-outline-light"
    }`;

  return (
    <nav className="navbar navbar-dark shadow-sm px-0">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">

        <Link className="navbar-brand fw-bold" to="/">
          E-Commerce
        </Link>

        <div className="d-flex flex-wrap align-items-center gap-2">

          <Link className={linkClass("/")} to="/">
            Products
          </Link>

          {token && (
            <>
              <Link className={linkClass("/cart")} to="/cart">
                🛒 Cart
              </Link>

              <Link className={linkClass("/orders")} to="/orders">
                Orders
              </Link>
            </>
          )}

          {!token ? (
            <>
              <Link className={linkClass("/login")} to="/login">
                Login
              </Link>

              <Link className={linkClass("/register")} to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-light px-2 fw-semibold">
                Welcome 👋
              </span>

              <button
                className="btn btn-warning rounded-pill px-3"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="text-center py-4 mt-5 text-muted">
      <div className="container">
        <p className="mb-1">© 2026 E-Commerce Store</p>

        <small>
          Built with React, Node.js, Express & MySQL
        </small>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
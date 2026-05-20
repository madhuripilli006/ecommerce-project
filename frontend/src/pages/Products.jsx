import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const categories = [
  "All",
  "Electronics",
  "Footwear",
  "Kitchen",
  "Fitness",
  "Fashion",
  "Stationery",
];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const description = (product.description || "").toLowerCase();
      const category = (product.category || "Electronics").toLowerCase();

      const query = search.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        description.includes(query);

      const matchesCategory =
        activeCategory === "All" ||
        category === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "priceLow") {
      return [...filtered].sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "priceHigh") {
      return [...filtered].sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return [...filtered].sort(
      (a, b) => Number(b.id) - Number(a.id)
    );
  }, [products, search, activeCategory, sortBy]);

  const addToCart = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          product_id: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to cart");
    } catch (error) {
      alert("Login first");
    }
  };

  return (
    <div className="container py-4">

      {/* HERO SECTION */}

      <div className="hero mb-5">
        <div className="row align-items-center">
          <div className="col-lg-7">

            <span className="badge bg-light text-dark px-3 py-2 mb-3 rounded-pill">
              New Collection 2026
            </span>

            <h1 className="display-4 fw-bold mb-3">
              Discover Amazing Products
            </h1>

            <p
              className="text-light opacity-75 mb-4"
              style={{ maxWidth: "600px" }}
            >
              Shop electronics, fashion, fitness and more
              with a clean modern shopping experience.
            </p>

            <div className="d-flex gap-3 flex-wrap">

              <button
                className="btn btn-light rounded-pill px-4 py-2 fw-semibold"
                onClick={() => setActiveCategory("All")}
              >
                Shop Now
              </button>

              <button
                className="btn btn-outline-light rounded-pill px-4 py-2"
                onClick={() =>
                  document
                    .getElementById("products-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Explore
              </button>

            </div>
          </div>

          <div className="col-lg-5 text-center mt-4 mt-lg-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="shopping"
              style={{
                width: "260px",
                filter:
                  "drop-shadow(0 10px 30px rgba(0,0,0,0.4))",
              }}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <h2 className="fw-bold mb-0">
          Products
        </h2>

        <div className="d-flex align-items-center gap-3">

          <span className="text-muted fw-semibold">
            {filteredProducts.length} products
          </span>

          <select
            className="form-control search-input"
            style={{ width: "200px" }}
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="newest">
              Newest
            </option>

            <option value="priceLow">
              Price: Low to High
            </option>

            <option value="priceHigh">
              Price: High to Low
            </option>
          </select>

        </div>
      </div>

      {/* SEARCH */}

      <input
        className="form-control search-input mb-4"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* CATEGORY FILTERS */}

      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn category-btn ${
              activeCategory === category
                ? "btn-light nav-active"
                : "btn-outline-light"
            }`}
            onClick={() =>
              setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div id="products-section">

          {filteredProducts.length === 0 ? (

            <div className="empty-state">
              <h4 className="mb-2">
                No products found
              </h4>

              <p className="mb-0 text-muted">
                Try searching another category.
              </p>
            </div>

          ) : (

            <div className="row g-4">

              {filteredProducts.map((product) => (

                <div
                  className="col-12 col-md-6 col-lg-4"
                  key={product.id}
                >

                  <div className="product-card h-100">

                    <div className="product-image-box">

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-img"
                        />

                      ) : (

                        <div className="product-placeholder">
                          Product Image
                        </div>

                      )}

                    </div>

                    <div className="card-body p-4">

                      <span className="badge bg-primary mb-3 rounded-pill px-3 py-2">
                        {product.category || "Electronics"}
                      </span>

                      <h5 className="product-title">
                        {product.name}
                      </h5>

                      <p className="product-description small">
                        {product.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-3">

                        <span className="product-price">
                          ₹ {product.price}
                        </span>

                        <button
                          className="btn btn-primary rounded-pill px-4 py-2"
                          onClick={() =>
                            addToCart(product.id)
                          }
                        >
                          🛒 Add to Cart
                        </button>

                      </div>
                    </div>
                  </div>
                </div>

              ))}

            </div>

          )}

        </div>
      )}
    </div>
  );
}

export default Products;
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("token");

  const loadCart = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Item removed");

      loadCart();
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders/place",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully");

      loadCart();
    } catch (error) {
      toast.error("Could not place order");
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  if (!token) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">
          Please log in to view your cart
        </h3>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold mb-0">
          Your Cart
        </h2>

        <span className="text-muted">
          {cartItems.length} items
        </span>

      </div>

      {cartItems.length === 0 ? (

        <div className="empty-state">

          <h4 className="mb-2">
            Your cart is empty
          </h4>

          <p className="mb-0 text-muted">
            Add products to continue shopping.
          </p>

        </div>

      ) : (

        <>
          <div className="row g-4">

            {cartItems.map((item) => (

              <div
                className="col-12 col-md-6 col-lg-4"
                key={item.id}
              >

                <div className="cart-card h-100">

                  <div className="mb-3">

                    <span className="badge bg-primary rounded-pill px-3 py-2">
                      Cart Item
                    </span>

                  </div>

                  <h4 className="fw-bold mb-2">
                    {item.name}
                  </h4>

                  <p className="mb-2">
                    Price: ₹ {item.price}
                  </p>

                  <p className="mb-4">
                    Quantity: {item.quantity}
                  </p>

                  <button
                    className="btn btn-outline-danger rounded-pill"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>
              </div>

            ))}

          </div>

          <div className="mt-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>
              <h3 className="fw-bold mb-1">
                Total Amount
              </h3>

              <h2 className="fw-bold">
                ₹ {totalAmount}
              </h2>
            </div>

            <button
              className="btn btn-success rounded-pill px-5 py-3"
              onClick={placeOrder}
            >
              Place Order
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
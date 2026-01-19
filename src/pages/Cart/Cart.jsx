import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { getApi, postApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";

const CheckoutForm = ({ cartData }) => {
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { checkoutData, loading, fetchCheckoutSession } = useStripeCheckout();

  // Monitor checkoutData for updates and redirect when session URL is available
  useEffect(() => {
    if (checkoutData && checkoutData.session && checkoutData.session.url) {
      // Ensure URL opens in the same tab
      window.location.replace(checkoutData.session.url);
    }
  }, [checkoutData]);

  const handleCheckout = async () => {
    setCheckoutLoading(true);

    try {
      // Create the order first
      const orderResponse = await new Promise((resolve, reject) => {
        postApi(
          endPoints.cart.cartCheckout(),
          {},
          {
            setResponse: (data) => resolve(data),
            setError: (error) => reject(error),
          }
        );
      });
      
      if (orderResponse && orderResponse.data && orderResponse.data._id) {
        // Create a Stripe Checkout Session with the order ID
        await fetchCheckoutSession(orderResponse.data._id);
        // The useEffect above will handle the redirect once checkoutData is updated
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout process error:", error);
      alert("Checkout failed: " + (error.message || "Unknown error"));
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="cart-summary">
      <div className="summary-box">
        <h2 className="!my-0">Order Summary</h2>
        <div className="summary-row">
          {/* <span>Subtotal</span>
          <span> $ {cartData.subTotal} </span> */}
        </div>
        <div className="summary-total !border-0">
          <span>Processing fee</span>
          <span> $ 1 </span>
        </div>
        <div className="summary-total !border-0">
          <span>Taxes</span>
          <span> $ 0 </span>
        </div>
        <div className="summary-total">
          <span>Processing fee</span>
          <span> $ 1 </span>
        </div>
        <div className="flex items-center gap-2 mt-5">
          <input type="checkbox" name="" id="" className="accent-[#ff3333] scale-150" />
          <span className="leading-[1.2]">You agree to our <a href="" className="text-[#ff3333]">terms and conditions</a></span>
        </div>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={checkoutLoading || loading}
        >
          {checkoutLoading || loading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(() => {
    setIsLoading(true);
    getApi(endPoints.cart.getCart(), {
      setResponse: (data) => {
        if (data.success) {
          setCartData(data.cart);
        }
        setIsLoading(false);
      },
      setError: (error) => {
        console.error("Error fetching cart:", error);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading) return     <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "40vh", // full viewport height
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>;
  if (!cartData)
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="cart-page">
      <div className="cart-container !max-w-[992px] !mt-10">
        <h1>Shopping Cart ({cartData.quantity || 1} item)</h1>
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-item">
              <img
                src={
                  cartData.productId?.productImages?.[0]?.image ||
                  "/api/placeholder/120/120"
                }
                alt={cartData.productId?.name || "Product"}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h3>{cartData.productId?.name}</h3>
                <p className="location">{cartData.productId?.locationValue}</p>
                {/* <p className="price"> $ {cartData.total}</p> */}
                <p className="quantity">Quantity: {cartData.quantity}</p>
              </div>
            </div>
          </div>
          <CheckoutForm cartData={cartData} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
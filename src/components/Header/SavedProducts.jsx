import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoHeart, IoLocationSharp } from "react-icons/io5";
import "./SavedProducts.css";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import Swal from "sweetalert2";

const SavedProducts = () => {
  const { getLikeProductList, productLikeAndUnlike, likeProduct } =
    useStripeCheckout();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.data?._id;

  const [loading, setLoading] = useState(true);

  // Fetch liked products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await getLikeProductList();
      setLoading(false);
    };
    if (userId) fetchProducts();
  }, [userId]);

  // Handle remove from favorites with SweetAlert confirm
  const handleFavoriteClick = async (productId) => {
    const result = await Swal.fire({
      title: "Remove from favorites?",
      text: "Are you sure you want to unlike this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await productLikeAndUnlike(productId);
        await getLikeProductList(); // refresh list after remove
        setLoading(false);

        Swal.fire("Removed!", "The product has been removed.", "success");
      } catch (error) {
        console.error("Error removing product:", error);
        setLoading(false);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="saved-products-container">
        <h2 className="saved-products-title">Saved Products</h2>
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-products-container min-h-screen">
      <h2 className="saved-products-title">Saved Products</h2>
      <div className="saved-products-grid">
        {likeProduct?.docs?.length > 0 ? (
          likeProduct.docs.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-wrapper">
                {product.productImages?.[0]?.image ? (
                  <img
                    src={product.productImages[0].image}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <button
                  className="favorite-btn"
                  onClick={() => handleFavoriteClick(product._id)}
                >
                  <IoHeart style={{ color: "red" }} />
                </button>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-location">
                  <IoLocationSharp /> {product.locationValue}
                </p>
                <div
                  className="product-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
              <button
                className="view-details-btn"
                onClick={() => navigate(`/products/?id=${product._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="no-products-text">No saved products found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;

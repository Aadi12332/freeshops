import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import QRcode from "../../components/CommonComponent/QRcode";
import SeachByCities from "../../components/CommonComponent/SeachByCities";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import styles from "../../css/home.module.css";
import WhatsAppButton from "../../components/CommonComponent/WhatsAppButton";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const fetchProduct = useCallback(() => {
    setLoading(true);
    const searchQuery = searchParams.get("search") || "";

    const queryParams = new URLSearchParams({
      page: page,
      limit: 21,
      ...(searchQuery && { search: searchQuery }),
    });

    getApi(endPoints.products.getAllProducts(queryParams.toString()), {
      setResponse: (data) => {
        setProducts(data?.data?.docs || []);
        setTotalPages(data?.data?.totalPages || 0);
        setLoading(false);
      },
      setError: () => {
        setLoading(false);
        setProducts([]);
      },
    });
  }, [page, location.search]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    setPage(1);
  }, [location.search]);

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="container min-h-screen flex justify-center items-center">
        <h2>No data found</h2>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid mt-3 px-lg-4">
        <div className="py-4">
          <QRcode />
        </div>

        {/* ✅ Responsive Inline CSS Grid */}
        <div
          className="w-full grid gap-4"
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {products.map((product) => (
            <div className={styles.product} key={product._id}>
              <div className={styles.thumbnail}>
                <img
                  src={product?.productImages?.[0]?.image}
                  alt={product.name}
                  onClick={() => navigate(`/products/?id=${product?._id}`)}
                />
              </div>
              <div className={styles.product_info}>
                <Link to={`/product/?id=${product?._id}`}>
                  <h6 className={styles.product_name}>{product.name}</h6>
                </Link>
                <p className={styles.location}>{product.locationValue}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center my-4">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`mx-1 px-3 py-1 ${
                  page === index + 1 ? "btn btn-dark" : "btn btn-light"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}


      </div>

      {/* ✅ Media Queries for Responsive Columns */}
      <style>
        {`
          @media (min-width: 640px) {
            .w-full {
              grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            }
          }
          @media (min-width: 1024px) {
            .w-full {
              grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Home;

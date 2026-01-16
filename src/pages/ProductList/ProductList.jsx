/** @format */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import FilterSidebar from "../../components/FilterDropdown/FilterDropdown";
import "./ProductList.css";
import QRcode from "../../components/CommonComponent/QRcode";
import TrackRoute from "../../components/CommonComponent/TrackRoute";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { SET_LOCATION, selectLatitude, selectLongitude } from "../../store/locationSlice";
import { useSelector, useDispatch } from "react-redux";

const ProductList = () => {
  const navigate = useNavigate();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const categoryName = searchParams.get("categoryName");

  const [response, setResponse] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [selectedSubcategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
 const subCategoryId = searchParams.get("subCategoryId");
  // const subCategoryName = query.get("subCategoryName");
  // const latitude = useSelector(selectLatitude);
  // const longitude = useSelector(selectLongitude);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (searchParams.get("latitude") && searchParams.get("longitude")) {
  //     dispatch(SET_LOCATION({
  //       latitude: searchParams.get("latitude"),
  //       longitude: searchParams.get("longitude"),
  //     }));
  //   }
  // }, [location.search, dispatch]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search") || "";
   
    const queryParams = new URLSearchParams({
      page: 1,
      limit: 45,
      ...(id && { categoryId: id }),
      // ...(latitude && longitude && { latitude, longitude }),
    });

    if (subCategoryId) {
      queryParams.append("subCategoryId", subCategoryId);
    }
   
    if (selectedCondition?.length > 0) {
      selectedCondition.forEach((condition) => {
        queryParams.append("conditions", condition);
      });
    }
   
    if (fromPrice > 0) {
      queryParams.append("fromPrice", fromPrice);
    }
    if (toPrice > 0) {
      queryParams.append("toPrice", toPrice);
    }
   
    if (sort) {
      queryParams.append("sort", sort);
    }
   
    if (searchQuery && searchParams.has("search")) {
      queryParams.append("search", searchQuery);
    }
   
    getApi(endPoints.products.getAllProducts(queryParams?.toString()), {
      setResponse: (data) => {
        setResponse(data);
        setLoading(false);
      },
    });
  }, [
    id,
    selectedSubcategoryId,
    selectedCondition,
    fromPrice,
    toPrice,
    sort,
    location.search,

    refreshTrigger,
  ]);















  //  [
  //   id,
  //   selectedSubcategoryId,
  //   selectedCondition,
  //   fromPrice,
  //   toPrice,
  //   sort,
  //   location.search,
  //   latitude,
  //   longitude,
  //   refreshTrigger,
  // ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchSubCategories = useCallback(() => {
    if (!id) return;
    setLoadingSubCategories(true);
    getApi(endPoints.subCategories.getSubCategoryByCatalog(id), {
      setResponse: (data) => {
        setSubCategories(data);
        setLoadingSubCategories(false);
      },
    });
  }, [id]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const handleSubCategory = (category) => {
    if (!category) {
      setSelectedSubCategoryId(null);
      setRefreshTrigger(prev => prev + 1);
      return;
    }
    
    setSelectedSubCategoryId({
      value: category?._id,
      label: category?.name,
    });
    
    // Close mobile filters after selection
    if (window.innerWidth <= 768) {
      setShowFilters(false);
    }
  };

  const handleActiveCategoryClick = () => {
    setSelectedSubCategoryId(null);
    setSelectedCondition([]);
    setFromPrice(0);
    setToPrice(0);
    setRefreshTrigger(prev => prev + 1);
    
    // Close mobile filters
    if (window.innerWidth <= 768) {
      setShowFilters(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearAllFilters = () => {
    setSelectedSubCategoryId(null);
    setSelectedCondition([]);
    setFromPrice(0);
    setToPrice(0);
    setSort(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const renderLoader = () => (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );

  const shouldShowNoProducts = () => {
    return (
      !loading &&
      (response?.data?.docs?.length === 0 ||
        response?.status === 404 ||
        !response?.data?.docs)
    );
  };

  // Reset filters when category changes
  useEffect(() => {
    setSelectedSubCategoryId(null);
    setSelectedCondition([]);
    setFromPrice(0);
    setToPrice(0);
    setSort(null);
    setShowFilters(false);
  }, [id, categoryName]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedSubcategoryId) count++;
    if (selectedCondition.length > 0) count += selectedCondition.length;
    if (fromPrice > 0 || toPrice > 0) count++;
    if (sort) count++;
    return count;
  };

  return (
    <>







    
      <div className=" productlist-container">
        <QRcode />
    {/*    <div className="home-app-filter">
          <TrackRoute pageName={categoryName} setSort={setSort} sort={sort} />
        </div>
       */ }
        {/* Mobile Filter Toggle Button */}
        <div className="mobile-filter-header">
          <button 
            className="mobile-filter-toggle"
            onClick={toggleFilters}
          >
            <span className="filter-icon">⚙</span>
            Filters 
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">{getActiveFiltersCount()}</span>
            )}
          </button>
          
          {getActiveFiltersCount() > 0 && (
            <button 
              className="clear-filters-btn"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="productlist-container-items">
          {/* Filter Sidebar */}
          <div className={`productlist-left-filter ${showFilters ? 'show-mobile-filters' : ''}`}>
            {/* Mobile Filter Header */}
            <div className="mobile-filter-header-inside">
              <h3>Filters</h3>
              <button 
                className="close-filters-btn"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {loadingSubCategories ? (
              renderLoader()
            ) : (
              <FilterSidebar
                categories={subCategories?.data || []}
                activecategory={categoryName}
                handleSubCategory={handleSubCategory}
                selectedCondition={selectedCondition}
                setSelectedCondition={setSelectedCondition}
                setFromPrice={setFromPrice}
                setToPrice={setToPrice}
                onActiveCategoryClick={handleActiveCategoryClick}
              />
            )}
          </div>

          {/* Overlay for mobile filters */}
          {showFilters && <div className="mobile-filter-overlay" onClick={() => setShowFilters(false)}></div>}
          
          {/* Products Section */}
          <div className="productlist-right">
            <div className="productlist-category">
              {categoryName && <h6>{categoryName}</h6>}
            </div>
            
            {/* Active Subcategory Display */}
            <div className="productlist-subcategory">
              {selectedSubcategoryId && (
                <div className="productlist-subcategory-div">
                  <p>{selectedSubcategoryId?.label}</p>
                  <button 
                    className="remove-subcategory"
                    onClick={() => handleSubCategory(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              renderLoader()
            ) : shouldShowNoProducts() ? (
              <div className="no-data-container">
                <h4 className="no-data-found">
                  Sorry, we couldn't find any products for this category. Please
                  try another category or refine your search.
                </h4>
              </div>
            ) : (
              <>
                <div className="products-header">
                  <span className="products-count">
                    {response?.data?.totalDocs || 0} products found
                  </span>
                </div>
                <div className="productlist-products">
                  {response?.data?.docs?.map((product) => (
                    <div className="productlist-products-div" key={product._id}>
                      <div className="productlist-products-image">
                        <img
                          src={product?.productImages?.[0]?.image || '/api/placeholder/200/200'}
                          alt={product.name}
                          onClick={() =>
                            navigate(`/products/?id=${product?._id}`)
                          }
                          loading="lazy"
                        />
                      </div>
                      <div className="productlist-products-content">
                        <Link to={`/products/?id=${product?._id}`}>
                          <h6>{product.name}</h6>
                        </Link>
                        <p>{product.locationValue}</p>
                        {/* {product.price && (
                          <span className="product-price">₹{product.price}</span>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
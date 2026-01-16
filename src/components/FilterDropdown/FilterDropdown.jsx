/** @format */
import { useEffect, useState } from "react";
import "./FilterDropdown.css";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { useNavigate } from "react-router-dom";

const FilterSidebar = ({
  categories,
  activecategory,
  handleSubCategory,
  selectedCondition,
  setSelectedCondition,
  setFromPrice,
  setToPrice,
  onActiveCategoryClick,
}) => {
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [allConditions, setAllConditions] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);




  useEffect(() => {
    fetchAllConditions();
    fetchMainCategories();
  }, []);

  const fetchAllConditions = () => {
    getApi(endPoints.getAllConditions, {
      setResponse: setAllConditions,
    });
  };

  const fetchMainCategories = () => {
    getApi(endPoints.getCategories, {
      setResponse: (response) => {
        if (response?.data) {
          setMainCategories(response.data);
        }
      },
    });
  };

  const handleConditionChange = (conditionId) => {
    if (selectedCondition.includes(conditionId)) {
      setSelectedCondition(selectedCondition.filter((item) => item !== conditionId));
    } else {
      setSelectedCondition([...selectedCondition, conditionId]);
    }
  };

  const handleApplyPriceRange = () => {
    const fromPrice = parseFloat(minPrice) || 0;
    const toPrice = parseFloat(maxPrice) || 0;

    if (fromPrice > toPrice && toPrice > 0) {
      alert("Maximum price should be greater than minimum price");
      return;
    }

    setFromPrice(fromPrice);
    setToPrice(toPrice);
  };

  const handleClearPriceRange = () => {
    setMinPrice("");
    setMaxPrice("");
    setFromPrice(0);
    setToPrice(0);
  };

  const handleCategoryClick = (parentCategory, subCategory = null) => {

      console.log('activeMainCategory',activeMainCategory)

    setActiveMainCategory(parentCategory);

    let url = `/product-list?categoryName=${encodeURIComponent(parentCategory.name)}&id=${parentCategory._id}`;

    if (subCategory) {
      url += `&subCategoryName=${encodeURIComponent(subCategory.name)}&subCategoryId=${subCategory._id}`;
    }

    navigate(url);
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const clearAllFilters = () => {
    setSelectedCondition([]);
    setMinPrice("");
    setMaxPrice("");
    setFromPrice(0);
    setToPrice(0);
    handleSubCategory(null);
  };

  const getSelectedConditionsCount = () => selectedCondition.length;

  const hasActiveFilters = () => selectedCondition.length > 0 || minPrice || maxPrice;

  const getVisibleCategories = () => {
    if (showAllCategories) return mainCategories;
    return mainCategories.slice(0, 5);
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-clear-section">
        {hasActiveFilters() && (
          <button className="clear-all-filters-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      <div className="filter-section">
        <p className="filter-section-title">Current Category</p>
        <h6 onClick={onActiveCategoryClick} className="active-category-heading" title="Click to reset category filters">
          {activecategory || "All Products"}
        </h6>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">All Categories</h3>

        <div className="categories-list">
          {getVisibleCategories().map((category) => (
            <div key={category._id} className="category-item-container">
              <span
                onClick={() => handleCategoryClick(category)}
                className="main-category-item cursor-pointer"
                title={`Browse ${category.name}`}
              >
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {mainCategories.length > 5 && (
          <button
            style={{
              color: '#e25845',
              padding: '8px 16px',
              border: '1px solid #e25845',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e25845';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#e25845';
            }}
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            {showAllCategories ? "Show Less" : `Show All (${mainCategories.length})`}
          </button>
        )}
      </div>

      {categories && categories.length > 0 && (
        <div className="filter-section">
          <h3 className="filter-section-title">
            Sub Categories <span className="category-count">({categories.length})</span>
          </h3>

          <div className="subcategories-list">
            {categories.map((subCategory, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(subCategory.categoryId, subCategory)}
                className="subcategory-item"
                title={`Filter by ${subCategory?.name}`}
              >
                {subCategory?.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition Filter */}
      <div className="filter-section-condition">
        <h3 className="filter-section-title">
          Condition
          {getSelectedConditionsCount() > 0 && (
            <span className="selected-count">({getSelectedConditionsCount()} selected)</span>
          )}
        </h3>

        <div className="conditions-list">
          {allConditions?.data?.map((item) => (
            <label
              className={`condition-label ${selectedCondition.includes(item._id) ? "selected" : ""}`}
              key={item._id}
            >
              <input
                type="checkbox"
                checked={selectedCondition.includes(item._id)}
                onChange={() => handleConditionChange(item._id)}
                className="condition-checkbox"
              />
              <div className="condition-label-content">
                <h6>{item.name}</h6>
                {item.description && <p className="condition-description">{item.description}</p>}
              </div>
            </label>
          ))}
        </div>

        {getSelectedConditionsCount() > 0 && (
          <button className="clear-conditions-btn" onClick={() => setSelectedCondition([])}>
            Clear All Conditions
          </button>
        )}
      </div>

      <div className="filter-summary">
        <div className="active-filters-count">
          {hasActiveFilters() && (
            <span className="filters-applied">
              {getSelectedConditionsCount() + (minPrice || maxPrice ? 1 : 0)} filters applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

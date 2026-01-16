import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, putApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ClipLoader } from "react-spinners";
import { uploadFileToFirebase } from "./uploadFileToFirebase";
import { FiImage, FiUser } from "react-icons/fi";
import { GoTag } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import "./Post.css";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
} from "@react-google-maps/api";
const centerDefault = {
  lat: 40.7128,
  lng: -74.0060,
};
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [conditions, setConditions] = useState("");
  const [video, setVideo] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [type, setType] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hideMap, setHideMap] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Dropdown data state
  const [allCategories, setAllCategories] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState(null);
  const [allConditions, setAllConditions] = useState(null);
  const [allBrands, setAllBrands] = useState(null);
  const [allModels, setAllModels] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  // Google Maps refs
  const inputRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef(null);

  // Google Maps API Loader
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["places"],
  });

  // Google Places Autocomplete setup
  useEffect(() => {
    if (isLoaded && window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLatitude(lat);
          setLongitude(lng);
          setSelectedPlace(place);
          setLocation(place.formatted_address || "");

          if (mapRef.current && place.geometry.viewport) {
            mapRef.current.fitBounds(place.geometry.viewport);
          } else if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(15);
          }
        } else {
          setLatitude(null);
          setLongitude(null);
          setSelectedPlace(null);
        }
      });
      return () => {
        if (autocomplete) {
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    }
  }, [isLoaded, inputRef]);

  // Fetch product details for editing
  const fetchProductDetails = useCallback(() => {
    getApi(endPoints.products.getProductDetail(id), {
      setResponse: setProductDetails,
    });
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  // Populate form when product details are loaded
  useEffect(() => {
    if (productDetails && productDetails.data) {
      const item = productDetails.data;

      setCategoryId(item.categoryId?._id || "");
      setName(item.name || "");
      setDescription(item.description || "");
      setPrice(item.price !== undefined ? String(item.price) : "");
      setLocation(item.locationValue || item.location || "");
      setSubCategoryId(item.subCategoryId?._id || "");
      setConditions(item.conditions?._id || "");
      setBrandId(item.brandId?._id || "");
      setModelId(item.modelId?._id || "");
      setType(item.type || "");
      setIsFree(!!item.isFree);
      setVideo(item.video || "");
      
      // Set map coordinates if available
      if (item.latitude) setLatitude(parseFloat(item.latitude));
      if (item.longitude) setLongitude(parseFloat(item.longitude));
    }
  }, [productDetails]);

  // Fetch initial dropdown data
  useEffect(() => {
    const fetchInitialData = async () => {
      getApi(endPoints.getCategories, { setResponse: setAllCategories });
      getApi(endPoints.getAllConditions, { setResponse: setAllConditions });
      getApi(endPoints.getAllBrands, { setResponse: setAllBrands });
      getApi(endPoints.getAllModels, { setResponse: setAllModels });
    };
    fetchInitialData();
  }, []);

  // Fetch subcategories when category changes
  const fetchSubCategories = useCallback(() => {
    if (categoryId) {
      getApi(endPoints.subCategories.getSubCategoryByCatalog(categoryId), {
        setResponse: (response) => {
          setAllSubCategories(response);
          const currentSubCategoryStillExists = response?.data?.some(
            (sub) => sub._id === subCategoryId
          );
          if (!currentSubCategoryStillExists && subCategoryId) {
            setSubCategoryId("");
          }
        },
      });
    } else {
      setAllSubCategories(null);
      setSubCategoryId("");
    }
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  // Validation function
  const validateForm = () => {
    const swalDarkOptions = {
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      buttonsStyling: true,
    };

    if (!name?.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter product name.",
        icon: "error",
        ...swalDarkOptions,
      });
      return false;
    }
    if (!categoryId) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a category.",
        icon: "error",
        ...swalDarkOptions,
      });
      return false;
    }
    if (!description?.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter description.",
        icon: "error",
        ...swalDarkOptions,
      });
      return false;
    }
    if (!conditions?.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select product condition.",
        icon: "error",
        ...swalDarkOptions,
      });
      return false;
    }
  
    if (!location?.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter location.",
        icon: "error",
        ...swalDarkOptions,
      });
      return false;
    }

    // Image validation
    if (image) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(image.type)) {
        Swal.fire({
          title: "Validation Error",
          text: "Image type must be PNG, JPG, or JPEG.",
          icon: "error",
          ...swalDarkOptions,
        });
        return false;
      }
      if (image.size > 3 * 1024 * 1024) {
        Swal.fire({
          title: "Validation Error",
          text: "Image size should not exceed 3 MB.",
          icon: "error",
          ...swalDarkOptions,
        });
        return false;
      }
    }

    return true;
  };

  // Handle form submission
// Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const swalDarkOptions = {
    background: "#1e1e1e",
    color: "#fff",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    buttonsStyling: true,
  };

  // Show confirmation alert before submitting
  Swal.fire({
    title: "Confirm Update",
    text: "Are you sure you want to update this post?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Update Post!",
    cancelButtonText: "Cancel",
    ...swalDarkOptions,
  }).then((result) => {
    if (result.isConfirmed) {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", name);
      fd.append("categoryId", categoryId);
      fd.append("description", description);
      
      // Fixed: Handle price properly - send actual price value or 0 if free
  
        fd.append("price", "0");
        // fd.append("isFree", "true");
        // fd.append("price", price || "0");
        // fd.append("isFree", "false");
      

      // Additional JSX to add back to your form (uncomment these sections in your component):
      /*
      <div className="post-form-inputes">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label>Is this item free?</label>
          <Form.Check
            type="switch"
            id="free-switch"
            onChange={(e) => {
              setIsFree(e.target.checked);
              if (e.target.checked) {
                setPrice("");
              }
            }}
            checked={isFree}
          />
        </div>
      </div>

      {!isFree && (
        <div className="post-form-inputes">
          <label>Price (₹) *</label>
          <input
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            placeholder="Enter price"
            min="0"
            required
          />
        </div>
      )}
      */
      
      fd.append("location", location);

      if (image) {
        fd.append("image", image);
      }

      if (subCategoryId) fd.append("subCategoryId", subCategoryId);
      fd.append("conditions", conditions);
      if (video) fd.append("video", video);
      if (brandId) fd.append("brandId", brandId);
      if (modelId) fd.append("modelId", modelId);
      if (type) fd.append("type", type);
      
      if (typeof latitude === "number" && !isNaN(latitude)) {
        fd.append("latitude", latitude.toString());
      }
      if (typeof longitude === "number" && !isNaN(longitude)) {
        fd.append("longitude", longitude.toString());
      }

      putApi(endPoints.products.editPost(id), fd, {
        setLoading,
        successMsg: "Post Updated Successfully!",
        showErr: true,
        additionalFunctions: [() => navigate("/post/thank-you")],
      }).catch(() => {
        setLoading(false);
        // Show error alert if API call fails
        Swal.fire({
          title: "Error!",
          text: "Failed to update post. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          ...swalDarkOptions,
        });
      });
    }
  });
};

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("Video size should be less than 20MB");
      return;
    }

    setLoading(true);
    try {
      const url = await uploadFileToFirebase(file, "videos");
      setVideo(url);
    } catch (error) {
      alert("Video upload failed");
      console.error(error);
      setVideo("");
    } finally {
      setLoading(false);
    }
  };

  // Map callbacks
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (selectedPlace?.geometry?.viewport) {
      map.fitBounds(selectedPlace.geometry.viewport);
    } else if (latitude && longitude) {
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(15);
    }
  }, [selectedPlace, latitude, longitude]);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const defaultCenter = { lat: 28.6448, lng: 77.216721 }; // Default to Delhi
  const mapContainerStyle = {
    height: "300px",
    width: "100%",
  };

  return (
    <div className="post-form-container my-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Post</h2>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Category Selection */}
        <div className="post-form-main-div">
          <div className="post-form-heading">
            <GoTag />
            <h6>Category (Required)</h6>
          </div>
          <div className="post-form-inputes">
            <select
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubCategoryId("");
              }}
              value={categoryId}
              required
            >
              <option value="">Select Option</option>
              {allCategories?.data?.map((item) => (
                <option value={item?._id} key={item?._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-Category Selection */}
        {categoryId && (
          <div className="post-form-main-div">
            <div className="post-form-heading">
              <h6>Sub-Category (Optional)</h6>
            </div>
            <div className="post-form-inputes">
              <select
                onChange={(e) => setSubCategoryId(e.target.value)}
                value={subCategoryId}
              >
                <option value="">Select Option</option>
                {allSubCategories?.data?.map((item) => (
                  <option value={item?._id} key={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Product Information */}
        <div className="post-form-main-div">
          <div className="post-form-heading">
            <IoIosInformationCircleOutline />
            <h6>Product Information:</h6>
          </div>
          
          <div className="post-form-inputes">
            <label>Title *</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter product title"
              required
            />
          </div>

          <div className="post-form-inputes">
            <label>Description *</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Describe your product..."
            />
          </div>

          {/* <div className="post-form-inputes">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label>Is this item free?</label>
              <Form.Check
                type="switch"
                id="free-switch"
                onChange={(e) => {
                  setIsFree(e.target.checked);
                  if (e.target.checked) {
                    setPrice("");
                  }
                }}
                checked={isFree}
              />
            </div>
          </div> */}

   
            {/* <div className="post-form-inputes">
              <label>Price (₹) *</label>
              <input
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                placeholder="Enter price"
                min="0"
                required
              />
            </div> */}

          <div className="post-form-inputes">
            <label>Condition *</label>
            <select
              onChange={(e) => setConditions(e.target.value)}
              value={conditions}
              required
            >
              <option value="">Select condition</option>
              {allConditions?.data?.map((item) => (
                <option value={item?._id} key={item?._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="post-form-inputes">
            <label>Brand (Optional)</label>
            <select
              onChange={(e) => setBrandId(e.target.value)}
              value={brandId}
            >
              <option value="">Select brand</option>
              {allBrands?.data?.map((item) => (
                <option value={item?._id} key={item?._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="post-form-inputes">
            <label>Model (Optional)</label>
            <select
              onChange={(e) => setModelId(e.target.value)}
              value={modelId}
            >
              <option value="">Select model</option>
              {allModels?.data?.map((item) => (
                <option value={item?._id} key={item?._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="post-form-inputes">
            <label>Type (Optional)</label>
            <input
              type="text"
              onChange={(e) => setType(e.target.value)}
              value={type}
              placeholder="e.g., New 2023 (2.3.2)"
            />
          </div>
        </div>

        {/* Images */}
        <div className="post-form-main-div">
          <div className="post-form-heading">
            <FiImage />
            <h6>Images:</h6>
          </div>
          <div className="post-form-image-div">
            <p>
              Recommended image size: 870x493px<br />
              Maximum size: 3 MB<br />
              Allowed types: PNG, JPG, JPEG<br />
              <small>Select new image to replace existing one</small>
            </p>
            <div className="post-form-images">
              <div className="post-form-image-left">
                <h1>
                  {image?.name || "Choose file to upload or take photo"}
                </h1>
              </div>
              <div className="post-form-image-right">
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                >
                  Choose File
                </button>
              </div>
            </div>

            {/* Image Selection Modal */}
            {showImageModal && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 9999
                }}
                onClick={() => setShowImageModal(false)}
              >
                <div 
                  style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    minWidth: '300px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={{ marginBottom: '20px', color: '#161c2d' }}>Choose Image Option</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                      type="button"
                      style={{
                        padding: '15px 20px',
                        backgroundColor: '#e25845',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: '0px 3px 5px rgba(248,92,112,0.3)'
                      }}
                      onClick={() => {
                        document.getElementById("image-file-picker").click();
                        setShowImageModal(false);
                      }}
                    >
                      Upload File from Gallery
                    </button>
                    
                    <button
                      type="button"
                      style={{
                        padding: '15px 20px',
                        backgroundColor: '#e25845',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: '0px 3px 5px rgba(248,92,112,0.3)'
                      }}
                      onClick={() => {
                        document.getElementById("image-file-camera").click();
                        setShowImageModal(false);
                      }}
                    >
                      Take Photo with Camera
                    </button>
                    
                    <button
                      type="button"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowImageModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              type="file"
              id="image-file-picker"
              onChange={(e) => setImage(e.target.files[0])}
              className="d-none"
              accept="image/png, image/jpeg, image/jpg"
            />

            <input
              type="file"
              id="image-file-camera"
              onChange={(e) => setImage(e.target.files[0])}
              className="d-none"
              accept="image/png, image/jpeg, image/jpg"
              capture="environment"
            />
          </div>
        </div>

        {/* Video Upload */}
        <div className="post-form-main-div">
          <div className="post-form-heading">
            <FiImage />
            <h6>Upload Video (Optional):</h6>
          </div>
          <div className="post-form-inputes">
            <label>Maximum size: 20MB | Allowed types: MP4</label>
            <input
              type="file"
              accept="video/mp4,video/x-m4v,video/*"
              onChange={handleVideoUpload}
            />
            {video && (
              <p style={{ marginTop: "0.5rem", color: "green" }}>
                ✓ Video uploaded successfully
              </p>
            )}
          </div>
        </div>

        {/* Contact Details & Location */}
        <div className="post-form-main-div">
          <div className="post-form-heading">
            <FiUser />
            <h6>Contact Details:</h6>
          </div>
          
          <div className="post-form-inputes">
            <label>Location *</label>
            <input
              type="text"
              onChange={(e) => {
                setLocation(e.target.value);
                if (selectedPlace && e.target.value !== selectedPlace.formatted_address) {
                  setSelectedPlace(null);
                  setLatitude(null);
                  setLongitude(null);
                }
              }}
              value={location}
              ref={inputRef}
              placeholder="Type address and select from suggestions"
              required
            />
          </div>

          {/* Map */}
          {!hideMap && import.meta.env.VITE_GOOGLE_MAP_KEY && (
            <div className="map_container">
              {loadError ? (
                <p>Error loading maps</p>
              ) : !isLoaded ? (
                <p>Loading Map...</p>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={latitude && longitude ? { lat: latitude, lng: longitude } : centerDefault}
                  zoom={latitude && longitude ? 15 : 5}
                  onLoad={onMapLoad}
                  onUnmount={onMapUnmount}
                  options={{
                    gestureHandling: "greedy",
                    disableDefaultUI: true,
                  }}
                >
                  {latitude && longitude && (
                    <MarkerF position={{ lat: latitude, lng: longitude }} />
                  )}
                </GoogleMap>
              )}
            </div>
          )}
        </div>

        {/* Final Options & Submit */}
        <div className="post-form-inputes-check">
          <div className="post-form-check">
            <input
              type="checkbox"
              id="hideMapCheck"
              onChange={(e) => setHideMap(e.target.checked)}
              checked={hideMap}
            />
            <label htmlFor="hideMapCheck">
              <h5>Don't show map</h5>
            </label>
          </div>
          
          <div className="post-form-check">
            <input type="checkbox" id="termsCheck" required />
            <label htmlFor="termsCheck">
              <h5>
                I agree to the{" "}
                <span>Terms & Conditions</span>
              </h5>
            </label>
          </div>
          
          <button 
            className="post-form-inputes-check-btn" 
            type="submit" 
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
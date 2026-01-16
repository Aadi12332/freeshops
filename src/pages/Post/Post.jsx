/** @format */

import "./Post.css";
import { GoTag } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FiImage } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { MdOutlineLink } from "react-icons/md";
import QRcode from "../../components/CommonComponent/QRcode";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { getApi, postApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Form } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import styles from "../../css/post.module.css";
import Swal from "sweetalert2";
// UPDATED IMPORTS: Removed @vis.gl/react-google-maps
// Added @react-google-maps/api imports
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { LoginModalfirst } from "../../components/Modals/Modals";
import { uploadFileToFirebase } from "./uploadFileToFirebase";
const centerDefault = {
  lat: 40.7128,
  lng: -74.006,
};

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_VIDEO_SIZE_MB = 20;

const Post = () => {
  const navigate = useNavigate();
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
  const [allCategories, setAllCategories] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState(null);
  const [allConditions, setAllConditions] = useState(null);
  const [allBrands, setAllBrands] = useState(null);
  const [allModels, setAllModels] = useState(null);
  const inputRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hideMap, setHideMap] = useState(false);

  // For @react-google-maps/api, we need a reference to the map instance
  const mapRef = useRef(null); // To store map instance

  // --- Google Maps API Loader ---
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["places"], // 'places' library is needed for Autocomplete
  });
  // --- End Google Maps API Loader ---

  useEffect(() => {
    // Ensure Google Maps script is loaded AND window.google is available
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
          setSelectedPlace(place); // Keep selectedPlace to use its viewport
          setLocation(place.formatted_address || "");

          // Fit map to bounds if map instance exists
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
          // Retain manually typed location if no place is selected
          // setLocation(""); // Or handle this as per your UX preference
        }
      });
      return () => {
        if (autocomplete) {
          // Important: Correctly clear listeners for Autocomplete
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    }
  }, [isLoaded, inputRef]); // Depend on isLoaded

  function fetchModels() {
    getApi(endPoints.getAllModels, {
      setResponse: setAllModels,
    });
  }

  function fetchBrands() {
    getApi(endPoints.getAllBrands, {
      setResponse: setAllBrands,
    });
  }

  const fetchCategories = () => {
    getApi(endPoints.getCategories, {
      setResponse: setAllCategories,
    });
  };

  const fetchSubCategories = useCallback(() => {
    if (categoryId) {
      getApi(endPoints.subCategories.getSubCategoryByCatalog(categoryId), {
        setResponse: setAllSubCategories,
      });
    } else {
      setAllSubCategories(null);
    }
  }, [categoryId]);

  const fetchConditions = () => {
    getApi(endPoints.getAllConditions, {
      setResponse: setAllConditions,
    });
  };

  useEffect(() => {
    fetchCategories();
    fetchConditions();
    fetchBrands();
    fetchModels();
  }, []);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const createPost = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const swalDarkOptions = {
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      buttonsStyling: true,
    };

    // --- Required field validation ---
    if (!name?.trim()) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter product name.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!categoryId) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please select a category.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!description?.trim()) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter description.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!conditions?.trim()) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter product conditions.",
        icon: "error",
        ...swalDarkOptions,
      });
    }

    // --- Optional image validation ---
    if (image) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(image.type)) {
        return Swal.fire({
          title: "Validation Error",
          text: "Image type must be PNG, JPG, or JPEG.",
          icon: "error",
          ...swalDarkOptions,
        });
      }
      if (image.size > 3 * 1024 * 1024) {
        return Swal.fire({
          title: "Validation Error",
          text: "Image size should not exceed 3 MB.",
          icon: "error",
          ...swalDarkOptions,
        });
      }
    }

    // --- SweetAlert confirmation ---
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
      ...swalDarkOptions,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);

        const payload = new FormData();
        payload.append("name", name);
        payload.append("categoryId", categoryId);
        payload.append("description", description);
        if (location) payload.append("location", location);
        if (image) payload.append("image", image); // Image is optional
        if (subCategoryId) payload.append("subCategoryId", subCategoryId);
        payload.append("conditions", conditions);
        if (video) payload.append("video", video);
        if (brandId) payload.append("brandId", brandId);
        if (modelId) payload.append("modelId", modelId);
        if (type) payload.append("type", type);
        payload.append("isFree", String(isFree));
        if (typeof latitude === "number" && !isNaN(latitude)) {
          payload.append("latitude", latitude.toString());
        }
        if (typeof longitude === "number" && !isNaN(longitude)) {
          payload.append("longitude", longitude.toString());
        }

        postApi(endPoints.products.createProduct, payload, {
          setLoading,
          successMsg: "Post created successfully!",
          showErr: true,
          additionalFunctions: [() => navigate("/post/thank-you")],
        });
      }
    });
  };

  // --- Callbacks for GoogleMap component ---
  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map; // Store the map instance
      // If a place was selected before map loaded, fit bounds now
      if (selectedPlace?.geometry?.viewport) {
        map.fitBounds(selectedPlace.geometry.viewport);
      } else if (latitude && longitude) {
        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(15);
      }
    },
    [selectedPlace, latitude, longitude]
  );

  const onMapUnmount = useCallback(() => {
    mapRef.current = null; // Clean up map instance
  }, []);
  // --- End Callbacks ---

  // Default map center (e.g., Delhi or a more generic central point)
  const defaultCenter = { lat: 28.6448, lng: 77.216721 };
  const mapContainerStyle = {
    height: "300px",
    width: "100%",
  };

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // or your key, e.g., 'authToken'
    if (token) {
      setIsLoggedIn(true);
    } else {
      setShowLoginModal(true);
      setIsLoggedIn(false);
    }
  }, []);

  const [selectedType, setSelectedType] = useState("product"); // default to "product"
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);

    setSelectedCategory(""); // reset category on type change

    if (value === "product") {
      navigate("/posy");
    } else if (value === "service") {
      navigate("/post-job");
    }
  };

  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "video/mp4") {
      setError("Only MP4 video format is allowed");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setError("Video size must be less than 20MB");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const url = await uploadFileToFirebase(file, "videos");
      setVideo(url);
    } catch (err) {
      console.error(err);
      setError("Video upload failed");
      setVideo("");
    } finally {
      setLoading(false);
    }
  };
  const validateImage = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only PNG, JPG and JPEG images are allowed";
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return "Image size must be less than 3MB";
    }

    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can upload maximum ${MAX_IMAGES} images`);
      return;
    }

    for (let file of files) {
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setImages((prev) => [...prev, ...files]);
    setError("");
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="container px-4 py-4 my-3 ">
        <div className="d-lg-block d-none">
          <QRcode />
        </div>
        <form onSubmit={createPost}>
          <div className="mb-3">
            <div className={styles.label_container}>
            <h6>Post Type</h6>
          </div>

          <div className={styles.input_container}>
            <select onChange={handleTypeChange} value={selectedType} required>
              <option value="">Select Type</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>
          </div>
          {/* Category Selection */}
          <div className={styles.main_container}>
            <div className={styles.label_container}>
              <GoTag />
              <h6>Category (Required)</h6>
            </div>
            <div className={styles.input_container}>
              <select
                onChange={(e) => setCategoryId(e.target.value)}
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
            <div className={styles.main_container}>
              <div className={styles.label_container}>
                <h6>Sub-Category (Optional)</h6>
              </div>
              <div className={styles.input_container}>
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
          <div className={styles.main_container}>
            <div className={styles.label_container}>
              <IoIosInformationCircleOutline />
              <h6> Product Information :</h6>
            </div>
            <div className={styles.input_container}>
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div
              className={styles.input_container}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>Free</label>
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                onChange={(e) => setIsFree(e.target.checked)}
                checked={isFree}
              />
            </div>
            <div className={styles.input_container}>
              <label htmlFor="">Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
              />
            </div>
            <div className={styles.input_container}>
              <label>Condition (Required) </label>
              <select
                onChange={(e) => setConditions(e.target.value)}
                value={conditions}
                required
              >
                <option value="">Ex : Used</option>
                {allConditions?.data?.map((item) => (
                  <option value={item?._id} key={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.input_container}>
              <label>Brand (Optional)</label>
              <select
                onChange={(e) => setBrandId(e.target.value)}
                value={brandId}
              >
                <option value="">Ex : Sony , Panasonic</option>
                {allBrands?.data?.map((item) => (
                  <option value={item?._id} key={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.input_container}>
              <label>Model (Optional)</label>
              <select
                onChange={(e) => setModelId(e.target.value)}
                value={modelId}
              >
                <option value="">Ex : 2023 , 2024</option>
                {allModels?.data?.map((item) => (
                  <option value={item?._id} key={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.input_container}>
              <label>Type (Optional) </label>
              <input
                type="text"
                onChange={(e) => setType(e.target.value)}
                value={type}
                placeholder="Ex : New 2023 (2.3.2)"
              />
            </div>
          </div>

          <div className={styles.main_container}>
            <div className={styles.label_container}>
              <FiImage />
              <h6>Upload Images :</h6>
            </div>

            <div className={styles.upload_img_container}>
              <div className="w-full mt-2">
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md overflow-hidden"
                      style={{ height: 200, width: 200 }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-full object-contain"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          top: 4,
                          right: 4,
                          minWidth: 25,
                          minHeight: 25,
                          fontSize: 12,
                          border: 0,
                        }}
                        className="absolute top-1 right-1 z-10 text-black rounded-full flex items-center justify-center text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
                    <label
                      style={{ height: 200, width: 200 }}
                      className="border-2 border-dashed border-green-500 rounded-md flex flex-col items-center justify-center cursor-pointer text-green-600 hover:bg-green-50 transition"
                    >
                      <span className="text-3xl leading-none">+</span>
                      <p className="text-xs mt-1">Add photo</p>

                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                <p style={{ fontSize: 14 }} className="text-gray-600 mb-2">
                  Recommended image size: <b>870×493px</b> <br />
                  Max size: <b>3MB</b> <br />
                  Allowed formats: <b>PNG, JPG, JPEG</b> <br />
                  You can upload up to <b>5 images</b>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.main_container}>
            <div className={styles.label_container}>
              <FiImage />
              <h6 className="mb-0">Upload Video :</h6>
            </div>
            <div className={styles.input_container}>
              <div className="w-full">
                <label
                  style={{ height: 200, width: 200 }}
                  className="border-2 border-dashed border-green-500 rounded-md flex flex-col items-center justify-center cursor-pointer text-green-600 hover:bg-green-50 transition relative"
                >
                  {!loading && !video && (
                    <>
                      <span className="text-3xl">+</span>
                      <p className="text-sm mt-1">Add video</p>
                    </>
                  )}

                  {loading && (
                    <p className="text-sm text-gray-500">Uploading video...</p>
                  )}

                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>

                {video && !loading && (
                  <p className="text-sm text-green-600 mt-2">
                    Video uploaded successfully ✔
                  </p>
                )}

                {video && (
                  <video
                    src={video}
                    controls
                    className="mt-3 w-full max-w-sm rounded-md border"
                  />
                )}

                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                <p style={{ fontSize: 14 }} className="text-gray-600 mb-2">
                  Allowed format: <b>MP4</b> <br />
                  Maximum size: <b>20MB</b>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details & Map */}
          <div className={styles.main_container}>
            <div className={styles.label_container}>
              <FiUser />
              <h6>Contact Details :</h6>
            </div>
            <div className={styles.input_container}>
              <label htmlFor="">Location</label>
              <input
                type="text"
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (
                    selectedPlace &&
                    e.target.value !== selectedPlace.formatted_address
                  ) {
                    setSelectedPlace(null);
                    setLatitude(null); // Clear lat/lng if user types manually after selecting
                    setLongitude(null);
                  }
                }}
                value={location}
                ref={inputRef}
                required
                placeholder="Type address and select from suggestions" // Added placeholder
              />
            </div>

            {/* --- Map Rendering with @react-google-maps/api --- */}
            {!hideMap && (
              <div className="map_container" style={{ marginTop: "1rem" }}>
                {!import.meta.env.VITE_GOOGLE_MAP_KEY ? (
                  <p>
                    Google Maps API Key not configured. Map cannot be displayed.
                  </p>
                ) : loadError ? (
                  <p>
                    Error loading maps. Please check your API key and internet
                    connection.
                  </p>
                ) : !isLoaded ? (
                  <p>Loading Map...</p>
                ) : (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      latitude && longitude
                        ? { lat: latitude, lng: longitude }
                        : centerDefault
                    }
                    zoom={latitude && longitude ? 15 : 5} // Zoom in if specific location, otherwise broader view
                    onLoad={onMapLoad}
                    onUnmount={onMapUnmount}
                    options={{
                      gestureHandling: "greedy",
                      disableDefaultUI: true,
                      // mapId: "YOUR_MAP_ID_IF_ANY" // If you use Google Cloud Map IDs
                    }}
                  >
                    {latitude && longitude && (
                      <MarkerF position={{ lat: latitude, lng: longitude }} />
                    )}
                    {/* MapHandler is not used here. fitBounds is handled in useEffect and onMapLoad */}
                  </GoogleMap>
                )}
              </div>
            )}
            {/* --- End Map Rendering --- */}
          </div>

          {/* Checkboxes & Submit */}
          <div className="post-form-inputes-check">
            <div className="post-form-check">
              <input
                type="checkbox"
                id="hideMapCheck"
                onChange={(e) => setHideMap(e.target.checked)}
                checked={hideMap}
              />
              <label htmlFor="hideMapCheck" style={{ marginLeft: "5px" }}>
                <h5>Don't show map</h5>
              </label>
            </div>
            <div className="post-form-check">
              <input type="checkbox" id="termsCheck" required />
              <label htmlFor="termsCheck" style={{ marginLeft: "5px" }}>
                <h5>
                  I have read and agree to the website{" "}
                  <span style={{ color: "blue", cursor: "pointer" }}>
                    Terms & Conditions
                  </span>
                  .
                </h5>
              </label>
            </div>
            <button
              className="post-form-inputes-check-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Post"}
            </button>
          </div>
        </form>

        {!isLoggedIn && (
          <LoginModalfirst
            show={showLoginModal}
            onHide={() => setShowLoginModal(false)}
            shownext={() => {
              setShowLoginModal(false);
              const token = localStorage.getItem("token");
              if (token) setIsLoggedIn(true);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Post;

import React, { useEffect, useRef, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FiImage, FiUser } from "react-icons/fi";
import { GoTag } from "react-icons/go";
import { ClipLoader } from "react-spinners";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./PostJob.css";
import endPoints from "../../Repository/apiConfig";
import { postApi } from "../../Repository/Api";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import OfferUpJobUI from "../Post/OfferUpJobUI";
import QRcode from "../../components/CommonComponent/QRcode";
import { JobGuidelineBanner } from "../Post/Post";
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 40.7128,
  lng: -74.006,
};

const PostJob = () => {
  const [serviceCategoryId, setServiceCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [storage, setStorage] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(centerDefault.lat);
  const [longitude, setLongitude] = useState(centerDefault.lng);
  const [typeOfJob, setTypeOfJob] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hideMap, setHideMap] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["places"],
  });

  // Fetch service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://mamun-reza-freeshops-backend-omega.vercel.app/api/v1/admin/ServiceCategory/allServiceCategory",
        );
        const data = await response.json();
        if (data.status === 200) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Google Maps Places Autocomplete
  useEffect(() => {
    if (
      isLoaded &&
      window.google &&
      window.google.maps &&
      window.google.maps.places
    ) {
      const inputElement = inputRef.current;
      if (inputElement) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputElement,
          {
            types: ["address"],
          },
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.geometry?.location) {
            setLatitude(place.geometry.location.lat());
            setLongitude(place.geometry.location.lng());
          }
          setSelectedPlace(place);
          setLocation(place?.formatted_address || "");
        });
        return () => {
          window.google.maps.event.clearInstanceListeners(autocomplete);
        };
      }
    }
  }, [isLoaded]);

  // Center map on selected place
  const [mapCenter, setMapCenter] = useState(centerDefault);
  console.log({ mapCenter });
  useEffect(() => {
    if (selectedPlace?.geometry?.location) {
      setMapCenter({
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });
    }
  }, [selectedPlace]);

  const resetForm = () => {
    setServiceCategoryId("");
    setTitle("");
    setDescription("");
    setSalary("");
    setStorage("");
    setLocation("");
    setLatitude(null);
    setLongitude(null);
    setTypeOfJob("");
    setImage(null);
    setSelectedPlace(null);
    setHideMap(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const swalDarkOptions = {
    background: "#1e1e1e", // dark background
    color: "#fff", // text color
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    buttonsStyling: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Basic field validation ---
    if (!selectedType) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please select a post type.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!serviceCategoryId) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please select a job category.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!title.trim()) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter job title.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!description.trim()) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter job description.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!salary) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter salary.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!typeOfJob) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please select type of job.",
        icon: "error",
        ...swalDarkOptions,
      });
    }
    if (!location.trim()) {
      return Swal.fire({
        title: "Validation Error",
        text: "Please enter location.",
        icon: "error",
        ...swalDarkOptions,
      });
    }

    // Optional image validation
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this job post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, post it!",
      cancelButtonText: "Cancel",
      ...swalDarkOptions,
    });

    if (!result.isConfirmed) return;

    // --- Proceed with API call ---
    setLoading(true);

    const formData = new FormData();
    formData.append("serviceCategoryId", serviceCategoryId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("salary", salary);
    formData.append("storage", storage);
    formData.append("location", location);
    formData.append("latitude", latitude?.toString() || "");
    formData.append("longitude", longitude?.toString() || "");
    formData.append("typeOfJob", typeOfJob);
    if (image) formData.append("image", image);
    formData.append("status", status);

    try {
      const response = await postApi(`api/v1/user/addJobs`, formData, {
        setLoading,
      });

      if (
        response.status === 409 &&
        response.message === "Jobs already exists."
      ) {
        setLoading(false);
        return Swal.fire({
          title: "Error",
          text: "Job already exists.",
          icon: "error",
          ...swalDarkOptions,
        });
      }

      setLoading(false);
      Swal.fire({
        title: "Success",
        text: "Your job has been posted successfully.",
        icon: "success",
        ...swalDarkOptions,
      });
      resetForm();
      navigate("/post/thank-you");
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "Job already exists.",
        icon: "error",
        ...swalDarkOptions,
      });
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size should not exceed 3MB");
        return;
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG and JPEG files are allowed");
        return;
      }

      setImage(file);
    }
  };

  const [selectedType, setSelectedType] = useState("service"); // default to "service"

  useEffect(() => {
    // Navigate on initial load based on default value
    navigate("/post-job");
  }, [navigate]);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setServiceCategoryId(""); // reset category on type change

    if (value === "product") {
      navigate("/post");
    } else if (value === "service") {
      navigate("/post-job");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="container row g-4">
      <div className="col-12 col-lg-8">

                <div className="d-lg-block d-none mb-5">
                  <QRcode />
                </div>
                <JobGuidelineBanner/>
        <form onSubmit={handleSubmit}>
          <div className="main-container">
            <div className="label-container">
              <h6>Post Type</h6>
            </div>
            <div className="input-container mb-4">
              <select onChange={handleTypeChange} value={selectedType} required>
                <option value="">Select Type</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div className="label-container">
              <GoTag />
              <h6>Job Category (Required)</h6>
            </div>
            <div className="input-container">
              <select
                onChange={(e) => setServiceCategoryId(e.target.value)}
                value={serviceCategoryId}
                required
              >
                <option value="">Select Job Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="main-container">
            <div className="label-container">
              <IoIosInformationCircleOutline />
              <h6>Job Information:</h6>
            </div>
            <div className="input-container">
              <label>Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter job title"
              />
            </div>

            <div className="input-container">
              <label>Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Enter job description"
              />
            </div>

            <div className="input-container">
              <label>Salary</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
                placeholder="Enter salary amount"
                min="0"
              />
            </div>

            <div className="input-container">
              <label>Storage</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="Enter storage details"
              />
            </div>

            <div className="input-container">
              <label>Type of Job</label>
              <select
                value={typeOfJob}
                onChange={(e) => setTypeOfJob(e.target.value)}
                required
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="main-container">
            <div className="label-container">
              <FiImage />
              <h6>Job Image:</h6>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Images :
              </label>

              <div
                onClick={() => document.getElementById("image-file").click()}
                className="relative flex h-[200px] w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#5b646f]"
              >
                {image ? (
                  <>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white opacity-0 transition hover:opacity-100">
                      Change Image
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-semibold text-gray-400">
                      +
                    </span>
                    <p className="mt-2 text-sm text-gray-600">Add photo</p>
                  </div>
                )}
              </div>

              <p className="text-sm leading-relaxed text-gray-500">
                Recommended image size:{" "}
                <span className="font-medium">870×493px</span>
                <br />
                Max size: <span className="font-medium">3 MB</span>
                <br />
                Allowed formats:{" "}
                <span className="font-medium">PNG, JPG, JPEG</span>
              </p>

              <input
                type="file"
                id="image-file"
                onChange={handleImageChange}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
              />
            </div>
          </div>

          <div className="main-container">
            <div className="label-container">
              <FiUser />
              <h6>Location Details:</h6>
            </div>
            <div className="input-container">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                ref={inputRef}
                required
                placeholder="Enter location"
              />
            </div>

            {!hideMap && (
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={15}
                  center={mapCenter}
                  options={{
                    gestureHandling: "greedy",
                    disableDefaultUI: true,
                    mapId: "49ae42fed52588c3",
                  }}
                >
                  {latitude && longitude && (
                    <MarkerF position={{ lat: latitude, lng: longitude }} />
                  )}
                </GoogleMap>
              </div>
            )}
          </div>

          <div className="form-actions">
            <div className="checkbox-container">
              <input
                type="checkbox"
                onChange={(e) => setHideMap(e.target.checked)}
                checked={hideMap}
              />
              <h5>Don't show map</h5>
            </div>
            <div className="checkbox-container">
              <input type="checkbox" required />
              <h5>
                I have read and agree to the website{" "}
                <span>Terms & Conditions</span>.
              </h5>
            </div>
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? <ClipLoader color="#fff" size={20} /> : "Post Job"}
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleModalClose}
          title="Job Posted Successfully!"
          message="Your job has been successfully posted and is now live on our platform."
        />
      </div>
              <div className="col-12 col-lg-4">
                <div className='sticky top-[180px]'>
                <OfferUpJobUI />
                </div>
              </div>
    </div>
  );
};

export default PostJob;

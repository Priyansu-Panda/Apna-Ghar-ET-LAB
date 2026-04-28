import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LandlordNavbar from "../../components/LandlordNavbar";
import {
  createProperty,
  getPropertyById,
  updateProperty
} from "../../api/properties";
import {
  FaUpload,
  FaPlusCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaHome
} from "react-icons/fa";

function AddProperty() {
  const navigate = useNavigate();
  const location = useLocation();
  const editId = new URLSearchParams(location.search).get("edit");

  const [formData, setFormData] = useState({
    type: "PG",
    title: "",
    location: "",
    address: "",
    rent: "",
    deposit: "",
    occupancy: "Single",
    gender: "Any",
    furnished: "Fully Furnished",
    description: "",
    photos: []
  });

  const [amenities, setAmenities] = useState([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amenitiesList = [
    "WiFi",
    "AC",
    "Laundry",
    "Meals",
    "Parking",
    "Power Backup",
    "Gym",
    "CCTV",
    "Housekeeping",
    "Balcony"
  ];

  useEffect(() => {
    if (!editId) return;

    setLoading(true);
    getPropertyById(editId)
      .then((property) => {
        setFormData({
          type: property.type || "PG",
          title: property.title || "",
          location: property.location || "",
          address: property.address || "",
          rent: property.rent || "",
          deposit: property.deposit || "",
          occupancy: property.occupancy || "Single",
          gender: property.gender || "Any",
          furnished: property.furnished || "Fully Furnished",
          description: property.description || "",
          photos: []
        });
        setAmenities(property.amenities || []);
        setError("");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Unable to load property for editing."
        );
      })
      .finally(() => setLoading(false));
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
  };

  const handleAmenity = (item) => {
    if (amenities.includes(item)) {
      setAmenities(
        amenities.filter((amenity) => amenity !== item)
      );
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);

    setFormData({
      ...formData,
      photos: files
    });
  };

  const validateProperty = () => {
    if (
      !formData.title ||
      !formData.location ||
      !formData.rent ||
      !formData.description
    ) {
      setError("Please complete all required property details (title, location, rent, description).");
      return false;
    }

    if (!editId && formData.photos.length === 0) {
      setError("Please upload at least one property image.");
      return false;
    }

    return true;
  };

  const buildPayload = (status) => {
    const payload = new FormData();

    payload.append("type", formData.type);
    payload.append("title", formData.title);
    payload.append("location", formData.location);
    payload.append("address", formData.address);
    payload.append("rent", formData.rent);
    payload.append("price", formData.rent);
    payload.append("deposit", formData.deposit);
    payload.append("occupancy", formData.occupancy);
    payload.append("gender", formData.gender);
    payload.append("furnished", formData.furnished);
    payload.append("description", formData.description);
    amenities.forEach(amenity => {
      payload.append("amenities", amenity);
    });
    payload.append("availableRooms", "1");
    payload.append("status", "Available");

    formData.photos.forEach((photo) => {
      payload.append("images", photo);
    });

    return payload;
  };

  const handleSubmit = async (status) => {
    if (!validateProperty()) return;

    setLoading(true);
    setError("");

    try {
      if (editId) {
        await updateProperty(editId, buildPayload(status));
      } else {
        await createProperty(buildPayload(status));
      }

      setPublished(status === "publish");

      alert(
        status === "publish"
          ? "Property Published Successfully!"
          : "Draft Saved Successfully!"
      );

      navigate("/landlord/properties");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Property save failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LandlordNavbar />

      <div className="container py-4">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="fw-bold">Add New Property</h1>
          <p className="text-muted mb-0">
            Create a new listing and start receiving bookings
          </p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-4">
            {error}
          </div>
        )}

        <div className="row g-4">
          {/* LEFT FORM */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              {/* BASIC INFO */}
              <h4 className="fw-bold mb-3">
                <FaHome className="me-2 text-primary" />
                Basic Information
              </h4>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">
                    Property Type
                  </label>
                  <select
                    className="form-select rounded-3"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option>PG</option>
                    <option>Hostel</option>
                    <option>Apartment</option>
                    <option>House</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Occupancy
                  </label>
                  <select
                    className="form-select rounded-3"
                    name="occupancy"
                    value={formData.occupancy}
                    onChange={handleChange}
                  >
                    <option>Single</option>
                    <option>Double</option>
                    <option>Triple</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Property Title
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Modern PG for Professionals"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Koramangala, Bangalore"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Gender Preference
                  </label>
                  <select
                    className="form-select rounded-3"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option>Any</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Full Address
                  </label>
                  <textarea
                    rows="2"
                    className="form-control rounded-3"
                    placeholder="Enter complete property address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PRICING */}
              <h4 className="fw-bold mb-3">
                ₹ Pricing Details
              </h4>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">
                    Monthly Rent
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    placeholder="12000"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    placeholder="24000"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* AMENITIES */}
              <h4 className="fw-bold mb-3">
                Amenities
              </h4>

              <div className="row g-2 mb-4">
                {amenitiesList.map((item, index) => (
                  <div
                    className="col-md-4 col-6"
                    key={index}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleAmenity(item)
                      }
                      className={`btn w-100 rounded-3 ${
                        amenities.includes(item)
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                    >
                      {item}
                    </button>
                  </div>
                ))}
              </div>

              {/* DESCRIPTION */}
              <h4 className="fw-bold mb-3">
                Description
              </h4>

              <textarea
                rows="5"
                className="form-control rounded-3 mb-4"
                placeholder="Describe the property, nearby landmarks, environment, features..."
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              {/* PHOTO UPLOAD */}
              <h4 className="fw-bold mb-3">
                Photos
              </h4>

              <label className="border rounded-4 p-5 text-center w-100 mb-4 bg-light">
                <FaUpload
                  size={35}
                  className="text-primary mb-3"
                />
                <h6>Upload Property Images</h6>
                <small className="text-muted">
                  JPG / PNG accepted
                </small>

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handlePhotoUpload}
                />
              </label>

              {formData.photos.length > 0 && (
                <div className="alert alert-success rounded-4">
                  {formData.photos.length} photo(s)
                  selected successfully
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-outline-dark rounded-3 px-4 py-2 fw-semibold"
                  disabled={loading}
                  onClick={() =>
                    handleSubmit("draft")
                  }
                >
                  {loading ? "Saving..." : "Save Draft"}
                </button>

                <button
                  className="btn btn-dark rounded-3 px-4 py-2 fw-semibold"
                  disabled={loading}
                  onClick={() =>
                    handleSubmit("publish")
                  }
                >
                  <FaPlusCircle className="me-2" />
                  {loading ? "Publishing..." : "Publish Property"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top">
              <h4 className="fw-bold mb-3">
                Live Preview
              </h4>

              <div className="bg-light rounded-4 p-4">
                <span className="badge bg-primary mb-3">
                  {formData.type}
                </span>

                <h5 className="fw-bold">
                  {formData.title ||
                    "Property Title"}
                </h5>

                <p className="text-muted mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  {formData.location ||
                    "Location"}
                </p>

                <h4 className="fw-bold text-success">
                  ₹
                  {formData.rent || "0"}
                  /month
                </h4>

                <small className="text-muted">
                  Deposit: ₹
                  {formData.deposit || "0"}
                </small>

                <hr />

                <div className="small text-muted">
                  {amenities.length > 0
                    ? amenities.join(", ")
                    : "Amenities will appear here"}
                </div>
              </div>

              {published && (
                <div className="alert alert-success rounded-4 mt-4 mb-0">
                  <FaCheckCircle className="me-2" />
                  Property Published Live
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProperty;

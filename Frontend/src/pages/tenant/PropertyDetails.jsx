import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/TenantNavbar";
import { getPropertyById } from "../../api/properties";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBed,
  FaUser,
  FaHome,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaCalendarAlt,
  FaCommentDots,
  FaWifi,
  FaSnowflake,
  FaUtensils,
  FaParking,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaStar,
  FaClock,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    getPropertyById(id)
      .then((data) => {
        setProperty(data);
        setError("");
        setCurrentImage(0);
      })
      .catch((err) => {
        setError(
          err.response?.status === 404
            ? "Property Not Found"
            : err.response?.data?.message ||
                "Unable to load property details."
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const images =
    property?.images && property.images.length > 0
      ? property.images
      : property?.image
        ? [property.image, property.image, property.image, property.image]
        : [];

  const reviews = [
    {
      name: "Arjun",
      rating: 5,
      text: "Very clean rooms and peaceful environment.",
    },
    {
      name: "Sneha",
      rating: 4,
      text: "Owner is helpful. Great location near metro.",
    },
    {
      name: "Rohit",
      rating: 5,
      text: "Best place I stayed in Bangalore.",
    },
  ];

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [autoPlay, images]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Property link copied!");
    } catch {
      alert("Link copied!");
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    alert(`Message sent: ${chatInput}`);
    setChatInput("");
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Loading Property...</h2>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 text-center">
        <h2>{error || "Property Not Found"}</h2>
        <Link to="/tenant/dashboard" className="btn btn-primary mt-3">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const ownerName = property.owner?.username || property.owner?.name || "Owner";

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="container py-4">
        {/* Back */}
        <Link
          to="/tenant/dashboard"
          className="text-dark text-decoration-none fw-semibold"
        >
          <FaArrowLeft /> Back to Listings
        </Link>

        <div className="row g-4 mt-2">
          {/* LEFT */}
          <div className="col-lg-8">
            {/* IMAGE SECTION */}
            <div className="bg-white rounded-4 shadow-sm p-3">
              <div
                className="position-relative"
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
              >
                <img
                  src={images[currentImage]}
                  alt="property"
                  className="w-100 rounded-4"
                  style={{
                    height: "520px",
                    objectFit: "cover",
                  }}
                />

                <span className="badge bg-primary position-absolute top-0 start-0 m-3 px-3 py-2">
                  {property.type}
                </span>

                <div className="position-absolute top-0 end-0 d-flex gap-2 m-3">
                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() => setLiked(!liked)}
                  >
                    {liked ? <FaHeart color="red" /> : <FaRegHeart />}
                  </button>

                  <button
                    className="btn btn-light rounded-circle"
                    onClick={handleShare}
                  >
                    <FaShareAlt />
                  </button>

                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() => setShowZoom(true)}
                  >
                    <FaExpand />
                  </button>
                </div>

                <button
                  className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3"
                  onClick={prevImage}
                >
                  <FaChevronLeft />
                </button>

                <button
                  className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={nextImage}
                >
                  <FaChevronRight />
                </button>

                <div className="position-absolute bottom-0 end-0 bg-dark text-white px-3 py-1 rounded-pill m-3">
                  {currentImage + 1}/{images.length}
                </div>
              </div>

              {/* THUMBNAILS */}
              <div className="d-flex gap-3 mt-3 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="thumb"
                    onClick={() => setCurrentImage(i)}
                    style={{
                      width: "95px",
                      height: "70px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "12px",
                      border:
                        currentImage === i
                          ? "3px solid #0d6efd"
                          : "2px solid #eee",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <div className="bg-white rounded-4 shadow-sm p-4 mt-4">
              <div className="d-flex justify-content-between">
                <h2 className="fw-bold">{property.title}</h2>

                <span className="badge bg-success px-3 py-2">{property.status}</span>
              </div>

              <p className="text-muted">
                <FaMapMarkerAlt /> {property.location}
              </p>

              {/* INFO GRID */}
              <div className="row g-3 my-3">
                <div className="col-md-3">
                  <div className="border rounded-4 p-3 text-center">
                    <FaBed />
                    <h5 className="mt-2">{property.occupancy || "Single"}</h5>
                    <small>Occupancy</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="border rounded-4 p-3 text-center">
                    <FaUser />
                    <h5 className="mt-2">{property.gender || "Any"}</h5>
                    <small>Gender</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="border rounded-4 p-3 text-center">
                    <FaHome />
                    <h5 className="mt-2">{property.type}</h5>
                    <small>Type</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="border rounded-4 p-3 text-center">
                    <FaCheckCircle className="text-success" />
                    <h5 className="mt-2">Verified</h5>
                    <small>Property</small>
                  </div>
                </div>
              </div>

              {/* TABS */}
              <div className="d-flex bg-light rounded-pill p-1 mt-4">
                {["description", "amenities", "location", "reviews"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`btn rounded-pill flex-fill ${
                        activeTab === tab ? "btn-white shadow-sm" : ""
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ),
                )}
              </div>

              {/* TAB CONTENT */}
              <div className="mt-4">
                {activeTab === "description" && (
                  <>
                    <h5>About this property</h5>

                    <p>
                      {property.description ||
                        "Fully furnished property with modern amenities and prime location."}
                    </p>

                    <div className="row g-3 mt-3">
                      <div className="col-md-4">
                        <div className="border rounded-4 p-3">
                          <FaClock /> 24x7 Access
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="border rounded-4 p-3">
                          <FaShieldAlt /> CCTV Security
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="border rounded-4 p-3">
                          <FaBolt /> Power Backup
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "amenities" && (
                  <div className="row g-3">
                    {(property.features || []).map((feature, i) => (
                      <div className="col-md-4" key={i}>
                        <div className="border rounded-4 p-3">
                          {feature === "WiFi" && <FaWifi />}
                          {feature === "AC" && <FaSnowflake />}
                          {feature === "Meals" && <FaUtensils />}
                          {feature === "Parking" && <FaParking />} {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "location" && (
                  <>

                    <div className="bg-light rounded-4 p-5 text-center mt-3">
                      <FaMapMarkerAlt size={40} />
                      <p className="mt-2">{property.address || property.location}</p>
                    </div>
                  </>
                )}

                {activeTab === "reviews" && (
                  <>
                    {reviews.map((review, index) => (
                      <div key={index} className="border rounded-4 p-3 mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>{review.name}</strong>

                          <span className="text-warning">
                            {[...Array(review.rating)].map((_, i) => (
                              <FaStar key={i} />
                            ))}
                          </span>
                        </div>

                        <p className="mb-0 mt-2">{review.text}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">
            <div
              className="bg-white rounded-4 shadow-sm p-4 sticky-top"
              style={{ top: "105px" }}
            >
              <h4>Pricing</h4>

              <h1 className="fw-bold mt-3">
                ₹{property.price}
                <span className="fs-4 text-muted">/month</span>
              </h1>

              <p className="text-muted">
                Security Deposit ₹{property.security}
              </p>

              <button className="btn btn-dark w-100 mb-3 rounded-3">
                Request Booking
              </button>

              <button className="btn btn-outline-dark w-100 mb-3 rounded-3">
                <FaCalendarAlt /> Schedule Visit
              </button>

              <button
                className="btn btn-outline-dark w-100 rounded-3"
                onClick={() => setShowChat(true)}
              >
                <FaCommentDots /> Chat with Owner
              </button>

              <hr />

              <ul className="text-muted small">
                <li>Free cancellation in 24 hrs</li>
                <li>Verified owner profile</li>
                <li>Digital agreement included</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT MODAL */}
      {showChat && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-4 p-4" style={{ width: "400px" }}>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="m-0">Chat with Owner</h5>

              <button
                className="btn-close"
                onClick={() => setShowChat(false)}
              ></button>
            </div>

            <div className="bg-light rounded-3 p-3 mb-3">
              👤 {ownerName}
              <br />
              <small className="text-success">Online now</small>
            </div>

            <textarea
              className="form-control"
              rows="4"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            ></textarea>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={sendMessage}
            >
              Send Message
            </button>
          </div>
        </div>
      )}

      {/* ZOOM MODAL */}
      {showZoom && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
          onClick={() => setShowZoom(false)}
        >
          <img
            src={images[currentImage]}
            alt="zoom"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "20px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;

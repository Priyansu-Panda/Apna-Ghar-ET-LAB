import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProperties } from "../../api/properties";
import Navbar from "../../components/TenantNavbar";

import {
  FaHome,
  FaUser,
  FaTools,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaHeart,
  FaMapMarkerAlt,
  FaStar,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
} from "react-icons/fa";

function TenantDashboard() {
  /* ---------------- STATES ---------------- */
  const [propertyType, setPropertyType] = useState("All Types");
  const [gender, setGender] = useState("Any");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FILTER OPTIONS ---------------- */
  const amenities = [
    { name: "WiFi", icon: <FaWifi /> },
    { name: "Parking", icon: <FaParking /> },
    { name: "Meals", icon: <FaUtensils /> },
    { name: "AC", icon: <FaSnowflake /> },
  ];

  /* ---------------- TOGGLE AMENITIES ---------------- */
  const toggleAmenity = (name) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  /* ---------------- FAVORITES ---------------- */
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  /* ---------------- RESET FILTERS ---------------- */
  const handleResetFilters = () => {
    setPropertyType("All Types");
    setGender("Any");
    setSelectedAmenities([]);
    setSearchTerm("");
  };

  useEffect(() => {
    getAllProperties()
      .then((data) => {
        setProperties(data);
        setError("");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Unable to load properties. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- LIVE FILTERING ---------------- */
  const filteredProperties = properties.filter((item) => {
    const search = searchTerm.toLowerCase();

    const matchSearch =
      item.title.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.gender.toLowerCase().includes(search);

    const matchType =
      propertyType === "All Types" || item.type === propertyType;

    const matchGender = gender === "Any" || item.gender === gender;

    const matchAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => item.features?.includes(amenity));

    return matchSearch && matchType && matchGender && matchAmenities;
  });

  const dashboardStats = {
    totalProperties: properties.length,
    available: properties.filter((item) => item.status === "Available").length,
    rating: 4.5
  };

  return (
    <div className="dashboard-page">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="hero-section">
        {/* Background Video */}
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="hero-overlay"></div>

        {/* Content */}
        <div className="container hero-content">
          <h1>Find Your Perfect Home</h1>

          <p>Search from thousands of PGs, Hostels and Apartments</p>

          {/* Search Row */}
          <div className="search-row">
            <div className="search-box">
              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search by location, property..."
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="btn btn-light filter-btn">
              <FaFilter /> Filters
            </button>

            <button className="btn search-btn">Search</button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div>
              <h2>{dashboardStats.totalProperties}</h2>
              <p>Properties</p>
            </div>

            <div>
              <h2>{dashboardStats.available}</h2>
              <p>Available</p>
            </div>

            <div>
              <h2>{dashboardStats.rating}★</h2>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN SECTION ================= */}
      <section className="container my-5">
        <div className="row">
          {/* ================= FILTERS ================= */}
          <div className="col-lg-3 mb-4">
            <div className="filter-box">
              <h4>Filters</h4>
              <p className="text-muted">Refine your search</p>

              {/* Property Type */}
              <label>Property Type</label>
              <select
                className="form-control mb-3"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option>All Types</option>
                <option>PG</option>
                <option>Hostel</option>
                <option>Apartment</option>
              </select>

              {/* Gender */}
              <label>Gender</label>
              <select
                className="form-control mb-3"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option>Any</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              {/* Amenities */}
              <label className="mb-2">
                Amenities ({selectedAmenities.length})
              </label>

              <div className="amenity-list">
                {amenities.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    className={
                      selectedAmenities.includes(item.name)
                        ? "amenity-btn active-amenity"
                        : "amenity-btn"
                    }
                    onClick={() => toggleAmenity(item.name)}
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
              </div>

              {/* Reset */}
              <button
                type="button"
                className="btn btn-outline-dark w-100 mt-4"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* ================= PROPERTY LIST ================= */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between mb-4">
              <h3>{filteredProperties.length} Properties Available</h3>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="row">
              {loading ? (
                <div className="text-center mt-5">
                  <h4>Loading Properties...</h4>
                </div>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((item) => (
                  <div className="col-md-6 mb-4" key={item.id}>
                    <div className="property-card">
                      {/* Image */}
                      <div className="img-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="property-img"
                        />

                        <span
                          className={
                            favorites.includes(item.id)
                              ? "wishlist-icon active-heart"
                              : "wishlist-icon"
                          }
                          onClick={() => toggleFavorite(item.id)}
                        >
                          <FaHeart />
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <span className="badge bg-primary mb-2">
                          {item.type}
                        </span>

                        <h5>{item.title}</h5>

                        <p className="text-muted mb-1">
                          <FaMapMarkerAlt /> {item.location}
                        </p>

                        <p className="text-muted">
                          {item.occupancy} • {item.gender}
                        </p>

                        {/* Feature Chips */}
                        <div className="feature-chips mb-3">
                          {item.features?.map((feature, index) => (
                            <span key={index}>{feature}</span>
                          ))}
                        </div>

                        <p className="rating">
                          <FaStar /> 4.5
                        </p>

                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="rent-text">₹{item.price}/month</h5>

                          <Link
                            to={`/tenant/property/${item.id}`}
                            className="btn details-btn"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-5">
                  <h4>No Properties Found</h4>
                  <p className="text-muted">Try changing filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TenantDashboard;

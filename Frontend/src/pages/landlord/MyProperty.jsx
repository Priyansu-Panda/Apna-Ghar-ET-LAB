import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandlordNavbar from "../../components/LandlordNavbar";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaBed,
  FaUsers,
  FaRupeeSign,
  FaFilter,
} from "react-icons/fa";
import {
  deleteProperty,
  getMyProperties,
} from "../../api/properties";

function MyProperties() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProperties = () => {
    setLoading(true);
    getMyProperties()
      .then((data) => {
        setProperties(data);
        setError("");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Unable to load your properties."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this property?")) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter((item) => item.id !== id));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Delete failed. Please try again."
        );
      }
    }
  };

  const filteredProperties = properties.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ? true : item.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <LandlordNavbar />

      <div className="container py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold">My Properties</h1>
            <p className="text-muted mb-0">
              Manage all your property listings
            </p>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search property / location..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaFilter />
                </span>

                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                >
                  <option>All</option>
                  <option>PG</option>
                  <option>Hostel</option>
                  <option>Apartment</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="row g-4 mb-4">

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold">
                {properties.length}
              </h2>
              <p className="text-muted mb-0">
                Total Properties
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold text-success">
                ₹
                {properties.reduce(
                  (sum, item) => sum + item.earnings,
                  0
                )}
              </h2>
              <p className="text-muted mb-0">
                Monthly Earnings
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold">
                {
                  properties.filter(
                    (p) => p.status === "Occupied"
                  ).length
                }
              </h2>
              <p className="text-muted mb-0">
                Occupied Units
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold text-primary">
                {properties.reduce(
                  (sum, item) => sum + item.tenants,
                  0
                )}
              </h2>
              <p className="text-muted mb-0">
                Total Tenants
              </p>
            </div>
          </div>

        </div>

        {/* PROPERTY LIST */}
        <div className="row g-4">

          {loading ? (
            <div className="text-center py-5">
              <h4>Loading properties...</h4>
            </div>
          ) : (
            filteredProperties.map((item) => (
            <div
              className="col-lg-6"
              key={item.id}
            >
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    height: "240px",
                    objectFit: "cover",
                  }}
                />

                {/* BODY */}
                <div className="p-4">

                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="fw-bold">
                      {item.title}
                    </h4>

                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        item.status === "Available"
                          ? "bg-success"
                          : "bg-dark"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-muted">
                    <FaMapMarkerAlt className="me-2" />
                    {item.location}
                  </p>

                  <div className="d-flex flex-wrap gap-3 mb-3">

                    <span>
                      <FaRupeeSign /> {item.rent}/mo
                    </span>

                    <span>
                      <FaBed className="me-1" />
                      {item.type}
                    </span>

                    <span>
                      <FaUsers className="me-1" />
                      {item.occupancy}
                    </span>

                  </div>

                  <div className="bg-light rounded-4 p-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">
                        Earnings
                      </span>
                      <strong>
                        ₹{item.earnings}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <span className="text-muted">
                        Tenants
                      </span>
                      <strong>
                        {item.tenants}
                      </strong>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="d-flex flex-wrap gap-2">

                    <button
                      className="btn btn-outline-secondary rounded-4"
                      onClick={() =>
                        navigate(`/landlord/add-property?edit=${item.id}`)
                      }
                    >
                      <FaEye className="me-2" />
                      View
                    </button>

                    <button
                      className="btn btn-outline-primary rounded-4"
                      onClick={() =>
                        navigate(`/landlord/add-property?edit=${item.id}`)
                      }
                    >
                      <FaEdit className="me-2" />
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-danger rounded-4"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      <FaTrash className="me-2" />
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            </div>
            ))
          )}

        </div>

        {/* EMPTY */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-5">
            <h4>No properties found</h4>
            <p className="text-muted">
              Try changing search/filter
            </p>
          </div>
        )}

      </div>
    </>
  );
}

export default MyProperties;

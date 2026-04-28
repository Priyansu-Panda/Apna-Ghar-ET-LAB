/* =========================================
   FILE 2: src/pages/landlord/LandlordDashboard.jsx
========================================= */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProperties } from "../../api/properties";
import LandlordNavbar from "../../components/LandlordNavbar";
import {
  FaBuilding,
  FaRupeeSign,
  FaClock,
  FaUsers,
  FaPlus,
  FaEye,
  FaEdit,
  FaClipboardCheck,
  FaTools
} from "react-icons/fa";

function LandlordDashboard() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProperties()
      .then((data) => {
        setProperties(data);
        setError("");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Unable to load landlord properties."
        );
      });
  }, []);

  const totalProperties = properties.length;
  const availableProperties = properties.filter(
    (item) => item.status === "Available"
  ).length;
  const occupiedProperties = properties.filter(
    (item) => item.status === "Occupied"
  ).length;
  const monthlyRevenue = properties.reduce(
    (sum, item) => sum + Number(item.earnings || item.rent || 0),
    0
  );
  const occupancyRate =
    totalProperties > 0
      ? Math.round((occupiedProperties / totalProperties) * 100)
      : 0;

  return (
    <>
      <LandlordNavbar />

      <div className="container py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold">Landlord Dashboard</h1>
            <p className="text-muted mb-0">
              Manage your properties and tenants
            </p>
          </div>

          <Link
          to="/landlord/add-property"
          className="btn btn-dark px-4 py-2 rounded-4 fw-semibold"
          >
            <FaPlus className="me-2" />
            Add New Property
          </Link>
        </div>

        {/* TOP CARDS */}
        <div className="row g-4 mb-4">

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-2">Total Properties</p>
                  <h1 className="fw-bold">{totalProperties}</h1>
                  <small className="text-muted">{availableProperties} available</small>
                </div>
                <FaBuilding size={40} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-2">Monthly Revenue</p>
                  <h1 className="fw-bold">₹{monthlyRevenue}</h1>
                  <small className="text-success">
                    +12% from last month
                  </small>
                </div>
                <FaRupeeSign size={40} className="text-success" />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-2">Pending Requests</p>
                  <h1 className="fw-bold">2</h1>
                  <small className="text-muted">Booking requests</small>
                </div>
                <FaClock size={40} className="text-warning" />
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-2">Occupancy Rate</p>
                  <h1 className="fw-bold">{occupancyRate}%</h1>
                  <small className="text-muted">
                    Average across properties
                  </small>
                </div>
                <FaUsers size={40} className="text-purple" />
              </div>
            </div>
          </div>

        </div>

        <div className="row g-4">

          {/* LEFT SECTION */}
          <div className="col-lg-8">

            {/* BOOKING REQUESTS */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h4 className="fw-bold mb-1">
                    Recent Booking Requests
                  </h4>
                  <p className="text-muted mb-0">
                    Review and respond to tenant applications
                  </p>
                </div>

                <button className="btn btn-outline-secondary rounded-4">
                  View All
                </button>
              </div>

              {/* REQUEST CARD */}
              {[
                {
                  name: "Rahul Verma",
                  property: "Modern PG for Working Professionals",
                  move: "2/15/2026",
                  req: "1/28/2026",
                  msg:
                    "I am interested in booking this property for long term. I work at a nearby IT company."
                },
                {
                  name: "Sneha Reddy",
                  property: "Spacious 2BHK Apartment",
                  move: "3/1/2026",
                  req: "1/30/2026",
                  msg:
                    "Looking for a 2BHK for my family. Would like to schedule a visit this weekend."
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="border rounded-4 p-4 mb-3"
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold mb-1">{item.name}</h4>
                      <p className="text-muted mb-3">
                        {item.property}
                      </p>
                    </div>

                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                      Pending
                    </span>
                  </div>

                  <p className="mb-1">
                    Move-in Date: {item.move}
                  </p>
                  <p className="mb-3">
                    Requested: {item.req}
                  </p>

                  <p className="text-muted">
                    {item.msg}
                  </p>

                  <button className="btn btn-dark w-100 rounded-4 fw-semibold">
                    Review
                  </button>
                </div>
              ))}
            </div>

            {/* MY PROPERTIES */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h4 className="fw-bold mb-1">
                    My Properties
                  </h4>
                  <p className="text-muted mb-0">
                    Manage your property listings
                  </p>
                </div>
              </div>

              {properties.slice(0, 2).map((p, i) => (
                <div
                  key={p.id || i}
                  className="border rounded-4 p-3 mb-3"
                >
                  <div className="row align-items-center">

                    <div className="col-md-2">
                      <img
                        src={p.image}
                        alt=""
                        className="img-fluid rounded-4"
                        style={{
                          height: "90px",
                          width: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>

                    <div className="col-md-7">
                      <h4 className="fw-bold mb-1">
                        {p.title}
                      </h4>
                      <p className="text-muted mb-2">
                        📍 {p.location}
                      </p>

                      <div className="d-flex gap-3 mb-3">
                        <span>₹{p.rent}/mo</span>
                        <span>{p.type}</span>
                        <span>{p.occupancy}</span>
                      </div>

                      <div className="d-flex gap-2">
                        <Link
                          to={`/landlord/add-property?edit=${p.id}`}
                          className="btn btn-outline-secondary rounded-4"
                        >
                          <FaEye className="me-2" />
                          View
                        </Link>

                        <Link
                          to={`/landlord/add-property?edit=${p.id}`}
                          className="btn btn-outline-secondary rounded-4"
                        >
                          <FaEdit className="me-2" />
                          Edit
                        </Link>

                        <button className="btn btn-outline-secondary rounded-4">
                          Stats
                        </button>
                      </div>
                    </div>

                    <div className="col-md-3 text-end">
                      <span className="badge bg-dark px-3 py-2 rounded-pill">
                        Available
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SECTION */}
          <div className="col-lg-4">

            {/* ALERTS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-4">
                Alerts & Notifications
              </h4>

              <div className="bg-warning bg-opacity-10 rounded-4 p-3 mb-3">
                <h6 className="mb-1">2 Pending Bookings</h6>
                <small>Review tenant applications</small>
              </div>

              <div className="bg-primary bg-opacity-10 rounded-4 p-3 mb-3">
                <h6 className="mb-1">2 Maintenance Requests</h6>
                <small>Requires attention</small>
              </div>

              <div className="bg-success bg-opacity-10 rounded-4 p-3">
                <h6 className="mb-1">All Payments Up To Date</h6>
                <small>No pending collections</small>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-4">
                Quick Actions
              </h4>

              <button className="btn btn-outline-secondary w-100 text-start rounded-4 mb-2">
                <FaClipboardCheck className="me-2" />
                Review Bookings
              </button>

              <button className="btn btn-outline-secondary w-100 text-start rounded-4 mb-2">
                <FaPlus className="me-2" />
                Add New Property
              </button>

              <button className="btn btn-outline-secondary w-100 text-start rounded-4 mb-2">
                ₹ Generate Invoice
              </button>

              <button className="btn btn-outline-secondary w-100 text-start rounded-4">
                <FaTools className="me-2" />
                View Maintenance
              </button>
            </div>

            {/* MONTHLY EXPENSES */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-4">
                Monthly Expenses
              </h4>

              {[
                ["Property Tax", "₹5,000"],
                ["Maintenance", "₹3,000"],
                ["Utilities", "₹2,500"],
                ["Insurance", "₹1,500"]
              ].map((item, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between mb-3"
                >
                  <span className="text-muted">
                    {item[0]}
                  </span>
                  <strong>{item[1]}</strong>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>₹12,000</strong>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default LandlordDashboard;

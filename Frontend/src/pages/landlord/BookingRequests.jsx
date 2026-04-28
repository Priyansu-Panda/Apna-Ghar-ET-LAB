import React, { useState } from "react";
import LandlordNavbar from "../../components/LandlordNavbar";
import {
  FaHome,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaComment,
  FaMapMarkerAlt,
  FaFileAlt,
  FaUserShield
} from "react-icons/fa";

function BookingRequests() {
  const requestsData = [
    {
      id: 1,
      name: "Rahul Verma",
      email: "rahul.verma@email.com",
      phone: "+91 98765 43210",
      property: "Modern PG for Working Professionals",
      location: "Koramangala, Bangalore",
      moveIn: "2/15/2026",
      requestDate: "1/28/2026",
      message:
        "I am interested in booking this property for long term. I work at a nearby IT company.",
      status: "pending",
      type: "PG",
      occupancy: "Single Occupancy",
      rent: "₹12,000/month",
      deposit: "₹24,000",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=80",
      docs: [
        { title: "ID Proof", status: "verified" },
        { title: "Employment Proof", status: "verified" },
        { title: "Previous Rental History", status: "pending" },
        { title: "Background Check", status: "verified" }
      ]
    },

    {
      id: 2,
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      phone: "+91 99887 65432",
      property: "Spacious 2BHK Apartment",
      location: "HSR Layout, Bangalore",
      moveIn: "3/01/2026",
      requestDate: "1/30/2026",
      message:
        "Looking for a 2BHK for my family. Would like to schedule a visit this weekend.",
      status: "pending",
      type: "Apartment",
      occupancy: "Double Occupancy",
      rent: "₹25,000/month",
      deposit: "₹50,000",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=80",
      docs: [
        { title: "ID Proof", status: "verified" },
        { title: "Income Proof", status: "verified" },
        { title: "Family Details", status: "verified" },
        { title: "Background Check", status: "verified" }
      ]
    }
  ];

  const [requests, setRequests] = useState(requestsData);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(requestsData[0]);

  const filtered = requests.filter((item) =>
    filter === "all" ? true : item.status === filter
  );

  const handleApprove = () => {
    const updated = requests.map((item) =>
      item.id === selected.id ? { ...item, status: "approved" } : item
    );
    setRequests(updated);
    setSelected({ ...selected, status: "approved" });
    alert("Booking Approved Successfully");
  };

  const handleReject = () => {
    const updated = requests.map((item) =>
      item.id === selected.id ? { ...item, status: "rejected" } : item
    );
    setRequests(updated);
    setSelected({ ...selected, status: "rejected" });
    alert("Booking Rejected");
  };

  const badgeColor = (status) => {
    if (status === "approved") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  };

  return (
    <>
      <LandlordNavbar />

      <div className="container py-4">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="fw-bold">Booking Requests</h1>
          <p className="text-muted mb-0">
            Review and manage tenant booking requests
          </p>
        </div>

        <div className="row g-4">
          {/* LEFT PANEL */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h4 className="fw-bold mb-1">All Requests</h4>
              <p className="text-muted">
                {filtered.length} {filter}
              </p>

              {/* FILTERS */}
              <div className="bg-light rounded-pill p-1 d-flex mb-4">
                {["pending", "approved", "rejected"].map((item) => (
                  <button
                    key={item}
                    className={`btn rounded-pill flex-fill fw-semibold ${
                      filter === item ? "btn-white shadow-sm" : "btn-light"
                    }`}
                    onClick={() => setFilter(item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>

              {/* LIST */}
              {filtered.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelected(req)}
                  className={`border rounded-4 p-3 mb-3 cursor-pointer ${
                    selected.id === req.id
                      ? "border-primary bg-primary bg-opacity-10"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="fw-bold mb-1">{req.name}</h5>
                  <div className="text-muted">{req.property}</div>
                  <small className="text-secondary">
                    {req.requestDate}
                  </small>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-8">
            {/* DETAILS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 className="fw-bold mb-1">{selected.name}</h3>
                  <p className="text-muted mb-0">
                    Booking Request Details
                  </p>
                </div>

                <span
                  className={`badge bg-${badgeColor(
                    selected.status
                  )}-subtle text-${badgeColor(selected.status)} px-3 py-2 rounded-pill text-capitalize`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <FaEnvelope className="me-2 text-secondary" />
                    {selected.email}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <FaPhone className="me-2 text-secondary" />
                    {selected.phone}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <FaCalendarAlt className="me-2 text-secondary" />
                    Move-in: {selected.moveIn}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <FaCalendarAlt className="me-2 text-secondary" />
                    Requested: {selected.requestDate}
                  </div>
                </div>
              </div>

              <hr />

              <h4 className="fw-bold mb-3">Message from Tenant</h4>
              <div className="bg-light rounded-4 p-3 text-muted mb-4">
                {selected.message}
              </div>

              {/* ACTION BUTTONS */}
              {selected.status === "pending" ? (
                <div className="row g-3">
                  <div className="col-md-5">
                    <button
                      className="btn btn-success w-100 rounded-3 fw-semibold py-3"
                      onClick={handleApprove}
                    >
                      <FaCheck className="me-2" />
                      Approve Booking
                    </button>
                  </div>

                  <div className="col-md-5">
                    <button
                      className="btn btn-danger w-100 rounded-3 fw-semibold py-3"
                      onClick={handleReject}
                    >
                      <FaTimes className="me-2" />
                      Reject Booking
                    </button>
                  </div>

                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-dark w-100 rounded-3 py-3"
                      onClick={() =>
                        alert("Opening tenant chat...")
                      }
                    >
                      <FaComment className="me-2" />
                      Chat
                    </button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info rounded-4 mb-0">
                  This request has been{" "}
                  <strong>{selected.status}</strong>.
                </div>
              )}
            </div>

            {/* PROPERTY DETAILS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-4">Property Details</h4>

              <div className="d-flex gap-3 flex-wrap">
                <img
                  src={selected.image}
                  alt=""
                  className="rounded-4"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover"
                  }}
                />

                <div>
                  <h3 className="fw-bold">
                    {selected.property}
                  </h3>

                  <p className="text-muted mb-2">
                    <FaMapMarkerAlt className="me-2" />
                    {selected.location}
                  </p>

                  <p className="text-muted mb-1">
                    Type: {selected.type} •{" "}
                    {selected.occupancy}
                  </p>

                  <p className="text-muted mb-1">
                    Rent: {selected.rent}
                  </p>

                  <p className="text-muted mb-0">
                    Deposit: {selected.deposit}
                  </p>
                </div>
              </div>
            </div>

            {/* VERIFICATION */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-1">
                Tenant Verification
              </h4>

              <p className="text-muted mb-4">
                Documents and background check
              </p>

              {selected.docs.map((doc, index) => (
                <div
                  key={index}
                  className="border rounded-4 p-3 d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    {doc.title === "Background Check" ? (
                      <FaUserShield className="me-2 text-secondary" />
                    ) : (
                      <FaFileAlt className="me-2 text-secondary" />
                    )}
                    <span className="fw-semibold">
                      {doc.title}
                    </span>
                  </div>

                  <span
                    className={`badge bg-${
                      doc.status === "verified"
                        ? "success"
                        : "warning"
                    }-subtle text-${
                      doc.status === "verified"
                        ? "success"
                        : "warning"
                    } px-3 py-2 rounded-pill`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingRequests;
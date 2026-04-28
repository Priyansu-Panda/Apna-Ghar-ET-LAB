import React, { useState } from "react";
import LandlordNavbar from "../../components/LandlordNavbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaLock,
  FaSave,
  FaTimes,
  FaRupeeSign,
  FaBell
} from "react-icons/fa";

function LandlordProfile() {
  const [tab, setTab] = useState("account");

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const [profile, setProfile] = useState({
    name: storedUser.username || storedUser.name || "Landlord",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    address: "—",
    joined: storedUser.createdAt ? new Date(storedUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—",
    pan: "",
    gst: ""
  });

  const [editMode, setEditMode] = useState(false);

  const [notifications, setNotifications] = useState({
    booking: true,
    payments: true,
    maintenance: true,
    promotions: false
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    setEditMode(false);
    alert("Profile Updated Successfully");
  };

  return (
    <>
      <LandlordNavbar />

      <div className="container py-4">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <h1 className="fw-bold">Landlord Profile</h1>
          <p className="text-muted mb-0">
            Manage your account, earnings and preferences
          </p>
        </div>

        <div className="row g-4">
          {/* LEFT PANEL */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="text-center">
                <FaUserCircle
                  size={95}
                  className="text-primary mb-3"
                />

                <h3 className="fw-bold mb-1">
                  {profile.name}
                </h3>

                <p className="text-muted mb-3">
                  Property Owner
                </p>

                <span className="badge bg-success px-3 py-2 rounded-pill">
                  <FaCheckCircle className="me-2" />
                  Verified Account
                </span>
              </div>

              <hr className="my-4" />

              <div className="mb-3">
                <FaEnvelope className="me-2 text-secondary" />
                {profile.email}
              </div>

              <div className="mb-3">
                <FaPhone className="me-2 text-secondary" />
                {profile.phone}
              </div>

              <div className="mb-3">
                <FaMapMarkerAlt className="me-2 text-secondary" />
                {profile.address}
              </div>

              <div>
                <FaCalendarAlt className="me-2 text-secondary" />
                Member since {profile.joined}
              </div>

              <hr className="my-4" />

              <button
                className="btn btn-dark w-100 rounded-3 mb-2"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>

              <button
                className="btn btn-outline-dark w-100 rounded-3"
                onClick={() =>
                  alert("Password Reset Link Sent")
                }
              >
                <FaLock className="me-2" />
                Change Password
              </button>
            </div>

            {/* QUICK STATS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
              <h5 className="fw-bold mb-3">
                Quick Stats
              </h5>

              <div className="d-flex justify-content-between mb-3">
                <span>Total Properties</span>
                <strong>2</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Occupied</span>
                <strong>75%</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>Pending Requests</span>
                <strong>2</strong>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-8">
            {/* TABS */}
            <div className="card border-0 shadow-sm rounded-4 p-2 mb-4">
              <div className="d-flex gap-2">
                {[
                  "account",
                  "earnings",
                  "settings"
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setTab(item)}
                    className={`btn flex-fill rounded-pill fw-semibold ${
                      tab === item
                        ? "btn-light shadow-sm"
                        : "btn-white"
                    }`}
                  >
                    {item.charAt(0).toUpperCase() +
                      item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* ACCOUNT TAB */}
            {tab === "account" && (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h3 className="fw-bold mb-4">
                  Account Information
                </h3>

                <div className="row g-3">
                  {[
                    ["name", "Full Name"],
                    ["email", "Email"],
                    ["phone", "Phone Number"],
                    ["address", "Address"],
                    ["pan", "PAN Number"],
                    ["gst", "GST Number"]
                  ].map(([field, label]) => (
                    <div
                      className="col-md-6"
                      key={field}
                    >
                      <label className="form-label">
                        {label}
                      </label>

                      <input
                        type="text"
                        className="form-control rounded-3"
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="d-flex gap-3 mt-4">
                    <button
                      className="btn btn-dark px-4 rounded-3"
                      onClick={saveProfile}
                    >
                      <FaSave className="me-2" />
                      Save Changes
                    </button>

                    <button
                      className="btn btn-outline-secondary px-4 rounded-3"
                      onClick={() =>
                        setEditMode(false)
                      }
                    >
                      <FaTimes className="me-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* EARNINGS TAB */}
            {tab === "earnings" && (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h3 className="fw-bold mb-4">
                  Earnings Summary
                </h3>

                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="bg-light rounded-4 p-4">
                      <small className="text-muted">
                        This Month
                      </small>
                      <h2 className="fw-bold text-success">
                        ₹37,000
                      </h2>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="bg-light rounded-4 p-4">
                      <small className="text-muted">
                        Pending Rent
                      </small>
                      <h2 className="fw-bold text-warning">
                        ₹12,000
                      </h2>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="bg-light rounded-4 p-4">
                      <small className="text-muted">
                        Lifetime
                      </small>
                      <h2 className="fw-bold text-primary">
                        ₹4.8L
                      </h2>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <button
                  className="btn btn-dark rounded-3"
                  onClick={() =>
                    alert("Invoice Generated")
                  }
                >
                  <FaRupeeSign className="me-2" />
                  Generate Invoice
                </button>
              </div>
            )}

            {/* SETTINGS TAB */}
            {tab === "settings" && (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h3 className="fw-bold mb-4">
                  Notification Settings
                </h3>

                {[
                  [
                    "booking",
                    "Booking Request Alerts"
                  ],
                  [
                    "payments",
                    "Rent Payment Alerts"
                  ],
                  [
                    "maintenance",
                    "Maintenance Updates"
                  ],
                  [
                    "promotions",
                    "Promotional Emails"
                  ]
                ].map(([key, label]) => (
                  <div
                    key={key}
                    className="form-check form-switch mb-3"
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        notifications[key]
                      }
                      onChange={() =>
                        setNotifications({
                          ...notifications,
                          [key]:
                            !notifications[
                              key
                            ]
                        })
                      }
                    />

                    <label className="form-check-label">
                      <FaBell className="me-2 text-primary" />
                      {label}
                    </label>
                  </div>
                ))}

                <button
                  className="btn btn-dark mt-3 rounded-3"
                  onClick={() =>
                    alert(
                      "Settings Saved Successfully"
                    )
                  }
                >
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LandlordProfile;
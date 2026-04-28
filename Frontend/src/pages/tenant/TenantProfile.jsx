import React, { useState } from "react";
import Navbar from "../../components/TenantNavbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaClock,
  FaMoneyBillWave,
  FaEdit,
  FaLock,
} from "react-icons/fa";

export default function TenantProfile() {
  const [activeTab, setActiveTab] =
    useState("payments");

  const [showEdit, setShowEdit] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const [profile, setProfile] = useState({
    name: storedUser.username || storedUser.name || "Tenant",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    address: "—",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  const [editData, setEditData] =
    useState(profile);

  const [password, setPassword] =
    useState({
      oldPass: "",
      newPass: "",
      confirmPass: "",
    });

  const transactions = [
    {
      title:
        "Modern PG for Working Professionals",
      type: "Rent",
      date: "1/5/2026",
      amount: "₹12,000",
      status: "Paid",
    },
    {
      title: "Security Deposit",
      type: "Deposit",
      date: "12/1/2025",
      amount: "₹24,000",
      status: "Paid",
    },
    {
      title: "Monthly Rent",
      type: "Rent",
      date: "2/5/2026",
      amount: "₹12,000",
      status: "Pending",
    },
  ];

  const documents = [
    "Rental Agreement.pdf",
    "Deposit Receipt.pdf",
    "January Rent Receipt.pdf",
    "ID Verification.pdf",
  ];

  const saveProfile = () => {
    setProfile(editData);
    setShowEdit(false);
    alert("Profile updated!");
  };

  const changePassword = () => {
    if (
      !password.oldPass ||
      !password.newPass ||
      !password.confirmPass
    ) {
      alert("Fill all fields");
      return;
    }

    if (
      password.newPass !==
      password.confirmPass
    ) {
      alert("Passwords do not match");
      return;
    }

    alert("Password changed!");
    setShowPassword(false);
    setPassword({
      oldPass: "",
      newPass: "",
      confirmPass: "",
    });
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="container py-4">
        <div className="row g-4">

          {/* LEFT COLUMN */}
          <div className="col-lg-4">

            {/* PROFILE CARD */}
            <div className="card border-0 shadow-sm rounded-4 p-4">

              <div className="text-center">
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="rounded-circle mb-3"
                  width="110"
                  height="110"
                />

                <h3 className="fw-bold">
                  {profile.name}
                </h3>

                <p className="text-muted mb-2">
                  Tenant
                </p>

                <span className="badge bg-success px-3 py-2 rounded-pill">
                  <FaCheckCircle className="me-2" />
                  Verified Account
                </span>
              </div>

              <hr />

              <p>
                <FaEnvelope className="me-2 text-muted" />
                {profile.email}
              </p>

              <p>
                <FaPhoneAlt className="me-2 text-muted" />
                {profile.phone}
              </p>

              <p>
                <FaMapMarkerAlt className="me-2 text-muted" />
                {profile.address}
              </p>

              <p className="mb-0">
                <FaCalendarAlt className="me-2 text-muted" />
                Member since Jan 2025
              </p>

              <hr />

              <button
                className="btn btn-dark rounded-3 w-100 mb-2"
                onClick={() => {
                  setEditData(profile);
                  setShowEdit(true);
                }}
              >
                <FaEdit className="me-2" />
                Edit Profile
              </button>

              <button
                className="btn btn-outline-dark rounded-3 w-100"
                onClick={() =>
                  setShowPassword(true)
                }
              >
                <FaLock className="me-2" />
                Change Password
              </button>
            </div>

            {/* CURRENT RENT */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">

              <h5 className="fw-bold mb-4">
                Current Rental
              </h5>

              <h6>
                Modern PG for Working
                Professionals
              </h6>

              <p className="text-muted mb-2">
                Koramangala, Bangalore
              </p>

              <h3 className="fw-bold">
                ₹12,000
                <span className="fs-5 text-muted">
                  /month
                </span>
              </h3>

              <p className="text-muted">
                Lease: Dec 2025 -
                Dec 2026
              </p>

              <button
                className="btn btn-outline-dark rounded-3 w-100"
                onClick={() =>
                  alert(
                    "Opening rental agreement..."
                  )
                }
              >
                View Agreement
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-8">

            {/* TABS */}
            <div className="bg-light rounded-pill p-1 d-flex border mb-3">

              {[
                "payments",
                "documents",
                "settings",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className={`btn rounded-pill flex-fill ${
                    activeTab === tab
                      ? "btn-white shadow-sm"
                      : ""
                  }`}
                >
                  {tab
                    .charAt(0)
                    .toUpperCase() +
                    tab.slice(1)}
                </button>
              ))}
            </div>

            {/* CONTENT CARD */}
            <div className="card border-0 shadow-sm rounded-4 p-4">

              {/* PAYMENTS */}
              {activeTab ===
                "payments" && (
                <>
                  <h4 className="fw-bold mb-2">
                    Payment Summary
                  </h4>

                  <p className="text-muted mb-4">
                    Your payment history
                    and upcoming dues
                  </p>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="p-3 rounded-4 bg-success-subtle">
                        <small>
                          Total Paid
                        </small>
                        <h2 className="fw-bold text-success">
                          ₹36,000
                        </h2>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="p-3 rounded-4 bg-warning-subtle">
                        <small>
                          Pending
                        </small>
                        <h2 className="fw-bold text-warning">
                          ₹12,000
                        </h2>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="p-3 rounded-4 bg-primary-subtle">
                        <small>
                          Next Due
                        </small>
                        <h2 className="fw-bold text-primary">
                          Feb 5
                        </h2>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <h5 className="fw-bold mb-3">
                    Recent Transactions
                  </h5>

                  {transactions.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="border rounded-4 p-3 mb-3 d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 className="mb-1">
                            {item.title}
                          </h6>

                          <small className="text-muted">
                            {item.type} •{" "}
                            {item.date}
                          </small>
                        </div>

                        <div className="text-end">
                          <strong>
                            {item.amount}
                          </strong>

                          <br />

                          <span
                            className={`badge ${
                              item.status ===
                              "Paid"
                                ? "bg-success-subtle text-success"
                                : "bg-warning-subtle text-warning"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    )
                  )}

                  <div className="p-4 rounded-4 border border-warning bg-warning-subtle mt-3">
                    <h5 className="fw-bold text-warning-emphasis">
                      Payment Due
                    </h5>

                    <p className="mb-3">
                      You have pending
                      payments. Pay now
                      to avoid late fees.
                    </p>

                    <button
                      className="btn btn-dark rounded-3"
                      onClick={() =>
                        alert(
                          "Redirecting to payment gateway..."
                        )
                      }
                    >
                      <FaMoneyBillWave className="me-2" />
                      Pay Now
                    </button>
                  </div>
                </>
              )}

              {/* DOCUMENTS */}
              {activeTab ===
                "documents" && (
                <>
                  <h4 className="fw-bold mb-4">
                    Documents &
                    Agreements
                  </h4>

                  {documents.map(
                    (doc, index) => (
                      <div
                        key={index}
                        className="border rounded-4 p-3 mb-3 d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {doc}
                        </span>

                        <button className="btn btn-outline-dark btn-sm rounded-3">
                          <FaDownload className="me-2" />
                          Download
                        </button>
                      </div>
                    )
                  )}
                </>
              )}

              {/* SETTINGS */}
              {activeTab ===
                "settings" && (
                <>
                  <h4 className="fw-bold mb-4">
                    Preferences &
                    Notifications
                  </h4>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked
                    />
                    <label>
                      Email payment
                      reminders
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked
                    />
                    <label>
                      SMS booking alerts
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked
                    />
                    <label>
                      Push maintenance
                      updates
                    </label>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                    />
                    <label>
                      Promotional mails
                    </label>
                  </div>

                  <button
                    className="btn btn-dark me-2 rounded-3"
                    onClick={() =>
                      alert(
                        "Settings saved!"
                      )
                    }
                  >
                    Save Changes
                  </button>

                  <button
                    className="btn btn-outline-secondary rounded-3"
                    onClick={() =>
                      alert(
                        "Changes reverted"
                      )
                    }
                  >
                    Cancel
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(0,0,0,0.45)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{
              width: "500px",
              maxWidth: "95%",
            }}
          >
            <h4 className="fw-bold mb-4">
              Edit Profile
            </h4>

            <div className="text-center mb-3">
              <img
                src={editData.avatar}
                alt="avatar"
                className="rounded-circle"
                width="90"
                height="90"
              />
            </div>

            <input
              className="form-control mb-3"
              placeholder="Avatar URL"
              value={
                editData.avatar
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  avatar:
                    e.target.value,
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Full Name"
              value={
                editData.name
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name:
                    e.target.value,
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={
                editData.email
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Phone"
              value={
                editData.phone
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  phone:
                    e.target.value,
                })
              }
            />

            <textarea
              rows="3"
              className="form-control mb-4"
              placeholder="Address"
              value={
                editData.address
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  address:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-dark me-2"
              onClick={
                saveProfile
              }
            >
              Save
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setShowEdit(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPassword && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(0,0,0,0.45)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{
              width: "450px",
              maxWidth: "95%",
            }}
          >
            <h4 className="fw-bold mb-4">
              Change Password
            </h4>

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Old Password"
              value={
                password.oldPass
              }
              onChange={(e) =>
                setPassword({
                  ...password,
                  oldPass:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="New Password"
              value={
                password.newPass
              }
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPass:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Confirm Password"
              value={
                password.confirmPass
              }
              onChange={(e) =>
                setPassword({
                  ...password,
                  confirmPass:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-dark me-2"
              onClick={
                changePassword
              }
            >
              Update
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setShowPassword(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
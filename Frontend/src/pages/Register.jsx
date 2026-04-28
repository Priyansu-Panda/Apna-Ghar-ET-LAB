import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardPath,
  register as registerUser
} from "../api/auth";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaUsers
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "tenant",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] =
    useState(false);
  const [showConfirm, setShowConfirm] =
    useState(false);
  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      general: ""
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number required";
    } else if (
      formData.phone.length < 10
    ) {
      newErrors.phone =
        "Enter valid phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "Password required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Minimum 6 characters";
    }

    if (
      formData.confirmPassword !==
      formData.password
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const user = await registerUser(formData);

      setLoading(false);

      navigate(
        getDashboardPath(user.role)
      );
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      });
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LOGO */}
        <h1 className="auth-logo">
          🏠 RentEase
        </h1>

        <p className="auth-subtitle">
          Create your account
        </p>

        {/* ROLE SWITCH */}
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className={`btn flex-fill rounded-pill fw-semibold ${
              formData.role ===
              "tenant"
                ? "btn-primary"
                : "btn-light border"
            }`}
            onClick={() =>
              setFormData({
                ...formData,
                role: "tenant"
              })
            }
          >
            <FaUsers className="me-2" />
            Tenant
          </button>

          <button
            type="button"
            className={`btn flex-fill rounded-pill fw-semibold ${
              formData.role ===
              "landlord"
                ? "btn-primary"
                : "btn-light border"
            }`}
            onClick={() =>
              setFormData({
                ...formData,
                role:
                  "landlord"
              })
            }
          >
            <FaBuilding className="me-2" />
            Landlord
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
        >
          {errors.general && (
            <div className="alert alert-danger py-2">
              {errors.general}
            </div>
          )}

          {/* FULL NAME */}
          <div className="position-relative mb-3">
            <FaUser className="auth-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="form-control auth-input ps-5"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
            />
          </div>

          {errors.name && (
            <small className="text-danger d-block text-start mb-2">
              {
                errors.name
              }
            </small>
          )}

          {/* EMAIL */}
          <div className="position-relative mb-3">
            <FaEnvelope className="auth-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-control auth-input ps-5"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />
          </div>

          {errors.email && (
            <small className="text-danger d-block text-start mb-2">
              {
                errors.email
              }
            </small>
          )}

          {/* PHONE */}
          <div className="position-relative mb-3">
            <FaPhoneAlt className="auth-icon" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="form-control auth-input ps-5"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
            />
          </div>

          {errors.phone && (
            <small className="text-danger d-block text-start mb-2">
              {
                errors.phone
              }
            </small>
          )}

          {/* PASSWORD */}
          <div className="position-relative mb-3">
            <FaLock className="auth-icon" />

            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              className="form-control auth-input ps-5 pe-5"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowPass(
                  !showPass
                )
              }
            >
              {showPass ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {errors.password && (
            <small className="text-danger d-block text-start mb-2">
              {
                errors.password
              }
            </small>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="position-relative mb-3">
            <FaLock className="auth-icon" />

            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-control auth-input ps-5 pe-5"
              value={
                formData.confirmPassword
              }
              onChange={
                handleChange
              }
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
            >
              {showConfirm ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {errors.confirmPassword && (
            <small className="text-danger d-block text-start mb-2">
              {
                errors.confirmPassword
              }
            </small>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="btn auth-btn"
            disabled={
              loading
            }
          >
            {loading
              ? "Creating Account..."
              : `Register as ${
                  formData.role ===
                  "tenant"
                    ? "Tenant"
                    : "Landlord"
                }`}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-4 mb-0">
          Already have an
          account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;

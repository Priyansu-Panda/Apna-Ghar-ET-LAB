import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardPath,
  login as loginUser
} from "../api/auth";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaUser  
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
    role: "tenant"
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [successMsg, setSuccessMsg] =
    useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value
    });

    setErrors({
      ...errors,
      [name]: "",
      general: ""
    });
  };

  const validateForm = () => {
    let newErrors = {};

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

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Minimum 6 characters";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      const user = await loginUser(formData);

      setSuccessMsg(
        "Login successful!"
      );

      navigate(
        getDashboardPath(user.role)
      );
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center px-3"
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af)"
      }}
    >
      <div
        className="bg-white shadow-lg rounded-5 p-4 p-md-5"
        style={{
          width: "100%",
          maxWidth: "470px"
        }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary">
            🏠 RentEase
          </h1>
          <p className="text-muted mb-0">
            Welcome back! Login
            to continue
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-4">
          <label className="fw-semibold mb-2 d-block">
            Login As
          </label>

          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "tenant"
                  })
                }
                className={`btn w-100 rounded-4 py-2 ${
                  formData.role ===
                  "tenant"
                    ? "btn-primary"
                    : "btn-light border"
                }`}
              >
                <FaUser className="me-2" />
                Tenant
              </button>
            </div>

            <div className="col-6">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role:
                      "landlord"
                  })
                }
                className={`btn w-100 rounded-4 py-2 ${
                  formData.role ===
                  "landlord"
                    ? "btn-dark"
                    : "btn-light border"
                }`}
              >
                <FaUserTie className="me-2" />
                Landlord
              </button>
            </div>
          </div>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="alert alert-success py-2">
            {successMsg}
          </div>
        )}

        {errors.general && (
          <div className="alert alert-danger py-2">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          {/* Email */}
          <div className="mb-3 position-relative">
            <FaEnvelope
              className="position-absolute text-muted"
              style={{
                top: "15px",
                left: "15px"
              }}
            />

            <input
              type="text"
              name="email"
              placeholder="Email Address"
              className="form-control rounded-4 ps-5 py-3"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />

            {errors.email && (
              <small className="text-danger">
                {
                  errors.email
                }
              </small>
            )}
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <FaLock
              className="position-absolute text-muted"
              style={{
                top: "15px",
                left: "15px"
              }}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              className="form-control rounded-4 ps-5 pe-5 py-3"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
            />

            <span
              className="position-absolute"
              style={{
                top: "13px",
                right: "15px",
                cursor:
                  "pointer"
              }}
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

            {errors.password && (
              <small className="text-danger">
                {
                  errors.password
                }
              </small>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-4 py-3 fw-semibold"
            disabled={
              loading
            }
          >
            {loading
              ? "Logging in..."
              : `Login as ${
                  formData.role ===
                  "tenant"
                    ? "Tenant"
                    : "Landlord"
                }`}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 mb-0">
          Don’t have an
          account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

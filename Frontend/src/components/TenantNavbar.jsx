import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import {
  FaHome,
  FaSearch,
  FaUser,
  FaTools,
  FaSignOutAlt
} from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navBtn = (active) =>
    `btn px-4 py-2 rounded-4 fw-semibold d-flex align-items-center gap-2 ${
      active
        ? "btn-light text-primary shadow-sm"
        : "btn-white text-dark border-0"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3 sticky-top">
      <div className="container-fluid">

        {/* LOGO */}
        <Link
          to="/tenant/dashboard"
          className="navbar-brand fw-bold text-primary fs-2"
          style={{ textDecoration: "none" }}
        >
          🏠 RentEase
        </Link>

        {/* RIGHT MENU */}
        <div className="d-flex align-items-center gap-3 ms-auto flex-wrap">

          {/* Dashboard */}
          <Link
            to="/tenant/dashboard"
            className={navBtn(
              isActive("/tenant/dashboard")
            )}
          >
            <FaHome />
            Dashboard
          </Link>

          {/* Profile */}
          <Link
            to="/tenant/profile"
            className={navBtn(
              isActive("/tenant/profile")
            )}
          >
            <FaUser />
            Profile
          </Link>

          {/* Maintenance */}
          <Link
            to="/tenant/maintenance"
            className={navBtn(
              isActive("/tenant/maintenance")
            )}
          >
            <FaTools />
            Maintenance
          </Link>

          {/* Logout */}
          <button
            type="button"
            className="btn px-3 py-2 rounded-4 fw-semibold text-danger"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;

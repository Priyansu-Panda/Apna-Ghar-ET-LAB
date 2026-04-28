import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import {
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaTools,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

function LandlordNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path;

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

        {/* Logo */}
        <Link
          to="/landlord/dashboard"
          className="navbar-brand fw-bold text-primary fs-2"
          style={{ textDecoration: "none" }}
        >
          🏠 RentEase
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu */}
        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
        >
          <div className="d-flex gap-3 align-items-center ms-auto flex-column flex-lg-row mt-3 mt-lg-0">

            <Link
              to="/landlord/dashboard"
              className={navBtn(
                isActive("/landlord/dashboard")
              )}
            >
              <FaHome />
              Dashboard
            </Link>

            <Link
              to="/landlord/properties"
              className={navBtn(
                isActive("/landlord/properties")
              )}
            >
              <FaBuilding />
              Properties
            </Link>

            <Link
              to="/landlord/requests"
              className={navBtn(
                isActive("/landlord/requests")
              )}
            >
              <FaClipboardList />
              Requests
            </Link>

            <Link
              to="/landlord/maintenance"
              className={navBtn(
                isActive("/landlord/maintenance")
              )}
            >
              <FaTools />
              Maintenance
            </Link>

            <Link
              to="/landlord/profile"
              className={navBtn(
                isActive("/landlord/profile")
              )}
            >
              <FaUserCircle />
              Profile
            </Link>

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
      </div>
    </nav>
  );
}

export default LandlordNavbar;

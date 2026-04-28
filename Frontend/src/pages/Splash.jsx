import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaHome, FaKey } from "react-icons/fa";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="splash-content text-center">

        <div className="icon-group mb-4">
          <FaBuilding className="top-icon" />
          <FaHome className="top-icon mx-3" />
          <FaKey className="top-icon" />
        </div>

        <h1 className="brand-title">RentEase</h1>

        <p className="brand-subtitle">
          Digital Rental & PG Management System
        </p>

        <div className="loading-bar mt-4">
          <div className="loading-fill"></div>
        </div>

      </div>
    </div>
  );
}

export default Splash;
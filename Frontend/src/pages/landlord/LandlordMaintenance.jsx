import React, { useState } from "react";
import LandlordNavbar from "../../components/LandlordNavbar";
import {
  FaTools,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSearch,
  FaEye,
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCommentDots,
  FaTimes,
  FaCalendarAlt,
  FaClipboardCheck
} from "react-icons/fa";

function LandlordMaintenance() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 101,
      issue: "Plumbing Leak",
      property: "Modern PG for Working Professionals",
      tenant: "Rahul Verma",
      room: "203",
      priority: "high",
      status: "open",
      date: "2 Feb 2026",
      phone: "+91 98765 43210",
      description:
        "Kitchen sink is leaking continuously. Water spreading near cooking area.",
      updates: [
        "Complaint submitted",
        "Owner notified"
      ]
    },
    {
      id: 102,
      issue: "AC Not Cooling",
      property: "Spacious 2BHK Apartment",
      tenant: "Sneha Reddy",
      room: "B-2",
      priority: "medium",
      status: "progress",
      date: "1 Feb 2026",
      phone: "+91 99887 65432",
      description:
        "AC running but no cooling. Needs technician check.",
      updates: [
        "Complaint submitted",
        "Technician assigned",
        "Visit scheduled"
      ]
    },
    {
      id: 103,
      issue: "WiFi Router Fault",
      property: "Girls Hostel Near Metro",
      tenant: "Aditi Singh",
      room: "106",
      priority: "low",
      status: "resolved",
      date: "28 Jan 2026",
      phone: "+91 91234 56789",
      description:
        "Internet dropping frequently due to router restart issue.",
      updates: [
        "Complaint submitted",
        "Router replaced",
        "Resolved successfully"
      ]
    }
  ]);

  const statusColor = (status) => {
    if (status === "open") return "warning";
    if (status === "progress") return "primary";
    return "success";
  };

  const priorityColor = (priority) => {
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    return "success";
  };

  const filtered = requests.filter((item) => {
    const matchStatus =
      filter === "all"
        ? true
        : item.status === filter;

    const matchSearch =
      item.issue
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.property
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.tenant
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const updateStatus = (id, newStatus) => {
    const updated = requests.map((item) =>
      item.id === id
        ? { ...item, status: newStatus }
        : item
    );

    setRequests(updated);

    if (selected && selected.id === id) {
      setSelected({
        ...selected,
        status: newStatus
      });
    }
  };

  const openCount = requests.filter(
    (r) => r.status === "open"
  ).length;

  const progressCount = requests.filter(
    (r) => r.status === "progress"
  ).length;

  const resolvedCount = requests.filter(
    (r) => r.status === "resolved"
  ).length;

  return (
    <>
      <LandlordNavbar />

      <div className="container py-4">

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="fw-bold">
            Maintenance Management
          </h1>

          <p className="text-muted mb-0">
            Handle tenant complaints and service requests
          </p>
        </div>

        {/* STATS */}
        <div className="row g-4 mb-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold">
                {openCount}
              </h2>
              <p className="text-muted mb-0">
                Open Requests
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold text-primary">
                {progressCount}
              </h2>
              <p className="text-muted mb-0">
                In Progress
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold text-success">
                {resolvedCount}
              </h2>
              <p className="text-muted mb-0">
                Resolved
              </p>
            </div>
          </div>

        </div>

        {/* FILTER BAR */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3">

            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch />
                </span>

                <input
                  className="form-control border-start-0"
                  placeholder="Search issue / tenant / property..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Status
                </option>
                <option value="open">
                  Open
                </option>
                <option value="progress">
                  In Progress
                </option>
                <option value="resolved">
                  Resolved
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* REQUEST LIST */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h4 className="fw-bold mb-4">
            Complaint Requests
          </h4>

          {filtered.map((item) => (
            <div
              key={item.id}
              className="border rounded-4 p-4 mb-3"
            >
              <div className="row align-items-center">

                <div className="col-lg-8">
                  <div className="d-flex gap-2 mb-2">
                    <span
                      className={`badge bg-${statusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>

                    <span
                      className={`badge bg-${priorityColor(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h5 className="fw-bold">
                    {item.issue}
                  </h5>

                  <p className="text-muted mb-1">
                    <FaMapMarkerAlt className="me-2" />
                    {item.property}
                  </p>

                  <p className="mb-1">
                    <FaUser className="me-2" />
                    {item.tenant} • Room {item.room}
                  </p>

                  <small className="text-muted">
                    <FaCalendarAlt className="me-2" />
                    {item.date}
                  </small>
                </div>

                <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">

                  <button
                    className="btn btn-outline-dark rounded-3 me-2 mb-2"
                    onClick={() =>
                      setSelected(item)
                    }
                  >
                    <FaEye className="me-2" />
                    View
                  </button>

                  <button
                    className="btn btn-outline-primary rounded-3 mb-2"
                    onClick={() =>
                      updateStatus(
                        item.id,
                        "progress"
                      )
                    }
                  >
                    Start Work
                  </button>

                  <br />

                  <button
                    className="btn btn-success rounded-3"
                    onClick={() =>
                      updateStatus(
                        item.id,
                        "resolved"
                      )
                    }
                  >
                    <FaCheckCircle className="me-2" />
                    Resolve
                  </button>

                </div>

              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-5">
              <FaClipboardCheck
                size={50}
                className="text-muted mb-3"
              />
              <h5>No Requests Found</h5>
            </div>
          )}
        </div>

      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(0,0,0,0.55)",
            zIndex: 9999
          }}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{
              width: "700px",
              maxWidth: "95%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            {/* TOP */}
            <div className="d-flex justify-content-between mb-4">
              <div>
                <h3 className="fw-bold mb-1">
                  {selected.issue}
                </h3>

                <p className="text-muted mb-0">
                  Complaint ID #{selected.id}
                </p>
              </div>

              <button
                className="btn btn-light"
                onClick={() =>
                  setSelected(null)
                }
              >
                <FaTimes />
              </button>
            </div>

            {/* BADGES */}
            <div className="mb-4 d-flex gap-2">
              <span
                className={`badge bg-${statusColor(
                  selected.status
                )}`}
              >
                {selected.status}
              </span>

              <span
                className={`badge bg-${priorityColor(
                  selected.priority
                )}`}
              >
                {selected.priority}
              </span>
            </div>

            {/* DETAILS */}
            <div className="row g-3 mb-4">

              <div className="col-md-6">
                <div className="bg-light rounded-4 p-3">
                  <strong>
                    Property
                  </strong>
                  <p className="mb-0 mt-2">
                    {
                      selected.property
                    }
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded-4 p-3">
                  <strong>
                    Tenant
                  </strong>
                  <p className="mb-0 mt-2">
                    {
                      selected.tenant
                    }
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded-4 p-3">
                  <strong>
                    Phone
                  </strong>
                  <p className="mb-0 mt-2">
                    {
                      selected.phone
                    }
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded-4 p-3">
                  <strong>
                    Room
                  </strong>
                  <p className="mb-0 mt-2">
                    {
                      selected.room
                    }
                  </p>
                </div>
              </div>

            </div>

            {/* DESC */}
            <div className="mb-4">
              <h5 className="fw-bold">
                Description
              </h5>

              <div className="bg-light rounded-4 p-3">
                {
                  selected.description
                }
              </div>
            </div>

            {/* TIMELINE */}
            <div className="mb-4">
              <h5 className="fw-bold">
                Updates Timeline
              </h5>

              {selected.updates.map(
                (
                  step,
                  index
                ) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <FaCheckCircle className="text-success" />
                    {step}
                  </div>
                )
              )}
            </div>

            {/* ACTIONS */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={() =>
                  alert(
                    "Technician Assigned"
                  )
                }
              >
                <FaTools className="me-2" />
                Assign Worker
              </button>

              <button
                className="btn btn-success"
                onClick={() =>
                  updateStatus(
                    selected.id,
                    "resolved"
                  )
                }
              >
                Resolve
              </button>

              <button
                className="btn btn-outline-dark"
                onClick={() =>
                  alert(
                    "Opening Chat..."
                  )
                }
              >
                <FaCommentDots className="me-2" />
                Chat Tenant
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  alert(
                    "Calling Tenant..."
                  )
                }
              >
                <FaPhoneAlt className="me-2" />
                Call
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default LandlordMaintenance;
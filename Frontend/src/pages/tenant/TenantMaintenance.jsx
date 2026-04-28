import React, { useState } from "react";
import Navbar from "../../components/TenantNavbar";
import {
  FaPlus,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTools,
  FaUpload,
  FaTrash,
  FaEdit,
  FaSearch,
} from "react-icons/fa";

function TenantMaintenance() {
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    property: "Modern PG for Working Professionals",
    issueType: "",
    priority: "Medium",
    description: "",
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "Plumbing",
      property: "Modern PG for Working Professionals",
      desc: "Kitchen sink is leaking water. Needs immediate attention.",
      status: "open",
      priority: "high",
      submitted: "2/4/2026",
      timeline: [
        "Request submitted",
        "Assigned to technician",
        "Waiting for visit",
      ],
    },
    {
      id: 2,
      title: "AC Repair",
      property: "Modern PG for Working Professionals",
      desc: "AC not cooling properly despite regular maintenance.",
      status: "resolved",
      priority: "medium",
      submitted: "1/20/2026",
      timeline: [
        "Request submitted",
        "Technician visited",
        "Issue resolved",
      ],
    },
  ]);

  const submitRequest = () => {
    if (!formData.issueType || !formData.description) {
      alert("Please complete all fields.");
      return;
    }

    const newReq = {
      id: Date.now(),
      title: formData.issueType,
      property: formData.property,
      desc: formData.description,
      status: "open",
      priority: formData.priority.toLowerCase(),
      submitted: new Date().toLocaleDateString(),
      timeline: ["Request submitted"],
    };

    setRequests([newReq, ...requests]);

    setFormData({
      property: "Modern PG for Working Professionals",
      issueType: "",
      priority: "Medium",
      description: "",
    });

    setShowForm(false);
    alert("Request submitted successfully.");
  };

  const openDetails = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const deleteRequest = (id) => {
    if (window.confirm("Delete this request?")) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.property.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : r.status === filter;

    return matchesSearch && matchesFilter;
  });

  const openCount = requests.filter((r) => r.status === "open").length;
  const progressCount = requests.filter(
    (r) => r.status === "progress"
  ).length;
  const resolvedCount = requests.filter(
    (r) => r.status === "resolved"
  ).length;

  const badgeColor = (status) => {
    if (status === "open") return "warning";
    if (status === "resolved") return "success";
    return "primary";
  };

  return (
    <>
      <Navbar />

      <div className="container py-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold">Maintenance Requests</h1>
            <p className="text-muted mb-0">
              Submit and track your maintenance issues
            </p>
          </div>

          <button
            className="btn btn-dark px-4 rounded-4"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus className="me-2" />
            New Request
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h4 className="fw-bold mb-3">
              Submit Maintenance Request
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Property</label>
                <input
                  className="form-control"
                  value={formData.property}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Issue Type</label>
                <select
                  className="form-select"
                  value={formData.issueType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issueType: e.target.value,
                    })
                  }
                >
                  <option value="">Select issue type</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>AC Repair</option>
                  <option>Cleaning</option>
                  <option>Furniture</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Describe issue..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Upload Photo (Optional)
                </label>

                <input
                  type="file"
                  className="form-control"
                />
              </div>

              <div className="col-12 d-flex gap-3">
                <button
                  className="btn btn-dark"
                  onClick={submitRequest}
                >
                  Submit Request
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card p-4 rounded-4 border-0 shadow-sm">
              <h2>{openCount}</h2>
              <p className="mb-0 text-muted">Open</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 rounded-4 border-0 shadow-sm">
              <h2>{progressCount}</h2>
              <p className="mb-0 text-muted">In Progress</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 rounded-4 border-0 shadow-sm">
              <h2>{resolvedCount}</h2>
              <p className="mb-0 text-muted">Resolved</p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  className="form-control"
                  placeholder="Search requests..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="resolved">
                  Resolved
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h4 className="fw-bold mb-3">Your Requests</h4>

          {filtered.map((req) => (
            <div
              key={req.id}
              className="border rounded-4 p-3 mb-3"
            >
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="fw-bold">
                    {req.title}
                  </h5>
                  <p className="text-muted mb-1">
                    {req.property}
                  </p>
                  <p>{req.desc}</p>
                  <small className="text-muted">
                    Submitted: {req.submitted}
                  </small>
                </div>

                <div className="text-end">
                  <span
                    className={`badge bg-${badgeColor(
                      req.status
                    )} me-2`}
                  >
                    {req.status}
                  </span>

                  <span className="badge bg-danger">
                    {req.priority}
                  </span>

                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() =>
                        openDetails(req)
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        deleteRequest(req.id)
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h4 className="fw-bold">
            Need Immediate Help?
          </h4>

          <p className="text-muted">
            For gas leak, water overflow,
            electrical short circuit.
          </p>

          <button className="btn btn-outline-dark">
            Call Emergency: +91 78737 29665
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white rounded-4 p-4 shadow"
            style={{
              width: "600px",
              maxWidth: "95%",
            }}
          >
            <div className="d-flex justify-content-between mb-3">
              <h4 className="fw-bold">
                Request Details
              </h4>

              <button
                className="btn btn-sm btn-light"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <h5>{selectedRequest.title}</h5>
            <p>{selectedRequest.desc}</p>

            <hr />

            <h6>Status Timeline</h6>

            {selectedRequest.timeline.map(
              (step, i) => (
                <div
                  key={i}
                  className="mb-2"
                >
                  <FaCheckCircle className="text-success me-2" />
                  {step}
                </div>
              )
            )}

            <hr />

            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <FaEdit className="me-2" />
                Edit
              </button>

              <button className="btn btn-outline-danger">
                <FaTrash className="me-2" />
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TenantMaintenance;
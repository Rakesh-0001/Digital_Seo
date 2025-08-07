import React from "react";
import { Dropdown } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Topbar({ user, onLogout }) {
  const currentUser = user || {
    name: "Guy Hawkins",
    role: "Admin",
    image: "https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg"
  };

  return (
    <nav className="topbar-navbar d-flex align-items-center justify-content-between px-4 p-3">
      
      {/* Left: Search */}
      <div className="flex-grow-1 " style={{ maxWidth: "350px" }}>
        <div className="input-group topbar-search border rounded-2">
          <span className="input-group-text bg-transparent border-0 p-2">
            <i className="bi bi-search text-white ms-1"></i>
          </span>
          <input
            type="text"
            className="form-control custom-search-input text-white border-0 shadow-none"
            placeholder="Search project, analytics"
            aria-label="Search"
            style={{ fontSize: "1rem", background: "transparent" }}
          />
        </div>
      </div>
      {/* Right: Icons and Profile */}
      <div className="d-flex align-items-center gap-3 me-3">
        <button className="btn btn-icon" style={{ background: "none" }}>
          <i className="bi bi-chat  text-white fs-5"></i>
        </button>
        <button className="btn btn-icon" style={{ background: "none" }}>
          <i className="bi bi-bell  text-white fs-5"></i>
        </button>
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="p-0 d-flex align-items-center topbar-dropdown-toggle" style={{ textDecoration: "none" }}>
            <img
              src="https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg"
              alt="profile"
              className="rounded-3 me-2"
              style={{ width: "36px", height: "36px", objectFit: "cover", background: "#3b3847" }}
            />
            <div className="text-start d-none d-md-block">
              <div className="fw-semibold text-white" style={{ fontSize: "0.97rem" }}>{currentUser.name}</div>
              <div className="text-secondary" style={{ fontSize: "0.82rem" }}>{currentUser.role}</div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark">
            <Dropdown.Item onClick={onLogout}> <i class="bi bi-box-arrow-right me-2"></i> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}

export default Topbar;
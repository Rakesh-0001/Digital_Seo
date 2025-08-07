import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav
      className="sidebar d-flex flex-column p-3 bg-dark text-light"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <h4 className="mb-5 ms-1 p-1">Tracker</h4>
      <ul className="nav nav-pills flex-column mb-auto">


        <li className="nav-item mb-2">
          <NavLink
            to="/Dashboard_one"
            className={({ isActive }) =>
              "nav-link sidebar-link text-white" + (isActive ? " active" : "")
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              "nav-link sidebar-link text-white" + (isActive ? " active" : "")
            }
            end
          >
            Upload Excel Sheet
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/Dashboard_two"
            className={({ isActive }) =>
              "nav-link sidebar-link text-white" + (isActive ? " active" : "")
            }
          >
            DashBoard -2
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
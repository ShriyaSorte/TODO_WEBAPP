import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaBell, FaCalendarAlt } from "react-icons/fa"; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Dashboard Link */}
        <h1 className="navbar-brand" style={{marginLeft: "40px"}} href="#">
          <span style={{color: "#ff6767"}}>Dash</span>board
        </h1>

        {/* Search Bar and Icons */}
        <div className="d-flex justify-content-center flex-grow-1">
          <form className="d-flex w-100" style={{ maxWidth: "600px" }}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn" style={{backgroundColor: "#ff6767"}} type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Icons Section */}
        <div className="d-flex align-items-center ms-3">
          <button className="btn me-2" style={{backgroundColor: "#ff6767"}}>
            <FaBell size={20} />
          </button>
          <button className="btn me-2" style={{backgroundColor: "#ff6767"}}>
            <FaCalendarAlt size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

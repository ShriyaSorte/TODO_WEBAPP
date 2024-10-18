import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaBell, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"; // Import date-fns to format the date

const Navbar = () => {
  // Initialize with the current date
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calendarRef = useRef(null); // Ref to store the calendar component

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close calendar after selecting a date
  };

  // Format the selected or current date for day and date separately
  const formattedDay = format(selectedDate, "EEEE"); // Example: "Thursday"
  const formattedDate = format(selectedDate, "MMMM dd, yyyy"); // Example: "October 03, 2024"

  // Close the calendar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Dashboard Link */}
        <h1 className="navbar-brand" style={{ marginLeft: "40px" }} href="#">
          <span style={{ color: "#ff6767" }}>Dash</span>board
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
            <button
              className="btn"
              style={{ backgroundColor: "#ff6767" }}
              type="submit"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Icons Section */}
        <div className="d-flex align-items-center ms-3 position-relative">
          {/* <button className="btn me-2" style={{ backgroundColor: "#ff6767" }}>
            <FaBell size={20} />
          </button> */}

          {/* Calendar Icon with day and date displayed below each other */}
          <div className="d-flex align-items-center gap-4">
            <button
              className="btn me-2"
              style={{ backgroundColor: "#ff6767" }}
              onClick={() => setShowCalendar((prev) => !prev)} // Toggle calendar visibility
            >
              <FaCalendarAlt size={20} />
            </button>

            {/* Display the day and date below each other */}
            <div className="d-flex flex-column align-items-center">
              <span style={{ fontWeight: "bold" }}>{formattedDay}</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Show DatePicker when the calendar is toggled */}
          {showCalendar && (
            <div
              className="position-absolute"
              style={{ top: "40px", right: "10px", zIndex: 1000 }}
              ref={calendarRef} // Attach the ref here
            >
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

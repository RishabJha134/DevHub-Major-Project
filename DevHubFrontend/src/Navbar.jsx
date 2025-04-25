import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "./utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Track scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  async function handleLogout() {
    try {
      const response = await axios.post(
        "https://devmatch-major-project.onrender.com/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Error logging out user: ", err);
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-slate-800 to-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and brand name */}
          <div className="flex-shrink-0">
            <Link to="/" className="group flex items-center space-x-2">
              <div className="bg-gradient-to-br from-cyan-400 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                DevMatch
              </span>
            </Link>
          </div>

          {/* User profile section */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* Welcome text - hide on mobile */}
              <div className="hidden md:block">
                <span className="text-gray-300 font-medium">
                  Welcome,{" "}
                  <span className="text-cyan-400 font-semibold">
                    {user?.firstName}
                  </span>
                </span>
              </div>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div>
                  <div
                    onClick={toggleDropdown}
                    role="button"
                    className="relative flex rounded-full border-2 border-transparent hover:border-cyan-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-cyan-500/30">
                      <img
                        alt="User profile"
                        src={`${
                          user?.photoUrl || "https://via.placeholder.com/150"
                        }`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                  {isDropdownOpen && (
                    <ul className="absolute right-0 menu z-[1] mt-3 p-2 shadow-lg bg-slate-800 rounded-xl w-52 text-gray-200 border border-slate-700 transform origin-top-right transition-all duration-200">
                      <li className="hover:bg-slate-700/50 rounded-lg">
                        <Link
                          to="/profile"
                          className="flex justify-between items-center px-4 py-2 text-sm hover:text-cyan-400 transition-colors duration-200"
                        >
                          <span>Profile</span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-500 text-slate-900">
                            New
                          </span>
                        </Link>
                      </li>
                      <li className="hover:bg-slate-700/50 rounded-lg">
                        <Link
                          to="/connections"
                          className="px-4 py-2 text-sm hover:text-cyan-400 transition-colors duration-200"
                        >
                          Connections
                        </Link>
                      </li>
                      <li className="hover:bg-slate-700/50 rounded-lg">
                        <Link
                          to="/requests"
                          className="px-4 py-2 text-sm hover:text-cyan-400 transition-colors duration-200"
                        >
                          Requests
                        </Link>
                      </li>
                      <div className="border-t border-slate-700 my-1"></div>
                      <li className="hover:bg-slate-700/50 rounded-lg">
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors duration-200 w-full text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

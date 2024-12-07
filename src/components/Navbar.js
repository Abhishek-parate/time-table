// src/components/Navbar.js
import React, { useState } from 'react';
import { FaUserCircle, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../images/logo.webp'; // Make sure the path is correct

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="navbar bg-primary text-white lg:bg-white lg:text-black shadow-lg p-4 flex justify-between items-center">
      {/* Left Section with Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Icon for Mobile */}
        <button
          className="lg:hidden text-white"
          onClick={toggleSidebar} // This triggers the sidebar toggle
        >
          <FaBars size={24} />
        </button>

        {/* Logo (Visible on all screen sizes including mobile) */}
        <img src={logo} alt="Logo" className="w-20 lg:hidden" />
      </div>

      {/* Center Section (Search Bar) */}
      <div className="hidden sm:flex flex-1 mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 p-2 rounded-lg"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <p className="hidden sm:block px-4 py-2 hover:bg-gray-100 cursor-pointer text-white lg:text-black">
          Logged in as <span className="font-semibold">Abhishek</span>
        </p>
        {/* Notification Icon */}
        <button className="btn btn-ghost btn-circle relative hover:bg-gray-200 text-white lg:text-black">
          <FaBell size={24} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* User Icon with Dropdown */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-circle hover:bg-gray-200 text-white lg:text-black"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaUserCircle size={24} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <ul className="py-1">
                <hr className="my-1" />
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
                  Change Password
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

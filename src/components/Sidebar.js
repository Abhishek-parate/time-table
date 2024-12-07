import React from 'react';
import logo from '../images/logo.webp';
import { FaRegClock, FaThList, FaBookOpen, FaUserTie, FaBriefcase, FaBuilding, FaHome, FaChevronDown } from 'react-icons/fa'; // New Icons
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isGeneralOpen, setIsGeneralOpen] = React.useState(false);

  const menuItems = [
    { name: 'Manage Shift', path: '/time', icon: <FaRegClock /> }, // Changed to FaRegClock
    { name: 'Manage Department', path: '/Dept', icon: <FaBuilding /> }, // Changed to FaBuilding
    { name: 'Manage Program', path: '/program', icon: <FaBriefcase /> }, // Changed to FaBriefcase
    { name: 'Manage Academic Year', path: '/year', icon: <FaBuilding /> }, // Changed to FaBuilding
    { name: 'Manage Section', path: '/section', icon: <FaThList /> }, // Changed to FaThList
    { name: 'Manage Course', path: '/course', icon: <FaBookOpen /> }, // Changed to FaBookOpen
    { name: 'Manage Faculty', path: '/faculty', icon: <FaUserTie /> }, // Changed to FaUserTie
    { name: 'Manage Class Room', path: '/classroom', icon: <FaHome /> }, // Changed to FaHome
    { name: 'Manage Allotment', path: '/allotment', icon: <FaBuilding /> }, // Changed to FaBuilding
  ];

  const getLinkClass = (path) =>
    location.pathname === path
      ? 'bg-accent text-white'
      : 'text-gray-300 hover:bg-secondary hover:text-white';

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-primary text-white w-64 z-50 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 shadow-md">
            <img src={logo} alt="Logo" className="w-36" />
          </div>
          <nav className="flex-1 px-2 py-4">
            <div>
              <button
                onClick={() => setIsGeneralOpen(!isGeneralOpen)}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-secondary focus:outline-none"
              >
                <span className="mr-3">
                  <FaChevronDown
                    className={`transition-transform ${isGeneralOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </span>
                General Settings
              </button>
              {isGeneralOpen && (
                <div className="mt-2 space-y-1 pl-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${getLinkClass(item.path)}`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="px-4 py-4">
            <button className="btn btn-accent w-full">Timetable Planner</button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

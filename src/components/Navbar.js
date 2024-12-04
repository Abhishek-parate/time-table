import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="navbar bg-base-100">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost normal-case text-xl">College Timetable</Link>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal p-0">
        <li><Link to="/time">Time</Link></li>
        <li><Link to="/section">Section</Link></li>
        <li><Link to="/program">Program</Link></li>
        <li><Link to="/course">Course</Link></li>
        <li><Link to="/faculty">Faculty</Link></li>
        <li><Link to="/class-room">Class Room</Link></li>
        <li><Link to="/dept">Dept</Link></li>
        <li><Link to="/allotment">Allotment</Link></li>
      </ul>
    </div>
  </div>
);

export default Navbar;

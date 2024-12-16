// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Time from './pages/Time';
import Section from './pages/Section';
import Course from './pages/Course';
import Faculty from './pages/Faculty';
import Program from './pages/Program';
import ClassRoom from './pages/ClassRoom';
import Dept from './pages/Dept';
import Allotment from './pages/Allotment';

import Year from './pages/Year';
import CourseAllotmentManagement from './pages/CourseAllotment';
import TimetableManagement from './pages/Timetable';
import DetailedTimetableManagement from './pages/DetailedTimetableManagement';
import NotFoundPage from './pages/NOtFound';
import SemesterManagement from './pages/Sem';



const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="flex h-screen bg-base-100">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar toggleSidebar={toggleSidebar} />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4">
            <Routes>
              <Route path="/time" element={<Time />} />
              <Route path="/section" element={<Section />} />
              <Route path="/course" element={<Course />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/program" element={<Program />} />
              <Route path="/semester" element={<SemesterManagement />} />
              <Route path="/classroom" element={<ClassRoom />} />
              <Route path="/dept" element={<Dept />} />
              <Route path="/allotment" element={<Allotment />} />
              <Route path="/year" element={<Year />} />
              <Route path="/course-allotment" element={<CourseAllotmentManagement />} />
              <Route path="/manage-timetable/:tid" element={<DetailedTimetableManagement />} />
              <Route path="/manage-timetable" element={<TimetableManagement />} />

              <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

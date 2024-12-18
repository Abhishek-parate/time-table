import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Time from "./pages/Time";
import Section from "./pages/Section";
import Course from "./pages/Course";
import Faculty from "./pages/Faculty";
import Program from "./pages/Program";
import ClassRoom from "./pages/ClassRoom";
import Dept from "./pages/Dept";
import Allotment from "./pages/Allotment";
import Year from "./pages/Year";
import CourseAllotmentManagement from "./pages/CourseAllotment";
import TimetableManagement from "./pages/Timetable";
import DetailedTimetableManagement from "./pages/DetailedTimetableManagement";
import NotFoundPage from "./pages/NOtFound";
import AdminLogin from "./components/auth/AdminLogin";
import DashboardLayout from "./components/DashboardLayout";
import UpdatePassword from "./pages/UpdatePassword";
import SemesterManagement from "./pages/Sem";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Routes: Dashboard */}
        <Route
          path="*"
          element={
            <DashboardLayout>
              <Routes>
                <Route path="/time" element={<Time />} />
                <Route path="/section" element={<Section />} />
                <Route path="/course" element={<Course />} />
                <Route path="/faculty" element={<Faculty />} />
                <Route path="/program" element={<Program />} />
                <Route path="/classroom" element={<ClassRoom />} />
                <Route path="/dept" element={<Dept />} />
                <Route path="/allotment" element={<Allotment />} />
                <Route path="/year" element={<Year />} />
                <Route path="/change-password" element={<UpdatePassword />} />

                <Route path="/semester" element={<SemesterManagement />} />
                <Route
                  path="/course-allotment"
                  element={<CourseAllotmentManagement />}
                />
                <Route
                  path="/manage-timetable/:tid"
                  element={<DetailedTimetableManagement />}
                />
                <Route path="/manage-timetable" element={<TimetableManagement />} />
              </Routes>
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

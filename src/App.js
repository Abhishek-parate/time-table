import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Time from './pages/Time';
import Section from './pages/Section';
import Program from './pages/Program';
import Course from './pages/Course';
import Faculty from './pages/Faculty';
import ClassRoom from './pages/ClassRoom';
import Dept from './pages/Dept';
import Allotment from './pages/Allotment';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
<Navbar />

      <div className="container mx-auto p-4">
       
        <Routes>
          <Route path="/time" element={<Time />} />
          <Route path="/section" element={<Section />} />

       
          <Route path="/course" element={<Course />} />   
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/program" element={<Program />} />
          {/*  
            
          <Route path="/classroom" element={<ClassRoom />} />
          <Route path="/dept" element={<Dept />} />
          <Route path="/allotment" element={<Allotment />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

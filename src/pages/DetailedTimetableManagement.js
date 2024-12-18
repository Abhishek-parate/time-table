import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataClassroom, fetchDatafacultybyID, fetchDataTimeTablebyTID } from "../api/api";
import { toast } from "react-hot-toast";

const ManageTimetable = () => {
  const { tid } = useParams();
  const [timetable, setTimeTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState({});
  const [classroomData, setClassroomData] = useState([]);


  const courseOptions = [
    { id: 1, name: "Math" },
    { id: 2, name: "Physics" },
  ];
  const facultyOptions = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];
  const roomOptions = [
    { id: 1, name: "Room A" },
    { id: 2, name: "Room B" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataTimeTablebyTID("getimetable", tid);
        if (response.success) {
          const timetableData = response.data;
          setTimeTable(timetableData);
          const { pid, yid, sid } = timetableData[0];
          const facultyResponse = await fetchDatafacultybyID(
            "getfacultybytimetable",
            { pid, yid, sid }
          );
          if (facultyResponse.success) {
            setFaculties(facultyResponse.data);
          } else {
            toast.error(facultyResponse.message);
          }
        } else {
          toast.error(response.message);
        }

        const roomResponse = await fetchDataClassroom('classroom');
        if (roomResponse.success) {
            setClassroomData(roomResponse.data);
        } else {
            toast.error(roomResponse.message);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tid]);

  const generateTimeSlots = (startTime, endTime, gap) => {
    const start = new Date(`2022-01-01T${startTime}`);
    const end = new Date(`2022-01-01T${endTime}`);
    const slots = [];
    while (start < end) {
      const next = new Date(start);
      next.setMinutes(start.getMinutes() + gap);
      slots.push(`${formatTime(start)} to ${formatTime(next)}`);
      start.setMinutes(start.getMinutes() + gap);
    }
    return slots;
  };

  const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() < 12 ? "AM" : "PM";
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  };

  const handleSelectChange = (day, timeSlot, type, value) => {
    setSelectedDetails((prev) => {
      const updatedDetails = { ...prev };
      const currentSlot = updatedDetails[`${day}-${timeSlot}`] || {};
  
      if (type === "course") {
        const selectedCourse = faculties.find((faculty) => faculty.cid === value);
        // Update course and faculty details
        updatedDetails[`${day}-${timeSlot}`] = {
          ...currentSlot,
          course: value,
          faculty: selectedCourse ? selectedCourse.faculty_name : "", // Set faculty based on course
        };
      } else if (type === "room") {
        updatedDetails[`${day}-${timeSlot}`] = {
          ...currentSlot,
          room: value,
        };
      }
      return updatedDetails;
    });
  };
  

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">Error: {error}</div>;

  const summary = timetable ? timetable[0] : null;
  const startTime = summary ? summary.start_time : "10:00 AM";
  const endTime = summary ? summary.end_time : "5:00 PM";
  const gap = summary ? parseInt(summary.gap) : 0;

  const timeSlots = generateTimeSlots(startTime, endTime, gap);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateKey = (item, index) =>
    `${["caid", "faculty_name", "max_allowed_lecture"]
      .map((col) => item[col])
      .join("-")}-${index}`;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold mb-2">Manage Timetable</h1>
      </header>

      <section >
        {summary ? (
          <div className="bg-primary text-sm text-white p-2 rounded-lg mb-2 shadow-sm">
            <div className="flex flex-wrap">
              <div className="flex-1 min-w-[200px] p-2">
                <strong>Department:</strong> {summary.dept_name}
              </div>
              <div className="flex-1 min-w-[450px] p-2">
                <strong>Program:</strong> {summary.program_name}
              </div>
              <div className="flex-1 min-w-[80px] p-2">
                <strong>Year:</strong> {summary.year_name}
              </div>
              <div className="flex-1 min-w-[80px] p-2">
                <strong>Sec:</strong> {summary.section_name}
              </div>
              <div className="flex-1 min-w-[100px] p-2">
                <strong>Gap:</strong> {summary.gap} min
              </div>
             
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No data available.</div>
        )}
      </section>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-3/4 p-2">
          <table className="min-w-full table bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-secondary text-white">
                <th className="px-4 py-2">Days</th>
                {timeSlots.map((slot, idx) => (
                  <th key={idx} className="px-4 py-2">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, idx) => (
                <tr key={idx} className="bg-white hover:bg-gray-100">
                  <td className="px-4 py-2 font-bold bg-primary text-white">{day}</td>
                  {timeSlots.map((slot, idx) => (
                    <td key={idx} className="px-4 py-2 text-center">
                      <div className="flex flex-col space-y-2">
                        <select
                          className="border rounded-md p-1"
                          onChange={(e) =>
                            handleSelectChange(day, slot, "course", e.target.value)
                          }
                        >
                          <option value="">Select Course</option>
                          {faculties.map((course) => (
                            <option key={course.cid} value={course.cid}>
                              {course.course_name}
                            </option>
                          ))}
                        </select>
                        
                        {selectedDetails[`${day}-${slot}`]?.course && (
                        <div className="border rounded-md p-1 bg-white">
                        <strong>Faculty: </strong>{selectedDetails[`${day}-${slot}`]?.faculty || "No Faculty Assigned"}
                        </div>
                        )}
                        <select
                          className="border rounded-md p-1"
                          onChange={(e) =>
                            handleSelectChange(day, slot, "room", e.target.value)
                          }
                        >
                          <option value="">Select Room</option>
                          {classroomData.map((room) => (
                            <option key={room.rid} value={room.rid}>
                              {room.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full lg:w-1/4 p-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-4">Faculty Details</h2>
            {faculties.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Max Lec</th>
                  </tr>
                </thead>
                <tbody>
                  {faculties.map((fac, idx) => (
                    <tr key={generateKey(fac, idx)} className="hover:bg-gray-100">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{fac.faculty_name}</td>
                      <td className="px-4 py-2">{fac.max_allowed_lecture}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No faculty data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTimetable;

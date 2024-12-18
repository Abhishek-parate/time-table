import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  fetchDataTimeTable,
  createDataTimeTable,
  updateDataTimeTable,
  deleteDataTimeTable,
  fetchDataYear,
  fetchDataGaps,
  fetchDataDepartment,
  fetchDataProgram,
  fetchDataSection,
} from "../api/api";

import FormModal from "../components/FormModal";

const TimetableManagement = () => {
  const [TimeTabledata, setTimeTabledata] = useState([]);
  const [form, setForm] = useState({
    tid: "",
    did: "",
    pid: "",
    yid: "",
    sid: "",
    gap: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [gaps, setGaps] = useState([]);
  const navigate = useNavigate();


  // table start
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredData = TimeTabledata.filter((item) =>
    ["tid", "did", "pid", "yid", "sid", "gap", "start_time", "end_time"].some(
      (col) =>
        item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // table end

  useEffect(() => {
    const fetchTimeTable = async () => {
      setLoading(true);
      try {
        const response = await fetchDataTimeTable("timetable");
        if (response.success) {
          setTimeTabledata(response.data);
        } else {
          toast.error(response.message);
        }

        const deptResponse = await fetchDataDepartment("dept");
        if (deptResponse.success) {
          setDepartments(deptResponse.data);
        } else {
          toast.error(deptResponse.message);
        }

        const programResponse = await fetchDataProgram("program");
        if (programResponse.success) {
          setPrograms(programResponse.data);
        } else {
          toast.error(programResponse.message);
        }

        const yearResponse = await fetchDataYear("year");
        if (yearResponse.success) {
          setYears(yearResponse.data);
        } else {
          toast.error(yearResponse.message);
        }
        const semesterResponse = await fetchDataSection("semesterdata");
        if (semesterResponse.success) {
          setSemesters(semesterResponse.data);
        } else {
          toast.error(semesterResponse.message);
        }

        const sectionResponse = await fetchDataSection("section");
        if (sectionResponse.success) {
          setSections(sectionResponse.data);
        } else {
          toast.error(sectionResponse.message);
        }

        const gapsResponse = await fetchDataGaps("getgaps");
        if (gapsResponse.success) {
          setGaps(gapsResponse.data);
        } else {
          toast.error(gapsResponse.message);
        }


      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
      setLoading(false);
    };

    fetchTimeTable();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!form.did) {
      errors.did = "Department is required";
    }

    if (!form.pid) {
      errors.pid = "Program is required";
    }

    if (!form.yid) {
      errors.yid = "Year is required";
    }

    if (!form.sid) {
      errors.sid = "Section is required";
    }

    if (!form.gap) {
      errors.gap = "Gap is required";
    }

    if (!form.start_time) {
      errors.start_time = "Start Time is required";
    }

    if (!form.end_time) {
      errors.end_time = "End TIme is required";
    }

    // "tid", "did", "pid", "yid", "sid", "gap", "start_time","end_time"

    const isDuplicate = TimeTabledata.some(
      (item) =>
        item.did === form.did &&
        item.pid === form.pid &&
        item.yid === form.yid &&
        item.sid !== form.sid // Ensure we're not comparing the same item
    );

    if (isDuplicate) {
      errors.sid = "This timetable already exists.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setLoading(true);

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = isEditing
        ? await updateDataTimeTable("timetable", form.tid, form)
        : await createDataTimeTable("timetable", form);

      if (response.success) {
        if (isEditing) {
          setTimeTabledata(
            TimeTabledata.map((item) => (item.tid === form.tid ? form : item))
          );
        } else {
          setTimeTabledata([...TimeTabledata, { ...form, tid: Date.now() }]);
        }
        toast.success(response.message || "TimeTable saved successfully!");
        setShowModal(false);
        setForm({
          tid: "",
          did: "",
          pid: "",
          yid: "",
          sid: "",
          gap: "",
          start_time: "",
          end_time: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    }

    setLoading(false);
  };

  const handleAddNewTimeTable = () => {
    setForm({
      tid: "",
      did: "",
      pid: "",
      yid: "",
      sid: "",
      gap: "",
      start_time: "",
      end_time: "",
    });
    setIsEditing(false);
    setModalTitle("Add New TimeTable");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      tid: item.tid,
      did: item.did,
      pid: item.pid,
      yid: item.yid,
      sid: item.sid,
      gap: item.gap,
      start_time: item.start_time,
      end_time: item.end_time,
    });
    setIsEditing(true);
    setModalTitle("Edit TimeTable");
    setShowModal(true);
  };

  const handleViewClick=async(tid)=>{
    setLoading(true);
    try {
        navigate(`/manage-timetable/${tid}`);
      } catch (error) {
        console.error("Error open timetable:", error);
        toast.error("Failed to open timetable. Please try again.");
      }
      setLoading(false);
    };
  

  const handleDelete = async (tid) => {
    setLoading(true);
    try {
      const response = await deleteDataTimeTable("timetable", tid);
      if (response.success) {
        setTimeTabledata(TimeTabledata.filter((item) => item.tid !== tid));
        if (response && response.success) {
          toast.success(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete the section. Please try again.");
    }
    setLoading(false);
  };

  const handleClose = useCallback(() => {
    setShowModal(false);
    setFormErrors({});
  }, []);

  // table start

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateKey = (item, index) =>
    `${["tid", "did", "alias", "yid", "sid", "did"]
      .map((col) => item[col])
      .join("-")}-${index}`;

  const ActionButtons = ({ item }) => (
    <div className="flex space-x-2 justify-center">
      <button
        onClick={() => handleViewClick(item.tid)}
        
        className="btn btn-primary text-white btn-sm"
        aria-label="Delete"
      >
        View
      </button>
      <button
        onClick={() => handleEdit(item)}
        className="btn btn-success text-white btn-sm"
        aria-label="Edit"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(item.tid)}
        className="btn btn-error text-white btn-sm"
        aria-label="Delete"
      >
        Delete
      </button>
    </div>
  );

  // table end

  const enrichedSectioData = TimeTabledata.map((timetabledata) => ({
    ...timetabledata,
    programName:
      programs.find((pro) => pro.pid === timetabledata.pid)?.name ||
      "Unknown Program",

    yearName:
      years.find((year) => year.yid === timetabledata.yid)?.name ||
      "Unknown Year",
    sectionName:
      sections.find((section) => section.sid === timetabledata.sid)?.name ||
      "Unknown Section",

    deptName:
      departments.find((dept) => dept.did === timetabledata.did)?.name ||
      "Unknown Department",
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Reset dependent fields
    if (name === "did") {
      setForm((prevForm) => ({
        ...prevForm,
        pid: "",
        yid: "",
        sid: "",
      }));
    } else if (name === "pid") {
      setForm((prevForm) => ({
        ...prevForm,
        yid: "",
        sid: "",
      }));
    } else if (name === "yid") {
      setForm((prevForm) => ({
        ...prevForm,
        sid: "",
      }));
    }
  };

  const filteredPrograms = useMemo(
    () => programs.filter((program) => program.did === form.did),
    [form.did, programs]
  );

  const filteredYears = useMemo(
    () => years.filter((year) => year.pid === form.pid),
    [form.pid, years]
  );

  const filteredSections = useMemo(
    () => sections.filter((section) => section.yid === form.yid),
    [form.yid, sections]
  );

  return (
    <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Timetable Management</h1>
        <button
          className="btn btn-primary text-card-bg"
          onClick={handleAddNewTimeTable}
        >
          Add TimeTable
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 py-5">
          <div className="skeleton h-16 w-full"></div>
          <div className="skeleton h-4 w-52"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        // table start

        <div className="overflow-x-auto p-5">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered input-primary w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="text-sm font-semibold">{`Total: ${filteredData.length} TimeTables`}</span>
          </div>
          {filteredData.length > 0 ? (
            <table className="table table-auto w-full rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-4 text-left whitespace-nowrap">S.No</th>

                  <th className="p-4 text-left whitespace-nowrap">
                    Department
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">Program</th>
                  <th className="p-4 text-left whitespace-nowrap">Year</th>
                  <th className="p-4 text-left whitespace-nowrap">Section</th>
                  <th className="p-4 text-left whitespace-nowrap">Duration of Lecture</th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Start Lecture Time
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">End Lecture Time</th>

                  <th className="p-4 text-left whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrichedSectioData
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((item, index) => (
                    <tr
                      key={generateKey(item, index)}
                      className="hover:bg-gray-100"
                    >
                      <td className="p-4">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4">{item.deptName}</td>
                      <td className="p-4">{item.programName}</td>
                      <td className="p-4">{item.yearName}</td>
                      <td className="p-4">{item.sectionName}</td>
                      <td className="p-4">{item.gap}</td>
                      <td className="p-4">{item.start_time}</td>

                      <td className="p-4">{item.end_time}</td>
                      <td className="p-4">
                        <ActionButtons item={item} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-6">No data available.</p>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-primary text-white btn-sm"
                aria-label="Previous Page"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`btn btn-sm ${
                    currentPage === index + 1 ? "btn-secondary" : "btn-base-100"
                  }`}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-primary text-white btn-sm"
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          )}
        </div>

        // table end
      )}
      {showModal && (
        <FormModal
          modalTitle={modalTitle}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          isEditing={isEditing}
          formErrors={formErrors}
        >
          <div className="form-modal p-4">
            <div className="mb-4">
              <label htmlFor="did">Department</label>
              <select
                id="did"
                name="did"
                value={form.did}
                onChange={handleInputChange}
                className="input input-bordered w-full "
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.did} value={dept.did}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {formErrors.did && (
                <span className="error">{formErrors.did}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Program</span>
                </label>
                <select
      id="pid"
      name="pid"
      value={form.pid}
      onChange={handleInputChange}
      className="input input-bordered w-full s"
      disabled={!form.did} // Disable if no department is selected
    >
      <option value="">Select Program</option>
      {filteredPrograms.map((program) => (
        <option key={program.pid} value={program.pid}>
          {program.name}
        </option>
      ))}
    </select>
    {formErrors.pid && <span className="error">{formErrors.pid}</span>}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Year</span>
                </label>
                <select
      id="yid"
      name="yid"
      value={form.yid}
      onChange={handleInputChange}
      className="input input-bordered w-full"
      disabled={!form.pid} // Disable if no program is selected
    >
      <option value="">Select Year</option>
      {filteredYears.map((year) => (
        <option key={year.yid} value={year.yid}>
          {year.name}
        </option>
      ))}
    </select>
    {formErrors.yid && <span className="error">{formErrors.yid}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Section</span>
                </label>
                <select
      id="sid"
      name="sid"
      value={form.sid}
      onChange={handleInputChange}
      className="input input-bordered w-full "
      disabled={!form.yid} // Disable if no year is selected
    >
      <option value="">Select Section</option>
      {filteredSections.map((section) => (
        <option key={section.sid} value={section.sid}>
          {section.name}
        </option>
      ))}
    </select>
    {formErrors.sid && <span className="error">{formErrors.sid}</span>}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Lecture Duration</span>
                </label>
                <select
                  value={form.gap}
                  onChange={(e) => setForm({ ...form, gap: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.gap ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Year</option>
                  {gaps.map((lectgap) => (
                    <option key={lectgap.em} value={lectgap.em}>
                      {lectgap.em}
                    </option>
                  ))}
                </select>
                {formErrors.gap && (
                  <p className="text-error">{formErrors.gap}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Start Lecture Time</span>
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                  className={`input input-bordered w-full ${
                    formErrors.start_time ? "input-error" : ""
                  }`}
                />
                {formErrors.start_time && (
                  <p className="text-error">{formErrors.start_time}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">End Lecture Time</span>
                </label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                  className={`input input-bordered w-full ${
                    formErrors.end_time ? "input-error" : ""
                  }`}
                />
                {formErrors.end_time && (
                  <p className="text-error">{formErrors.end_time}</p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {isEditing ? "Update TimeTable" : "Add TimeTable"}
              </button>
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default TimetableManagement;

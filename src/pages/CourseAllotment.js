import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchDataSection,
  createDataSection,
  updateDataSection,
  deleteDataSection,
  fetchDataYear,
  fetchCourseDataAllotment,
  deleteCourseDataAllotment,
} from "../api/api";
import FormModal from "../components/FormModal";
import Table from "../components/Table";

const CourseAllotmentManagement = () => {
  const [courseDataAllotment, setCourseDataAllotment] = useState([]);
  const [form, setForm] = useState({
    caid: "",
    cid: "",
    pid: "",
    yid: "",
    sid: "",
    fid: "",
    semid: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [semesters, setSemesters] = useState([]);
  

  // table start
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredData = courseDataAllotment.filter((item) =>
    ["caid", "cid", "pid", "yid", "sid", "fid"].some((col) =>
      item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // table end

  useEffect(() => {
    const fetchcourseAllotment = async () => {
      setLoading(true);
      try {
        const response = await fetchCourseDataAllotment("courseallotment");
        if (response.success) {
          setCourseDataAllotment(response.data);
        } else {
          toast.error(response.message);
        }

        const yearResponse = await fetchDataYear("year");
        if (yearResponse.success) {
          setYears(yearResponse.data);
        } else {
          toast.error(yearResponse.message);
        }

        const programResponse = await fetchDataSection("program");
        if (programResponse.success) {
          setPrograms(programResponse.data);
        } else {
          toast.error(programResponse.message);
        }

        const sectionResponse = await fetchDataSection("section");
        if (sectionResponse.success) {
          setSections(sectionResponse.data);
        } else {
          toast.error(sectionResponse.message);
        }

        const semesterResponse = await fetchDataSection('semesterdata');
        if (semesterResponse.success) {
        setSemesters(semesterResponse.data);
        } else {
        toast.error(semesterResponse.message);
        }

        const facultyResponse = await fetchDataSection("faculty");
        if (facultyResponse.success) {
          setFaculties(facultyResponse.data);
        } else {
          toast.error(facultyResponse.message);
        }

        const courseResponse = await fetchDataSection("course");
        if (courseResponse.success) {
          setCourses(courseResponse.data);
        } else {
          toast.error(courseResponse.message);
        }

    
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
      setLoading(false);
    };

    fetchcourseAllotment();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!form.cid) {
      errors.cid = "Course is required";
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

    if (!form.fid) {
      errors.fid = "Faculty is required";
    }

    if (!form.semid) {
      errors.semid = "Semester is required";
    }

    const isDuplicate = courseDataAllotment.some(
      (item) =>
        item.pid === form.pid &&
        item.fid === form.fid &&
        item.yid === form.yid &&
        item.sid === form.sid &&
        item.semid === form.semid &&
        item.cid !== form.cid // Ensure we're not comparing the same item
    );

    if (isDuplicate) {
      errors.cid = "This section already exists.";
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
        ? await updateDataSection("courseallotment", form.caid, form)
        : await createDataSection("courseallotment", form);

      if (response.success) {
        if (isEditing) {
          setCourseDataAllotment(
            courseDataAllotment.map((item) =>
              item.caid === form.caid ? form : item
            )
          );
        } else {
          setCourseDataAllotment([
            ...courseDataAllotment,
            { ...form, caid: Date.now() },
          ]);
        }
        toast.success(
          response.message || "course allotment saved successfully!"
        );
        setShowModal(false);
        setForm({ caid: "", cid: "", pid: "", yid: "", sid: "", fid: "" , semid: "" });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    }

    setLoading(false);
  };

  const handleAddNewCourseAllotment = () => {
    setForm({ caid: "", cid: "", pid: "", yid: "", sid: "", fid: "", semid: "" });
    setIsEditing(false);
    setModalTitle("Add New Course Allotmen");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      sid: item.sid,
      cid: item.cid,
      pid: item.pid,
      yid: item.yid,
      caid: item.caid,
      fid: item.fid,
      semid: item.semid,
    });
    setIsEditing(true);
    setModalTitle("Edit Allotment");
    setShowModal(true);
  };

  const handleDelete = async (caid) => {
    setLoading(true);
    try {
      const response = await deleteCourseDataAllotment("courseallotment", caid);
      if (response.success) {
        setCourseDataAllotment(
          courseDataAllotment.filter((item) => item.caid !== caid)
        );
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
    `${["caid", "cid", "alias", "yid", "sid", "fid","semid"]
      .map((col) => item[col])
      .join("-")}-${index}`;

  const ActionButtons = ({ item }) => (
    <div className="flex space-x-2 justify-center">
      <button
        onClick={() => handleEdit(item)}
        className="btn btn-success text-white btn-sm"
        aria-label="Edit"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(item.caid)}
        className="btn btn-error text-white btn-sm"
        aria-label="Delete"
      >
        Delete
      </button>
    </div>
  );

  // table end

  const enrichedSectioData = courseDataAllotment.map((courseallotmentval) => ({
    ...courseallotmentval,
    programName:
      programs.find((pro) => pro.pid === courseallotmentval.pid)?.name ||
      "Unknown Program",

    yearName:
      years.find((year) => year.yid === courseallotmentval.yid)?.name ||
      "Unknown Year",
    sectionName:
      sections.find((section) => section.sid === courseallotmentval.sid)
        ?.name || "Unknown Section",

    facultyName:
      faculties.find((faculty) => faculty.fid === courseallotmentval.fid)
        ?.name || "Unknown faculty",

    courseName:
      courses.find((course) => course.cid === courseallotmentval.cid)?.name ||
      "Unknown course",

    semName: semesters.find((sem) => sem.semid === courseallotmentval.semid)?.name ||
     'Unknown Semester',

  }));

  return (
    <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Course Allotment Management</h1>
        <button
          className="btn btn-primary text-card-bg"
          onClick={handleAddNewCourseAllotment}
        >
          Add Course Allotment
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
            <span className="text-sm font-semibold">{`Total: ${filteredData.length} Allotments`}</span>
          </div>
          {filteredData.length > 0 ? (
            <table className="table table-auto w-full rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-4 text-left whitespace-nowrap">S.No</th>

                  <th className="p-4 text-left whitespace-nowrap">
                    Program Name
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">Year</th>
                  <th className="p-4 text-left whitespace-nowrap">Section</th>
                  <th className="p-4 text-left whitespace-nowrap">Semester</th>
                  <th className="p-4 text-left whitespace-nowrap">Course</th>
                  <th className="p-4 text-left whitespace-nowrap">Faculty</th>

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
                      <td className="p-4">{item.programName}</td>{" "}
                      <td className="p-4">{item.yearName}</td>
                      <td className="p-4">{item.semName}</td>
                      <td className="p-4">{item.sectionName}</td>
                      <td className="p-4">{item.courseName}</td>
                      <td className="p-4">{item.facultyName}</td>
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
              <label className="label">
                <span className="label-text">Program</span>
              </label>
              <select
                value={form.pid}
                onChange={(e) => setForm({ ...form, pid: e.target.value })}
                className={`input input-bordered w-full ${
                  formErrors.pid ? "input-error" : ""
                }`}
              >
                <option value="">Select Program</option>
                {programs.map((pro) => (
                  <option key={pro.pid} value={pro.pid}>
                    {pro.name}
                  </option>
                ))}
              </select>
              {formErrors.pid && <p className="text-error">{formErrors.pid}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Year</span>
                </label>
                <select
                  value={form.yid}
                  onChange={(e) => setForm({ ...form, yid: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.yid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year.yid} value={year.yid}>
                      {year.name}
                    </option>
                  ))}
                </select>
                {formErrors.yid && (
                  <p className="text-error">{formErrors.yid}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Section</span>
                </label>
                <select
                  value={form.sid}
                  onChange={(e) => setForm({ ...form, sid: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.sid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.sid} value={section.sid}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {formErrors.sid && (
                  <p className="text-error">{formErrors.sid}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Semester</span>
                </label>
                <select
                  value={form.semid}
                  onChange={(e) => setForm({ ...form, semid: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.semid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Section</option>
                  {semesters.map((section) => (
                    <option key={section.semid} value={section.semid}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {formErrors.semid && (
                  <p className="text-error">{formErrors.semid}</p>
                )}
              </div>
              
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Course</span>
                </label>
                <select
                  value={form.cid}
                  onChange={(e) => setForm({ ...form, cid: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.cid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.cid} value={course.cid}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {formErrors.cid && (
                  <p className="text-error">{formErrors.cid}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Faculty</span>
                </label>
                <select
                  value={form.fid}
                  onChange={(e) => setForm({ ...form, fid: e.target.value })}
                  className={`select select-bordered w-full ${
                    formErrors.fid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.fid} value={faculty.fid}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                {formErrors.fid && (
                  <p className="text-error">{formErrors.fid}</p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {isEditing ? "Update Course Allotment" : "Add Course Allotment"}
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

export default CourseAllotmentManagement;

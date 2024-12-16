import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchDataCourse,
  createDataCourse,
  updateDataCourse,
  deleteDataCourse,
  fetchDataDepartment,
  fetchDataProgram,
  fetchDataYear,
  fetchCourseDuration,
  fetchCourseCategory,
  fetchDataSemester,
  fetchelectivedata,
} from "../api/api";
import FormModal from "../components/FormModal";

const CourseManagement = () => {
  const [courseData, setCourseData] = useState([]);
  const [form, setForm] = useState({
    cid: "",
    name: "",
    alias: "",
    course_code: "",
    category: "",
    max_lecture: "",
    duration: "",
    did: "",
    pid: "",
    semid: "",
    elective: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  const [departments, setDepartments] = useState([]);

  const [programs, setPrograms] = useState([]);

  const [years, setYears] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [electives, setElectives] = useState([]);

  const [durations, setDurations] = useState([]);
  const [categories, setCategories] = useState([]);

  // table start
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredData = courseData.filter((item) =>
    [
      "cid",
      "name",
      "alias",
      "course_code",
      "category",
      "max_lecture",
      "duration",
      "did",
      "pid",
      "yid",
      "semid",
      "elective",
    ].some((col) =>
      item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // table end

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchDataCourse("course");
        if (response.success) {
          setCourseData(response.data);
        } else {
          toast.error(response.message);
        }

        const departmentsResponse = await fetchDataDepartment("dept");
        if (departmentsResponse.success) {
          setDepartments(departmentsResponse.data);
        } else {
          toast.error(departmentsResponse.message);
        }

        const programsResponse = await fetchDataProgram("program");
        if (programsResponse.success) {
          setPrograms(programsResponse.data);
        } else {
          toast.error(programsResponse.message);
        }

        const yearsResponse = await fetchDataYear("year");
        if (yearsResponse.success) {
          setYears(yearsResponse.data);
        } else {
          toast.error(yearsResponse.message);
        }

        const durationResponse = await fetchCourseDuration("courseduration");
        if (durationResponse.success) {
          setDurations(durationResponse.data);
        } else {
          toast.error(durationResponse.message);
        }

        const categoryResponse = await fetchCourseCategory("coursecategory");
        if (categoryResponse.success) {
          setCategories(categoryResponse.data);
        } else {
          toast.error(categoryResponse.message);
        }

        const electiveResponse = await fetchelectivedata("getelective");
        if (electiveResponse.success) {
          setElectives(electiveResponse.data);
        } else {
          toast.error(electiveResponse.message);
        }

        const semesterResponse = await fetchDataSemester("semesterdata");
        if (semesterResponse.success) {
          setSemesters(semesterResponse.data);
        } else {
          toast.error(semesterResponse.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "Name is required";
    if (!form.alias) errors.alias = "Alias is required";
    if (!form.course_code) errors.course_code = "Course Code is required";
    if (!form.category) errors.category = "Category is required";
    if (!form.max_lecture || isNaN(form.max_lecture))
      errors.max_lecture = "Max Lecture must be a number";
    if (!form.duration) errors.duration = "Duration is required";
    if (!form.did) errors.did = "Department is required";
    if (!form.pid) errors.pid = "Program is required";
    if (!form.yid) errors.yid = "Year is required";
    if (!form.semid) errors.semid = "Semester is required";

    const isDuplicate = courseData.some(
      (item) =>
        item.name.toLowerCase() === form.name.toLowerCase() &&
        item.alias === form.alias &&
        item.course_code === form.course_code &&
        item.category === form.category &&
        item.max_lecture === form.max_lecture &&
        item.duration === form.duration &&
        item.did === form.did &&
        item.yid === form.yid &&
        item.semid === form.semid &&
        item.elective === form.elective &&
        item.cid !== form.cid
    );
    if (isDuplicate) {
      errors.name = "Course already exists";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = isEditing
        ? await updateDataCourse("course", form.cid, form)
        : await createDataCourse("course", form);

      if (response.success) {
        if (isEditing) {
          setCourseData(
            courseData.map((item) => (item.cid === form.cid ? form : item))
          );

          if (response && response.success) {
            toast.success(response.message);
          }
        } else {
          setCourseData([...courseData, { ...form, cid: Date.now() }]);
          if (response && response.success) {
            toast.success(response.message);
          }
        }
        setShowModal(false);
        setForm({
          cid: "",
          name: "",
          alias: "",
          course_code: "",
          category: "",
          max_lecture: "",
          duration: "",
          did: "",
          pid: "",
          yid: "",
          elective: "",
          semid: "",
        });
        setIsEditing(false);
      } else {
        if (response && response.error) {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
    setLoading(false);
  };

  const handleAddNewCourse = () => {
    setForm({
      cid: "",
      name: "",
      alias: "",
      course_code: "",
      category: "",
      max_lecture: "",
      duration: "",
      did: "",
      pid: "",
      yid: "",
      elective: "",
      semid: "",
    });
    setIsEditing(false);
    setModalTitle("Add New Course");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      cid: item.cid,
      name: item.name,
      alias: item.alias,
      course_code: item.course_code,
      category: item.category,
      max_lecture: item.max_lecture,
      duration: item.duration,
      did: item.did,
      pid: item.pid,
      yid: item.yid,
      elective: item.elective,
      semid: item.semid,
    });
    setIsEditing(true);
    setModalTitle("Edit Course");
    setShowModal(true);
  };

  const handleDelete = async (cid) => {
    setLoading(true);
    try {
      const response = await deleteDataCourse("course", cid);
      if (response.success) {
        setCourseData(courseData.filter((item) => item.cid !== cid));
        if (response && response.success) {
          toast.success(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete the course. Please try again.");
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
    `${[
      "cid",
      "name",
      "alias",
      "course_code",
      "category",
      "max_lecture",
      "duration",
      "did",
      "yid",
      "pid",
      "semid",
      "elective",
    ]
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
        onClick={() => handleDelete(item.cid)}
        className="btn btn-error text-white btn-sm"
        aria-label="Delete"
      >
        Delete
      </button>
    </div>
  );

  const enrichedCourseData = courseData.map((course) => ({
    ...course,
    deptName:
      departments.find((dept) => dept.did === course.did)?.name ||
      "Unknown Department",

    yearName:
      years.find((year) => year.yid === course.yid)?.name || "Unknown year",

    ProgramName:
      programs.find((program) => program.pid === course.pid)?.name ||
      "Unknown Program",

    semesterName:
      semesters.find((sem) => sem.semid === course.semid)?.name ||
      "Unknown Semester",
  }));

  // table end

  return (
    <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          className="btn btn-primary text-card-bg"
          onClick={handleAddNewCourse}
        >
          Add Course
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
            <span className="text-sm font-semibold">{`Total: ${filteredData.length} Courses`}</span>
          </div>
          {filteredData.length > 0 ? (
            <table className="table table-auto w-full rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-4 text-left whitespace-nowrap">S.No</th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Course Name
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Short Name
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Course Code
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">Category</th>
                  <th className="p-4">Max Lecture per Week</th>
                  <th className="p-4 text-left whitespace-nowrap">Duration</th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Department
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Program Name
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">Year</th>
                  <th className="p-4 text-left whitespace-nowrap">Semester</th>
                  <th className="p-4 text-left whitespace-nowrap">Elective</th>

                  <th className="p-4 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrichedCourseData
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((item, index) => (
                    <tr
                      key={generateKey(item, index)}
                      className="hover:bg-gray-100"
                    >
                      <td className="p-4">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">{item.alias}</td>
                      <td className="p-4">{item.course_code}</td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4">{item.max_lecture}</td>
                      <td className="p-4">{item.duration}</td>
                      <td className="p-4">{item.deptName}</td>
                      <td className="p-4">{item.ProgramName}</td>
                      <td className="p-4">{item.yearName}</td>
                      <td className="p-4">{item.semesterName}</td>
                      <td className="p-4">{item.elective}</td>
                      <td className="p-4">
                        <ActionButtons item={item} />
                      </td>

                      {/* columns={['name', 'alias', 'course_code', 'category', 'max_lecture']} */}
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
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className={`input input-bordered w-full ${
                  formErrors.name ? "input-error" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-error">{formErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Alias</span>
                </label>
                <input
                  type="text"
                  value={form.alias}
                  onChange={(e) => setForm({ ...form, alias: e.target.value })}
                  placeholder="Alias"
                  className={`input input-bordered w-full ${
                    formErrors.alias ? "input-error" : ""
                  }`}
                />
                {formErrors.alias && (
                  <p className="text-error">{formErrors.alias}</p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Course Code</span>
                </label>
                <input
                  type="text"
                  value={form.course_code}
                  onChange={(e) =>
                    setForm({ ...form, course_code: e.target.value })
                  }
                  placeholder="Course Code"
                  className={`input input-bordered w-full ${
                    formErrors.course_code ? "input-error" : ""
                  }`}
                />
                {formErrors.course_code && (
                  <p className="text-error">{formErrors.course_code}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={`select select-bordered w-full ${
                    formErrors.category ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.em} value={cat.em}>
                      {cat.em}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-error">{formErrors.category}</p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Max Lecture per Week</span>
                </label>
                <input
                  type="number"
                  value={form.max_lecture}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (Number(value) > 0 && Number.isInteger(Number(value)))
                    ) {
                      setForm({ ...form, max_lecture: value });
                    }
                  }}
                  placeholder="Max Lecture"
                  className={`input input-bordered w-full ${
                    formErrors.max_lecture ? "input-error" : ""
                  }`}
                  min="1"
                />
                {formErrors.max_lecture && (
                  <p className="text-error">{formErrors.max_lecture}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Select Duration</span>
                </label>
                <select
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className={`input input-bordered w-full ${
                    formErrors.duration ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Section</option>

                  {durations.map((duration) => (
                    <option key={duration.em} value={duration.em}>
                      {duration.em}
                    </option>
                  ))}
                </select>
                {formErrors.duration && (
                  <p className="text-error">{formErrors.duration}</p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Department Name</span>
                </label>
                <select
                  value={form.did}
                  onChange={(e) => setForm({ ...form, did: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.did ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Section</option>

                  {departments.map((dept) => (
                    <option key={dept.did} value={dept.did}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {formErrors.did && (
                  <p className="text-error">{formErrors.did}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Select Program</span>
                </label>
                <select
                  value={form.pid}
                  onChange={(e) => setForm({ ...form, pid: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.pid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Section</option>

                  {programs.map((pro) => (
                    <option key={pro.pid} value={pro.pid}>
                      {pro.name}
                    </option>
                  ))}
                </select>
                {formErrors.pid && (
                  <p className="text-error">{formErrors.pid}</p>
                )}
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">
                  <span className="label-text">Select Semester</span>
                </label>
                <select
                  value={form.semid}
                  onChange={(e) => setForm({ ...form, semid: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.semid ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Semester</option>

                  {semesters.map((sem) => (
                    <option key={sem.semid} value={sem.semid}>
                      {sem.name}
                    </option>
                  ))}
                </select>
                {formErrors.semid && (
                  <p className="text-error">{formErrors.semid}</p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Elective</span>
                </label>
                <select
                  value={form.elective}
                  onChange={(e) => setForm({ ...form, elective: e.target.value })}
                  className={`input input-bordered w-full ${
                    formErrors.elective ? "input-error" : ""
                  }`}
                >
                  <option value="">Select Elective</option>

                  {electives.map((elective) => (
                    <option key={elective.em} value={elective.em}>
                      {elective.em}
                    </option>
                  ))}
                </select>
                {formErrors.elective && (
                  <p className="text-error">{formErrors.elective}</p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {isEditing ? "Update Course" : "Add Course"}
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

export default CourseManagement;

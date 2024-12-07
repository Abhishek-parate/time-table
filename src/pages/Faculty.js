import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchDataFaculty,
  createDataFaculty,
  updateDataFaculty,
  deleteDataFaculty,
} from "../api/api";
import FormModal from "../components/FormModal";
import Table from "../components/Table";

const FacultyManagement = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [form, setForm] = useState({
    fid: "",
    name: "",
    entrytime: "",
    exittime: "",
    max_allowed_lecture: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [modalTitle, setModalTitle] = useState(""); // New state for modal title

  // table start
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredData = facultyData.filter((item) =>
    ["fid", "name", "entrytime", "exittime", "max_allowed_lecture"].some(
      (col) =>
        item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // table end

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchDataFaculty("faculty");
        if (response.success) {
          setFacultyData(response.data);
        } else {
          toast.error(response.message);
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
    if (!form.entrytime) errors.entrytime = "Entry time is required";
    if (!form.exittime) errors.exittime = "Exit time is required";
    if (!form.max_allowed_lecture || isNaN(form.max_allowed_lecture))
      errors.max_allowed_lecture = "Max allowed lecture must be a number";

    const isDuplicate = facultyData.some(
      (item) =>
        item.name.toLowerCase() === form.name.toLowerCase() &&
        item.fid !== form.fid
    );
    if (isDuplicate) {
      errors.name = "Faculty Name already exists";
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
        ? await updateDataFaculty("faculty", form.fid, form)
        : await createDataFaculty("faculty", form);

      if (response.success) {
        if (isEditing) {
          setFacultyData(
            facultyData.map((item) => (item.fid === form.fid ? form : item))
          );

          if (response && response.success) {
            toast.success(response.message);
          }
        } else {
          setFacultyData([...facultyData, { ...form, fid: Date.now() }]);
          if (response && response.success) {
            toast.success(response.message);
          }
        }
        setShowModal(false);
        setForm({
          fid: "",
          name: "",
          entrytime: "",
          exittime: "",
          max_allowed_lecture: "",
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

  const handleAddNewFaculty = () => {
    setForm({
      fid: "",
      name: "",
      entrytime: "",
      exittime: "",
      max_allowed_lecture: "",
    });
    setIsEditing(false);
    setModalTitle("Add New Faculty"); // Set modal title for adding
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      fid: item.fid,
      name: item.name,
      entrytime: item.entrytime,
      exittime: item.exittime,
      max_allowed_lecture: item.max_allowed_lecture,
    });
    setIsEditing(true);
    setShowModal(true);
    setModalTitle("Edit Faculty"); // Set modal title for editing
  };

  const handleDelete = async (fid) => {
    setLoading(true);
    try {
      const response = await deleteDataFaculty("faculty", fid);
      if (response.success) {
        setFacultyData(facultyData.filter((item) => item.fid !== fid));

        if (response && response.success) {
          toast.success(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete the faculty. Please try again.");
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
    `${["fid", "name", "entrytime", "exittime", "max_allowed_lecture"]
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

  // table end

  return (
    <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Faculty Management</h1>
        <button
          className="btn btn-primary text-card-bg"
          onClick={handleAddNewFaculty}
        >
          Add Faculty
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
            <span className="text-sm font-semibold">{`Total: ${filteredData.length} Faculties`}</span>
          </div>
          {filteredData.length > 0 ? (
            <table className="table table-auto w-full rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-4 text-left whitespace-nowrap">S.No</th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Faculty Name
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Punch in Time
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">Punch Out</th>
                  <th className="p-4 text-left whitespace-nowrap">
                    Max Lecture per Week
                  </th>
                  <th className="p-4 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={generateKey(item, index)}
                    className="hover:bg-gray-100"
                  >
                    <td className="p-4">{indexOfFirstItem + index + 1}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.entrytime}</td>
                    <td className="p-4">{item.exittime}</td>
                    <td className="p-4">{item.max_allowed_lecture}</td>
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
          modalTitle={modalTitle} // Pass modal title as prop
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
                <span className="label-text">Faculty Name</span>
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
                  <span className="label-text">Entry Time</span>
                </label>
                <input
                  type="time"
                  value={form.entrytime}
                  onChange={(e) =>
                    setForm({ ...form, entrytime: e.target.value })
                  }
                  className={`input input-bordered w-full ${
                    formErrors.entrytime ? "input-error" : ""
                  }`}
                />
                {formErrors.entrytime && (
                  <p className="text-error">{formErrors.entrytime}</p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Exit Time</span>
                </label>
                <input
                  type="time"
                  value={form.exittime}
                  onChange={(e) =>
                    setForm({ ...form, exittime: e.target.value })
                  }
                  className={`input input-bordered w-full ${
                    formErrors.exittime ? "input-error" : ""
                  }`}
                />
                {formErrors.exittime && (
                  <p className="text-error">{formErrors.exittime}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Max Lecture per Week</span>
              </label>
              <input
                type="number"
                value={form.max_allowed_lecture}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setForm({ ...form, max_allowed_lecture: value });
                  }
                }}
                placeholder="Max Lecture per Week"
                className={`input input-bordered w-full ${
                  formErrors.max_allowed_lecture ? "input-error" : ""
                }`}
              />
              {formErrors.max_allowed_lecture && (
                <p className="text-error">{formErrors.max_allowed_lecture}</p>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {isEditing ? "Update Faculty" : "Add Faculty"}
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

export default FacultyManagement;

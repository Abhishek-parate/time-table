import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  fetchDataSemester,
  createDataSemester,
  updateDataSemester,
  deleteDataSemester,
  fetchDataYear,
  fetchDataPrograms,
  fetchDataProgram,
} from "../api/api";
import FormModal from "../components/FormModal";
import Table from "../components/Table";

const SemesterManagement = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [form, setForm] = useState({ semid: "", name: "", pid: "", yid: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState(''); // Added state for selected program
  const [filteredYears, setFilteredYears] = useState([]);

  // Table handling
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredData = semesterData.filter((item) =>
    ["name", "pid", "yid", "semid"].some((col) =>
      item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    const fetchSemesterData = async () => {
      setLoading(true);
      try {
        const response = await fetchDataSemester("semesterdata");
        if (response.success) {
          setSemesterData(response.data);
        } else {
          toast.error(response.message);
        }

        const yearResponse = await fetchDataYear("year");
        if (yearResponse.success) {
          setYears(yearResponse.data);
        } else {
          toast.error(yearResponse.message);
        }

        const programResponse = await fetchDataProgram("program");
        if (programResponse.success) {
          setPrograms(programResponse.data);
        } else {
          toast.error(programResponse.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
      setLoading(false);
    };

    fetchSemesterData();
  }, []);


  useEffect(() => {
    if (selectedProgram && years.length > 0) {
      const filtered = years.filter((year) => year.pid === selectedProgram);
      setFilteredYears(filtered);
    } else {
      setFilteredYears([]);
    }
  }, [selectedProgram, years]); // This hook is triggered whenever selectedProgram or years changes
  


  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "Name is required";
    if (!form.pid) errors.pid = "Program is required";
    if (!form.yid) errors.yid = "Year is required";

    const isDuplicate = semesterData.some(
      (item) =>
        item.name.toLowerCase() === form.name.toLowerCase() &&
        item.pid === form.pid &&
        item.yid === form.yid &&
        item.semid !== form.semid
    );

    if (isDuplicate) {
      errors.name = "This semester already exists.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setFormErrors({});
    setLoading(true);
    

    const errors = validateForm();

    console.log(errors);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = isEditing
        ? await updateDataSemester("semesterdata", form.semid, form)
        : await createDataSemester("semesterdata", form);

      if (response.success) {
        if (isEditing) {
          setSemesterData(
            semesterData.map((item) =>
              item.semid === form.semid ? form : item
            )
          );
        } else {
          setSemesterData([...semesterData, { ...form, semid: Date.now() }]);
        }
        toast.success(response.message || "Semester saved successfully!");
        setShowModal(false);
        setForm({ semid: "", name: "", pid: "", yid: "" });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    }

    setLoading(false);
  };

  const handleAddNewSemester = () => {
    setForm({ semid: "", name: "", pid: "", yid: "" });
    setIsEditing(false);
    setModalTitle("Add New Semester");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      semid: item.semid,
      name: item.name,
      pid: item.pid,
      yid: item.yid,
    });
    setIsEditing(true);
    setModalTitle("Edit Semester");
    setShowModal(true);
  };

  const handleDelete = async (semid) => {
    setLoading(true);
    try {
      const response = await deleteDataSemester("semesterdata", semid);
      if (response.success) {
        setSemesterData(semesterData.filter((item) => item.semid !== semid));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete the semester. Please try again.");
    }
    setLoading(false);
  };

  const handleClose = useCallback(() => {
    setShowModal(false);
    setFormErrors({});
  }, []);


  useEffect(() => {
    if (selectedProgram && years.length > 0) {
      const filtered = years.filter((year) => year.pid === selectedProgram);
      setFilteredYears(filtered);
    } else {
      setFilteredYears([]);
    }
  }, [selectedProgram, years]);

  
  

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const generateKey = (item, index) =>
    `${["pid", "name", "alias", "timeid"]
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
        onClick={() => handleDelete(item.semid)}
        className="btn btn-error text-white btn-sm"
        aria-label="Delete"
      >
        Delete
      </button>
    </div>
  );

  const enrichedSemesterData = semesterData.map((semester) => ({
    ...semester,
    programName:
      programs.find((pro) => pro.pid === semester.pid)?.name ||
      "Unknown Program",
    yearName:
      years.find((year) => year.yid === semester.yid)?.name || "Unknown Year",
  }));

  return (
    <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Semester Management</h1>
        <button
          className="btn btn-primary text-card-bg"
          onClick={handleAddNewSemester}
        >
          Add Semester
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
        <div className="overflow-x-auto p-5">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered input-primary w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="text-sm font-semibold">{`Total: ${filteredData.length} Sections`}</span>
          </div>
          {filteredData.length > 0 ? (
            <table className="table table-auto w-full rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-4 text-left whitespace-nowrap">S.No</th>

                  <th className="p-4 text-left whitespace-nowrap">Program</th>
                  <th className="p-4 text-left whitespace-nowrap">Year</th>
                  <th className="p-4 text-left whitespace-nowrap">Semester</th>

                  <th className="p-4 text-left whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrichedSemesterData
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((item, index) => (
                    <tr
                      key={generateKey(item, index)}
                      className="hover:bg-gray-100"
                    >
                      <td className="p-4">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4">{item.programName}</td>{" "}
                      {/* Display Department Name */}
                      <td className="p-4">{item.yearName}</td>
                      <td className="p-4">{item.name}</td>
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
  onChange={(e) => {
    const selected = e.target.value;
    setSelectedProgram(selected); // Update the selected program
    setForm({ ...form, pid: selected }); // Optionally update the form if needed
  }}
  className={`input input-bordered w-full ${formErrors.pid ? "input-error" : ""}`}
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

            <div className="mb-4">
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
{filteredYears.length > 0 ? (
  filteredYears.map((year) => (
    <option key={year.yid} value={year.yid}>
      {year.name}
    </option>
  ))
) : (
  <option value="" disabled>No Year Available</option>
)}
              </select>
              {formErrors.yid && <p className="text-error">{formErrors.yid}</p>}
            </div>



            
            <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Semester</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Semester"
                                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                            />
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {isEditing ? "Update Semester" : "Add Semester"}
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

export default SemesterManagement;

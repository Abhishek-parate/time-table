import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataYear, createDataYear, updateDataYear, deleteDataYear, fetchDataProgram } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const YearManagement = () => {
    const [yearData, setYearData] = useState([]);
    const [form, setForm] = useState({ yid: '', name: '', pid: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [programs, setPrograms] = useState([]);

    // table start
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredData = yearData.filter(item =>
        ['yid', 'name', 'pid'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // table end

    // Fetch year data and programs from the API
    useEffect(() => {
        const fetchYearData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataYear('year');
                if (response.success) {
                    setYearData(response.data);
                } else {
                    toast.error(response.message);
                }

                const programResponse = await fetchDataProgram('program');
                if (programResponse.success) {
                    setPrograms(programResponse.data);
                } else {
                    toast.error(programResponse.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchYearData();
    }, []);

    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!form.name) {
            errors.name = 'Name is required';
        }
        if (!form.pid) {
            errors.pid = 'Program is required';
        }

        const isDuplicate = yearData.some(
            (item) =>
              item.name.toLowerCase() === form.name.toLowerCase() &&
              item.pid === form.pid &&
              item.yid !== form.yid
          );
      
        
        
        if (isDuplicate) {
            errors.name = 'Year already exists';
        }

        return errors;
    };

    // Handle form submission (create or update)
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
                ? await updateDataYear('year', form.yid, form)
                : await createDataYear('year', form);

            if (response.success) {
                if (isEditing) {
                    setYearData(yearData.map((item) => (item.yid === form.yid ? form : item)));
                    if (response && response.success) {
                        toast.success(response.message);  
                    }
                } else {
                    setYearData([...yearData, { ...form, yid: Date.now() }]);
                    if (response && response.success) {
                        toast.success(response.message);  
                    }
                }
                setShowModal(false);
                setForm({ yid: '', name: '', pid: '' });
                setIsEditing(false);
            } else {
                if (response && response.error) {
                    toast.error(response.message);
                }   
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit the form. Please try again.');
        }
        setLoading(false);
    };

    // Add new year
    const handleAddNewYear = () => {
        setForm({ yid: '', name: '', pid: '' });
        setIsEditing(false);
        setModalTitle('Add New Year');
        setShowModal(true);
    };

    // Edit existing year
    const handleEdit = (item) => {
        setForm({
            yid: item.yid,
            name: item.name,
            pid: item.pid
        });
        setIsEditing(true);
        setModalTitle('Edit Year');
        setShowModal(true);
    };

    // Delete a year
    const handleDelete = async (yid) => {
        setLoading(true);
        try {
            const response = await deleteDataYear('year', yid);
            if (response.success) {
                setYearData(yearData.filter(item => item.yid !== yid));
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the year. Please try again.');
        }
        setLoading(false);
    };

    // Close the modal
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

    const generateKey = (item, index) => `${['yid', 'name', 'pid'].map(col => item[col]).join('-')}-${index}`;

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
                onClick={() => handleDelete(item.yid)}
                className="btn btn-error text-white btn-sm"
                aria-label="Delete"
            >
                Delete
            </button>
        </div>
    );

    // table end

    const enrichedYearData = yearData.map((year) => ({
        ...year,
        programName: programs.find((program) => program.pid === year.pid)?.name || 'Unknown Program',
    }));

    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Year Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewYear}>
                    Add Year
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
                        <span className="text-sm font-semibold">{`Total: ${filteredData.length} Years`}</span>
                    </div>
                    {filteredData.length > 0 ? (
                        <table className="table table-auto w-full rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="p-4 text-left whitespace-nowrap">S.No</th>
                                    <th className="p-4 text-left whitespace-nowrap">Year Name</th>
                                    <th className="p-4 text-left whitespace-nowrap">Program</th>
                                    <th className="p-4 text-left whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {enrichedYearData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                    <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                        <td className="p-4">{indexOfFirstItem + index + 1}</td>
                                        <td className="p-4">{item.name}</td>
                                        
                                        <td className="p-4">{item.programName}</td> {/* Display Department Name */}
                                        <td className="p-4">
                                            <ActionButtons item={item} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 mt-6">No year data available.</p>
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
                                    className={`btn btn-sm ${currentPage === index + 1 ? 'btn-secondary' : 'btn-base-100'}`}
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
                                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                            />
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>
                       
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Program</span>
                            </label>
                            <select
                                value={form.pid}
                                onChange={(e) => setForm({ ...form, pid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.pid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Program</option>
                                {programs.map((Program) => (
                                    <option key={Program.pid} value={Program.pid}>
                                        {Program.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.pid && <p className="text-error">{formErrors.pid}</p>}
                        </div>
                        <div className="modal-action">

                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {isEditing ? 'Update Year' : 'Add Year'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default YearManagement;

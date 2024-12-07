import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataProgram, createDataProgram, updateDataProgram, deleteDataProgram, fetchDataDepartment } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const ProgramManagement = () => {
    const [programData, setProgramData] = useState([]);
    const [form, setForm] = useState({ pid: '', name: '', alias: '', did: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [departments, setDepartments] = useState([]);


    // table start
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;



    const filteredData = programData.filter(item =>
        ['pid', 'name', 'alias', 'did'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // table end


    // Fetch program data and departments from the API
    useEffect(() => {
        const fetchProgramData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataProgram('program');
                if (response.success) {
                    setProgramData(response.data);
                } else {
                    toast.error(response.message);
                }

                const deptResponse = await fetchDataDepartment('dept');
                if (deptResponse.success) {
                    setDepartments(deptResponse.data);
                } else {
                    toast.error(deptResponse.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchProgramData();
    }, []);

    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!form.name) {
            errors.name = 'Name is required';
        }
        if (!form.alias) {
            errors.alias = 'Alias is required';
        }


        if (!form.did) {
            errors.did = 'Program is required';
        }

        const isDuplicate = programData.some(item => item.name.toLowerCase() === form.name.toLowerCase() && item.pid !== form.pid);
        if (isDuplicate) {
            errors.name = 'Program already exists';
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
                ? await updateDataProgram('program', form.pid, form)
                : await createDataProgram('program', form);

            if (response.success) {
                if (isEditing) {
                    setProgramData(programData.map((item) => (item.pid === form.pid ? form : item)));

                    if (response && response.success) {
                        toast.success(response.message);
                    }

                } else {
                    setProgramData([...programData, { ...form, pid: Date.now() }]);
                    if (response && response.success) {
                        toast.success(response.message);
                    }
                }
                setShowModal(false);
                setForm({ pid: '', name: '', alias: '', did: '' });
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

    // Add new program
    const handleAddNewProgram = () => {
        setForm({ pid: '', name: '', alias: '', did: '' });
        setIsEditing(false);
        setModalTitle('Add New Program');
        setShowModal(true);
    };

    // Edit existing program
    const handleEdit = (item) => {
        setForm({
            pid: item.pid,
            name: item.name,
            alias: item.alias,
            did: item.did
        });
        setIsEditing(true);
        setModalTitle('Edit Program');
        setShowModal(true);
    };

    // Delete a program
    const handleDelete = async (pid) => {
        setLoading(true);
        try {
            const response = await deleteDataProgram('program', pid);
            if (response.success) {
                setProgramData(programData.filter(item => item.pid !== pid));
                if (response && response.success) {
                    toast.success(response.message);
                }
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the program. Please try again.');
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

    const generateKey = (item, index) => `${['did', 'name', 'alias', 'timeid'].map(col => item[col]).join('-')}-${index}`;

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
                onClick={() => handleDelete(item.pid)}
                className="btn btn-error text-white btn-sm"
                aria-label="Delete"
            >
                Delete
            </button>
        </div>
    );

    // table end


    const enrichedProgramData = programData.map((program) => ({
        ...program,
        deptName: departments.find((dept) => dept.did === program.did)?.name || 'Unknown Department',
    }));





    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Program Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewProgram}>
                    Add Program
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
                        <span className="text-sm font-semibold">{`Total: ${filteredData.length} Programs`}</span>
                    </div>
                    {filteredData.length > 0 ? (
                        <table className="table table-auto w-full rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="p-4 text-left whitespace-nowrap">S.No</th>
                                    <th className="p-4 text-left whitespace-nowrap">Program Name</th>
                                    <th className="p-4 text-left whitespace-nowrap">Short Name</th>
                                    <th className="p-4 text-left whitespace-nowrap">Department</th>
                                    <th className="p-4 text-left whitespace-nowrap">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {enrichedProgramData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                    <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                        <td className="p-4">{indexOfFirstItem + index + 1}</td>
                                        <td className="p-4">{item.name}</td>
                                        <td className="p-4">{item.alias}</td>
                                        <td className="p-4">{item.deptName}</td> {/* Display Department Name */}
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
                                <span className="label-text">Alias</span>
                            </label>
                            <input
                                type="text"
                                value={form.alias}
                                onChange={(e) => setForm({ ...form, alias: e.target.value })}
                                placeholder="Alias"
                                className={`input input-bordered w-full ${formErrors.alias ? 'input-error' : ''}`}
                            />
                            {formErrors.alias && <p className="text-error">{formErrors.alias}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Program</span>
                            </label>
                            <select
                                value={form.did}
                                onChange={(e) => setForm({ ...form, did: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.did ? 'input-error' : ''}`}
                            >
                                <option value="">Select Program</option>
                                {departments.map((dept) => (
                                    <option key={dept.did} value={dept.did}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.did && <p className="text-error">{formErrors.did}</p>}
                        </div>
                        <div className="modal-action">

                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {isEditing ? 'Update Program' : 'Add Program'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default ProgramManagement;

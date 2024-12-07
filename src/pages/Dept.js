import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataDepartment, createDataDepartment, updateDataTime, deleteDataDepartment, fetchDataTime } from '../api/api';
// import { fetchDataDepartment, createDataDepartment, updateDataDepartment, deleteDataDepartment, fetchDataProgram, fetchDataTime } from '../api/api';

import FormModal from '../components/FormModal';
import Table from '../components/Table';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../TimePickerCustom.css'; // Import your custom CSS



const TimeManagement = () => {
    const [deptData, setDeptData] = useState([]);
    const [form, setForm] = useState({ did: '', name: '', timeid: '', tid: '' }); const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [modalTitle, setModalTitle] = useState(''); // New state for modal title
    const [timevalues, setTimevalues] = useState([]);

    // table start
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;



    const filteredData = deptData.filter(item =>
        ['did', 'name', 'alias', 'timeid'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // table end


    useEffect(() => {
        const fetchDataDepartmentAsync = async () => {
            setLoading(true);
            try {
                const response = await fetchDataDepartment('dept');
                if (response.success) {
                    setDeptData(response.data);
                } else {
                    toast.error(response.message);
                }



                const timeResponse = await fetchDataTime('time');
                if (timeResponse.success) {
                    setTimevalues(timeResponse.data);
                } else {
                    toast.error(timeResponse.message);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchDataDepartmentAsync();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!form.name) {
            errors.name = 'Name is required';
        }
        if (!form.alias) {
            errors.alias = 'Alias is required';
        }


        if (!form.timeid) {
            errors.timeid = 'Time is required';
        }

        const isDuplicate = deptData.some(item => item.name.toLowerCase() === form.name.toLowerCase() && item.did !== form.did);
        if (isDuplicate) {
            errors.name = 'Department already exists';
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
                ? await updateDataTime('dept', form.did, form)
                : await createDataDepartment('dept', form);

            if (response.success) {
                if (isEditing) {
                    setDeptData(
                        deptData.map((item) => (item.did === form.did ? form : item))
                    );

                    if (response && response.success) {
                        toast.success(response.message);
                    }
                } else {
                    setDeptData([...deptData, { ...form, did: Date.now() }]);

                    if (response && response.success) {
                        toast.success(response.message);
                    }
                }
                setShowModal(false);
                setForm({ did: '', name: '', alias: '', timeid: '' });
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

    const handleAddNewTime = () => {
        setForm({ did: '', name: '', alias: '', timeid: '' });
        setIsEditing(false);
        setModalTitle('Add New Department'); // Set modal title for adding

        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({
            did: item.did,
            name: item.name,
            alias: item.alias,
            timeid: item.timeid,
        });
        setIsEditing(true);
        setModalTitle('Edit Department'); // Set modal title for adding

        setShowModal(true);
    };

    const handleDelete = async (did) => {
        setLoading(true);
        try {
            const response = await deleteDataDepartment('dept', did);
            if (response.success) {
                setDeptData(deptData.filter(item => item.did !== did));
                if (response && response.success) {
                    toast.success(response.message);
                }
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the Department. Please try again.');
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
                onClick={() => handleDelete(item.did)}
                className="btn btn-error text-white btn-sm"
                aria-label="Delete"
            >
                Delete
            </button>
        </div>
    );

    // table end


    const enrichedDeptData = deptData.map((dept) => ({
        ...dept,
        timeName: timevalues.find((time) => time.timeid === dept.timeid)?.name || 'Unknown Shift',
    }));



    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold">Department Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewTime}>
                    Add Department
                </button>
            </div>

            {loading ? (
                // Skeleton Loader here
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
                        <span className="text-sm font-semibold">{`Total: ${filteredData.length} Departments`}</span>
                    </div>
                    {filteredData.length > 0 ? (
                        <table className="table table-auto w-full rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="p-4 text-left whitespace-nowrap">S.No</th>
                                    <th className="p-4 text-left whitespace-nowrap">Course Name</th>
                                    <th className="p-4 text-left whitespace-nowrap">Short Name</th>
                                    <th className="p-4 text-left whitespace-nowrap">Shift</th>
                                    <th className="p-4 text-left whitespace-nowrap">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {enrichedDeptData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                    <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                        <td className="p-4">{indexOfFirstItem + index + 1}</td>
                                        <td className="p-4">{item.name}</td>
                                        <td className="p-4">{item.alias}</td>
                                        <td className="p-4">{item.timeName}</td> {/* Display Time Name */}
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
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                value={form.name || ''}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Name"
                            />
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text"> Alias</span>
                            </label>
                            <input
                                type="text"
                                value={form.alias || ''}
                                onChange={(e) => setForm({ ...form, alias: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Alias"
                            />
                            {formErrors.alias && <p className="text-error">{formErrors.alias}</p>}
                        </div>




                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Time</span>
                            </label>
                            <select
                                value={form.timeid}
                                onChange={(e) => setForm({ ...form, timeid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.timeid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Time</option>
                                {timevalues.map((timevalue) => (
                                    <option key={timevalue.timeid} value={timevalue.timeid}>
                                        {timevalue.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.timeid && <p className="text-error">{formErrors.timeid}</p>}
                        </div>


                        <div className="modal-action">

                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {isEditing ? 'Update Department' : 'Add Department'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default TimeManagement;

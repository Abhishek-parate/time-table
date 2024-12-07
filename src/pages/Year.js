import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataYear, updateDataYear, deleteDataYear, createDataYear, fetchDataProgram, fetchDataTime } from '../api/api';
import FormModal from '../components/FormModal';

const YearManagement = () => {
    const [yearData, setYearData] = useState([]);
    const [form, setForm] = useState({ yid: '', name: '', pid: '', timeid: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [program, setProgram] = useState([]);
    const [times, setTimes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
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
                    setProgram(programResponse.data);
                } else {
                    toast.error(programResponse.message);
                }

                const timesResponse = await fetchDataTime('time');
                if (timesResponse.success) {
                    setTimes(timesResponse.data);
                } else {
                    toast.error(timesResponse.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!form.timeid) {
            errors.timeid = 'Select the Shift';
        }
        if (!form.pid) {
            errors.pid = 'Select the Program';
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
                ? await updateDataYear('year', form.yid, form)
                : await createDataYear('year', form);

            if (response.success) {
                if (isEditing) {
                    setYearData(yearData.map((item) => (item.yid === form.yid ? form : item)));
                    toast.success('Year updated successfully!');
                } else {
                    setYearData([...yearData, { ...form, yid: Date.now() }]);
                    toast.success('Year added successfully!');
                }
                setShowModal(false);
                setForm({ yid: '', name: '', pid: '', timeid: '' });
                setIsEditing(false);
            } else {
                toast.error(`Error: ${response.message}`);
            }
        } catch (error) {
            toast.error('Failed to submit the form. Please try again.');
        }
        setLoading(false);
    };

    const handleAddNewClassroom = () => {
        setForm({ yid: '', name: '', pid: '', timeid: '' });
        setIsEditing(false);
        setModalTitle('Add New Academic Year');
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({ yid: item.yid, name: item.year, pid: item.pid, timeid: item.timeid });
        setIsEditing(true);
        setModalTitle('Edit Academic Year');
        setShowModal(true);
    };

    const handleDelete = async (yid) => {
        if (!yid) {
            toast.error('Academic Year is missing');
            return;
        }

        setLoading(true);
        try {
            const response = await deleteDataYear('year', yid);
            if (response.success) {
                setYearData(yearData.filter(item => item.yid !== yid));
                toast.success('Academic Year deleted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to delete the classroom. Please try again.');
        }
        setLoading(false);
    };

    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    const filteredData = yearData.filter(item =>
        ['year', 'program', 'shift'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generateKey = (item, index) => `${['year', 'program', 'shift'].map(col => item[col]).join('-')}-${index}`;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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

    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold">Academic Year Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewClassroom}>
                    Add Academic Year
                </button>
            </div>

            {/* Search and Pagination */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered input-primary w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="text-sm font-semibold">{`Total: ${filteredData.length}`}</span>
            </div>

            {filteredData.length > 0 ? (
                <table className="table table-auto w-full rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-secondary text-white">
                            <th className="p-4 text-left whitespace-nowrap">S.No</th>
                            <th className="p-4 text-left whitespace-nowrap">Year</th>
                            <th className="p-4 text-left whitespace-nowrap">Program</th>
                            <th className="p-4 text-left whitespace-nowrap">Shift</th>
                            <th className="p-4 text-left whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                <td className="p-4">{indexOfFirstItem + index + 1}</td>
                                <td className="p-4">{item.year}</td>
                                <td className="p-4">{item.program}</td>
                                <td className="p-4">{item.shift}</td>
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

            {/* Pagination */}
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
                            className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline'}`}
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

            {/* Modal */}
            {showModal && (
                <FormModal title={modalTitle} onClose={handleClose}>
                    <div className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="year" className="label">Academic Year</label>
                            <input
                                type="text"
                                id="year"
                                className="input input-bordered w-full"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="program" className="label">Program</label>
                            <select
                                id="program"
                                className="select select-bordered w-full"
                                value={form.pid}
                                onChange={(e) => setForm({ ...form, pid: e.target.value })}
                            >
                                <option value="">Select Program</option>
                                {program.map((prog) => (
                                    <option key={prog.pid} value={prog.pid}>{prog.name}</option>
                                ))}
                            </select>
                            {formErrors.pid && <p className="text-error">{formErrors.pid}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="shift" className="label">Shift</label>
                            <select
                                id="shift"
                                className="select select-bordered w-full"
                                value={form.timeid}
                                onChange={(e) => setForm({ ...form, timeid: e.target.value })}
                            >
                                <option value="">Select Shift</option>
                                {times.map((time) => (
                                    <option key={time.timeid} value={time.timeid}>
                                        {time.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.timeid && <p className="text-error">{formErrors.timeid}</p>}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleClose}
                                className="btn btn-secondary text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'} text-white`}
                                disabled={loading}
                            >
                                {isEditing ? 'Update Year' : 'Add Year'}
                            </button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default YearManagement;

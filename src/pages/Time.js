import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataTime, createDataTime, updateDataTime, deleteDataTime } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../TimePickerCustom.css'; // Import your custom CSS

const Time = () => {
    const [timeData, setTimeData] = useState([]);
    const [form, setForm] = useState({
        timeid: '',
        name: '',
        start: '',
        end: '',
        gap: 15
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [modalTitle, setModalTitle] = useState('');



        // table start
        const [searchTerm, setSearchTerm] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 6;
    
        const filteredData = timeData.filter(item =>
            ['timeid', 'name', 'start','end','gap'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
    
        // table end



    useEffect(() => {
        const fetchDataTimeAsync = async () => {
            setLoading(true);
            try {
                const response = await fetchDataTime('time');
                if (response.success) {
                    console.log(response.data); // Debug response data
                    setTimeData(response.data);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchDataTimeAsync();
    }, []);

    // Validation function
    const validateForm = () => {
        const errors = {};
        if (!form.name) errors.name = 'Name is required';
        if (!form.start) errors.start = 'Start time is required';
        if (!form.end) errors.end = 'End time is required';
        if (form.end <= form.start) errors.end = 'End time must be later than start time';
        if (form.gap <= 0) errors.gap = 'Gap must be a positive number';


        const isDuplicate = timeData.some(item => item.name.toLowerCase() === form.name.toLowerCase() && item.timeid !== form.timeid);
        if (isDuplicate) {
            errors.name = 'Time Slot already exists';
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
                ? await updateDataTime('time', form.timeid, form)
                : await createDataTime('time', form);

            if (response.success) {
                if (isEditing) {
                    setTimeData(timeData.map((item) => (item.timeid === form.timeid ? form : item)));
                    if (response && response.success) {
                        toast.success(response.message);  
                    }
                } else {
                    setTimeData([...timeData, { ...form, timeid: Date.now() }]);
                    if (response && response.success) {
                        toast.success(response.message);  
                    }
                }
                setShowModal(false);
                setForm({ timeid: '', name: '', start: '', end: '', gap: 15 });
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

    // Open modal to add new time
    const handleAddNewTime = () => {
        setForm({ timeid: '', name: '', start: '', end: '', gap: 15 });
        setIsEditing(false);
        setModalTitle('Add New Shift');
        setShowModal(true);
    };

    // Edit existing time
    const handleEdit = (item) => {
        console.log(item); // Debug the item being passed to handleEdit
        setForm({
            timeid: item.timeid,
            name: item.name || '', // Ensure 'name' exists, default to empty string
            start: item.start,
            end: item.end,
            gap: item.gap
        });
        setIsEditing(true);
        setModalTitle('Edit Shift');
        setShowModal(true);
    };

    // Delete time
    const handleDelete = async (timeid) => {
        setLoading(true);
        try {
            const response = await deleteDataTime('time', timeid);
            if (response.success) {
                setTimeData(timeData.filter(item => item.timeid !== timeid));
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the time. Please try again.');
        }
        setLoading(false);
    };

    // Close modal
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
 
     const generateKey = (item, index) => `${['timeid', 'name', 'start','end','gap'].map(col => item[col]).join('-')}-${index}`;
 
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
                 onClick={() => handleDelete(item.timeid)}
                 className="btn btn-error text-white btn-sm"
                 aria-label="Delete"
             >
                 Delete
             </button>
         </div>
     );
 
     // table end
 
    //  const enrichedYearData = timeData.map((year) => ({
    //      ...year,
    //      programName: programs.find((program) => program.pid === year.pid)?.name || 'Unknown Program',
    //  }));

    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Shift Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewTime}>
                    Add Shift
                </button>
            </div>

            {loading ? (
                <div className="space-y-4 py-5">
                    <div className="skeleton h-16 w-full"></div>
                    <div className="skeleton h-4 w-52"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 2x9w-full"></div>
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
                        <span className="text-sm font-semibold">{`Total: ${filteredData.length} Shifts`}</span>
                    </div>
                    {filteredData.length > 0 ? (
                        <table className="table table-auto w-full rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="p-4 text-left whitespace-nowrap">S.No</th>
                                    <th className="p-4 text-left whitespace-nowrap">Shift</th>
                                    <th className="p-4 text-left whitespace-nowrap">Start Time</th>
                                    <th className="p-4 text-left whitespace-nowrap">Close Time</th>

                                    <th className="p-4 text-left whitespace-nowrap">Gap in Lectures</th>
                                    <th className="p-4 text-left whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                    <td className="p-4">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.start}</td>
                                    <td className="p-4">{item.end}</td>
                                    <td className="p-4">{item.gap}</td>
                              
                                    <td className="p-4">
                                        <ActionButtons item={item} />
                                    </td>

                                    {/* columns={['name', 'alias', 'course_code', 'category', 'max_lecture']} */}
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
                                value={form.name} // Ensure 'name' is consistent with the state
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Name"
                                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                            />
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Start Time</span>
                            </label>
                            <input
                                type="time"
                                value={form.start || ''}
                                onChange={(e) => setForm({ ...form, start: e.target.value })}
                                className="input input-bordered w-full"
                            />
                            {formErrors.start && <p className="text-error">{formErrors.start}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">End Time</span>
                            </label>
                            <input
                                type="time"
                                value={form.end || ''}
                                onChange={(e) => setForm({ ...form, end: e.target.value })}
                                className="input input-bordered w-full"
                            />
                            {formErrors.end && <p className="text-error">{formErrors.end}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Gap</span>
                            </label>
                            <input
                                type="number"
                                value={form.gap || ''}
                                onChange={(e) => setForm({ ...form, gap: e.target.value })}
                                className="input input-bordered w-full"
                            />
                            {formErrors.gap && <p className="text-error">{formErrors.gap}</p>}
                        </div>

                        <div className="modal-action">

                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {isEditing ? 'Update Shift' : 'Add Shift'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default Time;

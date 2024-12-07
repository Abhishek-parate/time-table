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
                    toast.success('Time updated successfully!');
                } else {
                    setTimeData([...timeData, { ...form, timeid: Date.now() }]);
                    toast.success('Time added successfully!');
                }
                setShowModal(false);
                setForm({ timeid: '', name: '', start: '', end: '', gap: 15 });
                setIsEditing(false);
            } else {
                toast.error(response.message);
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
                toast.success('Time deleted successfully!');
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
                <Table
                    data={timeData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name', 'start', 'end', 'gap']}
                />
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

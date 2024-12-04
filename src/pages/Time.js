import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataTime, createDataTime, updateDataTime, deleteDataTime } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../TimePickerCustom.css'; // Import your custom CSS

const Time = () => {
    const [timeData, setTimeData] = useState([]);
    const [form, setForm] = useState({ timeid: '', start: '', end: '', gap: 15 });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchDataTimeAsync = async () => {
            setLoading(true);
            try {
                const response = await fetchDataTime('time');
                if (response.success) {
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

    const validateForm = () => {
        const errors = {};
        if (!form.start) {
            errors.start = 'Start time is required';
        }
        if (!form.end) {
            errors.end = 'End time is required';
        }
        if (form.end <= form.start) {
            errors.end = 'End time must be later than start time';
        }
        if (form.gap <= 0) {
            errors.gap = 'Gap must be a positive number';
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
                ? await updateDataTime('time', form.timeid, form)
                : await createDataTime('time', form);

            if (response.success) {
                if (isEditing) {
                    setTimeData(
                        timeData.map((item) => (item.timeid === form.timeid ? form : item))
                    );
                    toast.success('Time updated successfully!');
                } else {
                    setTimeData([...timeData, { ...form, timeid: Date.now() }]);
                    toast.success('Time added successfully!');
                }
                setShowModal(false);
                setForm({ timeid: '', start: '', end: '', gap: 15 });
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

    const handleAddNewTime = () => {
        setForm({ timeid: '', start: '', end: '', gap: 15 });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({
            timeid: item.timeid,
            start: item.start,
            end: item.end,
            gap: item.gap,
        });
        setIsEditing(true);
        setShowModal(true);
    };

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

    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Time Management</h1>
            <button
                onClick={handleAddNewTime}
                className="btn btn-primary mb-4">
                Add Time
            </button>
            {loading ? (
                // Skeleton Loader here
                <div className="space-y-4">
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ) : (
                <Table
                    data={timeData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['start', 'end', 'gap']}
                />
            )}
            {showModal && (
                <FormModal
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
                                <span className="label-text">Select Start Time</span>
                            </label>
                            <TimePicker
                                onChange={(time) => setForm({ ...form, start: time })}
                                value={form.start || ''}
                                disableClock={false}
                                className="custom-time-picker"
                                format="HH:mm"
                            />
                            {formErrors.start && <p className="text-error">{formErrors.start}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Select End Time</span>
                            </label>
                            <TimePicker
                                onChange={(time) => setForm({ ...form, end: time })}
                                value={form.end || ''}
                                disableClock={false}
                                className="custom-time-picker"
                                format="HH:mm"
                            />
                            {formErrors.end && <p className="text-error">{formErrors.end}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Gap (minutes)</span>
                            </label>
                            <input
                                type="number"
                                value={form.gap}
                                onChange={(e) => setForm({ ...form, gap: e.target.value })}
                                placeholder="Gap (minutes)"
                                className={`input input-bordered w-full ${formErrors.gap ? 'input-error' : ''}`}
                            />
                            {formErrors.gap && <p className="text-error">{formErrors.gap}</p>}
                        </div>
                        <div className="save-button">
                            <button
                                onClick={handleSubmit}
                                className="btn btn-success">
                                Save
                            </button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default Time;

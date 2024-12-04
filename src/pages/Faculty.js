import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataFaculty, createDataFaculty, updateDataFaculty, deleteDataFaculty } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const FacultyManagement = () => {
    const [facultyData, setFacultyData] = useState([]);
    const [form, setForm] = useState({
        fid: '',
        name: '',
        entrytime: '',
        exittime: '',
        user: '',
        pass: '',
        role: 'teacher',
        day: '',
        max_allowed_lecture: '',
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataFaculty('faculty');
                if (response.success) {
                    setFacultyData(response.data);
                } else {
                    toast.error(response.message);
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
        if (!form.name) {
            errors.name = 'Name is required';
        }
        if (!form.entrytime) {
            errors.entrytime = 'Entry time is required';
        }
        if (!form.exittime) {
            errors.exittime = 'Exit time is required';
        }
        if (!form.user) {
            errors.user = 'User index is required';
        }
        if (!form.pass) {
            errors.pass = 'Password is required';
        }
        if (!form.day) {
            errors.day = 'Day is required';
        }
        if (!form.max_allowed_lecture || isNaN(form.max_allowed_lecture)) {
            errors.max_allowed_lecture = 'Max allowed lecture must be a number';
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
                ? await updateDataFaculty('faculty', form.fid, form)
                : await createDataFaculty('faculty', form);

            if (response.success) {
                if (isEditing) {
                    setFacultyData(
                        facultyData.map((item) => (item.fid === form.fid ? form : item))
                    );
                    toast.success('Faculty updated successfully!');
                } else {
                    setFacultyData([...facultyData, { ...form, fid: Date.now() }]);
                    toast.success('Faculty added successfully!');
                }
                setShowModal(false);
                setForm({
                    fid: '',
                    name: '',
                    entrytime: '',
                    exittime: '',
                    user: '',
                    pass: '',
                    role: 'teacher',
                    day: '',
                    max_allowed_lecture: '',
                });
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

    const handleAddNewFaculty = () => {
        setForm({
            fid: '',
            name: '',
            entrytime: '',
            exittime: '',
            user: '',
            pass: '',
            role: 'teacher',
            day: '',
            max_allowed_lecture: '',
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({
            fid: item.fid,
            name: item.name,
            entrytime: item.entrytime,
            exittime: item.exittime,
            user: item.user,
            pass: item.pass,
            role: item.role,
            day: item.day,
            max_allowed_lecture: item.max_allowed_lecture,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (fid) => {
        setLoading(true);
        try {
            const response = await deleteDataFaculty('faculty', fid);
            if (response.success) {
                setFacultyData(facultyData.filter(item => item.fid !== fid));
                toast.success('Faculty deleted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the faculty. Please try again.');
        }
        setLoading(false);
    };

    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
        setShowPassword(false); // Reset password visibility state on close
    }, []);

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Faculty Management</h1>
            <button
                onClick={handleAddNewFaculty}
                className="btn btn-primary mb-4">
                Add Faculty
            </button>
            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ) : (
                <Table
                    data={facultyData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name', 'entrytime', 'exittime', 'user', 'role', 'day', 'max_allowed_lecture']}
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
                        {/* Displaying inputs in two columns */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
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
                            <div>
                                <label className="label">
                                    <span className="label-text">User Index</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.user}
                                    onChange={(e) => setForm({ ...form, user: e.target.value })}
                                    placeholder="User Index"
                                    className={`input input-bordered w-full ${formErrors.user ? 'input-error' : ''}`}
                                />
                                {formErrors.user && <p className="text-error">{formErrors.user}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Entry Time</span>
                                </label>
                                <input
                                    type="time"
                                    value={form.entrytime}
                                    onChange={(e) => setForm({ ...form, entrytime: e.target.value })}
                                    className={`input input-bordered w-full ${formErrors.entrytime ? 'input-error' : ''}`}
                                />
                                {formErrors.entrytime && <p className="text-error">{formErrors.entrytime}</p>}
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Exit Time</span>
                                </label>
                                <input
                                    type="time"
                                    value={form.exittime}
                                    onChange={(e) => setForm({ ...form, exittime: e.target.value })}
                                    className={`input input-bordered w-full ${formErrors.exittime ? 'input-error' : ''}`}
                                />
                                {formErrors.exittime && <p className="text-error">{formErrors.exittime}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.pass}
                                        onChange={(e) => setForm({ ...form, pass: e.target.value })}
                                        placeholder="Password"
                                        className={`input input-bordered w-full ${formErrors.pass ? 'input-error' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {formErrors.pass && <p className="text-error">{formErrors.pass}</p>}
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Day</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.day}
                                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                                    placeholder="Day"
                                    className={`input input-bordered w-full ${formErrors.day ? 'input-error' : ''}`}
                                />
                                {formErrors.day && <p className="text-error">{formErrors.day}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Max Allowed Lecture</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.max_allowed_lecture}
                                    onChange={(e) => setForm({ ...form, max_allowed_lecture: e.target.value })}
                                    placeholder="Max Allowed Lecture"
                                    className={`input input-bordered w-full ${formErrors.max_allowed_lecture ? 'input-error' : ''}`}
                                />
                                {formErrors.max_allowed_lecture && <p className="text-error">{formErrors.max_allowed_lecture}</p>}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-4" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default FacultyManagement;

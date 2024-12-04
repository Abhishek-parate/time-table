import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Ensure toast is imported
import { fetchDataCourse, createDataCourse, updateDataCourse, deleteDataCourse } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const CourseManagement = () => {
    const [courseData, setCourseData] = useState([]);
    const [form, setForm] = useState({ cid: '', name: '', alias: '', course_code: '', category: '', max_lecture: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataCourse('course'); // Update this to fetch courses
                if (response.success) {
                    setCourseData(response.data);
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
        if (!form.alias) {
            errors.alias = 'Alias is required';
        }
        if (!form.course_code) {
            errors.course_code = 'Course Code is required';
        }
        if (!form.category) {
            errors.category = 'Category is required';
        }
        if (!form.max_lecture || isNaN(form.max_lecture)) {
            errors.max_lecture = 'Max Lecture must be a number';
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
                ? await updateDataCourse('course', form.cid, form) // Update to use course update API
                : await createDataCourse('course', form); // Update to use course create API

            if (response.success) {
                if (isEditing) {
                    setCourseData(
                        courseData.map((item) => (item.cid === form.cid ? form : item))
                    );
                    toast.success('Course updated successfully!'); // Success notification
                } else {
                    setCourseData([...courseData, { ...form, cid: Date.now() }]);
                    toast.success('Course added successfully!'); // Success notification
                }
                setShowModal(false);
                setForm({ cid: '', name: '', alias: '', course_code: '', category: '', max_lecture: '' });
                setIsEditing(false);
            } else {
                toast.error(response.message); // Error notification
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit the form. Please try again.'); // Error notification
        }
        setLoading(false);
    };

    const handleAddNewCourse = () => {
        setForm({ cid: '', name: '', alias: '', course_code: '', category: '', max_lecture: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({
            cid: item.cid,
            name: item.name,
            alias: item.alias,
            course_code: item.course_code,
            category: item.category,
            max_lecture: item.max_lecture,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (cid) => {
        setLoading(true);
        try {
            const response = await deleteDataCourse('course', cid); // Update to use course delete API
            if (response.success) {
                setCourseData(courseData.filter(item => item.cid !== cid));
                toast.success('Course deleted successfully!'); // Success notification
            } else {
                toast.error(response.message); // Error notification
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the course. Please try again.'); // Error notification
        }
        setLoading(false);
    };

    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Course Management</h1>
            <button
                onClick={handleAddNewCourse}
                className="btn btn-primary mb-4">
                Add Course
            </button>
            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ) : (
                <Table
                    data={courseData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name', 'alias', 'course_code', 'category', 'max_lecture']}
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
                                <span className="label-text">Course Code</span>
                            </label>
                            <input
                                type="text"
                                value={form.course_code}
                                onChange={(e) => setForm({ ...form, course_code: e.target.value })}
                                placeholder="Course Code"
                                className={`input input-bordered w-full ${formErrors.course_code ? 'input-error' : ''}`}
                            />
                            {formErrors.course_code && <p className="text-error">{formErrors.course_code}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className={`select select-bordered w-full ${formErrors.category ? 'input-error' : ''}`}
                            >
                                <option value="">Select Category</option>
                                <option value="pr">Practical</option>
                                <option value="tr">Theory</option>
                                <option value="tu">Tutorial</option>
                            </select>
                            {formErrors.category && <p className="text-error">{formErrors.category}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Max Lecture</span>
                            </label>
                            <input
                                type="number"
                                value={form.max_lecture}
                                onChange={(e) => setForm({ ...form, max_lecture: e.target.value })}
                                placeholder="Max Lecture"
                                className={`input input-bordered w-full ${formErrors.max_lecture ? 'input-error' : ''}`}
                            />
                            {formErrors.max_lecture && <p className="text-error">{formErrors.max_lecture}</p>}
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

export default CourseManagement;

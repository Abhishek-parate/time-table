import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Make sure you import toast
import { fetchDataSection, createDataSection, updateDataSection, deleteDataSection } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const SectionManagement = () => {
    const [sectionData, setSectionData] = useState([]);
    const [form, setForm] = useState({ sid: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataSection('section');
                if (response.success) {
                    setSectionData(response.data);
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
                ? await updateDataSection('section', form.sid, form)
                : await createDataSection('section', form);

            if (response.success) {
                if (isEditing) {
                    setSectionData(
                        sectionData.map((item) => (item.sid === form.sid ? form : item))
                    );
                    toast.success('Section updated successfully!'); // Success notification
                } else {
                    setSectionData([...sectionData, { ...form, sid: Date.now() }]);
                    toast.success('Section added successfully!'); // Success notification
                }
                setShowModal(false);
                setForm({ sid: '', name: '' });
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

    const handleAddNewSection = () => {
        setForm({ sid: '', name: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({
            sid: item.sid,
            name: item.name,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (sid) => {
        setLoading(true);
        try {
            const response = await deleteDataSection('section', sid);
            if (response.success) {
                setSectionData(sectionData.filter(item => item.sid !== sid));
                toast.success('Section deleted successfully!'); // Success notification
            } else {
                toast.error(response.message); // Error notification
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the section. Please try again.'); // Error notification
        }
        setLoading(false);
    };

    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Section Management</h1>
            <button
                onClick={handleAddNewSection}
                className="btn btn-primary mb-4">
                Add Section
            </button>
            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ) : (
                <Table
                    data={sectionData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name']}
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

export default SectionManagement;

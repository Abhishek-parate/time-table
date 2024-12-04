import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    fetchDataProgram,
    createDataProgram,
    updateDataProgram,
    deleteDataProgram,
    fetchDataSection,
} from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const ProgramManagement = () => {
    const [programData, setProgramData] = useState([]);
    const [form, setForm] = useState({ pid: '', name: '', alias: '', sectionId: '' });
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Fetch programs and sections on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const programResponse = await fetchDataProgram('program');
                if (programResponse.success) {
                    setProgramData(programResponse.data);
                } else {
                    toast.error(programResponse.message);
                }

                const sectionResponse = await fetchDataSection('section'); // Fetch sections
                if (sectionResponse.success) {
                    setSections(sectionResponse.data);
                } else {
                    toast.error(sectionResponse.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchData();
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
        if (!form.sectionId) {
            errors.sectionId = 'Section is required';
        }
        return errors;
    };

// Handle form submission
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

    // Convert sectionId to a number before comparing
    const selectedSection = sections.find(sec => sec.sid === Number(form.sectionId));

    if (!selectedSection) {
        toast.error('Selected section not found. Please choose a valid section.');
        setLoading(false);
        return;
    }

    // Prepare payload for submission with only necessary fields
    const dataToSubmit = {
        pid: form.pid,
        name: form.name,
        alias: form.alias,
        sid: selectedSection.sid, // Use selected section's sid
    };

    try {
        const response = isEditing
            ? await updateDataProgram('program', form.pid, dataToSubmit) // Update with filtered data
            : await createDataProgram('program', dataToSubmit); // Create with filtered data

        if (response.success) {
            if (isEditing) {
                // Update program data in state
                setProgramData(
                    programData.map((item) =>
                        item.pid === form.pid ? { ...dataToSubmit } : item
                    )
                );
                toast.success('Program updated successfully!');
            } else {
                const newProgram = { ...dataToSubmit, pid: Date.now() }; // Assuming pid is generated
                setProgramData([...programData, newProgram]);
                toast.success('Program added successfully!');
            }
            setShowModal(false);
            setForm({ pid: '', name: '', alias: '', sectionId: '' });
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



    // Handle opening the modal for adding a new program
    const handleAddNewProgram = () => {
        setForm({ pid: '', name: '', alias: '', sectionId: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    // Handle editing an existing program
    const handleEdit = (item) => {
        setForm({
            pid: item.pid,
            name: item.name,
            alias: item.alias,
            sectionId: item.section.sid || '', // Ensure you are capturing the section ID
        });
        setIsEditing(true);
        setShowModal(true);
    };

    // Handle deleting a program
    const handleDelete = async (pid) => {
        setLoading(true);
        try {
            const response = await deleteDataProgram('program', pid);
            if (response.success) {
                setProgramData(programData.filter(item => item.pid !== pid));
                toast.success('Program deleted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the program. Please try again.');
        }
        setLoading(false);
    };

    // Handle closing the modal
    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Program Management</h1>
            <button
                onClick={handleAddNewProgram}
                className="btn btn-primary mb-4">
                Add Program
            </button>
            {loading ? (
                <div className="space-y-4">
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ) : (
                <Table
                    data={programData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name', 'alias', 'section_name']}
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
                        <form onSubmit={handleSubmit}>
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
                                    <span className="label-text">Section</span>
                                </label>
                                <select
                                    value={form.sectionId}
                                    onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                                    className={`select select-bordered w-full ${formErrors.sectionId ? 'select-error' : ''}`}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((sec) => (
                                        <option key={sec.sid} value={sec.sid}>{sec.name}</option>
                                    ))}
                                </select>
                                {formErrors.sectionId && <p className="text-error">{formErrors.sectionId}</p>}
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default ProgramManagement;

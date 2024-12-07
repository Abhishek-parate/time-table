import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataClassroom, createDataClassroom, updateDataClassroom, deleteDataClassroom } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const ClassroomManagement = () => {
    const [classroomData, setClassroomData] = useState([]);
    const [form, setForm] = useState({ rid: '', name: '', type: '', capacity: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataClassroom('classroom');
                if (response.success) {
                    setClassroomData(response.data);
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
    
        if (!form.name || form.name.length < 3) {
            errors.name = 'Name is required and should be at least 3 characters long';
        }
    
        if (!form.type) {
            errors.type = 'Type is required';
        }
    
        if (!form.capacity || isNaN(form.capacity) || form.capacity <= 0) {
            errors.capacity = 'Capacity must be a positive number';
        }
    
        const isDuplicate = classroomData.some(item => item.name.toLowerCase() === form.name.toLowerCase() && item.rid !== form.rid);
        if (isDuplicate) {
            errors.name = 'Classroom name already exists';
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
                ? await updateDataClassroom('classroom', form.rid, form)
                : await createDataClassroom('classroom', form);

            if (response.success) {
                if (isEditing) {
                    setClassroomData(classroomData.map((item) => (item.rid === form.rid ? form : item)));
                    toast.success('Classroom updated successfully!');
                } else {
                    setClassroomData([...classroomData, { ...form, rid: Date.now() }]);
                    toast.success('Classroom added successfully!');
                }
                setShowModal(false);
                setForm({ rid: '', name: '', type: '', capacity: '' });
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

    const handleAddNewClassroom = () => {
        setForm({ rid: '', name: '', type: '', capacity: '' });
        setIsEditing(false);
        setModalTitle('Add New Classroom');
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({ rid: item.rid, name: item.name, type: item.type, capacity: item.capacity });
        setIsEditing(true);
        setModalTitle('Edit Classroom');
        setShowModal(true);
    };

    const handleDelete = async (rid) => {
        if (!rid) {
            toast.error('Classroom ID is missing');
            return;
        }
        
        setLoading(true);
        try {
            const response = await deleteDataClassroom('classroom', rid);
            if (response.success) {
                setClassroomData(classroomData.filter(item => item.rid !== rid));
                toast.success('Classroom deleted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the classroom. Please try again.');
        }
        setLoading(false);
    };
    
    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold">Classroom Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewClassroom}>
                    Add Classroom
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
                <Table
                    data={classroomData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name', 'type', 'capacity']}
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
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Name"
                                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                            />
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Type</span>
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.type ? 'input-error' : ''}`}
                            >
                                <option value="">Select Type</option>
                                <option value="Class">Class</option>
                                <option value="Lab">Lab</option>
                            </select>
                            {formErrors.type && <p className="text-error">{formErrors.type}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Capacity</span>
                            </label>
                            <input
                                type="number"
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                placeholder="Capacity"
                                className={`input input-bordered w-full ${formErrors.capacity ? 'input-error' : ''}`}
                            />
                            {formErrors.capacity && <p className="text-error">{formErrors.capacity}</p>}
                        </div>
                        <div className="save-button">
                            <button onClick={handleSubmit} className="btn btn-success">Save</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default ClassroomManagement;

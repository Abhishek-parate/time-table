import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; 
import { fetchDataSection, createDataSection, updateDataSection, deleteDataSection } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const SectionManagement = () => {
    const [sectionData, setSectionData] = useState([]);
    const [form, setForm] = useState({ sid: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState(''); 
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
    
        // Check if the section name is empty
        if (!form.name) {
            errors.name = 'Name is required';
        }
    
        // Check if the section name already exists
        const isDuplicate = sectionData.some(item => item.name.toLowerCase() === form.name.toLowerCase() && item.sid !== form.sid);
        if (isDuplicate) {
            errors.name = 'Course name already exists';
            
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
                    setSectionData(sectionData.map((item) => (item.sid === form.sid ? form : item)));
                    toast.success('Section updated successfully!'); 
                } else {
                    setSectionData([...sectionData, { ...form, sid: Date.now() }]);
                    toast.success('Section added successfully!'); 
                }
                setShowModal(false);
                setForm({ sid: '', name: '' });
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
    

    const handleAddNewSection = () => {
        setForm({ sid: '', name: '' });
        setIsEditing(false);
        setModalTitle('Add New Section'); 
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({ sid: item.sid, name: item.name });
        setIsEditing(true);
        setModalTitle('Edit Section'); 
        setShowModal(true);
    };

    const handleDelete = async (sid) => {
        setLoading(true);
        try {
            const response = await deleteDataSection('section', sid); 
            if (response.success) {
                setSectionData(sectionData.filter(item => item.sid !== sid));
                toast.success('Section deleted successfully!'); 
            } else {
                toast.error(response.message); 
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the section. Please try again.'); 
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
                <h1 className="text-2xl font-bold">Section Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewSection}>
                    Add Section
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
                    data={sectionData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name']}
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
                        <div className="save-button">
                            <button onClick={handleSubmit} className="btn btn-success">Save</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default SectionManagement;

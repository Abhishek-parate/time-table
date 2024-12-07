import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataAllotment, createDataAllotment, updateDataAllotment, deleteDataAllotment } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const AllotmentManagement = () => {
    const [allotmentData, setAllotmentData] = useState([]);
    const [form, setForm] = useState({ aid: '', pid: '', cid: '', fid: '', did: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const responseAllotment = await fetchDataAllotment('allotment');
                if (responseAllotment.success) {
                    setAllotmentData(responseAllotment.data);
                } else {
                    toast.error(responseAllotment.message);
                }

                // Fetch programs, courses, and faculties for dropdowns
                const responsePrograms = await fetchDataAllotment('program');
                const responseCourses = await fetchDataAllotment('course');
                const responseFaculties = await fetchDataAllotment('faculty');

                setPrograms(responsePrograms.data);
                setCourses(responseCourses.data);
                setFaculties(responseFaculties.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchAllData();
    }, []);

    const validateForm = () => {
        const errors = {};
    
        if (!form.pid) {
            errors.pid = 'Program is required';
        }
    
        if (!form.cid) {
            errors.cid = 'Course is required';
        }
    
        if (!form.fid) {
            errors.fid = 'Faculty is required';
        }

        if (!form.did) {
            errors.did = 'Department ID is required';
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
                ? await updateDataAllotment('allotment', form.aid, form)
                : await createDataAllotment('allotment', form);

            if (response.success) {
                if (isEditing) {
                    setAllotmentData(allotmentData.map((item) => (item.aid === form.aid ? form : item)));
                    toast.success('Allotment updated successfully!');
                } else {
                    setAllotmentData([...allotmentData, { ...form, aid: Date.now() }]);
                    toast.success('Allotment added successfully!');
                }
                setShowModal(false);
                setForm({ aid: '', pid: '', cid: '', fid: '', did: '' });
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

    const handleAddNewAllotment = () => {
        setForm({ aid: '', pid: '', cid: '', fid: '', did: '' });
        setIsEditing(false);
        setModalTitle('Add New Allotment');
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({ aid: item.aid, pid: item.pid, cid: item.cid, fid: item.fid, did: item.did });
        setIsEditing(true);
        setModalTitle('Edit Allotment');
        setShowModal(true);
    };

    const handleDelete = async (aid) => {
        if (!aid) {
            toast.error('Allotment ID is missing');
            return;
        }
        
        setLoading(true);
        try {
            const response = await deleteDataAllotment('allotment', aid);
            if (response.success) {
                setAllotmentData(allotmentData.filter(item => item.aid !== aid));
                toast.success('Allotment deleted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the allotment. Please try again.');
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
                <h1 className="text-2xl font-bold">Allotment Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewAllotment}>
                    Add Allotment
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
                    data={allotmentData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['program_name', 'course_name', 'Dept_name', 'Faculty_name']}
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
                                <span className="label-text">Program</span>
                            </label>
                            <select
                                value={form.pid}
                                onChange={(e) => setForm({ ...form, pid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.pid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Program</option>
                                {programs.map((program) => (
                                    <option key={program.pid} value={program.pid}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.pid && <p className="text-error">{formErrors.pid}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Course</span>
                            </label>
                            <select
                                value={form.cid}
                                onChange={(e) => setForm({ ...form, cid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.cid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.cid} value={course.cid}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.cid && <p className="text-error">{formErrors.cid}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Faculty</span>
                            </label>
                            <select
                                value={form.fid}
                                onChange={(e) => setForm({ ...form, fid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.fid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Faculty</option>
                                {faculties.map((faculty) => (
                                    <option key={faculty.fid} value={faculty.fid}>
                                        {faculty.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.fid && <p className="text-error">{formErrors.fid}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Department ID</span>
                            </label>
                            <input
                                type="text"
                                value={form.did}
                                onChange={(e) => setForm({ ...form, did: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.did ? 'input-error' : ''}`}
                            />
                            {formErrors.did && <p className="text-error">{formErrors.did}</p>}
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default AllotmentManagement;

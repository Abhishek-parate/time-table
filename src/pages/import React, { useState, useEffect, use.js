import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataDepartment, createDataDepartment, updateDataDepartment, deleteDataDepartment, fetchDataProgram, fetchDataTime } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../TimePickerCustom.css'; // Import your custom CSS

const DepartmentManagement = () => {
    const [deptData, setDeptData] = useState([]);
    const [form, setForm] = useState({ name: '', pid: '', timeid: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [modalTitle, setModalTitle] = useState(''); // New state for modal title
    const [timevalues, setTimevalues] = useState([]);
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setLoading(true);
            try {
                const response = await fetchDataDepartment('dept');
                if (response.success) {
                    setDeptData(response.data);
                } else {
                    toast.error(response.message);
                }

                const programResponse = await fetchDataProgram('program');
                if (programResponse.success) {
                    setPrograms(programResponse.data);
                } else {
                    toast.error(programResponse.message);
                }

                const timeResponse = await fetchDataTime('time');
                if (timeResponse.success) {
                    setTimevalues(timeResponse.data);
                } else {
                    toast.error(timeResponse.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchDataAsync();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!form.name) {
            errors.name = 'Name is required';
        }
        if (!form.pid) {
            errors.pid = 'Program is required';
        }
        if (!form.timeid) {
            errors.timeid = 'Time is required';
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
                ? await updateDataDepartment('dept', form.did, form)
                : await createDataDepartment('dept', form);

            if (response.success) {
                if (isEditing) {
                    setDeptData(deptData.map((item) => (item.did === form.did ? form : item)));
                    toast.success('Department updated successfully!');
                } else {
                    setDeptData([...deptData, { ...form, did: response.data.did }]);
                    toast.success('Department added successfully!');
                }
                setShowModal(false);
                setForm({ name: '', pid: '', timeid: '' });
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

    const handleAddNewDept = () => {
        setForm({ name: '', pid: '', timeid: '' });
        setIsEditing(false);
        setModalTitle('Add New Department');
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({
            did: item.did,
            name: item.name,
            pid: item.pid,
            timeid: item.timeid,
        });
        setIsEditing(true);
        setModalTitle('Edit Department');
        setShowModal(true);
    };

    const handleDelete = async (did) => {
        setLoading(true);
        try {
            const response = await deleteDataDepartment('dept', did);
            if (response.success) {
                setDeptData(deptData.filter(item => item.did !== did));
                toast.success('Department deleted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete the department. Please try again.');
        }
        setLoading(false);
    };

    const handleClose = useCallback(() => {
        setShowModal(false);
        setFormErrors({});
    }, []);

    return (
        <div className="p-6 bg-card-bg rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Department Management</h1>
                <button className="btn btn-primary text-card-bg" onClick={handleAddNewDept}>
                    Add Department
                </button>
            </div>

            {loading ? (
                // Skeleton Loader here
                  <div className="space-y-4 py-5">
  <div className="skeleton h-16 w-full"></div>
  <div className="skeleton h-4 w-52"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
  </div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ) : (
                <Table
                    data={deptData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    columns={['name', 'pid', 'timeid']}
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
                                value={form.name || ''}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Name"
                            />
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Time</span>
                            </label>
                            <select
                                value={form.timeid}
                                onChange={(e) => setForm({ ...form, timeid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.timeid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Time</option>
                                {timevalues.map((timevalue) => (
                                    <option key={timevalue.timeid} value={timevalue.timeid}>
                                        {timevalue.Name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.timeid && <p className="text-error">{formErrors.timeid}</p>}
                        </div>

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

                        <div className="save-button">
                            <button onClick={handleSubmit} className="btn btn-success">
                                Save
                            </button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default DepartmentManagement;

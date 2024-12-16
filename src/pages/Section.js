import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; 
import { fetchDataSection, createDataSection, updateDataSection, deleteDataSection, fetchDataYear, fetchDataSectionFields } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const SectionManagement = () => {
    const [sectionData, setSectionData] = useState([]);
    const [form, setForm] = useState({ sid: '', name: '', pid:'', yid:'' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState(''); 
    const [formErrors, setFormErrors] = useState({});

    const [programs, setPrograms] = useState([]);
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [sectionfields, setSectionFields] = useState([]);

    // table start
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;



    const filteredData = sectionData.filter(item =>
        ['name', 'pid', 'yid', 'semid'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // table end

    useEffect(() => {
        const fetchSectionData = async () => {
            setLoading(true);
            try {
                const response = await fetchDataSection('section');
                if (response.success) {
                    setSectionData(response.data);
                } else {
                    toast.error(response.message);
                }

                const yearResponse = await fetchDataYear('year');
                if (yearResponse.success) {
                    setYears(yearResponse.data);
                } else {
                    toast.error(yearResponse.message);
                }

                const programResponse = await fetchDataSection('program');
                if (programResponse.success) {
                    setPrograms(programResponse.data);
                } else {
                    toast.error(programResponse.message);
                }

                const sectionfieldsResponse = await fetchDataSection('sectionfields');
                if (sectionfieldsResponse.success) {
                    setSectionFields(sectionfieldsResponse.data);
                } else {
                    toast.error(sectionfieldsResponse.message);
                }

                const semesterResponse = await fetchDataSection('semesterdata');
                if (semesterResponse.success) {
                    setSemesters(semesterResponse.data);
                } else {
                    toast.error(semesterResponse.message);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
            }
            setLoading(false);
        };

        fetchSectionData();
    }, []);

    const validateForm = () => {
        const errors = {};
    
        if (!form.name) {
            errors.name = 'Name is required';
        }
    
        if (!form.pid) {
            errors.pid = 'Program is required';
        }
    
        if (!form.yid) {
            errors.yid = 'Year is required';
        }

        if (!form.semid) {
            errors.semid = 'Semester is required';
        }
        
        const isDuplicate = sectionData.some(
        item =>
            item.name.toLowerCase() === form.name.toLowerCase() &&
            item.pid === form.pid &&
            item.yid === form.yid &&
            item.semid === form.semid &&
            item.sid !== form.sid // Ensure we're not comparing the same item
    );

    if (isDuplicate) {
        errors.name = 'This section already exists.';
    }
    
        return errors;
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setLoading(true);
    
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
                    setSectionData(sectionData.map(item => item.sid === form.sid ? form : item));
                    
                } else {
                    setSectionData([...sectionData, { ...form, sid: Date.now() }]);
                }
                toast.success(response.message || 'Section saved successfully!');
                setShowModal(false);
                setForm({ sid: '', name: '', pid: '', yid: '',semid:'' });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit. Please try again.');
        }
    
        setLoading(false);
    };
    

    const handleAddNewSection = () => {
        setForm({ sid: '', name: '', pid:'', yid:'', semid:''});
        setIsEditing(false);
        setModalTitle('Add New Section'); 
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({ sid: item.sid, name: item.name, pid:item.pid, yid:item.yid, semid:item.semid });
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
                if (response && response.success) {
                    toast.success(response.message);
                }
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


    

    // table start

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generateKey = (item, index) => `${['pid', 'name', 'alias', 'timeid', 'semid'].map(col => item[col]).join('-')}-${index}`;

    const ActionButtons = ({ item }) => (
        <div className="flex space-x-2 justify-center">
            <button
                onClick={() => handleEdit(item)}
                className="btn btn-success text-white btn-sm"
                aria-label="Edit"
            >
                Edit
            </button>
            <button
                onClick={() => handleDelete(item.sid)}
                className="btn btn-error text-white btn-sm"
                aria-label="Delete"
            >
                Delete
            </button>
        </div>
    );

    // table end



    const enrichedSectioData = sectionData.map((section) => ({
        ...section,
        programName: programs.find((pro) => pro.pid === section.pid)?.name || 'Unknown Program',

        yearName: years.find((year) => year.yid === section.yid)?.name || 'Unknown Year',

        semName: semesters.find((sem) => sem.semid === section.semid)?.name || 'Unknown Semester',
    }));


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
               // table start

               <div className="overflow-x-auto p-5">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered input-primary w-1/3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="text-sm font-semibold">{`Total: ${filteredData.length} Sections`}</span>
                    </div>
                    {filteredData.length > 0 ? (
                        <table className="table table-auto w-full rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="p-4 text-left whitespace-nowrap">S.No</th>

                                    <th className="p-4 text-left whitespace-nowrap">Program</th>
                                    <th className="p-4 text-left whitespace-nowrap">Year</th>
                                    <th className="p-4 text-left whitespace-nowrap">Semester</th>
                                    <th className="p-4 text-left whitespace-nowrap">Section</th>

                                    <th className="p-4 text-left whitespace-nowrap">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {enrichedSectioData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                    <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                        <td className="p-4">{indexOfFirstItem + index + 1}</td>

                                        <td className="p-4">{item.programName}</td> {/* Display Department Name */}
                                        <td className="p-4">{item.yearName}</td>
                                        <td className="p-4">{item.semName}</td>
                                        <td className="p-4">{item.name}</td>

                                        <td className="p-4">
                                            <ActionButtons item={item} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    ) : (
                        <p className="text-center text-gray-500 mt-6">No data available.</p>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-primary text-white btn-sm"
                                aria-label="Previous Page"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`btn btn-sm ${currentPage === index + 1 ? 'btn-secondary' : 'btn-base-100'}`}
                                    aria-label={`Page ${index + 1}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-primary text-white btn-sm"
                                aria-label="Next Page"
                            >
                                Next
                            </button>
                        </div>
                    )}


                </div>

                // table end
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
                                {programs.map((pro) => (
                                    <option key={pro.pid} value={pro.pid}>
                                        {pro.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.pid && <p className="text-error">{formErrors.pid}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Year</span>
                            </label>
                            <select
                                value={form.yid}
                                onChange={(e) => setForm({ ...form, yid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.yid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                    <option key={year.yid} value={year.yid}>
                                        {year.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.yid && <p className="text-error">{formErrors.yid}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Semester</span>
                            </label>
                            <select
                                value={form.semid}
                                onChange={(e) => setForm({ ...form, semid: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.semid ? 'input-error' : ''}`}
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((sems) => (
                                    <option key={sems.semid} value={sems.semid}>
                                        {sems.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.semid && <p className="text-error">{formErrors.semid}</p>}
                        </div>
                        


                        <div className="mb-4">
                            <label className="label">
                            <span className="label-text">Section</span>
                            </label>
                            <select
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={`select select-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                            >
                                <option value="">Select Section</option>
                                    {sectionfields.map((sectionitem) => (
                                    <option key={sectionitem.em} value={sectionitem.em}>
                                        {sectionitem.em}
                                    </option>
                                    ))}
                            </select>
                            {formErrors.name && <p className="text-error">{formErrors.name}</p>}
                        </div>

                    
                     
                      
                        
                        <div className="modal-action">

                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {isEditing ? 'Update Section' : 'Add Section'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default SectionManagement;

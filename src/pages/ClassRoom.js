import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDataClassroom, createDataClassroom, updateDataClassroom, deleteDataClassroom, fetchClassRoomstype, fetchFloors } from '../api/api';
import FormModal from '../components/FormModal';
import Table from '../components/Table';

const ClassroomManagement = () => {
    const [classroomData, setClassroomData] = useState([]);
    const [form, setForm] = useState({ rid: '', name: '', type: '', cap: '',floor: '' });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [formErrors, setFormErrors] = useState({});


    const [roomstype, setRoomsType] = useState([]);
    const [floor, setFloors] = useState([]);



        // table start
        const [searchTerm, setSearchTerm] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 6;
    
    
    
        const filteredData = classroomData.filter(item =>
            ['name', 'type', 'cap','floor'].some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
    
        // table end


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

                const typeResponse = await fetchClassRoomstype('gerclassrooms');
                if (typeResponse.success) {
                    setRoomsType(typeResponse.data);
                } else {
                    toast.error(typeResponse.message);
                }

                const floorResponse = await fetchFloors('getfloor');
                if (floorResponse.success) {
                    setFloors(floorResponse.data);
                } else {
                    toast.error(floorResponse.message);
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
    
        if (!form.type) {
            errors.type = 'Room Type is required';
        }
    
        if (!form.floor) {
            errors.floor = 'Year is required';
        }
        
        const isDuplicate = classroomData.some(item => item.name.toLowerCase() === form.name.toLowerCase() && item.rid !== form.rid);
        if (isDuplicate) {
            errors.name = 'Room already exists';
        }

    if (isDuplicate) {
        errors.name = 'This Room already exists.';
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
                } else {
                    setClassroomData([...classroomData, { ...form, rid: Date.now() }]);
                }
                toast.success(response.message || 'Room saved successfully!');

                setShowModal(false);
                setForm({ rid: '', name: '', type: '', cap: '', floor: '' });
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
        setForm({ rid: '', name: '', type: '', cap: '', floor:'' });
        setIsEditing(false);
        setModalTitle('Add New Classroom');
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setForm({ rid: item.rid, name: item.name, type: item.type, cap: item.cap , floor: item.floor });
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
                if (response && response.success) {
                    toast.success(response.message);
                }
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



    
    // table start

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generateKey = (item, index) => `${['name', 'type', 'floor', 'cap'].map(col => item[col]).join('-')}-${index}`;

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
                onClick={() => handleDelete(item.rid)}
                className="btn btn-error text-white btn-sm"
                aria-label="Delete"
            >
                Delete
            </button>
        </div>
    );

    // table end




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

                                    <th className="p-4 text-left whitespace-nowrap">Room Name</th>
                                    <th className="p-4 text-left whitespace-nowrap">Room Type</th>

                                    <th className="p-4 text-left whitespace-nowrap">Floor</th>
                                    <th className="p-4 text-left whitespace-nowrap">Student Capacity</th>

                                    <th className="p-4 text-left whitespace-nowrap">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                                    <td className="p-4">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.type}</td>
                                    <td className="p-4">{item.floor}</td>
                                    <td className="p-4">{item.cap}</td>
                                    
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
                                <span className="label-text">Classroom Name</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Classroom Name"
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


                                {roomstype.map((type) => (
                                    <option key={type.em} value={type.em}>
                                        {type.em}
                                    </option>
                                ))}


                            </select>
                            {formErrors.type && <p className="text-error">{formErrors.type}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">Floor</span>
                            </label>
                            <select
                                value={form.floor}
                                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                                className={`input input-bordered w-full ${formErrors.floor ? 'input-error' : ''}`}
                            >
                                
                                <option value="">Select Floor</option>


                                {floor.map((floor) => (
                                    <option key={floor.em} value={floor.em}>
                                        {floor.em}
                                    </option>
                                ))}


                            </select>
                            {formErrors.floor && <p className="text-error">{formErrors.floor}</p>}
                        </div>
                        <div className="mb-4">
    <label className="label">
        <span className="label-text">Capacity</span>
    </label>
    <input
        type="number"
        max={250}
        min={1}
        value={form.cap}
        onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
                setForm({ ...form, cap: value });
            }
        }}
        placeholder="Student Capacity"
        className={`input input-bordered w-full ${formErrors.cap ? 'input-error' : ''}`}
    />
    {formErrors.cap && <p className="text-error">{formErrors.cap}</p>}
</div>

                        <div className="modal-action">

<button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
    {isEditing ? 'Update Room' : 'Add Room'}
</button>
<button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
</div>
                    </div>
                </FormModal>
            )}
        </div>
    );
};

export default ClassroomManagement;

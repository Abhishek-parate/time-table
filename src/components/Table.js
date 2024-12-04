import React, { useState } from 'react';

const Table = ({ data, handleEdit, handleDelete, columns }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page

    // Filter the data based on the search term
    const filteredData = data.filter(item =>
        columns.some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className='p-5 bg-gray-50 rounded-lg shadow-lg'>
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="text-sm font-semibold text-gray-600">{`Total: ${filteredData.length} items`}</span>
            </div>

            <table className="table w-full bg-white rounded-lg shadow-md">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-4 text-left">S.No</th>
                        {columns.map((col) => (
                            <th key={col} className="p-4 text-left">
                                {col.charAt(0).toUpperCase() + col.slice(1)}
                            </th>
                        ))}
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr
                            key={`${item.sid || item.timeid || item.cid || item.fid || item.pid || index}`} // Ensure uniqueness
                            className="hover:bg-gray-100 transition duration-300"
                        >
                            <td className="p-4 border-t border-gray-200">{indexOfFirstItem + index + 1}</td>
                            {columns.map((col) => (
                                <td key={`${col}-${item[col]}`} className="p-4 border-t border-gray-200">
                                    {item[col]}
                                </td>
                            ))}
                            <td className="p-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="btn btn-sm btn-info hover:bg-blue-600 transition duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.sid || item.timeid || item.cid || item.fid || item.pid)}
                                        className="btn btn-sm btn-error hover:bg-red-600 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    className="btn btn-outline btn-sm text-gray-600 hover:bg-gray-200 transition duration-200"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <div className="flex items-center">
                    <span className="mx-2 font-semibold text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
                </div>
                <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    className="btn btn-outline btn-sm text-gray-600 hover:bg-gray-200 transition duration-200"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Table;

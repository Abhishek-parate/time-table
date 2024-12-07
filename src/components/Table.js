import React, { useState } from 'react';

const Table = ({ data, handleEdit, handleDelete, columns }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredData = data.filter(item =>
        columns.some(col => item[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generateKey = (item, index) => `${columns.map(col => item[col]).join('-')}-${index}`;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
                onClick={() => handleDelete(item.cid  || item.pid ||  item.did || item.sid || item.fid || item.timeid  || item.rid )}
                className="btn btn-error text-white btn-sm"
                aria-label="Delete"
            >
                Delete
            </button>
        </div>
    );

    return (
        <div className="overflow-x-auto p-5">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered input-primary w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="text-sm font-semibold">{`Total: ${filteredData.length}`}</span>
            </div>

            {filteredData.length > 0 ? (
             <table className="table table-auto w-full rounded-lg shadow-md">
             <thead>
                 <tr className="bg-secondary text-white">
                     <th className="p-4 text-left whitespace-nowrap">S.No</th>
                     {columns.map((col) => (
                         <th key={col} className="p-4 text-left whitespace-nowrap">
                             {capitalize(col)}
                         </th>
                     ))}
                     <th className="p-4 text-left whitespace-nowrap">Actions</th>
                 </tr>
             </thead>
             <tbody>
                 {currentItems.map((item, index) => (
                     <tr key={generateKey(item, index)} className="hover:bg-gray-100">
                         <td className="p-4">{indexOfFirstItem + index + 1}</td>
                         {columns.map((col) => (
                             <td key={`${col}-${item[col]}-${index}`} className="p-4 whitespace-nowrap">
                                 {item[col]}
                             </td>
                         ))}
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
    );
};

export default Table;

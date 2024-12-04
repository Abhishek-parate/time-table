import React, { useEffect } from 'react';

const FormModal = ({ children, handleClose }) => {
    // Close the modal when clicking outside of it
    const handleClickOutside = (e) => {
        const modalContent = document.getElementById('modal-content');
        if (modalContent && !modalContent.contains(e.target)) {
            handleClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div id="modal-content" className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">Time Entry</h2>
                {children}
            </div>
        </div>
    );
};

export default FormModal;

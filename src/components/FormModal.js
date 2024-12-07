import React, { useEffect } from 'react';

const FormModal = ({ modalTitle, children, handleClose }) => { // Accept modalTitle prop
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
                <h2 className="text-xl font-semibold mb-4">{modalTitle}</h2> {/* Display modal title */}
                {children}
            </div>
        </div>
    );
};

export default FormModal;

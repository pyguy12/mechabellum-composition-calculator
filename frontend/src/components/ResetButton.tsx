import React from 'react';
import { useDispatch } from 'react-redux';
import { resetSelectedUnits } from '../redux/store/unitsSlice';

const ResetButton: React.FC = () => {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(resetSelectedUnits());
    };

    return (
        <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 bg-transparent hover:bg-gray-700 font-medium py-1 px-3 rounded text-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
            Reset
        </button>
    );
};

export default ResetButton;

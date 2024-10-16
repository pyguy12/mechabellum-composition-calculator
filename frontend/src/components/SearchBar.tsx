import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../redux/store/unitsSlice';
import { RootState } from '../redux/store';

const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state: RootState) => state.units.searchQuery);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.select();
    };

    return (
        <div className="mb-4">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search units..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                onClick={handleClick}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default SearchBar;

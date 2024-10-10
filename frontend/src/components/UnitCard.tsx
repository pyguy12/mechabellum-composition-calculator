import React from 'react';
import { Unit } from '../types';

interface UnitCardProps {
    unit: Unit;
    isSelected: boolean;
    onClick: () => void;
    allUnits: Unit[];
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isSelected, onClick, allUnits }) => {
    return (
        <div
            onClick={onClick}
            className={`
                relative cursor-pointer transition-all duration-300 ease-in-out
                transform hover:scale-105 rounded-lg overflow-hidden
                ${
                    isSelected
                        ? 'ring-4 ring-blue-500 shadow-lg shadow-blue-500/50'
                        : 'hover:shadow-md hover:shadow-gray-600/50'
                }
            `}
        >
            <div className="relative w-full pb-[144.44%]">
                <img
                    src={`/images/units/${unit.image}`}
                    alt={unit.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-sm font-bold text-white text-center">{unit.name}</p>
                </div>
            </div>
            {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            )}
        </div>
    );
};

export default UnitCard;

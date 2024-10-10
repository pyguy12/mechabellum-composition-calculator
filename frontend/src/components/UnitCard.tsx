import React, { useState } from 'react';
import { Unit, UnitType } from '../types';
import { Shield, Sword } from 'lucide-react';

interface UnitCardProps {
    unit: Unit;
    isSelected: boolean;
    onClick: () => void;
    allUnits: Unit[];
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isSelected, onClick, allUnits }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getUnitNameById = (id: UnitType): string => {
        return allUnits.find((u) => u.id === id)?.name || 'Unknown';
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
            {isHovered && unit.counters && (
                <div className="absolute inset-0 bg-black/90 p-4 overflow-y-auto">
                    <div className="text-white space-y-4">
                        <div>
                            <div className="flex items-center mb-2">
                                <Sword className="w-5 h-5 mr-2 text-green-500" />
                                <p className="font-bold text-green-500">Effective against:</p>
                            </div>
                            <ul className="list-disc list-inside grid grid-cols-2 gap-x-2 text-sm">
                                {unit.counters.effectiveAgainst.map((id) => (
                                    <li key={id} className="truncate">
                                        {getUnitNameById(id)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <Shield className="w-5 h-5 mr-2 text-red-500" />
                                <p className="font-bold text-red-500">Countered by:</p>
                            </div>
                            <ul className="list-disc list-inside grid grid-cols-2 gap-x-2 text-sm">
                                {unit.counters.counteredBy.map((id) => (
                                    <li key={id} className="truncate">
                                        {getUnitNameById(id)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitCard;

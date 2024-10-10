import React from 'react';
import UnitCard from './UnitCard';
import { Unit } from '../types';

interface UnitGridProps {
    units: Unit[];
    selectedUnits: number[];
    toggleUnit: (id: number) => void;
}

const UnitGrid: React.FC<UnitGridProps> = ({ units, selectedUnits, toggleUnit }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {units.map((unit) => (
            <UnitCard
                key={unit.id}
                unit={unit}
                isSelected={selectedUnits.includes(unit.id)}
                onClick={() => toggleUnit(unit.id)}
            />
        ))}
    </div>
);

export default UnitGrid;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UnitCard from './UnitCard';
import { toggleUnit } from '../redux/store/unitsSlice';
import { RootState } from '../redux/store';
import { Unit } from '../types';

interface UnitGridProps {
    units: Unit[];
}

const UnitGrid: React.FC<UnitGridProps> = ({ units }) => {
    const dispatch = useDispatch();
    const selectedUnits = useSelector((state: RootState) => state.units.selectedUnits);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {units.map((unit) => (
                <UnitCard
                    key={unit.id}
                    unit={unit}
                    isSelected={selectedUnits.includes(unit.id)}
                    onClick={() => dispatch(toggleUnit(unit.id))}
                />
            ))}
        </div>
    );
};

export default UnitGrid;

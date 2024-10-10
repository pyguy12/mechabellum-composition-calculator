import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UnitCard from './UnitCard';
import { addUnit, removeUnit } from '../redux/store/unitsSlice';
import { RootState } from '../redux/store';
import { Unit } from '../types';

interface UnitGridProps {
    units: Unit[];
}

const UnitGrid: React.FC<UnitGridProps> = ({ units }) => {
    const dispatch = useDispatch();
    const selectedUnits = useSelector((state: RootState) => state.units.selectedUnits);
    const allUnits = useSelector((state: RootState) => state.units.allUnits);

    const handleUnitClick = (unitId: number) => {
        const isSelected = selectedUnits.some((u) => u.id === unitId);
        if (isSelected) {
            dispatch(removeUnit(unitId));
        } else {
            dispatch(addUnit(unitId));
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {units.map((unit) => (
                <UnitCard
                    key={unit.id}
                    unit={unit}
                    isSelected={selectedUnits.some((u) => u.id === unit.id)}
                    onClick={() => handleUnitClick(unit.id)}
                    allUnits={allUnits}
                />
            ))}
        </div>
    );
};

export default UnitGrid;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UnitCard from './UnitCard';
import { addUnit, removeUnit } from '../redux/store/unitsSlice';
import { RootState } from '../redux/store';
import { Unit } from '../types';

interface UnitGridProps {
    units: Unit[];
}

interface GroupedUnits {
    [cost: number]: Unit[];
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

    // Group units by cost
    const groupedUnits = units.reduce((acc: GroupedUnits, unit) => {
        if (!acc[unit.cost]) {
            acc[unit.cost] = [];
        }
        acc[unit.cost].push(unit);
        return acc;
    }, {});

    // Sort units alphabetically within each cost group
    Object.keys(groupedUnits).forEach((cost) => {
        groupedUnits[Number(cost)].sort((a, b) => a.name.localeCompare(b.name));
    });

    // Sort cost groups
    const sortedCosts = Object.keys(groupedUnits)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div>
            {sortedCosts.map((cost) => (
                <div key={cost} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Cost: {cost}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {groupedUnits[cost].map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                isSelected={selectedUnits.some((u) => u.id === unit.id)}
                                onClick={() => handleUnitClick(unit.id)}
                                allUnits={allUnits}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UnitGrid;

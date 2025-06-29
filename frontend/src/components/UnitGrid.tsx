import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UnitCard from './UnitCard';
import { addUnit, removeUnit, clearSearchQuery } from '../redux/store/unitsSlice';
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
    const gridRef = useRef<HTMLDivElement>(null);
    const unitRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const handleUnitClick = (unitId: number) => {
        const isSelected = selectedUnits.some((u) => u.id === unitId);
        if (isSelected) {
            dispatch(removeUnit(unitId));
        } else {
            dispatch(addUnit(unitId));
        }
        // Don't clear search query when selecting units
    };

    const handleKeyDown = (e: React.KeyboardEvent, unitId: number, currentIndex: number) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleUnitClick(unitId);
            return;
        }

        const allUnitElements = Array.from(unitRefs.current.values()).filter(el => el !== null);
        let targetIndex = currentIndex;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                targetIndex = Math.max(0, currentIndex - 5); // Move up one row (assuming 5 columns)
                break;
            case 'ArrowDown':
                e.preventDefault();
                targetIndex = Math.min(allUnitElements.length - 1, currentIndex + 5);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                targetIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                targetIndex = Math.min(allUnitElements.length - 1, currentIndex + 1);
                break;
            default:
                return;
        }

        allUnitElements[targetIndex]?.focus();
    };

    // Focus first unit when component mounts
    useEffect(() => {
        const firstUnit = Array.from(unitRefs.current.values())[0];
        if (firstUnit && units.length > 0) {
            firstUnit.setAttribute('tabindex', '0');
        }
    }, [units.length]);

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

    let overallIndex = 0;

    return (
        <div ref={gridRef} role="group" aria-label="Unit selection grid">
            {sortedCosts.map((cost) => (
                <div key={cost} className="mb-10">
                    <h3 className="text-xl font-semibold mb-4" id={`cost-group-${cost}`}>Cost: {cost}</h3>
                    <div 
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        role="group"
                        aria-labelledby={`cost-group-${cost}`}
                    >
                        {groupedUnits[cost].map((unit) => {
                            const currentIdx = overallIndex++;
                            return (
                                <div
                                    key={unit.id}
                                    ref={(el) => {
                                        if (el) unitRefs.current.set(unit.id, el);
                                        else unitRefs.current.delete(unit.id);
                                    }}
                                >
                                    <UnitCard
                                        unit={unit}
                                        isSelected={selectedUnits.some((u) => u.id === unit.id)}
                                        onClick={() => handleUnitClick(unit.id)}
                                        allUnits={allUnits}
                                        tabIndex={currentIdx === 0 ? 0 : -1}
                                        onKeyDown={(e) => handleKeyDown(e, unit.id, currentIdx)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UnitGrid;

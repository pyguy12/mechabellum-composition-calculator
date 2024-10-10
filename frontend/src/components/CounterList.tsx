import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Unit } from '../types';

const CounterList: React.FC = () => {
    const { allUnits, selectedUnits } = useSelector((state: RootState) => state.units);

    const calculateCounters = (
        selectedUnits: number[],
        allUnits: Unit[]
    ): { [key: number]: { counters: string[]; effectiveAgainst: string[] } } => {
        const counters: { [key: number]: { counters: string[]; effectiveAgainst: string[] } } = {};
        const selectedUnitObjects = allUnits.filter((unit) => selectedUnits.includes(unit.id));

        allUnits.forEach((unit) => {
            counters[unit.id] = { counters: [], effectiveAgainst: [] };

            selectedUnitObjects.forEach((selectedUnit) => {
                if (selectedUnit.counters?.counteredBy.includes(unit.id)) {
                    counters[unit.id].counters.push(selectedUnit.name);
                }
                if (unit.counters?.effectiveAgainst.includes(selectedUnit.id)) {
                    counters[unit.id].effectiveAgainst.push(selectedUnit.name);
                }
            });
        });

        return counters;
    };

    const counters = calculateCounters(selectedUnits, allUnits);
    const sortedCounters = Object.entries(counters)
        .filter(([, { counters, effectiveAgainst }]) => counters.length > 0 || effectiveAgainst.length > 0)
        .sort(([, a], [, b]) => {
            // Sort by number of units it's effective against, then by number of counters
            if (b.effectiveAgainst.length !== a.effectiveAgainst.length) {
                return b.effectiveAgainst.length - a.effectiveAgainst.length;
            }
            return b.counters.length - a.counters.length;
        })
        .slice(0, 5);

    const getUnitById = (id: number): Unit | undefined => {
        return allUnits.find((unit) => unit.id === id);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Best Units vs. Enemy Army</h3>
            {selectedUnits.length > 0 ? (
                sortedCounters.length > 0 ? (
                    <ul className="space-y-4">
                        {sortedCounters.map(([unitId, { counters: counteredUnits, effectiveAgainst }]) => {
                            const unit = getUnitById(Number(unitId));
                            if (!unit) return null;
                            return (
                                <li key={unitId} className="border-b border-gray-700 pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-lg font-semibold">{unit.name}</span>
                                        <div className="flex space-x-2">
                                            <span className="bg-green-600 px-2 py-1 rounded">
                                                Effective: {effectiveAgainst.length}
                                            </span>
                                            <span className="bg-red-600 px-2 py-1 rounded">
                                                Counters: {counteredUnits.length}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <p className="mb-1">
                                            <span className="font-medium text-green-400">Effective against: </span>
                                            {effectiveAgainst.length > 0
                                                ? effectiveAgainst.join(', ')
                                                : 'None of the selected units'}
                                        </p>
                                        <p>
                                            <span className="font-medium text-red-400">Counters: </span>
                                            {counteredUnits.length > 0
                                                ? counteredUnits.join(', ')
                                                : 'None of the selected units'}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-400">No effective counters found for the selected units.</p>
                )
            ) : (
                <p className="text-gray-400">Select enemy units to see suggested counters.</p>
            )}
        </div>
    );
};

export default CounterList;

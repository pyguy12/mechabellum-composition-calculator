import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Unit } from '../types';

const CounterList: React.FC = () => {
    const { allUnits, selectedUnits } = useSelector((state: RootState) => state.units);

    const calculateCounters = (
        selectedUnits: { id: number; quantity: number }[],
        allUnits: Unit[]
    ): {
        [key: number]: {
            countersEnemy: { name: string; count: number; image: string }[];
            counteredByEnemy: { name: string; count: number; image: string }[];
        };
    } => {
        const counters: {
            [key: number]: {
                countersEnemy: { name: string; count: number; image: string }[];
                counteredByEnemy: { name: string; count: number; image: string }[];
            };
        } = {};

        const selectedUnitObjects = selectedUnits.map(({ id, quantity }) => ({
            unit: allUnits.find((u) => u.id === id)!,
            quantity,
        }));

        allUnits.forEach((unit) => {
            counters[unit.id] = {
                countersEnemy: [],
                counteredByEnemy: [],
            };

            selectedUnitObjects.forEach(({ unit: selectedUnit, quantity }) => {
                if (selectedUnit.counters?.counteredBy.includes(unit.id)) {
                    counters[unit.id].countersEnemy.push({
                        name: selectedUnit.name,
                        count: quantity,
                        image: selectedUnit.image,
                    });
                }

                if (unit.counters?.counteredBy.includes(selectedUnit.id)) {
                    counters[unit.id].counteredByEnemy.push({
                        name: selectedUnit.name,
                        count: quantity,
                        image: selectedUnit.image,
                    });
                }
            });
        });

        return counters;
    };

    const counters = calculateCounters(selectedUnits, allUnits);
    const sortedCounters = Object.entries(counters)
        .filter(([, data]) => data.countersEnemy.length > 0 || data.counteredByEnemy.length > 0)
        .sort(([, a], [, b]) => {
            const aCountersEnemyCount = a.countersEnemy.reduce((sum, { count }) => sum + count, 0);
            const bCountersEnemyCount = b.countersEnemy.reduce((sum, { count }) => sum + count, 0);
            if (bCountersEnemyCount !== aCountersEnemyCount) {
                return bCountersEnemyCount - aCountersEnemyCount;
            }

            const aCounteredByCount = a.counteredByEnemy.reduce((sum, { count }) => sum + count, 0);
            const bCounteredByCount = b.counteredByEnemy.reduce((sum, { count }) => sum + count, 0);
            return aCounteredByCount - bCounteredByCount;
        })
        .slice(0, 5);

    const getUnitById = (id: number): Unit | undefined => {
        return allUnits.find((unit) => unit.id === Number(id));
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Best Units vs. Enemy Army</h3>
            {selectedUnits.length > 0 ? (
                sortedCounters.length > 0 ? (
                    <ul className="space-y-4">
                        {sortedCounters.map(([unitId, data]) => {
                            const unit = getUnitById(Number(unitId));
                            if (!unit) return null;
                            const countersEnemyCount = data.countersEnemy.reduce((sum, { count }) => sum + count, 0);
                            const counteredByCount = data.counteredByEnemy.reduce((sum, { count }) => sum + count, 0);
                            if (countersEnemyCount === 0) return null;
                            return (
                                <li key={unitId} className="border-b border-gray-700 pb-4">
                                    <div className="flex items-center mb-2">
                                        <img
                                            src={`/images/units/${unit.image}`}
                                            alt={unit.name}
                                            className="w-12 h-12 object-cover rounded-full mr-4"
                                        />
                                        <div className="flex-grow">
                                            <span className="text-lg font-semibold">{unit.name}</span>
                                            <div className="flex space-x-2 mt-1">
                                                <span className="bg-green-600 px-2 py-1 rounded text-xs">
                                                    Counters: {countersEnemyCount}
                                                </span>
                                                <span className="bg-red-600 px-2 py-1 rounded text-xs">
                                                    Countered by: {counteredByCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <p className="mb-1">
                                            <span className="font-medium text-green-400">Counters: </span>
                                            {data.countersEnemy.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {data.countersEnemy.map(({ name, count, image }) => (
                                                        <div
                                                            key={name}
                                                            className="flex items-center bg-gray-700 rounded-full px-2 py-1"
                                                        >
                                                            <img
                                                                src={`/images/units/${image}`}
                                                                alt={name}
                                                                className="w-6 h-6 object-cover rounded-full mr-1"
                                                            />
                                                            <span>
                                                                {name} ({count})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </p>
                                        <p>
                                            <span className="font-medium text-red-400">Countered by: </span>
                                            {data.counteredByEnemy.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {data.counteredByEnemy.map(({ name, count, image }) => (
                                                        <div
                                                            key={name}
                                                            className="flex items-center bg-gray-700 rounded-full px-2 py-1"
                                                        >
                                                            <img
                                                                src={`/images/units/${image}`}
                                                                alt={name}
                                                                className="w-6 h-6 object-cover rounded-full mr-1"
                                                            />
                                                            <span>
                                                                {name} ({count})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
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

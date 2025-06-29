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
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Counter Recommendations</h3>
                <p className="text-sm text-gray-400">Units sorted by effectiveness against enemy composition</p>
            </div>
            {selectedUnits.length > 0 ? (
                sortedCounters.length > 0 ? (
                    <ul className="space-y-3">
                        {sortedCounters.map(([unitId, data]) => {
                            const unit = getUnitById(Number(unitId));
                            if (!unit) return null;
                            const countersEnemyCount = data.countersEnemy.reduce((sum, { count }) => sum + count, 0);
                            const counteredByCount = data.counteredByEnemy.reduce((sum, { count }) => sum + count, 0);
                            if (countersEnemyCount === 0) return null;
                            return (
                                <li key={unitId} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={`/images/units/${unit.image}`}
                                            alt={unit.name}
                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            loading="lazy"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-lg font-semibold">{unit.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1 text-green-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-bold">{countersEnemyCount}</span>
                                                    </span>
                                                    {counteredByCount > 0 && (
                                                        <span className="flex items-center gap-1 text-red-400">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="font-bold">{counteredByCount}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    {data.countersEnemy.length > 0 && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 uppercase tracking-wider">Effective Against</span>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                    {data.countersEnemy.map(({ name, count, image }) => (
                                                        <div
                                                            key={name}
                                                            className="flex items-center bg-gray-800 rounded-full px-2 py-1 text-xs"
                                                        >
                                                            <img
                                                                src={`/images/units/${image}`}
                                                                alt={name}
                                                                className="w-5 h-5 object-cover rounded-full mr-1"
                                                            />
                                                            <span>
                                                                {name} ({count})
                                                            </span>
                                                        </div>
                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {data.counteredByEnemy.length > 0 && (
                                                        <div>
                                                            <span className="text-xs text-gray-400 uppercase tracking-wider">Vulnerable To</span>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                    {data.counteredByEnemy.map(({ name, count, image }) => (
                                                        <div
                                                            key={name}
                                                            className="flex items-center bg-gray-800 rounded-full px-2 py-1 text-xs"
                                                        >
                                                            <img
                                                                src={`/images/units/${image}`}
                                                                alt={name}
                                                                className="w-5 h-5 object-cover rounded-full mr-1"
                                                            />
                                                            <span>
                                                                {name} ({count})
                                                            </span>
                                                        </div>
                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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

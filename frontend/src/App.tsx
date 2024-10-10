import React, { useState } from 'react';
import Header from './components/Header';
import UnitGrid from './components/UnitGrid';
import CounterList from './components/CounterList';
import { Unit } from './types';
import unitsData from './data/units.json';

const units: Unit[] = unitsData.units;

function App() {
    const [selectedUnits, setSelectedUnits] = useState<number[]>([]);

    const toggleUnit = (id: number) => {
        setSelectedUnits((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((unitId) => unitId !== id) : [...prevSelected, id]
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-2xl font-semibold mb-4">Select Enemy Units</h2>
                    <UnitGrid units={units} selectedUnits={selectedUnits} toggleUnit={toggleUnit} />
                    <h2 className="text-2xl font-semibold mb-4 mt-8">Suggested Counters</h2>
                    <CounterList />
                </div>
            </main>
        </div>
    );
}

export default App;

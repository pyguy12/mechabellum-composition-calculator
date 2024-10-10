import React from 'react';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import UnitGrid from './components/UnitGrid';
import CounterList from './components/CounterList';
import SearchBar from './components/SearchBar';
import { RootState } from './redux/store';

function App() {
    const { allUnits, searchQuery } = useSelector((state: RootState) => state.units);

    const filteredUnits = allUnits.filter((unit) => unit.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-2xl font-semibold mb-4">Select Enemy Units</h2>
                    <SearchBar />
                    <UnitGrid units={filteredUnits} />
                    <h2 className="text-2xl font-semibold mb-4 mt-8">Suggested Counters</h2>
                    <CounterList />
                </div>
            </main>
        </div>
    );
}

export default App;

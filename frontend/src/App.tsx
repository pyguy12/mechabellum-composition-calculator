import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import UnitGrid from './components/UnitGrid';
import CounterList from './components/CounterList';
import SearchBar from './components/SearchBar';
import ResetButton from './components/ResetButton';
import EnemyCompositionBar from './components/EnemyCompositionBar';
import { RootState } from './redux/store';

function App() {
    const { allUnits, searchQuery } = useSelector((state: RootState) => state.units);

    const filteredUnits = allUnits.filter((unit) => unit.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="max-w-screen-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="md:w-2/3 mb-6 md:mb-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Select Enemy Units</h2>
                            <ResetButton />
                        </div>
                        <EnemyCompositionBar />
                        <SearchBar />
                        <UnitGrid units={filteredUnits} />
                    </div>
                    <div className="md:w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Suggested Units</h2>
                        <CounterList />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;

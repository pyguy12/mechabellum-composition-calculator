import React from 'react';
import { useSelector } from 'react-redux';
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
            <main className="max-w-screen-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    <div className="lg:flex-1 order-2 lg:order-1">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold">Select Enemy Units</h2>
                                <ResetButton />
                            </div>
                            <EnemyCompositionBar />
                        </div>
                        
                        <div className="mb-6">
                            <SearchBar />
                        </div>
                        
                        <UnitGrid units={filteredUnits} />
                    </div>
                    
                    <div className="lg:w-96 order-1 lg:order-2 mb-8 lg:mb-0 lg:sticky lg:top-20 lg:h-fit">
                        <h2 className="text-3xl font-bold mb-6">Suggested Counters</h2>
                        <CounterList />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;

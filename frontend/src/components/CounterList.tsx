import React from 'react';

const CounterList: React.FC = () => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <ul className="space-y-2">
            <li className="flex justify-between items-center">
                <span>Counter Unit 1</span>
                <span className="bg-green-600 px-2 py-1 rounded">Counters 3</span>
            </li>
            <li className="flex justify-between items-center">
                <span>Counter Unit 2</span>
                <span className="bg-green-600 px-2 py-1 rounded">Counters 2</span>
            </li>
            <li className="flex justify-between items-center">
                <span>Counter Unit 3</span>
                <span className="bg-green-600 px-2 py-1 rounded">Counters 1</span>
            </li>
        </ul>
    </div>
);

export default CounterList;

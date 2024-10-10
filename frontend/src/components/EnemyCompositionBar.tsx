import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeUnit, setUnitQuantity } from '../redux/store/unitsSlice';

const EnemyCompositionBar: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedUnits, allUnits } = useSelector((state: RootState) => state.units);

    const handleRemoveUnit = (id: number) => {
        dispatch(removeUnit(id));
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity > 0) {
            dispatch(setUnitQuantity({ id, quantity }));
        } else {
            handleRemoveUnit(id);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-4">Enemy Composition</h3>
            {selectedUnits.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {selectedUnits.map(({ id, quantity }) => {
                        const unit = allUnits.find((u) => u.id === id);
                        if (!unit) return null;
                        return (
                            <div
                                key={id}
                                className="relative bg-gray-700 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg w-32"
                            >
                                <img
                                    src={`/images/units/${unit.image}`}
                                    alt={unit.name}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-2">
                                    <h4 className="text-sm font-semibold text-white mb-2 truncate">{unit.name}</h4>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => handleQuantityChange(id, quantity - 1)}
                                            className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                                        >
                                            -
                                        </button>
                                        <span className="text-white font-bold">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(id, quantity + 1)}
                                            className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveUnit(id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-400">
                    No units selected. Click on units below to add them to the enemy composition.
                </p>
            )}
        </div>
    );
};

export default EnemyCompositionBar;

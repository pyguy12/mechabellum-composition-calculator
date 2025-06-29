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
                <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                    {selectedUnits.map(({ id, quantity }) => {
                        const unit = allUnits.find((u) => u.id === id);
                        if (!unit) return null;
                        return (
                            <div
                                key={id}
                                className="relative bg-gray-700 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg flex-shrink-0 w-36"
                            >
                                <img
                                    src={`/images/units/${unit.image}`}
                                    alt={unit.name}
                                    className="w-full h-36 object-cover"
                                />
                                <div className="p-2">
                                    <h4 className="text-sm font-semibold text-white mb-3 truncate" title={unit.name}>{unit.name}</h4>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => handleQuantityChange(id, quantity - 1)}
                                            className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 text-lg font-bold touch-manipulation"
                                            aria-label={`Decrease ${unit.name} quantity`}
                                        >
                                            −
                                        </button>
                                        <span className="text-white font-bold text-lg min-w-[2rem] text-center" aria-label={`${quantity} ${unit.name} units`}>{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(id, quantity + 1)}
                                            className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300 text-lg font-bold touch-manipulation"
                                            aria-label={`Increase ${unit.name} quantity`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveUnit(id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 text-lg touch-manipulation"
                                    aria-label={`Remove ${unit.name} from enemy composition`}
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

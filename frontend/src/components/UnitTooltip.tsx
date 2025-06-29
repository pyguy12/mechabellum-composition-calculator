import React from 'react';
import { Unit } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface UnitTooltipProps {
    unit: Unit;
    isVisible: boolean;
    position: { x: number; y: number };
}

const UnitTooltip: React.FC<UnitTooltipProps> = ({ unit, isVisible, position }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 max-w-xs pointer-events-none"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: 'translate(-50%, -110%)'
                    }}
                >
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-lg font-bold text-white">{unit.name}</h3>
                            <p className="text-sm text-gray-400">Cost: {unit.cost}</p>
                        </div>
                        
                        {unit.counters && (
                            <div className="space-y-2">
                                {unit.counters.effectiveAgainst.length > 0 && (
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Effective Against:</span>
                                        <p className="text-xs text-gray-300 mt-1">
                                            {unit.counters.effectiveAgainst.length} unit{unit.counters.effectiveAgainst.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                )}
                                
                                {unit.counters.counteredBy.length > 0 && (
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Countered By:</span>
                                        <p className="text-xs text-gray-300 mt-1">
                                            {unit.counters.counteredBy.length} unit{unit.counters.counteredBy.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="pt-2 border-t border-gray-700">
                            <p className="text-xs text-gray-400">
                                Click to add to enemy composition
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UnitTooltip;
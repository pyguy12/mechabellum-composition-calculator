import React, { useState, useRef, useEffect } from 'react';
import { Unit } from '../types';
import UnitTooltip from './UnitTooltip';

interface UnitCardProps {
    unit: Unit;
    isSelected: boolean;
    onClick: () => void;
    allUnits: Unit[];
    tabIndex?: number;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isSelected, onClick, allUnits, tabIndex = 0, onKeyDown }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const isTouchDevice = 'ontouchstart' in window;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cardRef.current && showTooltip) {
                const rect = cardRef.current.getBoundingClientRect();
                setTooltipPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top
                });
            }
        };

        if (showTooltip && !isTouchDevice) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [showTooltip, isTouchDevice]);
    const handleMouseEnter = () => {
        if (!isTouchDevice) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const handleTouch = () => {
        if (isTouchDevice) {
            setShowTooltip(!showTooltip);
            setTimeout(() => setShowTooltip(false), 3000);
        }
    };

    return (
        <>
            <div
                ref={cardRef}
            onClick={(e) => {
                onClick();
                if (isTouchDevice) {
                    handleTouch();
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={onKeyDown}
            tabIndex={tabIndex}
            role="button"
            aria-pressed={isSelected}
            aria-label={`Select ${unit.name} unit. Cost: ${unit.cost}. ${isSelected ? 'Selected' : 'Not selected'}`}
            className={`
                relative cursor-pointer transition-all duration-300 ease-in-out
                transform hover:scale-105 rounded-lg overflow-hidden
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                ${
                    isSelected
                        ? 'ring-4 ring-blue-500 shadow-lg shadow-blue-500/50'
                        : 'hover:shadow-md hover:shadow-gray-600/50'
                }
            `}
        >
            <div className="relative w-full pb-[144.44%]">
                <img
                    src={`/images/units/${unit.image}`}
                    alt={`${unit.name} unit`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-sm font-bold text-white text-center">{unit.name}</p>
                </div>
            </div>
            {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            )}
        </div>
            <UnitTooltip
                unit={unit}
                isVisible={showTooltip}
                position={tooltipPosition}
            />
        </>
    );
};

export default UnitCard;

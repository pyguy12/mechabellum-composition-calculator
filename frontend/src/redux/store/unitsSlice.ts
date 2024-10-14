import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unit } from '../../types';
import unitsData from '../../data/units.json';

interface UnitQuantity {
    id: number;
    quantity: number;
}

interface UnitsState {
    allUnits: Unit[];
    selectedUnits: UnitQuantity[];
    searchQuery: string;
}

const initialState: UnitsState = {
    allUnits: unitsData.units,
    selectedUnits: [],
    searchQuery: '',
};

const unitsSlice = createSlice({
    name: 'units',
    initialState,
    reducers: {
        addUnit: (state, action: PayloadAction<number>) => {
            const unitId = action.payload;
            const existingUnit = state.selectedUnits.find((unit) => unit.id === unitId);
            if (existingUnit) {
                existingUnit.quantity += 1;
            } else {
                state.selectedUnits.push({ id: unitId, quantity: 1 });
            }
        },
        removeUnit: (state, action: PayloadAction<number>) => {
            const unitId = action.payload;
            state.selectedUnits = state.selectedUnits.filter((unit) => unit.id !== unitId);
        },
        setUnitQuantity: (state, action: PayloadAction<UnitQuantity>) => {
            const { id, quantity } = action.payload;
            const existingUnit = state.selectedUnits.find((unit) => unit.id === id);
            if (existingUnit) {
                existingUnit.quantity = quantity;
            } else if (quantity > 0) {
                state.selectedUnits.push({ id, quantity });
            }
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        resetSelectedUnits: (state) => {
            state.selectedUnits = [];
            state.searchQuery = '';
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        },
    },
});

export const { addUnit, removeUnit, setUnitQuantity, setSearchQuery, resetSelectedUnits, clearSearchQuery } =
    unitsSlice.actions;
export default unitsSlice.reducer;

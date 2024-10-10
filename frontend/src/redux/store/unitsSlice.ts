import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unit } from '../../types';
import unitsData from '../../data/units.json';

interface UnitsState {
    allUnits: Unit[];
    selectedUnits: number[];
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
        toggleUnit: (state, action: PayloadAction<number>) => {
            const unitId = action.payload;
            if (state.selectedUnits.includes(unitId)) {
                state.selectedUnits = state.selectedUnits.filter((id) => id !== unitId);
            } else {
                state.selectedUnits.push(unitId);
            }
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        resetSelectedUnits: (state) => {
            state.selectedUnits = [];
        },
    },
});

export const { toggleUnit, setSearchQuery, resetSelectedUnits } = unitsSlice.actions;
export default unitsSlice.reducer;

// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import unitsReducer from './unitsSlice';

export const store = configureStore({
    reducer: {
        units: unitsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

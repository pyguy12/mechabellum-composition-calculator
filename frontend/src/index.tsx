import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRouter from './AppRouter';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <AppRouter />
            <Analytics />
        </Provider>
    </React.StrictMode>
);

// GlobalProvider.tsx
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { myStore } from './store';

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => (
    <Provider store={myStore} >
        {children}
    </Provider>
);

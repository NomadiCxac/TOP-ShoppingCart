import React, { createContext, useContext } from 'react';
import useFirebaseOrders from '../states/useFirebaseOrders';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const { orders, loading, error, pushOrderToDatabase } = useFirebaseOrders();

    return (
        <OrderContext.Provider value={{  orders, loading, error, pushOrderToDatabase }}>
            {children}
        </OrderContext.Provider>
    );
};
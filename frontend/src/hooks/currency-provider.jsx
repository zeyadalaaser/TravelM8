import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(localStorage.getItem("currency") ?? "USD");
    const [exchangeRate, setExchangeRate] = useState(parseFloat(localStorage.getItem("exchangeRate") ?? 1));

    useEffect(() => {
        localStorage.setItem("currency", currency);
        localStorage.setItem("exchangeRate", exchangeRate);
    }, [currency, exchangeRate]);

    const changeCurrency = (newCurrency, newExchangeRate) => {
        setCurrency(newCurrency);
        setExchangeRate(newExchangeRate);
    };

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, changeCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}

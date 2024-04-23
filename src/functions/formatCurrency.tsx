import React from 'react';

export default function CurrencyFormatter({ value }) {
    const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <span>{formattedValue}</span>
    );
}
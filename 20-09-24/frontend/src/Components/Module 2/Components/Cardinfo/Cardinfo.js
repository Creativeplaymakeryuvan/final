import React, { useEffect, useState } from 'react';
import './cardinfo.css';
import { useGlobalContext } from '../../Context/globalContext';

function Cardinfo({ totalMonthlyIncome, totalMonthlyExpenses, balance, flag }) {
    const { totalExpenses, totalIncomes, totalBalance, getIncomes, getExpenses } = useGlobalContext()
    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    return (
        <div className="cardinfo-container">
            
            <div className="card">
                <div>
                    <h2 className="title title-in">Total Income</h2>
                    <h2 className="amount amount-in">₹{ flag ? totalMonthlyIncome : totalIncomes() }</h2>
                </div>
            </div>
            <div className="card">
                <div>
                    <h2 className="title title-ex">Total Expence</h2>
                    <h2 className="amount amount-ex">₹{ flag ? totalMonthlyExpenses : totalExpenses() }</h2>
                </div>
            </div>
            <div className="card">
                <div>
                    <h2 className="title">Total balance </h2>
                    <h2 className="amount">₹{ flag ? balance : totalBalance() }</h2>
                </div>
            </div>
        </div>
    );
}

export default Cardinfo;



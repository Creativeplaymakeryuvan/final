import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGlobalContext } from '../../Context/globalContext';

const BarChartComponent = ({ incomeData, expenseData, flag }) => {

    const { incomes, expenses } = useGlobalContext();
    // Combine income and expense data for chart
    if (!flag) {
        incomeData = incomes;
        expenseData = expenses;
    }

    const chartData = [
        ...incomeData.map((income) => ({
            date: new Date(income.date).toLocaleDateString(),
            income: income.amount,
            expense: 0,
        })),
        ...expenseData.map((expense) => ({
            date: new Date(expense.date).toLocaleDateString(),
            income: 0,
            expense: expense.amount,
        })),
    ];

    // Aggregate data by date
    const aggregatedData = chartData.reduce((acc, curr) => {
        const existing = acc.find((item) => item.date === curr.date);
        if (existing) {
            existing.income += curr.income;
            existing.expense += curr.expense;
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={aggregatedData}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#82ca9d" />
                <Bar dataKey="expense" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
